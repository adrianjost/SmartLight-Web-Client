import { FAuth } from "@/helpers/firebase";
import { onAuthStateChanged } from "firebase/auth";
export default (store) => {
	onAuthStateChanged(FAuth, (user) => {
		if (user) {
			store.dispatch("auth/login", user);
		} else {
			store.dispatch("auth/logout", user);
		}
	});
};
