<template>
	<section>
		<SavedStatePicker
			v-if="!noSave"
			:data="colors"
			event="loadColor"
			add-event="addColor"
			context-event="deleteState"
			@loadColor="loadColor"
			@addColor="saveState"
			@deleteState="deleteState"
		/>
		<slot name="colorPicker" :setColor="setColor" :color="currentColor">
			<ColorPicker
				v-model="currentColor"
				class="color-picker"
				:config="{
					width: 250,
					height: 300,
					sliderMargin: 16,
					markerRadius: 10,
					color: (unit.state || {}).color,
				}"
			/>
		</slot>
	</section>
</template>

<script>
import SavedStatePicker from "@/components/picker/savedStatePicker";
import ColorPicker from "@/components/picker/colorPicker";

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js";

export default {
	name: "ChooseColor",
	components: {
		SavedStatePicker,
		ColorPicker,
	},
	mixins: [undoableStateDelete("colors")],
	props: {
		unit: {
			type: Object,
			required: true,
		},
		noSave: {
			type: Boolean,
		},
	},
	data() {
		return {
			currentColor: "#ffffff",
			setColor: (color) => {
				this.currentColor = color;
			},
		};
	},
	computed: {
		colors() {
			return this.$store.getters["savedStates/list-colors"];
		},
	},
	watch: {
		currentColor: function(to) {
			this.$store.dispatch("localAPI/sendHexColor", {
				unit: this.unit,
				color: to,
			});
		},
	},
	created() {
		this.$eventHub.$on("apply-color", this.apply);
		if ((this.unit.state || {}).color) {
			this.currentColor = this.unit.state.color;
		}
	},
	beforeDestroy() {
		this.$eventHub.$off("apply-color", this.apply);
	},
	methods: {
		loadColor(id) {
			this.currentColor = this.colors.find((state) => {
				return state.id === id;
			}).color;
		},
		saveState() {
			// prevent saving the last color again
			if (
				this.colors.find(
					(color) =>
						JSON.stringify(color.color) === JSON.stringify(this.currentColor)
				)
			) {
				return this.toastError("Color is already saved.");
			}

			this.$store.dispatch("savedStates/insert", {
				type: "color",
				color: this.currentColor,
			});
		},
		apply() {
			this.$store.dispatch("units/setState", {
				id: this.unit.id,
				data: {
					color: this.currentColor,
				},
			});
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>
