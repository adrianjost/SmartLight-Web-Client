<template>
	<section class="control">
		<div class="tab-nav">
			<div
				v-for="tab in tabNames"
				:key="tab"
				:class="{
					tab: true,
					active: (activeTab == tab),
				}"
				@click.prevent="setActiveTab(tab)"
			>
				{{ tab }}
			</div>
		</div>
		<choose-color
			v-if="activeTab == 'Color'"
			:unit="unit"
		/>
		<choose-gradient
			v-if="activeTab == 'Gradient'"
			:unit="unit"
		/>
	</section>
</template>

<script>
const chooseColor = () => import(/* webpackChunkName: "chooseColor" */ './components/chooseColor');
const chooseGradient = () => import(/* webpackChunkName: "chooseGradient" */ './components/chooseGradient');
import localAPI from "@/mixins/localAPI.js"

import { UIStateNestedDefault } from '@/helpers/ui-states.js';

export default {
	name: "ControlDetail",
	components: {
		chooseColor,
		chooseGradient
	},
	mixins: [localAPI],
	data(){
		return {
			tabNames: ["Color", "Gradient"],
			activeTab: "",
		}
	},
	computed: {
		unit () {
			return this.$store.getters["units/get"](this.$route.params.id);
		},
	},
	watch: {
		unit: function(to, from){
			if(to === from){ return; }
			this.setActiveTab(to.state);

			this.$store.commit("ui/patch", {
				component: "appBarTop",
				payload: { title: { text: to.name }}
			});
		}
	},
	created(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: Object.assign(UIStateNestedDefault.appBarTop(this.unit.name || ""), {
				back_action: {
					event: "backAndReset",
					icon: "arrow_back"
				},
				actions: [
					{
						icon: "edit",
						to: `/settings/edit/${this.unit.id}`
					}
				]
			})
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: Object.assign(UIStateNestedDefault.bottomNav(0), {
				fab: {
					icon: "check",
					event: "apply"
				}
			})
		});
		this.setActiveTab(this.unit.state);
		this.$eventHub.$on('backAndReset', this.reset);
	},
	beforeDestroy(){
		this.$eventHub.$off('backAndReset', this.reset);
	},
	methods: {
		setActiveTab(state){
			if(typeof state === "string"){
				// TODO: refactor this ugly double use of this method.
				this.activeTab = state
			}
			if(typeof state === "object"){
				if(state.gradient){ this.activeTab = "Gradient"; }
				if(state.color){ this.activeTab = "Color"; }
				return;
			}
		},
		reset(state){
			this.sendState(this.unit, this.unit.state);
			this.$eventHub.$emit('go-back');
		},
	}
};
</script>

<style lang="scss" scoped>
.control {
	text-align: center;
}

.tab-nav {
	border: 1px solid var(--color-border);
	border-radius: 4px;
	display: flex;
	font-size: 0;
	margin: 16px auto;
	max-width: 250px;
	user-select: none;

	.tab {
		cursor: pointer;
		display: inline-block;
		flex: 1;
		font-size: 16px;
		line-height: 16px;
		padding: 8px;
		text-align: center;

		&.active {
			background-color: var(--color-overlay);
		}
	}
}
</style>
<style lang="scss">
.toast-dot {
	border-radius: 50%;
	display: inline-block;
	height: 16px;
	margin-right: 4px;
	vertical-align: bottom;
	width: 16px;
}
</style>