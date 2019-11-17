<template>
	<section class="edit">
		<EditLamp v-if="unit.type == 'LAMP'" v-model="unit" />
		<EditGroup v-if="unit.type == 'GROUP'" v-model="unit" />
	</section>
</template>

<script>
const EditLamp = () =>
	import(/* webpackChunkName: "editLamp" */ "./components/editLamp");
const EditGroup = () =>
	import(/* webpackChunkName: "editGroup" */ "./components/editGroup");

import { UIStateNestedDefault } from "@/helpers/ui-states.js";

const defaultUnit = {
	name: "",
	icon: "highlight",
	tags: "",
	state: {
		color: "#2ab5a2",
		gradient: false,
	},
};
const defaultLamp = {
	...defaultUnit,
	type: "LAMP",
	ip: "",
	hostname: "",
	lampType: "RGB",
	channelMap: { r: 1, g: 2, b: 3 },
};
const defaultGroup = {
	...defaultUnit,
	type: "GROUP",
	lamps: [],
};

export default {
	name: "SettingsDetail",
	components: {
		EditLamp,
		EditGroup,
	},
	data() {
		return {
			unit: {},
		};
	},
	computed: {
		savedUnit() {
			return this.$store.getters["units/get"](this.$route.params.id);
		},
	},
	watch: {
		savedUnit: function(to, from) {
			if (!to || to === from) {
				return;
			}
			this.unit = to;
		},
		unit: function(to, from) {
			if (to === from) {
				return;
			}

			this.$store.commit("ui/patch", {
				component: "appBarTop",
				payload: { title: { text: to.name } },
			});
		},
	},
	created() {
		const topBarState = {
			back_action: {
				event: "go-back",
				icon: "arrow_back",
			},
			actions: [],
		};
		if (this.$route.params.id) {
			this.unit = this.$store.getters["units/get"](this.$route.params.id);
			topBarState.actions.push({
				icon: "delete",
				event: "delete",
			});
		}
		if (!this.unit.type && this.$route.params.type) {
			const type = this.$route.params.type.toUpperCase();
			if (type === "LAMP") {
				this.unit = JSON.parse(JSON.stringify(defaultLamp));
			}
			if (type === "GROUP") {
				this.unit = JSON.parse(JSON.stringify(defaultGroup));
			}
		}
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: Object.assign(
				UIStateNestedDefault.appBarTop(
					this.unit.name || `add ${(this.unit.type || "").toLowerCase()}`
				),
				topBarState
			),
		});
		this.$store.commit("ui/patch", {
			component: "bottomNav",
			payload: Object.assign(UIStateNestedDefault.bottomNav(1), {
				fab: {
					icon: "check",
					event: "apply",
				},
			}),
		});

		this.$eventHub.$on("apply", this.apply);
		this.$eventHub.$on("delete", this.delete);
	},
	beforeDestroy() {
		this.$eventHub.$off("apply", this.apply);
		this.$eventHub.$off("delete", this.delete);
	},
	methods: {
		apply() {
			// TODO [#62]: save new state
			this.$store.dispatch("units/set", this.unit);
			this.$eventHub.$emit("go-back");
		},
		delete() {
			// TODO [#63]: save new state
			this.$store.dispatch("units/delete", this.unit.id);
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>
