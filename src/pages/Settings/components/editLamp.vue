<template>
	<form>
		<h2>Edit Lamp "{{ value.name }}"</h2>

		<SLInput
			v-model="value.name"
			label="Name"
			type="text"
			placeholder="Kitchen"
		/>

		<SLInput
			v-model="value.hostname"
			label="Hostname"
			type="text"
			placeholder="smartlight-kitchen"
		/>

		<SLInput
			v-model="value.ip"
			label="IP"
			type="url"
			placeholder="192.168.2.123"
		/>

		<SLInput
			v-model="value.tags"
			label="Tags"
			type="url"
			placeholder="Mixer, Oven, ..."
		>
			<template slot="hint">
				seperated by <code>,</code>
			</template>
		</SLInput>

		<IconPicker v-model="value.icon" />
	</form>
</template>

<script>
import Input from "@/components/picker/input"
import IconPicker from "@/components/picker/iconPicker"

export default {
	components: {
		SLInput: Input,
		IconPicker
	},
	props: {
		value: {
			type: Object,
			required: true
		},
	},
}
</script>