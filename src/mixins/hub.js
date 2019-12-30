export default {
	computed: {
		hub_units() {
			return this.$store.getters["units/list"];
		},
	},
	watch: {
		hub_units: {
			handler: function(to, from) {
				to.forEach((unit) => {
					this.$store.dispatch("localAPI/sendState", {
						unit,
						state: unit.state,
					});
				});
			},
			deep: true,
		},
	},
};
