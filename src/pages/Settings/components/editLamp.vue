<template>
  <form>
    <h2>Edit Lamp "{{value.name}}"</h2>

    <SLInput label="Name" type="text" placeholder="Kitchen" v-model="value.name" />

    <SLInput label="Hostname" type="text" placeholder="smartlight-kitchen" v-model="value.hostname" />

    <SLInput label="IP" type="url" placeholder="192.168.2.123" v-model="value.ip" />

    <SLInput label="Tags" type="url" placeholder="Mixer, Oven, ..." v-model="value.tags" hint="seperated by <code>,</code>"/>

    <p>TODO: icon-picker</p>
  </form>
</template>

<script>

import Input from "@/components/picker/input"

export default {
  components: {
    SLInput: Input
  },
  props: ["value"],
}
</script>

<style scoped>
form {
	max-width: 300px;
	margin: 0 auto;
}
</style>