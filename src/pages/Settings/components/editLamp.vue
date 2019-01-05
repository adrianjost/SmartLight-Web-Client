<template>
  <div>
    <label for="group-name">Name:</label>
    <input id="group-name" class="input" type="text" placeholder="name" v-model="value.name"><br />

    <label for="group-name">Hostname:</label>
    <input id="group-name" class="input" type="text" placeholder="name" v-model="value.hostname"><br />

    <label for="group-name">IP:</label>
    <input id="group-name" class="input" type="text" placeholder="name" v-model="value.ip"><br />


    <p>TODO: icon-picker</p>
  </div>
</template>

<script>
import lampPicker from "@/components/picker/lampPicker.vue"
export default {
  components: {
    lampPicker
  },
  props: ["value"],
  computed: {
    lamps() {
      return this.$store.getters["units/list-lamps"];
    }
  }
}
</script>

<style scoped>
input:before{
  content: "\a"
}
</style>