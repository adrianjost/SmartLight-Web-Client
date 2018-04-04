<template>
  <modal id="modal" name="color-picker">
    <iro v-model="color" :config="iroConfig"/>
    <button @click="hide" >CLOSE</button>
    <button @click="apply" >APPLY</button>
  </modal>
</template>

<script>
  import firebase from 'firebase'
  import iro from './iro.vue'

  export default {
    components: {
      iro
    },
    data(){
      return {
        id: undefined,
        color: "FA00AA",
        iroConfig: {
          width: 300,
          height: 350,
          sliderMargin: 16,
          markerRadius: 10
        }
      }
    },
    created() {
      this.$parent.$on('show-color-picker', this.show);
      this.$parent.$on('hide', this.hide);
    },
    methods: {
      apply () {
        this.emit();
        this.hide();
      },
      emit(){
        this.$emit("newColor", this.id, JSON.parse(JSON.stringify(this.color)));
      },
      show (id, color) {
        this.id = id;
        this.color = color || "#FFFFFFF";
        this.$modal.show('color-picker');
      },
      hide () {
        this.$modal.hide('color-picker');
      }
    },
    watch:{
      "color": function(){
        this.emit()
      }
    }
  };
</script>
<style lang="scss" scoped>
  .v--modal *{
    margin: 8px auto;
    display: block;
  }
</style>
