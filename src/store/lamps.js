import createPersistedState from 'vuex-persistedstate';

const plugins = [
  createPersistedState()
];

const state = {
  lamps: []
};

const getters = {
  list: (state) => {
    return state.lamps.filter((lamp) => {
      return lamp && !!lamp.id;
    });
  },
  get: (state, lampId) => {
    return state.lamps[lampId];
  },
};

const mutations = {
  set(state, { data: {lampId, newData}}) {
    state.lamps[lampId] = newData;
  },
  setList(state, { data }){
    state.lamps = data;
  },
  setState(state, { data: {lampId, newLampState}}) {
    state.lamps[lampId].state = newLampState;
  },
};

const actions = {

};

export default {
  namespaced: true,
  plugins,
  state,
  getters,
  mutations,
  actions
};