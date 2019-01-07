<template>
  <section>
      <saved-state-picker
        :data="gradients"
        event="loadGradient"
        @loadGradient="loadGradient"
        addEvent="addGradient"
        @addGradient="saveGradient"
        contextEvent="deleteState"
        @deleteState="deleteState"
      />

      <div class="inputs">
        <input id="gradient-name" class="input" type="text" v-model="name" placeholder="gradient-name">
        <div class="input inputs duration">
          <input id="minutes" class="input" type="number" v-model="minutes" placeholder="5"><label for="minutes">min</label>
          <input id="seconds" class="input" type="number" v-model="seconds" placeholder="0"><label for="seconds">s</label>
        </div>
      </div>

      <multi-slider
        :color.sync="currentColor"
        :gradient.sync="relativeGradient"
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

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js"
import localAPI from "@/mixins/localAPI.js"

export default {
  name: "choose-gradient",
  components: {
    savedStatePicker,
    colorPicker,
    multiSlider
  },
  mixins: [undoableStateDelete("gradients"), localAPI],
  props: ["unit"],
  data(){
    return {
      currentColor: "#ffffff",
      relativeGradient: undefined,
      name: "",
      minutes: undefined,
      seconds: undefined
    }
  },
  created(){
    this.$eventHub.$on('apply', this.apply);
    this.loadGradient((this.unit.state || {}).gradient);
  },
  beforeDestroy(){
    this.$eventHub.$off('apply', this.apply);
    this.closeConnection(this.unit);
  },
  methods: {
    loadGradient(id){
      let gradient;
      if(typeof id == "object"){
        gradient = id;
      }else{
        gradient = this.gradients.find(state => state.id === id);
      }
      if(!gradient){ return; }

      this.name = gradient.name;
      const duration = gradient.transitionTimes[gradient.transitionTimes.length - 1] / 1000; // / 100 to convert into seconds
      this.minutes = Math.floor(duration / 60);
      this.seconds = duration - (this.minutes * 60);
      this.relativeGradient = gradient.colors.map((color, index) => {
        return {
          position: Math.round(gradient.transitionTimes[index] / this.duration / 10), // / 10 to convert into %
          color: color
        }
      });
    },
    saveGradient(){
      if(!this.name || !this.duration){
        return this.error(`You need to specify a ${this.name?"duration":"name"}!`);
      }
      if(this.gradients.some(gradient => gradient.name == this.name)){
        return this.error("Gradient names must be unqiue.");
      }
      this.$store.commit("savedStates/add", {
        data: this.currentGradient
      });
    },
    apply(){
      this.sendGradient(this.unit, this.currentGradient);
      this.$store.commit("units/setState", {
        id: this.unit.id,
        data: {
          gradient: this.currentGradient
        }
      });
    }
  },
  watch: {
    currentColor: function(to){
      this.sendHexColor(this.unit, to);
    },
  },
  computed: {
    gradients() {
      return this.$store.getters["savedStates/list-gradients"];
    },
    states() {
      return this.$store.getters["savedStates/list"];
    },
    currentGradient(){
      if(!this.relativeGradient){ return; }
      return {
        type: "gradient",
        name: this.name || "",
        colors: this.relativeGradient.map(marker => marker.color) || [],
        transitionTimes: this.relativeGradient.map(marker => Math.round(marker.position * this.duration * 10)) || [], // * 10 to convert to ms
        loop: true,
      }
    },
    duration(){
      return parseInt(((this.minutes || 0) * 60) + (this.seconds || 0), 10);
    }
  }
}
</script>
<style lang="scss" scoped>
.inputs{
  display: flex;
  align-items: center;
  max-width: 300px;
  margin: 0 auto;
  padding: 0 2px;
  .input{
    margin: 0 2px;
  }
}
.duration input{
  text-align: right;
}
</style>
