const unitPrototyp = {
	id: undefined,
	name: "",
	icon: "",
	state: {
		color: "#ffffff",
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
		const unit = Object.values(state.data).find((unit) => unit.id === unitId);
		return unit || unitPrototyp;
	},
	load: (state) => (unitId) => {
		const waitForUnit = () =>
			new Promise((resolve) =>
				setTimeout(async () => {
					const unit = Object.values(state.data).find(
						(unit) => unit.id === unitId
					);
					if (!unit) {
						await waitForUnit();
					}
					resolve();
				}, 10)
			);
		return waitForUnit();
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
	["allowedUsers", "array-contains", "{userId}"],
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
		insertHook: function (updateFirestore, doc, store) {
			const uid = store.getters["auth/get"].uid;
			if (!Array.isArray(doc.allowedUsers)) {
				doc.allowedUsers = [];
			}
			if (!doc.allowedUsers.includes(uid)) {
				doc.allowedUsers.push(uid);
			}
			return updateFirestore(doc);
		},
	},
	namespaced: true,
	getters,
	actions,
};
