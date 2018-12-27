import firebase from 'firebase';
import createPersistedState from 'vuex-persistedstate';

const plugins = [
  createPersistedState()
];

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
      context.commit('logout');
    } catch(error){
      console.error(error);
    }
  },
  login(context, user) {
    context.commit('login', user);
  },
};

export default {
  namespaced: true,
  plugins,
  state,
  getters,
  mutations,
  actions
};