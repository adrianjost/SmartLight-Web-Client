const state = {
  units: []
};

const getters = {
  "list": (state) => {
    return state.units;
  },
  "list-lamps": (state) => {
    return state.units.filter(unit => unit.type === "lamp" );
  },
  "list-groups": (state) => {
    return state.units.filter(unit => unit.type === "group" );
  },
  get: (state) => (unitId) => {
    return state.units.filter(unit => unit.id === unitId)[0];
  },
};

function getIndex(list, unitId){
  return list.findIndex(unit => unit.id === unitId);
}

const mutations = {
  // TODO fix parameter handling in all mutations
  set(state, { data: {unitId, newData}}) {
    if(!unitId || !newData){ return; }
    state.units[getIndex(state.units, unitId)] = newData;
  },
  setList(state, { data }){
    state.units = data;
  },
  setState(state, { id, data}) {
    state.units[getIndex(state.units, id)].state = data;
  },
  delete(state, { data: {id}}) {
    if(!id){ return; }
    state.units.slice(getIndex(state.units, unitId), 1);
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