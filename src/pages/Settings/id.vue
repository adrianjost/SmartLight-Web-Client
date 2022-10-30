<template>
	<section class="edit">
		<EditLamp v-if="unit.type == 'LAMP'" v-model="unit" />
		<EditGroup v-if="unit.type == 'GROUP'" v-model="unit" />
	</section>
</template>

<script>
import { reactive, defineAsyncComponent } from "vue";

const EditLamp = defineAsyncComponent(() =>
	import(/* webpackChunkName: "editLamp" */ "./components/editLamp")
);
const EditGroup = defineAsyncComponent(() =>
	import(/* webpackChunkName: "editGroup" */ "./components/editGroup")
);

import { UIStateNestedDefault } from "@/helpers/ui-states.js";

const defaultUnit = {
	name: "",
	icon: "highlight",
	tags: "",
	state: {
		color: "#2ab5a2",
		type: "MANUAL",
	},
};
const defaultLamp = () =>
	reactive({
		...defaultUnit,
		type: "LAMP",
		ip: "",
		hostname: "",
		lamptype: "RGB",
		channelMap: { r: 1, g: 2, b: 3 },
	});
const defaultGroup = () =>
	reactive({
		...defaultUnit,
		type: "GROUP",
		lamps: [],
	});

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
		savedUnit: function (to, from) {
			if (!to || to === from) {
				return;
			}
			this.unit = to;
		},
		unit: function (to, from) {
			if (to === from) {
				return;
			}

			this.$store.commit("ui/patch", {
				component: "appBarTop",
				payload: { title: { text: to.name } },
			});
			if (to.type === "LAMP") {
				this.$store.commit("ui/patch", {
					component: "appBarTop",
					payload: {
						actions: [
							{
								icon: "share",
								event: "share",
							},
							{
								icon: "delete",
								event: "delete",
							},
						],
					},
				});
			}
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
			if (this.unit.type === "LAMP") {
				topBarState.actions.push({
					icon: "share",
					event: "share",
				});
			}
			topBarState.actions.push({
				icon: "delete",
				event: "delete",
			});
		}
		if (!this.unit.type && this.$route.params.type) {
			const type = this.$route.params.type.toUpperCase();
			if (type === "LAMP") {
				this.unit = defaultLamp();
			}
			if (type === "GROUP") {
				this.unit = defaultGroup();
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

		this.$eventHub.on("apply", this.apply);
		this.$eventHub.on("share", this.share);
		this.$eventHub.on("delete", this.delete);
	},
	beforeUnmount() {
		this.$eventHub.off("apply", this.apply);
		this.$eventHub.off("share", this.share);
		this.$eventHub.off("delete", this.delete);
	},
	methods: {
		async apply() {
			await this.$store.dispatch("units/set", this.unit);
			this.$eventHub.emit("go-back");
		},
		async delete() {
			this.$store.dispatch("units/deleteUnit", this.unit); // Do not await delete for fast UI response
			this.$eventHub.emit("go-back");
		},
		async share() {
			const u = this.unit;
			const sharedData = JSON.stringify({
				lamptype: u.lamptype,
				tags: u.tags,
				state: {},
				icon: u.icon,
				channelMap: u.channelMap,
				name: u.name,
				ip: u.ip,
				type: u.type,
				lamptype: u.lamptype,
				hostname: u.hostname,
			});

			await navigator.clipboard
				.writeText(sharedData)
				.then(() => {
					this.toast(`Copied ${name} to clipboard.`, "check");
				})
				.catch(() => {
					this.toastError(`Failed copying ${name} to clipboard.`);
				});
		},
	},
};
</script>
