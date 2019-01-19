import localAPI from '@/mixins/localAPI.js'

export default {
	mixins: [localAPI],
	computed: {
		hub_units () {
			return this.$store.getters["units/list"];
		},
	},
	watch: {
		hub_units: {
			handler: function(to, from){
				to.forEach((unit) => {
					this.sendState(unit, unit.state);
				});
			},
			deep: true
		}
	},
};