const unitPrototyp = {
  id: undefined,
  name: "",
	icon: "",
	state: {}
}

const getters = {
	"list": (state) => {
		return Object.values(state.data);
	},
	"list-lamps": (state) => {
		return Object.values(state.data).filter(unit => unit.type.toUpperCase() === "LAMP" );
	},
	"list-groups": (state) => {
		return Object.values(state.data).filter(unit => unit.type.toUpperCase() === "GROUP" );
	},
	get: (state) => (unitId) => {
		return Object.values(state.data).filter(unit => unit.id === unitId)[0] || unitPrototyp;
	},
};

const actions = {
	setState(store, { id, data}) {
		const currentObjState = store.state.data[id];
		delete currentObjState.state;
		const newObject = Object.assign(currentObjState, { state: data });
		store.dispatch("set", newObject)
	},
};


const where = [ // an array of arrays
  ['created_by', '==', '{userId}'],
]
const orderBy = [] // an array of strings

export default {
	firestorePath: 'units/',
	firestoreRefType: 'collection',
	statePropName: 'data',
	moduleName: 'units',
	sync: {
    where,
    orderBy
	},
	namespaced: true,
	getters,
	actions
};