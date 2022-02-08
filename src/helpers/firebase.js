/* eslint-disable no-console */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { config } from "./firebaseConfig";

export const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

export const FAuth = getAuth(firebaseApp);
export const FStore = db;
