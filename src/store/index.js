import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";
import firebaseAuth from "./plugins/firebaseAuth";
import createEasyFirestore from "vuex-easy-firestore";

import ui from "./ui";
import user from "./user";
import auth from "./auth";
import units from "./units";
import savedStates from "./savedStates";

// do the magic 🔥🧙‍♂️
const easyFirestore = createEasyFirestore([user, units, savedStates], {
	logging: process.env.NODE_ENV !== "production",
});

export default new Vuex.Store({
	plugins: [createPersistedState(), easyFirestore, firebaseAuth()],
	modules: {
		ui,
		auth,
	},
});
