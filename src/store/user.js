import firebase from 'firebase';
import createPersistedState from 'vuex-persistedstate';

const plugins = [
  createPersistedState()
];

const state = {
  user: undefined
};

const getters = {
  get: (state) => { return (state.user === {})? false : state.user; },
  getLampIds: (state) => { return (state.user || {}).lamps},
  getGroupIds: (state) => { return (state.user || {}).groups},
};

const mutations = {
  logout(state) {
    state.user = {};
  },
  login(state, user) {
    state.user = user;
  },
};

const actions = {
  async logout(context) {
    try {
      const result = await firebase.auth().signOut();
      console.log(result);
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