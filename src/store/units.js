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
		unit.state = {
			...unit.state,
			...data,
		};

		if (unit.state.type !== "AUTO") {
			unit.state.type = unit.state.color === "#000000" ? "OFF" : "MANUAL";
		}
		store.dispatch("set", unit);
	},
	async deleteUnit(store, unit) {
		const updates = [store.dispatch("delete", unit.id)];
		if (unit.type === "LAMP") {
			const groupUpdates = store.getters["list-groups"]
				.filter((group) => group.lamps.includes(unit.id))
				.map((group) => {
					group.lamps = group.lamps.filter((lamp) => lamp !== unit.id);
					return store.dispatch("set", group);
				});
			updates.push(...groupUpdates);
		}
		await Promise.all(updates);
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
