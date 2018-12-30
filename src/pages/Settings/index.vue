<template>
  <h1>/settings</h1>
</template>

<script>
import { UIStateLoggedIn } from '@/helpers/ui-states.js';

  export default {
    created(){
      this.$store.commit("ui/set", {
        component: "appBarTop",
        payload: UIStateLoggedIn.appBarTop(this.user)
      });
      this.$store.commit("ui/set", {
        component: "bottomNav",
        payload: UIStateLoggedIn.bottomNav(1)
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