import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";
import firebaseAuth from "./plugins/firebaseAuth";
import createEasyFirestore from "vuex-easy-firestore";
import { firebase } from "@/helpers/firebase";

import ui from "./ui";
import user from "./user";
import auth from "./auth";
import units from "./units";
import savedStates from "./savedStates";

// do the magic 🔥🧙‍♂️
const easyFirestore = createEasyFirestore([user, units, savedStates], {
	logging: process.env.NODE_ENV !== "production",
	FirebaseDependency: firebase,
});

export default new Vuex.Store({
	plugins: [
		createPersistedState({ paths: ["auth.authState", "auth.userInfo"] }),
		easyFirestore,
		firebaseAuth,
	],
	modules: {
		ui,
		auth,
	},
});
