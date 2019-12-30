<template>
	<section class="control">
		<TabNav v-model="activeTab" :tab-names="availablePicker" />
		<keep-alive>
			<component :is="activePicker" :unit="unit" />
		</keep-alive>
	</section>
</template>

<script>
const RGBChooseColor = () =>
	import(/* webpackChunkName: "rgbChooseColor" */ "./components/rgb/chooseColor");
const RGBChooseGradient = () =>
	import(/* webpackChunkName: "rgbChooseGradient" */ "./components/rgb/chooseGradient");

const WWCWChooseColor = () =>
	import(/* webpackChunkName: "wwcwChooseColor" */ "./components/wwcw/chooseColor");

import TabNav from "@/components/TabNav";

import { UIStateNestedDefault } from "@/helpers/ui-states.js";
import { scaleColor, hex2rgb, rgb2hex } from "@/mixins/colorConversion";

const picker = {
	RGB: {
		Color: RGBChooseColor,
		Gradient: RGBChooseGradient,
	},
	WWCW: {
		Color: WWCWChooseColor,
	},
	Switch: {},
};

export default {
	name: "ControlDetail",
	components: {
		RGBChooseColor,
		RGBChooseGradient,
		WWCWChooseColor,
		TabNav,
	},
	data() {
		return {
			activeTab: "",
		};
	},
	computed: {
		unit() {
			return this.$store.getters["units/get"](this.$route.params.id);
		},
		availablePicker() {
			switch (this.unit.lamptype) {
				case "Switch":
					return [""];
				case "WWCW":
					return ["Color" /*, 'Gradient'*/];
				default:
					return ["Color", "Gradient"];
			}
		},
		activePicker() {
			return picker[this.unit.lamptype || "RGB"][this.activeTab || "Color"];
		},
	},
	watch: {
		unit: {
			handler(to) {
				this.setActiveTab(to.state);
				this.setTopNav();
			},
			deep: true,
		},
		activeTab() {
			this.setBottomNav();
		},
	},
	created() {
		this.setTopNav();
		this.setBottomNav();
		this.setActiveTab(this.unit.state);
		this.$eventHub.$on("backAndReset", this.backAndReset);
	},
	beforeRouteLeave(to, from, next) {
		this.resetColor();
		next();
	},
	beforeDestroy() {
		this.$eventHub.$off("backAndReset", this.backAndReset);
	},
	methods: {
		scaleColor,
		setTopNav() {
			this.$store.commit("ui/set", {
				component: "appBarTop",
				payload: Object.assign(
					UIStateNestedDefault.appBarTop(this.unit.name || ""),
					{
						back_action: {
							event: "backAndReset",
							icon: "arrow_back",
						},
						actions: [
							{
								icon: "edit",
								to: `/settings/edit/${this.unit.id}`,
							},
						],
					}
				),
			});
		},
		setBottomNav() {
			this.$store.commit("ui/set", {
				component: "bottomNav",
				payload: Object.assign(UIStateNestedDefault.bottomNav(0), {
					fab: {
						icon: "check",
						event: `apply-${this.activeTab.toLowerCase()}`,
					},
				}),
			});
		},
		setActiveTab(state) {
			if (typeof state === "object") {
				if (state.gradient) {
					this.activeTab = "Gradient";
				}
				if (state.color) {
					this.activeTab = "Color";
				}
			}
		},
		resetColor() {
			this.$store.dispatch("localAPI/sendState", {
				unit: this.unit,
				state: this.unit.state,
			});
		},
		backAndReset(state) {
			this.resetColor();
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>

<style lang="scss" scoped>
.control {
	text-align: center;
}
</style>
<style lang="scss">
.toast-dot {
	display: inline-block;
	width: 16px;
	height: 16px;
	margin-right: 4px;
	vertical-align: bottom;
	border-radius: 50%;
}
</style>
