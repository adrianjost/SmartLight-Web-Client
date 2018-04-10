<template>
  <div class="iro-container"></div>
</template>

<script>
import iro from "@jaames/iro"

var colorPicker;
export default {
  name: "iro-color-picker",
  props: ['value', 'config'],
  mounted(){
    this.init()
  },
  methods: {
    init(){
      if(!this.config || this.config === {}){return}
      if(!this.value || this.value.length > 7){ this.value = "#ffffff"}
      let config = this.config;
      config.color = this.value;
      colorPicker = new iro.ColorPicker(".iro-container", config);
      colorPicker.on("color:change", this.emitColor)
    },
    emitColor(color){
      this.$emit('input', color.hexString);
    }
  },
  watch: {
    value: function(to){
      if(colorPicker && colorPicker.color && to.length <= 7){
        colorPicker.color.hexString = to;
      }
    },
    config: function(){
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
