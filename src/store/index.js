import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import user from './user';
import lamps from './lamps';

import firebaseSync from './firebaseSync';

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
    firebaseSync(config)
  ],
  modules: {
    user,
    lamps
  }
});