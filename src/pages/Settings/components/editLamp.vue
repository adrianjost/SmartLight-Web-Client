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

		<SLSelect
			v-model="value.lamptype"
			label="LED Type"
			placeholder="NeoPixel"
			:options="availableLampTypes"
		/>

		<SLSelect
			v-model="value.channelMap"
			label="Channel Mapping"
			placeholder="RGB"
			:options="availableChannelMappings"
		/>

		<fieldset v-if="value.lamptype === 'WWCW'" class="color-temp-input-group">
			<legend>Color Temperature</legend>
			<div class="color-temp-input">
				<SLInput
					v-model.number="value.tempMin"
					label="Min (in Kelvin)"
					type="number"
					placeholder="2700"
				/>

				<SLInput
					v-model.number="value.tempMax"
					label="Max (in Kelvin)"
					type="number"
					placeholder="6000"
				/>
			</div>
		</fieldset>

		<SLInput
			v-model="tagString"
			label="Tags"
			type="text"
			placeholder="Mixer, Oven, ..."
		>
			<template slot="hint">
				seperated by
				<code>,</code>
			</template>
		</SLInput>

		<IconPicker v-model="value.icon" />
	</form>
</template>

<script>
import Input from "@/components/picker/input";
import Select from "@/components/picker/select";
import IconPicker from "@/components/picker/iconPicker";
import { lamptTypes } from "@/helpers/types";

export default {
	components: {
		SLInput: Input,
		SLSelect: Select,
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
		availableChannelMappings() {
			const RGBMappings = [
				{ label: "RGB", value: { r: 1, g: 2, b: 3 } },
				{ label: "RBG", value: { r: 1, g: 3, b: 2 } },
				{ label: "BRG", value: { r: 2, g: 3, b: 1 } },
				{ label: "GRB", value: { r: 2, g: 1, b: 3 } },
				{ label: "GBR", value: { r: 3, g: 1, b: 2 } },
				{ label: "BGR", value: { r: 3, g: 2, b: 1 } },
			];
			const WWCWMappings = [
				{ label: "WW CW //", value: { r: 1, g: 3, b: 2 } },
				{ label: "WW // CW", value: { r: 1, g: 2, b: 3 } },
				{ label: "// WW CW", value: { r: 2, g: 1, b: 3 } },
				{ label: "CW WW //", value: { r: 2, g: 3, b: 1 } },
				{ label: "CW // WW", value: { r: 3, g: 2, b: 1 } },
				{ label: "// CW WW", value: { r: 3, g: 1, b: 2 } },
			];
			const Switch = [
				{
					label: "For Switches you don't need to set this option",
					value: { r: 1, g: 2, b: 3 },
					disabled: true,
				},
			];
			const lampTypes = {
				RGB: RGBMappings,
				WWCW: WWCWMappings,
				Switch: Switch,
			};
			return (
				lampTypes[this.value.lamptype] || [
					{
						label: "Please Select the Type first",
						disabled: true,
					},
				]
			);
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

<style lang="scss" scoped>
.color-temp-input-group {
	padding: 0;
	margin: 0;
	border: 0;
	.color-temp-input {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1em;
	}
}
</style>
