<template>
  <form>
    <h2>Edit Group "{{value.name}}"</h2>

    <SLInput label="Name" type="text" placeholder="Kitchen" v-model="value.name" />

    <SLInput label="Tags" type="url" placeholder="Mixer, Oven, ..." v-model="value.tags" hint="seperated by <code>,</code>"/>

    <lampPicker
      :lamps="lamps"
      v-model="value.lamps"
    />

    <p>TODO: icon-picker</p>
  </form>
</template>

<script>
import Input from "@/components/picker/input"
import lampPicker from "@/components/picker/lampPicker.vue"

export default {
  components: {
    SLInput: Input,
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
form {
	max-width: 300px;
	margin: 0 auto;
}
</style>