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
			<template slot="hint">
				seperated by
				<code>,</code>
			</template>
		</SLInput>

		<b>Lamps:</b>
		<LampPicker v-model="value.lamps" :lamps="lamps" />

		<IconPicker v-model="value.icon" />
	</form>
</template>

<script>
import Input from "@/components/picker/input";
import IconPicker from "@/components/picker/iconPicker";
import LampPicker from "@/components/picker/lampPicker.vue";

export default {
	components: {
		SLInput: Input,
		LampPicker,
		IconPicker,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
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
