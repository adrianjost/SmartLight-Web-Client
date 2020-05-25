export default {
	state_cache: {},
	computed: {
		hub_units() {
			return this.$store.getters["units/list"];
		},
	},
	watch: {
		hub_units: {
			handler: function (to) {
				const cache = this.$options.state_cache;
				to.forEach((unit) => {
					const state = JSON.stringify(unit.state);
					if (cache[unit.id] !== state) {
						if (cache[unit.id]) {
							this.$store.dispatch("localAPI/sendState", {
								unit,
								state: unit.state,
							});
						}
						cache[unit.id] = state;
					}
				});
			},
			deep: true,
		},
	},
};
