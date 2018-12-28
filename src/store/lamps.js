const state = {
  lamps: []
};

const getters = {
  list: (state) => {
    return state.lamps.filter((lamp) => {
      return lamp && !!lamp.id;
    });
  },
  get: (state) => (lampId) => {
    return state.lamps.filter((lamp) => { return lamp.id === lampId})[0];
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
  state,
  getters,
  mutations,
  actions
};