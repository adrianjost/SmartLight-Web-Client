import { firebase } from '@firebase/app';
import '@firebase/auth';

const state = {
	userInfo: undefined
};

const getters = {
	isAuthenticated: (state) => { return !!state.userInfo},
	get: (state) => { return state.userInfo; },
	api_token: (state) => { return state.data.api_token; }
};

const mutations = {
	logout(state) {
		state.userInfo = undefined;
	},
	login(state, user) {
		state.userInfo = user;
	},
};

const actions = {
	async logout(context) {
		try {
			await firebase.auth().signOut();
			context.commit('logout');
			window.location.reload()
		} catch(error){
			console.error(error);
		}
	}
};

export default {
	firestorePath: 'users/{userId}',
	firestoreRefType: 'docs',
	statePropName: 'data',
	moduleName: 'user',
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};