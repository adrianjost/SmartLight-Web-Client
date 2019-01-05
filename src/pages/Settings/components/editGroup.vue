<template>
  <div>
    <label for="group-name">Name:</label>
    <input id="group-name" class="input" type="text" placeholder="name" v-model="value.name">

    <lampPicker
      :lamps="lamps"
      v-model="value.lamps"
    />

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

</style>