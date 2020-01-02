<template>
	<div>
		<h2>Lamps:</h2>
		<ControlUnitList :control-units="lamps" add-url="/settings/add/lamp" />
		<h2>Groups:</h2>
		<ControlUnitList :control-units="groups" add-url="/settings/add/group" />

		<hr />

		<RouterLink v-ripple to="/settings/api" class="button button-primary">
			API Info
		</RouterLink>
	</div>
</template>

<script>
import ControlUnitList from "@/components/controlUnitList.vue";
import { UIStateDefault } from "@/helpers/ui-states.js";
import unitBackground from "@/mixins/unitBackground.js";

export default {
	components: {
		ControlUnitList,
	},
	mixins: [unitBackground],
	computed: {
		user() {
			return this.$store.getters["auth/get"];
		},
		lamps() {
			return this.$store.getters["units/list-lamps"].map((lamp) =>
				this.addBackground(lamp)
			);
		},
		groups() {
			return this.$store.getters["units/list-groups"].map((group) =>
				this.addBackground(group)
			);
		},
	},
	created() {
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateDefault.appBarTop({ user: this.user, title: "Settings" }),
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: UIStateDefault.bottomNav(1),
		});
	},
};
</script>
<style lang="scss" scoped>
.no-wrap {
	word-wrap: none;
	white-space: nowrap;
}
</style>
