<template>
  <section>
      <saved-state-picker
        :data="gradients"
        event="loadGradient"
        @loadGradient="loadGradient"
        addEvent="addGradient"
        @addGradient="saveState"
        contextEvent="deleteState"
        @deleteState="deleteState"
      />
      <multi-slider
        :color="currentColor"
      />
      <color-picker
        class="color-picker"
        v-model="currentColor"
        :config="{
          width: 250,
          height: 300,
          sliderMargin: 16,
          markerRadius: 10
        }"
      />
  </section>
</template>

<script>
import savedStatePicker from "@/components/picker/savedStatePicker"
import colorPicker from "@/components/picker/colorPicker"
import multiSlider from "@/components/picker/multiSlider"

import { EventBus } from '@/helpers/event-bus.js';

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js"
import localAPI from "@/mixins/localAPI.js"

export default {
  name: "choose-gradient",
  components: {
    savedStatePicker,
    colorPicker,
    multiSlider
  },
  mixins: [undoableStateDelete("colors"), localAPI],
  props: ["lamp"],
  data(){
    return {
      currentColor: "#ffffff",
    }
  },
  created(){
    this.$eventHub.$on('apply', this.apply);
    /*if((this.lamp.state || {}).gradient){
      this.currentColor = this.lamp.state.gradient.colors[0];
    }*/
  },
  beforeDestroy(){
    this.$eventHub.$off('apply');
    this.closeConnection(this.lamp);
  },
  methods: {
    loadGradient(id){
      /* // TODO
      this.currentColor = this.gradients.find((state) => {
        return state.id === id;
      });
      */
    },
    saveState(){
      // TODO prevent saving the last gradient again
      //if((this.colors[this.colors.length - 1]||{}).color === this.currentColor){ return }

      this.$store.commit("savedStates/add", {
        data: {
          type: "gradient",
          // TODO add data
        }
      })
    },
    apply(){
      this.$store.commit("lamps/setState", {
        id: this.lamp.id,
        data: {
          gradient: this.currentColor
        }
      });
    }
  },
  watch: {
    currentColor: function(to){
      this.sendHexColor(this.lamp, to);
    },
  },
  computed: {
    gradients() {
      return this.$store.getters["savedStates/list-gradients"];
    },
    states() {
      return this.$store.getters["savedStates/list"];
    },
  }
}
</script>
