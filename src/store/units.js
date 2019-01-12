const state = {
	units: []
};

const getters = {
	"list": (state) => {
		return state.units.map(unit => {
			unit.type = unit.type.toUpperCase();
			return unit;
		});
	},
	"list-lamps": (state) => {
		return state.units.filter(unit => unit.type.toUpperCase() === "LAMP" );
	},
	"list-groups": (state) => {
		return state.units.filter(unit => unit.type.toUpperCase() === "GROUP" );
	},
	get: (state) => (unitId) => {
		return state.units.filter(unit => unit.id === unitId)[0];
	},
};

function getIndex(list, unitId){
	return list.findIndex(unit => unit.id === unitId);
}

function isIdUnique(list, id){
	if(!id){ return false };
	return list.every((item) => {
		return item.id !== id;
	})
}

const mutations = {
	// TODO fix parameter handling in all mutations
	set(state, { data: { data }}) {
		console.log("new data", data);
		if(!data){ return; }
		while(!isIdUnique(state.units, data.id)){
			data.id = (new Date()).getTime().toString();
		}
		const currentIndex = getIndex(state.units, data.id);
		if(currentIndex >= 0){
			state.units[currentIndex] = data;
		}else{
			state.units.push(data);
		}
		console.log(state.units);
	},
	setList(state, { data }){
		state.units = data;
	},
	setState(state, { id, data}) {
		state.units[getIndex(state.units, id)].state = data;
	},
	delete(state, { data: {id}}) {
		if(!id){ return; }
		state.units.splice(getIndex(state.units, id), 1);
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