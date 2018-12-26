import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import lamps from './lamps';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    lamps
  }
});