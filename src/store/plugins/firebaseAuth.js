import { FAuth } from "@/helpers/firebase";

export default (store) => {
	FAuth.onAuthStateChanged((user) => {
		if (user) {
			store.dispatch("auth/login", user);
		} else {
			store.dispatch("auth/logout", user);
		}
	});
};
