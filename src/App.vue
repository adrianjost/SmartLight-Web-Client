<template>
	<div id="app">
		<AppBarTop
			v-if="appBarTopState.visible"
			:back-action="appBarTopState.back_action"
			:title="appBarTopState.title"
			:actions="appBarTopState.actions"
			:user-avatar="appBarTopState.user_avatar"
			@action="handleAction"
		/>
		<main
			class="container"
			:style="{
				'padding-top': appBarTopState.visible ? '56px' : '0',
				'padding-bottom': bottomNavState.visible ? '100px' : '0',
			}"
		>
			<BrowserWarning />
			<RouterView v-if="isInitialized" />
		</main>
		<BottomNavigation
			v-if="bottomNavState.visible"
			:fab="bottomNavState.fab"
			:actions="bottomNavState.actions"
			@action="handleAction"
		/>
	</div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue";
import AppBarTop from "@/components/AppBarTop.vue";
import BrowserWarning from "@/components/BrowserWarning.vue";

export default {
	name: "App",
	components: {
		AppBarTop,
		BottomNavigation,
		BrowserWarning,
	},
	data() {
		return {
			showBottomNav: undefined,
			windowCircumference: 0,
		};
	},
	computed: {
		appBarTopState() {
			return this.$store.getters["ui/get"]("appBarTop");
		},
		bottomNavState() {
			return this.$store.getters["ui/get"]("bottomNav");
		},
		isInitialized() {
			return this.$store.getters["auth/isAuthenticated"] !== undefined;
		},
	},
	mounted() {
		// only use 80% of height for chrome HTTP warnings,
		// url bars and other stuff that may pop up on input fields
		this.windowCircumference = window.innerWidth + window.innerHeight * 0.8;
		window.addEventListener("orientationchange", () => {
			this.windowCircumference = window.innerWidth + window.innerHeight * 0.8;
		});
		window.addEventListener("mouseup", this.resize);
		window.addEventListener("touchend", this.resize);
		window.addEventListener("resize", this.resize);
	},
	created() {
		this.$eventHub.on("logout", async () => {
			await this.$store.dispatch("auth/logout");
			this.$router.go("/login");
		});
		this.$eventHub.on("go-back", this.goBack);
	},
	beforeDestroy() {
		this.$eventHub.off("logout");
		this.$eventHub.off("go-back", this.goBack);
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		handleAction(event) {
			this.$eventHub.emit(event);
		},
		resize(/* event */) {
			// hide BottomNav when onscreen keyboard opens (mobile devices)
			// only tested on android
			// TODO [#58]: fix this hack.
			if (
				document.activeElement.tagName == "INPUT" &&
				this.showBottomNav === undefined
			) {
				this.showBottomNav = this.bottomNavState.visible;
				this.$store.commit("ui/visible", {
					component: "bottomNav",
					visible: false,
				});
			} else if (
				this.showBottomNav !== undefined &&
				window.innerWidth + window.innerHeight >= this.windowCircumference
				// || document.activeElement.tagName !== "INPUT"
			) {
				this.$store.commit("ui/visible", {
					component: "bottomNav",
					visible: this.showBottomNav,
				});
				this.showBottomNav = undefined;
			}
		},
	},
};
</script>
<style lang="scss">
@import "./styles/base";

main.container {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 0 16px;
}
</style>
