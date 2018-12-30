<template>
  <router-view></router-view>
</template>

<script>
import { UIStateDefault } from '@/helpers/ui-states.js';

  export default {
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
    computed: {
      user () {
        return this.$store.getters["user/get"];
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>