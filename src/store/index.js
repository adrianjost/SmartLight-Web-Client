import { createStore } from "vuex";

import createPersistedState from "vuex-persistedstate";
import firebaseAuth from "./plugins/firebaseAuth";

import ui from "./ui";
import user from "./user";
import auth from "./auth";
import units from "./units";
import savedStates from "./savedStates";
import localAPI from "./localAPI";

import createEasyFirestore from "vuex-easy-firestore";
import { firebaseApp } from "@/helpers/firebase";

// do the magic 🔥🧙‍♂️
const easyFirestore = createEasyFirestore([user, units, savedStates], {
	logging: process.env.NODE_ENV !== "production",
	FirebaseDependency: firebaseApp,
});

export default createStore({
	plugins: [
		createPersistedState({
			paths: ["auth.authState", "auth.userInfo", "ui.theme", "ui.overviewZoom"],
		}),
		easyFirestore,
		firebaseAuth,
	],
	modules: {
		ui,
		auth,
		// user,
		localAPI,
		// units,
		// savedStates,
	},
});
