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
import { config } from '@/helpers/firebaseConfig'
import '@firebase/auth';
import '@firebase/firestore';

firebase.initializeApp(config);
const firestore = firebase.firestore()
firestore.settings({timestampsInSnapshots: true})

export default function firebaseSync() {
	return (store) => {
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				// user is logged in so openDBChannel
				store.commit("user/login", user);
				store.dispatch('units/openDBChannel').catch(console.error);
				store.dispatch('savedStates/openDBChannel').catch(console.error);
				store.dispatch('user/openDBChannel').catch(console.error);
			} else {
				store.commit("user/logout");
				store.dispatch('units/closeDBChannel', {clearModule: true}).catch(console.error);
				store.dispatch('savedStates/closeDBChannel', {clearModule: true}).catch(console.error);
				store.dispatch('user/closeDBChannel', {clearModule: true}).catch(console.error);
			}
		});
	}
}