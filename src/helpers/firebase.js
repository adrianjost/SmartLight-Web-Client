/* eslint-disable no-console */

import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/performance";

import { config } from "./firebaseConfig";

// initialize if not already done
try {
	firebase.initializeApp(config);
} catch (error) {
	console.warn("firebase already initialized", error);
}

firebase.firestore().enablePersistence();

export { firebase };
export const FAuth = firebase.auth();
export const FStore = firebase.firestore();
export const FPerf =
	process.env.NODE_ENV === "production"
		? firebase.performance()
		: firebase.performance;
