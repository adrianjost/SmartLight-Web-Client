/* eslint-disable no-console */

import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";

import { config } from "./firebaseConfig";

// initialize if not already done
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}
firebase.firestore().enablePersistence();

export { firebase };
export const FAuth = firebase.auth();
export const FStore = firebase.firestore();
