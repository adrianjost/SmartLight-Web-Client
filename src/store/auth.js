import { FAuth } from "@/helpers/firebase";

const state = {
	authState: undefined,
	userInfo: undefined,
};

const getters = {
	initialized: (state) => state.initialized,
	isAuthenticated: (state) => {
		return state.authState;
	},
	get: (state) => {
		return state.userInfo;
	},
};

const mutations = {
	logout(state) {
		state.authState = false;
		state.userInfo = undefined;
	},
	login(state, user) {
		state.authState = true;
		state.userInfo = user;
	},
};

const actions = {
	async login(store, user) {
		store.commit("login", user);
		const syncedStores = [
			store.dispatch("units/openDBChannel", null, { root: true }),
			store.dispatch("savedStates/openDBChannel", null, { root: true }),
			store.dispatch("user/openDBChannel", null, { root: true }),
		];
		return Promise.all(syncedStores);
	},
	async logout(store) {
		try {
			const syncedStores = [
				FAuth.signOut(),
				store.dispatch(
					"units/closeDBChannel",
					{ clearModule: true },
					{ root: true }
				),
				store.dispatch(
					"savedStates/closeDBChannel",
					{ clearModule: true },
					{ root: true }
				),
				store.dispatch(
					"user/closeDBChannel",
					{ clearModule: true },
					{ root: true }
				),
			];
			await Promise.all(syncedStores);
			store.commit("logout");
		} catch (error) {
			console.error(error); // eslint-disable-line no-console
		}
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
