/* eslint-disable no-console */

import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";

import { config } from "./firebaseConfig";

firebase.initializeApp(config);
firebase.firestore().enablePersistence();

export { firebase };
export const FAuth = firebase.auth();
