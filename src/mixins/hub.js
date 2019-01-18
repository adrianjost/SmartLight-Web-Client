import localAPI from './localAPI.js'

export default {
	mixins: [localAPI],
	created() {
    /*
    this.$store.watch(
      (state, getters) => getters.status,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);
      },
    );
    */
	},
};
