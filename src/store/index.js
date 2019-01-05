import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import createPersistedState from 'vuex-persistedstate';
import firebaseSync from './plugins/firebaseSync';
import firebaseAuth from './plugins/firebaseAuth';

import ui from './ui';
import user from './user';
import units from './units';
import savedStates from './savedStates';

const config = [
  { // DB Lamps => Vuex Lamps
    ref: (fireDB) =>{
      return fireDB.ref("units")
      .orderByChild("creatorId")
      .equalTo("IcAd2hRhBoRs5WTORWTTCSaRSvy2");
    },
    mutation: "units/setList",
    direction: "down"
  }
]

export default new Vuex.Store({
  plugins: [
    createPersistedState(),
    firebaseSync(config),
    firebaseAuth()
  ],
  modules: {
    ui,
    user,
    units,
    savedStates
  }
});