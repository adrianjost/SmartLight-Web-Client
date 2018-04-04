<template>
  <div class="iro-container"></div>
</template>

<script>
import iro from "@jaames/iro"

export default {
  name: "iro-color-picker",
  props: ['value', 'config'],
  mounted(){
    let config = this.config;
    config.color = this.value || "#fff";
    const colorPicker = new iro.ColorPicker(".iro-container", config);
    colorPicker.on("color:change", this.emitColor)
  },
  methods: {
    emitColor(color){
      this.$emit('input', color.hexString);
    }
  }
}
</script>

<style scoped>

</style>
