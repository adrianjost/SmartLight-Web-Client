/*
example syncMap with default values

syncMapping = [
	{
		dbPath: "", // firebase db path
		commit: "", // store commit mutation
		type: "update" // type to use to react to changes
	}
]
*/

import { firebase } from '@firebase/app';
import '@firebase/auth';

export default function firebaseSync() {
	return (store) => {
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				store.commit("user/login", user);
			} else {
				store.commit("user/logout");
			}
		});
	}
}