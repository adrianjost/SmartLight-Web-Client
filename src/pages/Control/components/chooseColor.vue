<template>
  <section>
      <saved-state-picker
        :data="colors"
        event="loadColor"
        @loadColor="loadColor"
        addEvent="addColor"
        @addColor="saveState"
        contextEvent="deleteState"
        @deleteState="deleteState"
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

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js"
import localAPI from "@/mixins/localAPI.js"

export default {
  name: "choose-color",
  components: {
    savedStatePicker,
    colorPicker,
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
    this.$on('apply', this.apply);
    if((this.lamp.state || {}).color){
      this.currentColor = this.lamp.state.color;
    }
  },
  beforeDestroy(){
    this.$eventHub.$off('apply', this.apply);
    this.closeConnection(this.lamp);
  },
  methods: {
    loadColor(id){
      this.currentColor = this.colors.find((state) => {
        return state.id === id;
      }).color;
    },
    saveState(){
      // prevent saving the last color again
      if((this.colors[this.colors.length - 1]||{}).color === this.currentColor){
        return this.error("Color is already saved.");
      }

      this.$store.commit("savedStates/add", {
        data: {
          type: "color",
          color: this.currentColor
        }
      });
    },
    apply(){
      console.log("apply Color", this.currentColor);
      this.sendHexColor(this.lamp, this.currentColor);
      this.$store.commit("lamps/setState", {
        id: this.lamp.id,
        data: {
          color: this.currentColor
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
    colors() {
      return this.$store.getters["savedStates/list-colors"];
    },
    states() {
      return this.$store.getters["savedStates/list"];
    },
  }
}
</script>
