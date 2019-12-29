const unitPrototyp = {
	id: undefined,
	name: "",
	icon: "",
	state: {
		color: "#ffffff",
		gradient: false,
	},
};

function orderByName(unitA, unitB) {
	return unitA.name.localeCompare(unitB.name);
}

const getters = {
	list: (state) => {
		return Object.values(state.data).sort(orderByName);
	},
	"list-lamps": (state) => {
		return (
			Object.values(state.data)
				.filter((unit) => unit.type.toUpperCase() === "LAMP")
				.sort(orderByName) || []
		);
	},
	"list-groups": (state) => {
		return (
			Object.values(state.data)
				.filter((unit) => unit.type.toUpperCase() === "GROUP")
				.sort(orderByName) || []
		);
	},
	get: (state) => (unitId) => {
		return (
			Object.values(state.data).filter((unit) => unit.id === unitId)[0] ||
			unitPrototyp
		);
	},
};

const actions = {
	async setState(store, { id, data }) {
		const unit = store.state.data[id];
		if (typeof unit.state === "object") {
			Object.keys(unit.state).forEach((key) => {
				unit.state[key] = false;
			});
		}
		unit.state = { ...unit.state, ...data };
		store.dispatch("set", unit);
	},
};

const where = [
	// an array of arrays
	["created_by", "==", "{userId}"],
];
const orderBy = []; // an array of strings

export default {
	firestorePath: "units/",
	firestoreRefType: "collection",
	statePropName: "data",
	moduleName: "units",
	sync: {
		where,
		orderBy,
		guard: ["background"],
	},
	namespaced: true,
	getters,
	actions,
};
