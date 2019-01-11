<template>
  <div id="app">
    <app-bar-top
      v-if="appBarTopState.visible"
      :back_action="appBarTopState.back_action"
      :title="appBarTopState.title"
      :actions="appBarTopState.actions"
      :user_avatar="appBarTopState.user_avatar"
      @action="handleAction"
    />
    <main
      class="container"
      :style="{
        'padding-top': appBarTopState.visible?'56px':'0',
        'padding-bottom': bottomNavState.visible?'100px':'0'
      }"
    >
      <router-view ></router-view>
    </main>
    <bottom-navigation
      v-if="bottomNavState.visible"
      :fab="bottomNavState.fab"
      :actions="bottomNavState.actions"
      @action="handleAction"
    />
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation.vue'
import AppBarTop from '@/components/AppBarTop.vue'

export default {
  name: 'app',
  components: {
    AppBarTop,
    BottomNavigation
  },
  data(){
    return {
      showBottomNav: undefined,
      windowCircumference: 0
    }
  },
  mounted(){
    this.windowCircumference = window.innerWidth + window.innerHeight;
  },
  methods: {
    handleAction(event){
      this.$eventHub.$emit(event);
    },
    resize(event){
      // hide BottomNav when onscreen keyboard opens (mobile devices)
      // only tested on android
      // TODO: fix this hack.
      if(document.activeElement.tagName == "INPUT" && this.showBottomNav === undefined){
        this.showBottomNav = this.bottomNavState.visible;
        this.$store.commit("ui/visible", {
          component: "bottomNav",
          visible: false
        });
      }else if(this.showBottomNav !== undefined && (window.innerWidth + window.innerHeight) == this.windowCircumference){
        this.$store.commit("ui/visible", {
          component: "bottomNav",
          visible: this.showBottomNav
        });
        this.showBottomNav = undefined;
      }
    }
  },
  created() {
    this.$eventHub.$on('logout', () => {
      this.$store.dispatch("user/logout");
    });
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy(){
    this.$eventHub.$off("logout");
  },
  computed: {
    appBarTopState () {
      return this.$store.getters["ui/get"]("appBarTop");
    },
    bottomNavState () {
      return this.$store.getters["ui/get"]("bottomNav");
    }
  }
}
</script>
<style lang="scss">
@import "./styles/base";

main.container {
	padding: 0 16px;
}
</style>
