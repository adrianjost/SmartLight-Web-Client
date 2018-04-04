<template>
  <div class="dialog-container" :aria-hidden="hidden" @click.self="close">
    <div class="dialog">
      <!-- Content from the parent gets rendered here. -->
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "a11y-dialog",
    data(){
      return {
        hidden: true
      }
    },
    methods: {
      open(){
        this.hidden = false
      },
      close(){
        this.hidden = true
      },
      toggle(){
        this.hidden = !this.hidden
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
    z-index: 999;
    background-color: rgba(0,0,0,.5);
  }
  .dialog-container[aria-hidden='true'] {
    display: none;
  }
  .dialog{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    background-color: #f6f6f6;
    cursor: initial;
    box-shadow: 5px 5px 10px rgba(0,0,0,.5);
  }
</style>
