<template>
	<form>
		<h2>Edit Group "{{ modelValue.name }}"</h2>

		<SLInput
			v-model="modelValue.name"
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
			v-model="modelValue.lamptype"
			label="Color Picker Type"
			placeholder="RGB"
			:options="availableLampTypes"
		/>

		<b>Lamps:</b>
		<LampPicker v-model="modelValue.lamps" :lamps="lamps" />

		<IconPicker v-model="modelValue.icon" />
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
		modelValue: {
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
				return Array.isArray(this.modelValue.tags)
					? this.modelValue.tags.join(", ")
					: this.modelValue.tags;
			},
			set(to) {
				this.modelValue.tags = to
					.split(",")
					.map((item) => item.trim())
					.filter((item) => item);
			},
		},
	},
};
</script>
