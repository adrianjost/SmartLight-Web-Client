<template>
<div>
  <h2>Lamps:</h2>
  <control-unit-list
    :control-units="lamps"
  />
</div>
</template>

<script>
import controlUnitList from '@/components/controlUnitList.vue';
import { UIStateDefault } from '@/helpers/ui-states.js';

export default {
  components: {
    controlUnitList
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
  computed: {
    user () {
      return this.$store.getters["user/get"];
    },
    lamps() {
      return this.$store.getters["lamps/list"];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>