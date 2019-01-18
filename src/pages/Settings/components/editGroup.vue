<template>
	<form>
		<h2>Edit Group "{{ value.name }}"</h2>

		<SLInput
			v-model="value.name"
			label="Name"
			type="text"
			placeholder="Kitchen"
		/>

		<SLInput
			v-model="value.tags"
			label="Tags"
			type="url"
			placeholder="Mixer, Oven, ..."
			hint="seperated by <code>,</code>"
		/>

		<lampPicker
			v-model="value.lamps"
			:lamps="lamps"
		/>

		<icon-picker v-model="value.icon" />
	</form>
</template>

<script>
import Input from "@/components/picker/input"
import iconPicker from "@/components/picker/iconPicker"
import lampPicker from "@/components/picker/lampPicker.vue"

export default {
	components: {
		SLInput: Input,
		lampPicker,
		iconPicker
	},
	props: {
		value: {
			type: Object,
			required: true
		},
	},
	computed: {
		lamps() {
			return this.$store.getters["units/list-lamps"];
		}
	}
}
</script>