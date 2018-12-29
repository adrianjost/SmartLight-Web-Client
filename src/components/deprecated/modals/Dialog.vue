<template>
  <portal to="dialog-container" v-if="active">
    <div class="dialog-container" :aria-hidden="!active" @mousedown.self="close" @keyup.esc="close">
      <div class="dialog">
        <!-- Content from the parent gets rendered here. -->
        <slot/>
      </div>
    </div>
  </portal>
</template>

<script>
  export default {
    name: "a11y-dialog",
    props: ['active'],
    methods: {
      open(){
        this.$emit("update:active", true);
      },
      close(){
        this.$emit("update:active", false);
      }
    }
  }
</script>

<style scoped>
  .dialog-container{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999999;
    background-color: rgba(0,0,0,.5);
  }
  .dialog-container[aria-hidden='true']{
    display: none;
  }
  .dialog{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 4px;
    overflow: auto;
    background-color: #fff;
    box-shadow: 5px 5px 10px rgba(0,0,0,.5);
  }
</style>
