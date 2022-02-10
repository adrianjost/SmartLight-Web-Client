const state = {
	theme: "system",
	appBarTop: {},
	bottomNav: {},
	overviewZoom: 96,
};

const getters = {
	get: (state) => (component) => {
		return state[component];
	},
};

const mutations = {
	visible(state, { visible, component }) {
		state[component].visible = visible;
	},
	set(state, { component, payload }) {
		state[component] = payload;
	},
	patch(state, { component, payload }) {
		state[component] = Object.assign(state[component], payload);
	},
};

const actions = {};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
