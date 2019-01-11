<template>
  <div class="color-picker" :id="'iro-'+id"></div>
</template>

<script>
import iro from "@jaames/iro"

export default {
  name: "iro-color-picker",
  props: ['value', 'config'],
  data () {
    return {
      id: this._uid,
    }
  },
  colorPickerConfig: {},
  colorPicker: undefined,
  mounted(){
    this.init();
  },
  methods: {
    init(){
      if(!this.config || this.config === {}){return}
      this.$options.colorPickerConfig = this.config;
      this.$options.colorPicker = new iro.ColorPicker('#iro-'+this.id, this.$options.colorPickerConfig);
      this.$options.colorPicker.on("color:change", this.emitColor);
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
      if(!to || to.length !== 7){ return; }

      if((this.$options.colorPicker || {}).color){
        this.$options.colorPicker.color.hexString = to;
      }else{
        this.$options.colorPickerConfig.color = to;
      }
    },
    config: function(){
      this.updateConfig()
    }
  }
}
</script>

<style scoped>
.color-picker {
	display: inline-block;
}
</style>
