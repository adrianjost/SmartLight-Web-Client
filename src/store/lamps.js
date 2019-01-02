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

function getIndex(list, id){
  return list.findIndex((obj)=>{return obj.id === id});
}

const mutations = {
  // TODO fix parameter handling in all mutations
  set(state, { data: {lampId, newData}}) {
    state.lamps[getIndex(state.lamps, lampId)] = newData;
  },
  setList(state, { data }){
    state.lamps = data;
  },
  setState(state, { id, data}) {
    state.lamps[getIndex(state.lamps, id)].state = data;
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