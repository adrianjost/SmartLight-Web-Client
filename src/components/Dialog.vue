<template>
  <div id=".dialog-container">TEST</div>
</template>

<script>
  import dialog from "a11y-dialog"

  export default {
    name: "iro-color-picker",
    props: ['value', 'config'],
    mounted(){
      // Get the dialog element (with the accessor method you want)
      const el = document.getElementById('dialog-container');

      // Instantiate a new A11yDialog module
      let dialog = new dialog.A11yDialog(el);
      dialog.show();
    },
    methods: {
    }
  }
</script>

<style scoped>
  .dialog[aria-hidden='true'] {
    display: none;
  }
</style>
