<template>
	<div class="hub">
		<!-- <h1>IoT-Hub is active :)</h1>
		<i class="material-icons md-64">device_hub</i>
		<p>
			As long as you have this page open, the website acts as an hub for
			external communication.
		</p>
		<p>
			So you can control your lights from anywhere on earth using the API, as
			long as one device in your local network has this app opened.
		</p>
		<p>
			This is also required to setup Google Assistant and IFTTT.
			<br />
			You can read more,
			<a href="https://docs.smart-light.ga/integrations" target="_blank">
				how to setup integrations here.
			</a>
		</p> -->

		<h2>Credentials</h2>
		<AccountSettings />
		<h3>
			User-Id
			<small class="no-wrap">(without spaces)</small>
		</h3>
		<p class="formatted uid">
			<span
				v-for="(uidSection, index) in groupString(user.uid || '', 4)"
				:key="index"
			>
				{{ uidSection }}
			</span>
		</p>
		<button
			v-ripple
			class="button button-primary"
			type="button"
			@click="copyToClipboard(user.uid, 'userid')"
		>
			Copy
		</button>
		<h3>
			API-Token
			<small class="no-wrap">(without spaces)</small>
		</h3>
		<template v-if="api_token">
			<p class="formatted">
				<span v-for="(token, index) in api_token" :key="index">
					{{ token }}
				</span>
			</p>

			<button
				v-ripple
				class="button button-primary"
				type="button"
				@click="copyToClipboard(api_token.join(''), 'token')"
			>
				Copy
			</button>
			<button v-ripple class="button" type="button" @click="updateToken">
				Update
			</button>
			<button v-ripple class="button" type="button" @click="deleteToken">
				Delete
			</button>
			<p>
				<small>
					* deleting or updating the token will invalidate the old one and you
					have to reconfigure all API integrations.
				</small>
			</p>
		</template>
		<template v-else>
			<button
				v-ripple
				class="button button-primary"
				type="button"
				@click="updateToken"
			>
				Create API Token
			</button>
		</template>
	</div>
</template>

<script>
import hub from "@/mixins/hub.js";
import { UIStateNestedDefault } from "@/helpers/ui-states.js";
import * as clipboard from "clipboard-polyfill/text";
const AccountSettings = () =>
	import(
		/* webpackChunkName: "accountSettings" */ "./components/accountSettings"
	);

export default {
	components: { AccountSettings },
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
		copyToClipboard(text, name) {
			clipboard
				.writeText(text)
				.then(() => {
					this.toast(`Copied ${name} to clipboard.`, "check");
				})
				.catch(() => {
					this.toastError(`Failed copying ${name} to clipboard.`);
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

<style lang="scss" scoped>
.hub {
	margin: 2em 0;
}

.material-icons.md-64 {
	font-size: 64px;
}

h3 {
	margin-top: 2em;
}

.formatted {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(7ch, 1fr));
	grid-gap: 0.25em;
	max-height: 7rem;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.uid {
	max-width: 55ch;
	max-height: initial;
	overflow-y: initial;
}
</style>
