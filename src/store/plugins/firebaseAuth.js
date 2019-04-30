/* eslint-disable no-console */

import { firebase } from "@firebase/app";
import { config } from "@/helpers/firebaseConfig";
import "@firebase/firestore";

firebase.initializeApp(config);
firebase.firestore();

export default function firebaseSync() {
	return (store) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				store.dispatch("auth/login", user);
			} else {
				store.dispatch("auth/logout");
			}
		});
	};
}
