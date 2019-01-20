<template>
	<section>
		<h2 v-if="groups.length">
			Groups
		</h2>
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
			<RouterLink
				v-if="!lamps.length"
				v-ripple
				to="/settings/add/lamp"
				tag="button"
				class="button button-primary add-lamp"
			>
				<i class="material-icons">
					add
				</i><span>Add Lamp</span>
			</RouterLink>
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

.add-lamp{
	display: flex;
	align-items: center;
	margin: 16px 0;
}
</style>