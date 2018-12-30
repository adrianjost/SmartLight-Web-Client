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
    <main class="container">
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

import { EventBus } from '@/helpers/event-bus.js';


export default {
  name: 'app',
  components: {
    AppBarTop,
    BottomNavigation
  },
  methods: {
    handleAction(event){
      EventBus.$emit(event);
    }
  },
  created() {
    EventBus.$on('logout', () => {
      this.$store.dispatch("user/logout");
    });
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
main {
  padding-top: 56px;
}
</style>
