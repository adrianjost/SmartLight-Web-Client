<template>
	<section>
		<h2>Groups</h2>
		<div class="control-units">
			<ControlUnit
				v-for="unit in groups"
				:key="unit.id"
				class="control-unit"
				:data="unit"
			/>
		</div>
		<h2>Lamps</h2>
		<div class="control-units">
			<ControlUnit
				v-for="unit in lamps"
				:key="unit.id"
				class="control-unit"
				:data="unit"
			/>
		</div>
	</section>
</template>

<script>
import ControlUnit from '@/components/ControlUnit.vue'
import { UIStateDefault } from '@/helpers/ui-states.js';
import unitBackground from '@/mixins/unitBackground.js';

export default {
	components: {
		ControlUnit
	},
	mixins: [unitBackground],
	computed: {
		lamps() {
			return (this.$store.getters["units/list-lamps"] || []).map(unit => this.addBackground(unit));
		},
		groups() {
			return (this.$store.getters["units/list-groups"] || []).map(unit => this.addBackground(unit));
		},
	},
	created(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateDefault.appBarTop({
				user: this.$store.getters["auth/get"],
				title: "Control"
			})
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: UIStateDefault.bottomNav(0)
		});
	}
};
</script>

<style lang="scss" scoped>
h2{
	text-align: center;
	text-decoration: underline;
}

.control-units {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
}

.control-unit {
	margin: 8px;
}
</style>