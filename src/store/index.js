import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

let mixin = {
  computed: {
    user: function() {
    return this.$store.state.user;
    }
  },
}
Vue.mixin(mixin);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: undefined
  },
  mutations: {
    logout(state) {
      state.user = undefined;
    },
    login(state, user) {
      state.user = user;
    },
  }
})