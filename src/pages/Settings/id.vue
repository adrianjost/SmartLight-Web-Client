<template>
	<section class="edit">
		<edit-lamp
			v-if="unit.type == 'LAMP'"
			v-model="unit"
		/>
		<edit-group
			v-if="unit.type == 'GROUP'"
			v-model="unit"
		/>
	</section>
</template>

<script>
import editLamp from "./components/editLamp"
import editGroup from "./components/editGroup"

import { UIStateNestedDefault } from '@/helpers/ui-states.js';

const defaultUnit = {
  name: "",
  icon: "highlight"
}
const defaultLamp = {
  ...defaultUnit,
  type: "LAMP",
  ip: "",
  hostname: "",
}
const defaultGroup = {
  ...defaultUnit,
  type: "GROUP",
  lamps: []
}

export default {
	name: "settings-detail",
	components: {
		editLamp,
		editGroup
  },
	data(){
		return {
			unit: {}
		}
	},
	created(){
		const topBarState = {
			back_action: {
				event: "go-back",
				icon: "arrow_back"
			},
			actions: []
		};
    if(this.$route.params.id){
			this.unit = this.$store.getters["units/get"](this.$route.params.id);
			topBarState.actions.push({
					icon: "delete",
					event: "delete"
				});
    }
    if(!this.unit.type && this.$route.params.type){
      const type = this.$route.params.type.toUpperCase();
      if(type === "LAMP"){
        this.unit = defaultLamp;
      }
      if(type === "GROUP"){
        this.unit = defaultGroup;
      }
    }
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: Object.assign(UIStateNestedDefault.appBarTop(this.unit.name || `add ${this.unit.type.toLowerCase()}`), topBarState)
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
		this.$eventHub.$on('delete', this.delete);
		this.$eventHub.$on('go-back', () => { this.$router.go(-1); });
	},
	beforeDestroy(){
		this.$eventHub.$off('apply', this.apply);
		this.$eventHub.$off('delete', this.delete);
	},
	methods: {
		apply(){
			// TODO: save new state
			this.$store.commit("units/set", { data: {
				data: this.unit
			}});
			this.$router.go(-1);
		},
		delete(){
			// TODO: save new state
			this.$store.commit("units/delete", { data: {
				id: this.unit.id
			}});
			this.$router.go(-1);
		},
	},
};
</script>
