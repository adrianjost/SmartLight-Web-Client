<template>
	<section class="control">
		<template v-if="unit.lamptype === 'Switch'">
			SwitchToggle
		</template>
		<template v-else-if="unit.lamptype === 'RGB'">
			<TabNav v-model="activeTab" :tab-names="['Color', 'Gradient']" />
			<ChooseColor v-if="activeTab == 'Color'" :unit="unit" />
			<ChooseGradient v-if="activeTab == 'Gradient'" :unit="unit" />
		</template>
		<template v-else-if="unit.lamptype === 'WWCW'">
			<!-- <TabNav v-model="activeTab" :tab-names="['Color']" /> -->
			<ChooseColor
				v-if="activeTab == 'Color'"
				v-slot:colorPicker="{ color, setColor }"
				:unit="unit"
			>
				<WhiteTonePicker
					:value="extractWhiteChannels(color)"
					class="white-tone-picker"
					color-left="#fd9"
					color-right="#9df"
					@input="setColor(getColorForWhiteChannels($event))"
				/>
			</ChooseColor>
			<!-- <ChooseGradient v-if="activeTab == 'Gradient'" :unit="unit" /> -->
		</template>
	</section>
</template>

<script>
const ChooseColor = () =>
	import(/* webpackChunkName: "chooseColor" */ "./components/chooseColor");
const ChooseGradient = () =>
	import(/* webpackChunkName: "chooseGradient" */ "./components/chooseGradient");
const WhiteTonePicker = () =>
	import(/* webpackChunkName: "chooseGradient" */ "@/components/picker/WhiteTonePicker");
import TabNav from "@/components/TabNav";
import localAPI from "@/mixins/localAPI.js";

import { UIStateNestedDefault } from "@/helpers/ui-states.js";
import { scaleColor, hex2rgb, rgb2hex } from "@/mixins/colorConversion";

export default {
	name: "ControlDetail",
	components: {
		ChooseColor,
		ChooseGradient,
		WhiteTonePicker,
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
		this.$eventHub.$on("backAndReset", this.reset);
	},
	beforeDestroy() {
		this.$eventHub.$off("backAndReset", this.reset);
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
		reset(state) {
			this.sendState(this.unit, this.unit.state);
			this.$eventHub.$emit("go-back");
		},
		extractWhiteChannels(color) {
			const rgb = hex2rgb(color);
			rgb.r /= 255;
			rgb.g = 0;
			rgb.b /= 255;
			return [rgb.r, rgb.b];
		},
		getColorForWhiteChannels([a, b]) {
			const newColor = rgb2hex({
				r: Math.round(a * 255),
				g: 0,
				b: Math.round(b * 255),
			});
			return newColor;
		},
	},
};
</script>

<style lang="scss" scoped>
.control {
	text-align: center;
}
.white-tone-picker {
	max-width: 400px;
	margin: 0 auto;
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
