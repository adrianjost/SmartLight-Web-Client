import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import createPersistedState from 'vuex-persistedstate';
import firebaseSync from './plugins/firebaseSync';
import firebaseAuth from './plugins/firebaseAuth';

import user from './user';
import lamps from './lamps';
import ui from './ui';

const config = [
  { // DB Lamps => Vuex Lamps
    ref: (fireDB) =>{
      return fireDB.ref("lamps")
      .orderByChild("creatorId")
      .equalTo("IcAd2hRhBoRs5WTORWTTCSaRSvy2");
    },
    mutation: "lamps/setList",
    direction: "down"
  }
]

export default new Vuex.Store({
  plugins: [
    createPersistedState(),
    //firebaseSync(config),
    firebaseAuth()
  ],
  modules: {
    ui,
    user,
    lamps
  }
});