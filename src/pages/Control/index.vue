<template>
	<section class="control">
		<h2 v-if="groups.length">Groups</h2>
		<div class="control-units">
			<ControlUnit
				v-for="unit in groups"
				:key="unit.id"
				class="control-unit"
				v-bind="unit"
				:size="zoom"
			/>
		</div>
		<h2>Lamps</h2>
		<div class="control-units">
			<ControlUnit
				v-for="unit in lamps"
				:key="unit.id"
				class="control-unit"
				v-bind="unit"
				:size="zoom"
			/>
			<RouterLink
				v-if="!lamps.length"
				v-slot="{ navigate }"
				to="/settings/add/lamp"
				custom
			>
				<button
					v-ripple
					class="button button-primary add-lamp"
					@click="navigate"
				>
					<i class="material-icons">add</i>
					<span>Add Lamp</span>
				</button>
			</RouterLink>
		</div>
		<div style="flex: 1"></div>
		<div class="control-zoom">
			<ZoomPicker ref="zoom" v-model="zoom" :min="64" :max="256" :step="16" />
		</div>
	</section>
</template>

<script>
import ControlUnit from "@/components/ControlUnit.vue";
import ZoomPicker from "@/components/picker/ZoomPicker.vue";
import { UIStateDefault } from "@/helpers/ui-states.js";
import unitBackground from "@/mixins/unitBackground.js";

export default {
	components: {
		ControlUnit,
		ZoomPicker,
	},
	mixins: [unitBackground],
	computed: {
		lamps() {
			return this.$store.getters["units/list-lamps"].map((unit) =>
				this.addBackground(unit)
			);
		},
		groups() {
			return this.$store.getters["units/list-groups"].map((unit) =>
				this.addBackground(unit)
			);
		},
		zoom: {
			get() {
				return this.$store.getters["ui/get"]("overviewZoom");
			},
			set(value) {
				this.$store.commit("ui/set", {
					component: "overviewZoom",
					payload: value,
				});
				this.$nextTick(() => {
					this.$refs.zoom.$el.scrollIntoView();
				});
			},
		},
	},
	created() {
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateDefault.appBarTop({
				user: this.$store.getters["auth/get"],
				title: "Control",
			}),
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: UIStateDefault.bottomNav(0),
		});
	},
};
</script>

<style lang="scss" scoped>
.control {
	display: flex;
	flex: 1;
	flex-direction: column;
}

h2 {
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

.add-lamp {
	display: flex;
	align-items: center;
	margin: 16px 0;
}
.control-zoom {
	display: flex;
	justify-content: center;
	margin: 16px 0 0;
}
</style>
