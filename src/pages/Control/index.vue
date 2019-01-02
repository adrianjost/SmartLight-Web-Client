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
  methods:{
    addBackground(lamp){
      if(!lamp.state){return lamp;}
      if(lamp.state.color){
        lamp.background = lamp.state.color;
      }
      if(lamp.state.gradient){
        lamp.background = "conic-gradient("
        const maxTime = lamp.state.gradient.transitionTimes[lamp.state.gradient.transitionTimes.length - 1];
        lamp.state.gradient.colors.forEach((color, index) => {
          lamp.background += `${color} ${lamp.state.gradient.transitionTimes[index] / maxTime * 100}%`;
          if(index < lamp.state.gradient.colors.length - 1){
            lamp.background += ", "
          }
        })
        lamp.background += `)`
        console.log(lamp.background);
        //lamp.background = lamp.state.gradient.colors[0];
      }
      return lamp;
    }
  },
  computed: {
    lamps() {
      return this.$store.getters["lamps/list"].map(lamp => this.addBackground(lamp));
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