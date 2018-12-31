<template>
  <div class="color-picker" :id="'iro-'+id"></div>
</template>

<script>
import iro from "@jaames/iro"

var colorPicker;
export default {
  name: "iro-color-picker",
  props: ['value', 'config'],
  data () {
    return {
      id: this._uid,
    }
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
      if(!this.config || this.config === {}){return}
      let config = this.config;

      if(!this.value || this.value.length > 7){ config.color = "#ffffff"}
      else if(this.value.length === 6){ config.color = '#'+this.value}
      else{config.color = this.value;}

      colorPicker = new iro.ColorPicker('#iro-'+this.id, config);
      colorPicker.on("color:change", this.emitColor)
    },
    updateConfig(){
      // TODO - watch for config changes and apply them
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
      this.updateConfig()
    }
  }
}
</script>

<style scoped>
.color-picker{
  display: inline-block;
}
</style>
