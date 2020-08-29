<template>
	<section class="text-center">
		<h1 class="header">Welcome</h1>
		<h2 class="subheader">Sign in to continue</h2>
		<div id="firebaseui-auth-container" />
	</section>
</template>

<script>
import { firebase, FAuth } from "@/helpers/firebase";
import { mapGetters } from "vuex";

import * as firebaseui from "firebaseui";
let loginUi;

export default {
	name: "Auth",
	created() {
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: {
				visible: false,
			},
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: {
				visible: false,
			},
		});
	},
	mounted() {
		loginUi = new firebaseui.auth.AuthUI(FAuth);
		const uiConfig = {
			signInSuccessUrl: this.$route.query.redirect || "/",
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.GithubAuthProvider.PROVIDER_ID,
				firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
			],
		};
		loginUi.start("#firebaseui-auth-container", uiConfig);
	},
};
</script>

<style lang="scss" scoped>
@import "~firebaseui/dist/firebaseui.css";

.text-center {
	text-align: center;
}

.header {
	font-size: 56px;
}

.subheader {
	font-size: 24px;
}

#firebaseui-auth-container {
	padding: 1em 0;
}
</style>
