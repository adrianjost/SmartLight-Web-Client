import { firebase } from '@firebase/app';
import '@firebase/auth';
//import vm from '../main'

const state = {
  userInfo: undefined
};

const getters = {
  isAuthenticated: (state) => { return !!state.userInfo},
  get: (state) => { return state.userInfo; },
};

const mutations = {
  logout(state) {
    state.userInfo = undefined;
  },
  login(state, user) {
    state.userInfo = user;
  },
};

const actions = {
  async logout(context) {
    try {
      await firebase.auth().signOut();
      /* vm.$router.push({
          path: '/login'
        });
        */
      context.commit('logout');
      window.location.reload()
    } catch(error){
      console.error(error);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};