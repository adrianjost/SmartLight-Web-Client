const state = {
  states: [
    {
      id: "blablagrad",
      type: "gradient",
      colors: ["#ff0000", "#0000ff", "#00ff00", "#ff0000"],
      stops: [0, 30, 40, 100],
      loop: true
    }
  ]
};

const getters = {
  "list": (state) => {
    return state.states;
  },
  "list-colors": (state) => {
    return state.states.filter((mode) => {
      return mode.type === "color";
    }).map(color => {
      color.background = color.color;
      return color;
    });
  },
  "list-gradients": (state) => {
    return state.states.filter((mode) => {
      return mode.type === "gradient";
    }).filter(gradient => { return gradient.colors; })
    .map(gradient => {

      // generate background pattern
      gradient.background = "linear-gradient(90deg, "
      gradient.colors.forEach((color, index) => {
        gradient.background += `${color} ${gradient.stops[index]}%`;
        if(index < gradient.colors.length - 1){
          gradient.background += ", "
        }
      })
      gradient.background += `)`

      return gradient;
    });
  },
};

function getIndex(list, id){
  return list.findIndex((obj)=>{return obj.id === id});
}

function isIdUnique(list, id){
  if(!id){ return false};
  return list.every((item) => {
    return item.id !== id;
  })
}

const mutations = {
  add(state, { data, index }) {
    // TODO inject uid
    while(!isIdUnique(state.states, data.id)){
      data.id = (new Date()).getTime().toString();
    }
    if(!index){
      state.states.push(data);
    }else{
      index = Math.min(index, state.states.length);
      state.states.splice(index, 0, data);
    }
  },
  update(state, { data }) {
    state.states[getIndex(state.states, data.id)] = data;
  },
  delete(state, id) {
    state.states.splice(getIndex(state.states, id), 1);
  },
  setList(state, { data }){
    state.states = data;
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