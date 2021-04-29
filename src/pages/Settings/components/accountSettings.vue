<template>
	<form v-if="currentSSOProvider !== null">
		<h3>Password</h3>

		<p v-if="!hasPassword">
			In order to use the SmartLight Hub, you need to set a password.
		</p>
		<p v-else>
			To use the SmartLight Hub you need to use your password. If you forgot
			yours, just enter a new one down below.
			<br />
			<b>
				Be aware, that all existing password signed in sessions get logged out.
			</b>
		</p>

		<p>Current E-Mail: {{ initialUser.email }}</p>

		<SLInput
			v-model="password"
			label="Password"
			placeholder="********"
			type="password"
			hint="min. 20 characters"
		/>

		<div class="password-actions">
			<button
				v-ripple
				class="button button-primary"
				type="button"
				@click="submitPassword"
			>
				{{ hasPassword ? "Update" : "Save" }}
			</button>
			<button
				v-if="hasPassword"
				v-ripple
				class="button"
				type="button"
				@click="removePassword"
			>
				Remove Password from Account
			</button>
		</div>
	</form>
</template>

<script>
import Input from "@/components/picker/input";
import { firebase, FAuth } from "@/helpers/firebase";

export default {
	components: {
		SLInput: Input,
	},
	data() {
		return {
			initialUser: null,
			password: "",
		};
	},

	computed: {
		user() {
			return this.$store.getters["auth/get"];
		},
		hasPassword() {
			return this.currentAuthProviders.includes("password");
		},
		currentAuthProviders() {
			return this.initialUser.providerData.map((a) => a.providerId);
		},
		currentSSOProvider() {
			for (const providerID of this.currentAuthProviders) {
				if (providerID === "google.com") {
					return firebase.auth.GoogleAuthProvider;
				}
				if (providerID === "github.com") {
					return firebase.auth.GithubAuthProvider;
				}
			}
			return null;
		},
	},
	created() {
		this.initialUser = this.$store.getters["auth/get"];
	},
	methods: {
		async reauthenticateCurrentUser() {
			const currentProvider = this.currentSSOProvider;
			if (currentProvider === null) {
				throw new Error("account currently has no SSO provider");
			}
			const currentEMail = this.user.email;
			let credential;
			do {
				const result = await FAuth.signInWithPopup(new currentProvider());
				credential = result.credential;
				if (currentEMail !== this.user.email) {
					// TODO [$608a607429b9aa0008265c45]: handle authentication with other account more nicely
					//
					// Currently the app data changes in the background to the new account which isn't
					// wanted. Actually we just want some new credentials to be able to reauthenticate.
					// It shouldn't be possible to switch accounts here.
					alert("You have signed in with another account. Please try again.");
				}
			} while (currentEMail !== this.user.email);
			await FAuth.currentUser.reauthenticateWithCredential(credential);
		},
		async submitPassword() {
			try {
				if (this.password.length < 20) {
					throw new Error("Password must have at least 20 Characters");
				}
				// TODO [$608a607429b9aa0008265c46]: use in-app dialog instead of unstyled browser confirm
				confirm(
					"This is a sensitive operation. You will be asked to reauthenticate before you can continue."
				);
				await this.reauthenticateCurrentUser();
				if (this.hasPassword) {
					await this.updatePassword();
					this.toast("Password updated", "check");
				} else {
					await this.createPassword();
					this.toast("Password saved", "check");
				}
			} catch (error) {
				this.toastError(error);
			} finally {
				this.password = "";
			}
		},
		async createPassword() {
			const passwordCredentials = firebase.auth.EmailAuthProvider.credential(
				this.user.email,
				this.password
			);
			await FAuth.currentUser.linkWithCredential(passwordCredentials);
		},
		async updatePassword() {
			// TODO implement password update without account unlink
			await this.removePassword();
			await this.createPassword();
		},
		async removePassword() {
			await FAuth.currentUser.unlink("password");
		},
	},
};
</script>
<style lang="scss" scoped>
.password-actions {
	display: flex;
	justify-content: space-between;
}
</style>
