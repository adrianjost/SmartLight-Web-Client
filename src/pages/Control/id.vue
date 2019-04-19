<template>
	<section class="control">
		<div class="tab-nav">
			<div
				v-for="tab in tabNames"
				:key="tab"
				:class="{
					tab: true,
					active: activeTab == tab,
				}"
				@click.prevent="setActiveTab(tab)"
			>
				{{ tab }}
			</div>
		</div>
		<ChooseColor v-if="activeTab == 'Color'" :unit="unit" />
		<ChooseGradient v-if="activeTab == 'Gradient'" :unit="unit" />
	</section>
</template>

<script>
const ChooseColor = () =>
	import(/* webpackChunkName: "chooseColor" */ "./components/chooseColor");
const ChooseGradient = () =>
	import(/* webpackChunkName: "chooseGradient" */ "./components/chooseGradient");
import localAPI from "@/mixins/localAPI.js";

import { UIStateNestedDefault } from "@/helpers/ui-states.js";

export default {
	name: "ControlDetail",
	components: {
		ChooseColor,
		ChooseGradient,
	},
	mixins: [localAPI],
	data() {
		return {
			tabNames: ["Color", "Gradient"],
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

			this.$store.commit("ui/patch", {
				component: "appBarTop",
				payload: { title: { text: to.name } },
			});
		},
	},
	created() {
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
		setActiveTab(state) {
			if (typeof state === "string") {
				// TODO: refactor this ugly double use of this method.
				this.activeTab = state;
			}
			if (typeof state === "object") {
				if (state.gradient) {
					this.activeTab = "Gradient";
				}
				if (state.color) {
					this.activeTab = "Color";
				}
				return;
			}
		},
		reset(state) {
			this.sendState(this.unit, this.unit.state);
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>

<style lang="scss" scoped>
.control {
	text-align: center;
}

.tab-nav {
	display: flex;
	max-width: 250px;
	margin: 16px auto;
	font-size: 0;
	user-select: none;
	border: 1px solid var(--color-border);
	border-radius: 4px;

	.tab {
		display: inline-block;
		flex: 1;
		padding: 8px;
		font-size: 16px;
		line-height: 16px;
		text-align: center;
		cursor: pointer;

		&.active {
			background-color: var(--color-overlay);
		}
	}
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
