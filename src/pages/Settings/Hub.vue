<template>
	<div class="hub">
		<h1>IoT-Hub is always active :)</h1>
		<i class="material-icons md-64">device_hub</i>
		<p>
			As long as you have any page of this app open, the website acts as an hub
			for external communication.
		</p>
		<p>
			So you can control your lights from anywhere on earth, as long as one
			device in your local network has this app opened.
		</p>
		<p>
			This is also required to be able to use Google Assistant & IFTTT.
			<a
				href="https://adrian-jost.gitbook.io/smartlight/setup/enable-google-home"
				target="_blank"
				>Read more, how to setup Google Assistant & IFTTT</a
			>
		</p>

		<h2>
			Your API-Token
			<small class="no-wrap">(without spaces)</small>
		</h2>

		<p class="token">
			<span v-for="(token, index) in api_token" :key="index" class="block">{{
				token
			}}</span>
		</p>

		<button
			v-ripple
			class="button button-primary"
			type="button"
			@click="copyToken"
			>Copy</button
		>
		<button v-ripple class="button" type="button" @click="updateToken"
			>Update</button
		>
		<button v-ripple class="button" type="button" @click="deleteToken"
			>Delete</button
		>
	</div>
</template>

<script>
import hub from "@/mixins/hub.js";
import { UIStateNestedDefault } from "@/helpers/ui-states.js";

export default {
	mixins: [hub],
	computed: {
		user() {
			return this.$store.getters["auth/get"];
		},
		lamps() {
			return this.$store.getters["units/list-lamps"].map((lamp) =>
				this.addBackground(lamp)
			);
		},
		groups() {
			return this.$store.getters["units/list-groups"].map((group) =>
				this.addBackground(group)
			);
		},
		api_token() {
			return this.groupString(this.$store.getters["user/api_token"] || "", 4);
		},
	},
	mounted() {
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateNestedDefault.appBarTop("IoT-Hub"),
		});
	},
	methods: {
		generate_token(length) {
			//edit the token allowed characters
			var a = "abcdefghmnpqrstuvwxyzABCDEFGHLMNPQRSTUVWXYZ23456789".split("");
			var b = "";
			for (var i = 0; i < length; i++) {
				var j = (Math.random() * (a.length - 1)).toFixed(0);
				b += a[j];
			}
			return b;
		},
		groupString(string, groupLength) {
			return string.match(/.{1,4}/g);
		},
		copyToken() {
			navigator.clipboard
				.writeText(this.api_token)
				.then(() => {
					this.toast("Copied token to clipboard.", "check");
				})
				.catch(() => {
					this.toastError("Failed coping token to clipboard.");
				});
		},
		updateToken() {
			this.$store.dispatch("user/set", { api_token: this.generate_token(512) });
		},
		deleteToken() {
			this.$store.dispatch("user/delete", "api_token");
		},
	},
};
</script>

<style scoped>
.hub {
	margin: 2em 0;
	text-align: center;
}
.material-icons.md-64 {
	font-size: 64px;
}
</style>
<style lang="scss" scoped>
.token {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	max-height: 13ch;
	margin: 0.25em 0;
	overflow-y: auto;
	color: var(--color-text-inactive);
	-webkit-overflow-scrolling: touch;
	.block {
		display: inline-block;
		flex: 1;
		margin: 0.25em 0.5em;
	}
}
</style>
