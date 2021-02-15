const cache = {};

export default {
	computed: {
		hub_units() {
			return this.$store.getters["units/list"];
		},
	},
	watch: {
		hub_units: {
			handler: function (to) {
				to.forEach((unit) => {
					const state = JSON.stringify(unit.state);
					if (cache[unit.id] === state) {
						return;
					}
					this.$store.dispatch("localAPI/sendState", {
						unit,
						state: unit.state,
					});
					cache[unit.id] = state;
				});
			},
			deep: true,
		},
	},
};
