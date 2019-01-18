<template>
  <div>
    <h2>Lamps:</h2>
    <control-unit-list
      :control-units="lamps"
      add-url="/settings/add/lamp"
    />
    <h2>Groups:</h2>
    <control-unit-list
      :control-units="groups"
      add-url="/settings/add/group"
    />
    <h2>
      Your API-Token <small class="no-wrap">
        (without spaces)
      </small>
    </h2>

    <!-- REFACTOR: remove v-html -->
    <!-- eslint-disable vue/no-v-html -->
    <p
      class="token"
      v-html="api_token"
    />
    <!-- eslint-enable -->
    <button
      v-ripple
      class="button button-primary"
      type="button"
      @click="copyToken"
    >
      Copy
    </button>
    <button
      v-ripple
      class="button"
      type="button"
      @click="updateToken"
    >
      Update
    </button>
    <button
      v-ripple
      class="button"
      type="button"
      @click="deleteToken"
    >
      Delete
    </button>
  </div>
</template>

<script>
import controlUnitList from '@/components/controlUnitList.vue';
import { UIStateDefault } from '@/helpers/ui-states.js';
import unitBackground from '@/mixins/unitBackground.js';

export default {
	components: {
		controlUnitList
	},
	mixins: [unitBackground],
	computed: {
		user () {
			return this.$store.getters["auth/get"];
		},
		lamps() {
			return this.$store.getters["units/list-lamps"].map(lamp => this.addBackground(lamp));
		},
		groups() {
			return this.$store.getters["units/list-groups"].map(group => this.addBackground(group));
		},
		api_token() {
			return this.groupString(this.$store.getters["user/api_token"] || "", 4);
		}
	},
	created(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateDefault.appBarTop({user: this.user, title:"Settings"})
		});
		this.$store.commit("ui/set", {
			component: "bottomNav",
			payload: UIStateDefault.bottomNav(1)
		});
	},
	methods: {
		generate_token(length){
			//edit the token allowed characters
			var a = "abcdefghmnpqrstuvwxyzABCDEFGHLMNPQRSTUVWXYZ23456789".split("");
			var b = "";
			for (var i=0; i<length; i++) {
				var j = (Math.random() * (a.length-1)).toFixed(0);
				b += a[j];
			}
			return b;
		},
		groupString(string, groupLength){
			return string.split("").map((char, index) => {
				if(index % groupLength === 0){
					char = "<span>" + char;
				}
				if(index % groupLength === groupLength - 1){
					char += "</span> "
				}
				return char;
			}).join("");
		},
		copyToken(){
			navigator.clipboard.writeText(this.api_token)
				.then(() => {
					this.toast("Copied token to clipboard.", "check");
				})
				.catch(() => {
					this.toastError("Failed coping token to clipboard.");
				});
		},
		updateToken(){
			this.$store.dispatch("user/set", {api_token: this.generate_token(512)})
		},
		deleteToken(){
			this.$store.dispatch("user/delete", "api_token")
		}
	}
};
</script>
<style lang="scss" scoped>
.no-wrap{
	word-wrap: none;
	white-space: nowrap;
}
.token{
	color: var(--color-text-inactive);
	max-height: 13ch;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	margin: .25em 0;
}
</style>
<style lang="scss">
.token span{
	flex: 1;
	display: inline-block;
	margin: .25em .5em;
}
</style>