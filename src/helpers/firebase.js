import { initializeApp } from "firebase/app";
import {
	getFirestore,
	enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getPerformance } from "firebase/performance";

import { config } from "./firebaseConfig";

export const firebaseApp = initializeApp(config);

const perf = getPerformance(firebaseApp);

export const FStore = getFirestore(firebaseApp);
enableMultiTabIndexedDbPersistence(FStore);

export const FAuth = getAuth(firebaseApp);
