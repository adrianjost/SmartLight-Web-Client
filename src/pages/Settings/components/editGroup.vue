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
			v-model="tagString"
			label="Tags"
			type="url"
			placeholder="Mixer, Oven, ..."
		>
			<template #hint>
				seperated by
				<code>,</code>
			</template>
		</SLInput>

		<SLSelect
			v-model="value.lamptype"
			label="Color Picker Type"
			placeholder="RGB"
			:options="availableLampTypes"
		/>

		<b>Lamps:</b>
		<LampPicker v-model="value.lamps" :lamps="lamps" />

		<IconPicker v-model="value.icon" />
	</form>
</template>

<script>
import Input from "@/components/picker/input";
import IconPicker from "@/components/picker/iconPicker";
import Select from "@/components/picker/select";
import LampPicker from "@/components/picker/lampPicker.vue";
import { lamptTypes } from "@/helpers/types";

export default {
	components: {
		SLInput: Input,
		SLSelect: Select,
		LampPicker,
		IconPicker,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			availableLampTypes: lamptTypes,
		};
	},
	computed: {
		lamps() {
			return this.$store.getters["units/list-lamps"];
		},
		tagString: {
			get() {
				return Array.isArray(this.value.tags)
					? this.value.tags.join(", ")
					: this.value.tags;
			},
			set(to) {
				this.value.tags = to
					.split(",")
					.map((item) => item.trim())
					.filter((item) => item);
			},
		},
	},
};
</script>
