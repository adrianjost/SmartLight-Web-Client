/* eslint-disable no-console */

import { firebase } from "@firebase/app";
import { config } from "@/helpers/firebaseConfig";
import "@firebase/auth";
import "@firebase/firestore";

firebase.initializeApp(config);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

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
