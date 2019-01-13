import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import createPersistedState from 'vuex-persistedstate';
import firebaseAuth from './plugins/firebaseAuth';

import ui from './ui';
import user from './user';
import units from './units';
import savedStates from './savedStates';

export default new Vuex.Store({
	plugins: [
		createPersistedState(),
		firebaseAuth()
	],
	modules: {
		ui,
		user,
		units,
		savedStates
	}
});