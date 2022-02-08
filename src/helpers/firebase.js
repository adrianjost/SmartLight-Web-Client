/* eslint-disable no-console */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { config } from "./firebaseConfig";

export const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

// TODO [$620295039df3610009f66d5a]: enable performance monitoring
// import { getPerformance } from "firebase/performance";
// const perf = getPerformance(app);

export const FAuth = getAuth(firebaseApp);
export const FStore = db;
