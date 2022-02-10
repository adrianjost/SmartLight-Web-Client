<template>
	<div>
		<h2>Lamps:</h2>
		<ControlUnitList :control-units="lamps" add-url="/settings/add/lamp" />
		<h2>Groups:</h2>
		<ControlUnitList :control-units="groups" add-url="/settings/add/group" />

		<hr />

		<button
			v-ripple
			class="button button-primary"
			style="margin-right: 16px"
			@click="importData"
		>
			Import
		</button>

		<RouterLink v-ripple to="/settings/api" class="button button-primary">
			API Info
		</RouterLink>

		<SLSelect v-model="theme" label="Theme" :options="availableThemes" />
	</div>
</template>

<script>
import ControlUnitList from "@/components/controlUnitList.vue";
import { UIStateDefault } from "@/helpers/ui-states.js";
import unitBackground from "@/mixins/unitBackground.js";
import Select from "@/components/picker/select";

export default {
	components: {
		ControlUnitList,
		SLSelect: Select,
	},
	mixins: [unitBackground],
	data() {
		return {
			availableThemes: [
				{ label: "System", value: "system" },
				{ label: "Dark", value: "dark" },
				{ label: "Light", value: "light" },
			],
		};
	},
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
		theme: {
			get() {
				return this.$store.getters["ui/get"]("theme");
			},
			set(value) {
				this.$store.commit("ui/set", {
					component: "theme",
					payload: value,
				});
			},
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
	methods: {
		async importData() {
			try {
				let data = JSON.parse(prompt("Shared Data"));
				if (!Array.isArray(data)) {
					data = [data];
				}
				await Promise.all(
					data.map((unit) => {
						return this.$store.dispatch("units/set", unit);
					})
				);
				this.toast("Import successfull", "check");
			} catch (error) {
				console.error(error);
				this.toastError("Failed to import data");
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.no-wrap {
	word-wrap: none;
	white-space: nowrap;
}
</style>
