<template>
  <div class="control-units">
    <control-unit
      class="control-unit"
      v-for="unit in units"
      :key="unit.id"
      :data="unit"
    />
  </div>
</template>

<script>
import ControlUnit from '@/components/ControlUnit.vue'
import { UIStateDefault } from '@/helpers/ui-states.js';
import unitBackground from '@/mixins/unitBackground.js';

export default {
  components: {
    ControlUnit
  },
  mixins: [unitBackground],
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
    units() {
      return this.$store.getters["units/list"].map(unit => this.addBackground(unit));
    }
  }
};
</script>

<style lang="scss" scoped>
.control-units {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.control-unit {
  margin: 8px;
}
</style>