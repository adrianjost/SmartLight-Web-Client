<template>
	<div>
		<h2>Lamps:</h2>
		<control-unit-list
			:control-units="lamps"
			add-url="/settings/add/lamp"
		/>
		<h2>Groups:</h2>
		<control-unit-list
			:control-units="groups"
			add-url="/settings/add/group"
		/>
		<button @click="updateToken" type="button">Update API-Token</button>
		<pre>{{api_token}}</pre>
	</div>
</template>

<script>
import controlUnitList from '@/components/controlUnitList.vue';
import { UIStateDefault } from '@/helpers/ui-states.js';
import unitBackground from '@/mixins/unitBackground.js';

export default {
	components: {
		controlUnitList
	},
	mixins: [unitBackground],
	created(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateDefault.appBarTop({user: this.user, title:"Settings"})
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: UIStateDefault.bottomNav(1)
		});
	},
	methods: {
		updateToken(){
			console.log("update Token");
			this.$store.dispatch('user/set', {api_token: Date.now()})
		}
	},
	computed: {
		user () {
			return this.$store.getters["user/get"];
		},
		lamps() {
			return this.$store.getters["units/list-lamps"].map(lamp => this.addBackground(lamp));
		},
		groups() {
			return this.$store.getters["units/list-groups"].map(group => this.addBackground(group));
		},
		api_token() {
			return this.$store.getters["user/api_token"];
		}
	}
};
</script>

<style lang="scss" scoped>
</style>