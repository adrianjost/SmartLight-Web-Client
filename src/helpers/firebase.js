/* eslint-disable no-console */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { config } from "./firebaseConfig";

export const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

import { getPerformance } from "firebase/performance";
const perf = getPerformance(app);

export const FAuth = getAuth(firebaseApp);
export const FStore = db;
