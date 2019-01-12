<template>
	<section class="edit">
		<edit-lamp
			v-if="unit.type == 'lamp'"
			v-model="unit"
		/>
		<edit-group
			v-if="unit.type == 'group'"
			v-model="unit"
		/>
	</section>
</template>

<script>
import editLamp from "./components/editLamp"
import editGroup from "./components/editGroup"

import { UIStateNestedDefault } from '@/helpers/ui-states.js';

export default {
	name: "settings-detail",
	components: {
		editLamp,
		editGroup
	},
	data(){
		return {
			unit: this.$store.getters["units/get"](this.$route.params.id)
		}
	},
	created(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: Object.assign(UIStateNestedDefault.appBarTop(this.unit.name), {
				back_action: {
					event: "go-back",
					icon: "arrow_back"
				},
				actions: [
					{
						icon: "delete",
						event: "delete"
					}
				]
			})
		});
		this.$store.commit("ui/patch", {
			component: "bottomNav",
			payload: Object.assign(UIStateNestedDefault.bottomNav(0), {
				fab: {
					icon: "check",
					event: "apply"
				}
			})
		});

		this.$eventHub.$on('apply', this.apply);
		this.$eventHub.$on('go-back', () => { this.$router.go(-1); });
	},
	beforeDestroy(){
		this.$eventHub.$off('apply', this.apply);
	},
	methods: {
		apply(){
			// TODO: save new state
			this.$store.commit("units/set", { data: {
				unitId: this.unit.id,
				newData: this.unit
			}});
			this.$router.go(-1);
		},
	},
};
</script>
