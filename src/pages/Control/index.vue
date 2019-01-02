<template>
  <div class="control-units">
    <control-unit
      class="control-unit"
      v-for="lamp in lamps"
      :key="lamp.id"
      :data="lamp"
    />
  </div>
</template>

<script>
import ControlUnit from '@/components/ControlUnit.vue'
import { UIStateDefault } from '@/helpers/ui-states.js';

export default {
  components: {
    ControlUnit
  },
  created(){
    this.$store.commit("ui/set", {
      component: "appBarTop",
      payload: UIStateDefault.appBarTop({
        user: this.$store.getters["user/get"],
        title: "Control"
      })
    });
    this.$store.commit("ui/set", {
      component: "bottomNav",
      payload: UIStateDefault.bottomNav(0)
    });
  },
  computed: {
    lamps() {
      return this.$store.getters["lamps/list"];
    }
  }
};
</script>

<style lang="scss" scoped>
.control-units{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.control-unit{
  margin: 8px;
}
</style>