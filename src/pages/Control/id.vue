<template>
	<section class="control">
		<template v-if="unit.lamptype === 'Switch'">
			<!-- TODO: implement SwitchToggle -->
		</template>
		<template v-else-if="unit.lamptype === 'WWCW'">
			<TabNav v-model="activeTab" :tab-names="['Color' /*, 'Gradient'*/]" />
			<WWCWChooseColor v-if="activeTab == 'Color'" :unit="unit" />
			<ChooseGradient v-if="activeTab == 'Gradient'" :unit="unit" />
		</template>
		<!-- <template v-else-if="unit.lamptype === 'RGB'">-->
		<template v-else>
			<TabNav v-model="activeTab" :tab-names="['Color', 'Gradient']" />
			<RGBChooseColor v-if="activeTab == 'Color'" :unit="unit" />
			<RGBChooseGradient v-if="activeTab == 'Gradient'" :unit="unit" />
		</template>
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
import localAPI from "@/mixins/localAPI.js";

import { UIStateNestedDefault } from "@/helpers/ui-states.js";
import { scaleColor, hex2rgb, rgb2hex } from "@/mixins/colorConversion";

export default {
	name: "ControlDetail",
	components: {
		RGBChooseColor,
		RGBChooseGradient,
		WWCWChooseColor,
		TabNav,
	},
	mixins: [localAPI],
	data() {
		return {
			activeTab: "",
		};
	},
	computed: {
		unit() {
			return this.$store.getters["units/get"](this.$route.params.id);
		},
	},
	watch: {
		unit: function(to, from) {
			if (to === from) {
				return;
			}
			this.setActiveTab(to.state);
			this.setTopNav();
		},
	},
	created() {
		this.setTopNav();
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: Object.assign(UIStateNestedDefault.bottomNav(0), {
				fab: {
					icon: "check",
					event: "apply",
				},
			}),
		});
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
			this.sendState(this.unit, this.unit.state);
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
