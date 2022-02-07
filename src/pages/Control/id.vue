<template>
	<section class="control">
		<transition name="fade">
			<div v-if="loading" key="skeleton" class="skeleton">
				<SkeletonTabNav :tab-names="['...']" />
				<SkeletonSavedStatePicker />
				<SkeletonStatePicker />
			</div>
			<div v-else key="control">
				<TabNav v-model="activeTab" :tab-names="availablePicker" />
				<keep-alive>
					<component :is="activePicker" :unit="unit" />
				</keep-alive>
			</div>
		</transition>
	</section>
</template>

<script>
const RGBChooseColor = () =>
	import(
		/* webpackChunkName: "rgbChooseColor" */ "./components/rgb/chooseColor"
	);
const WWCWChooseColor = () =>
	import(
		/* webpackChunkName: "wwcwChooseColor" */ "./components/wwcw/chooseColor"
	);
const WWCWCAutoConfig = () =>
	import(
		/* webpackChunkName: "wwcwChooseColor" */ "./components/wwcw/autoConfig"
	);

import TabNav from "@/components/TabNav";
import SkeletonTabNav from "@/components/skeleton/TabNav";
import SkeletonStatePicker from "@/components/skeleton/StatePicker";
import SkeletonSavedStatePicker from "@/components/skeleton/SavedStatePicker";

import { UIStateNestedDefault } from "@/helpers/ui-states.js";
import { scaleColor, hex2rgb, rgb2hex } from "@/mixins/colorConversion";

const picker = {
	RGB: {
		Color: RGBChooseColor,
	},
	WWCW: {
		Color: WWCWChooseColor,
		"Auto-Config": WWCWCAutoConfig,
	},
	Switch: {},
};

export default {
	name: "ControlDetail",
	components: {
		RGBChooseColor,
		WWCWChooseColor,
		TabNav,
		SkeletonTabNav,
		SkeletonStatePicker,
		SkeletonSavedStatePicker,
	},
	async beforeRouteLeave(to, from, next) {
		await this.resetColor();
		await this.$store.dispatch("localAPI/closeConnection", this.unit);
		next();
	},
	data() {
		return {
			activeTab: "",
			loading: true,
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
					return ["Color", "Auto-Config"];
				case "RGB":
					return ["Color"];
				default:
					throw new Error(
						`unknown lamptype ${JSON.stringify(this.unit.lamptype)}`
					);
			}
		},
		activePicker() {
			return picker[this.unit.lamptype || "RGB"][this.activeTab || "Color"];
		},
	},
	watch: {
		unit: {
			handler(to) {
				this.setTopNav();
			},
			deep: true,
		},
		activeTab() {
			this.setBottomNav();
		},
	},
	async created() {
		this.setTopNav();
		this.setBottomNav();
		this.$eventHub.on("backAndReset", this.backAndReset);
		// Load units initial state and preconnect
		await this.$store.getters["units/load"](this.$route.params.id);
		this.activeTab = this.availablePicker[0];
		if (this.unit.type === "LAMP") {
			let unitInitialState = null;
			let connection;
			try {
				connection = await this.$store.dispatch(
					"localAPI/openConnection",
					this.unit
				);
			} catch (error) {
				this.toastError(`${this.unit.name} is not in reach.`);
				this.loading = false;
				return;
			}
			connection.onmessage = (event) => {
				const message = JSON.parse(event.data);
				if (message.action === "GET /output/channel") {
					unitInitialState = {
						color: rgb2hex({
							r: parseInt(message.data[0], 10),
							g: 0,
							b: parseInt(message.data[1], 10),
						}),
					};
				}
				// legacy handling
				if (message && message.color) {
					unitInitialState = {
						color: rgb2hex({
							r: parseInt(message.color[1], 10),
							g: parseInt(message.color[2], 10),
							b: parseInt(message.color[3], 10),
						}),
					};
					connection.onmessage = null;
				}
			};
			connection.send(
				JSON.stringify({
					action: "GET /output/channel",
				})
			);
			setTimeout(() => {
				unitInitialState = false;
				connection.onmessage = null;
			}, 3000);
			const waitForUnitInitialState = () =>
				new Promise((resolve) =>
					setTimeout(async () => {
						if (unitInitialState === null) {
							await waitForUnitInitialState();
						}
						resolve();
					}, 10)
				);
			await waitForUnitInitialState();
			if (unitInitialState) {
				this.unit.state = unitInitialState;
			}
		}
		this.loading = false;
	},
	beforeDestroy() {
		this.$eventHub.off("backAndReset", this.backAndReset);
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
		resetColor() {
			return this.$store.dispatch("localAPI/sendState", {
				unit: this.unit,
				state: this.unit.state,
			});
		},
		backAndReset() {
			this.resetColor();
			this.$eventHub.emit("go-back");
		},
	},
};
</script>

<style lang="scss" scoped>
.control {
	text-align: center;
}
.skeleton {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
.fade-enter-active,
.fade-leave-active {
	transition: filter 0.3s;
}
.fade-enter,
.fade-leave-to {
	filter: opacity(0);
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
