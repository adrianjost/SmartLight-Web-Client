<template>
	<section>
		<SavedStatePicker
			:data="gradients"
			event="loadGradient"
			add-event="addGradient"
			context-event="deleteState"
			@loadGradient="loadGradient"
			@addGradient="saveGradient"
			@deleteState="deleteState"
		/>

		<div class="inputs">
			<input
				id="gradient-name"
				v-model="name"
				class="input"
				type="text"
				placeholder="gradient-name"
			/>
			<div class="input inputs duration">
				<input
					id="minutes"
					v-model="minutes"
					class="input"
					type="number"
					placeholder="5"
				/><label for="minutes">
					min
				</label>
				<input
					id="seconds"
					v-model="seconds"
					class="input"
					type="number"
					placeholder="0"
				/><label for="seconds">
					s
				</label>
			</div>
			<ToggleButton
				v-model="loop"
				:labels="{ checked: 'loop', unchecked: 'loop' }"
			/>
		</div>

		<MultiSlider :color.sync="currentColor" :gradient.sync="relativeGradient" />
		<ColorPicker
			v-model="currentColor"
			class="color-picker"
			:config="{
				width: 250,
				height: 300,
				sliderMargin: 16,
				markerRadius: 10,
			}"
		/>
	</section>
</template>

<script>
import SavedStatePicker from "@/components/picker/savedStatePicker";
import ColorPicker from "@/components/picker/colorPicker";
import MultiSlider from "@/components/picker/multiSlider";
import ToggleButton from "vue-js-toggle-button/src/Button.vue";

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js";
import localAPI from "@/mixins/localAPI.js";

export default {
	name: "ChooseGradient",
	components: {
		SavedStatePicker,
		ColorPicker,
		MultiSlider,
		ToggleButton,
	},
	mixins: [undoableStateDelete("gradients"), localAPI],
	props: {
		unit: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			currentColor: "#ffffff",
			relativeGradient: undefined,
			name: "",
			minutes: undefined,
			seconds: undefined,
			loop: true,
		};
	},
	computed: {
		gradients() {
			return this.$store.getters["savedStates/list-gradients"];
		},
		states() {
			return this.$store.getters["savedStates/list"];
		},
		currentGradient() {
			if (!this.relativeGradient) {
				return;
			}
			return {
				type: "gradient",
				name: this.name || "",
				colors: this.relativeGradient.map((marker) => marker.color) || [],
				transitionTimes:
					this.relativeGradient.map((marker) =>
						Math.round(marker.position * this.duration * 10)
					) || [], // * 10 to convert % to ms
				loop: this.loop,
			};
		},
		duration() {
			return parseInt((this.minutes || 0) * 60 + (this.seconds || 0), 10);
		},
	},
	watch: {
		currentColor: function(to) {
			this.sendHexColor(this.unit, to);
		},
	},
	created() {
		this.$eventHub.$on("apply-gradient", this.apply);
		this.loadGradient((this.unit.state || {}).gradient);
	},
	beforeDestroy() {
		this.$eventHub.$off("apply-gradient", this.apply);
		this.closeConnection(this.unit);
	},
	methods: {
		loadGradient(id) {
			let gradient;
			if (typeof id == "object") {
				gradient = id;
			} else {
				gradient = this.gradients.find((state) => state.id === id);
			}
			if (!gradient) {
				return;
			}

			this.name = gradient.name;
			const duration =
				gradient.transitionTimes[gradient.transitionTimes.length - 1] / 1000; // / 100 to convert into seconds
			this.minutes = Math.floor(duration / 60);
			this.seconds = duration - this.minutes * 60;
			this.relativeGradient = gradient.colors.map((color, index) => {
				return {
					position: Math.round(
						gradient.transitionTimes[index] / this.duration / 10
					), // / 10 to convert into %
					color: color,
				};
			});
		},
		isGradientUnqiue(gradient) {
			if (!this.name) {
				this.toastError(`You need to specify a name!`);
				return false;
			}
			if (
				this.gradients.some(
					(someGradient) => someGradient.name == gradient.name
				)
			) {
				this.toastError("Gradient names must be unqiue.");
				return false;
			}
			return true;
		},
		isGradientValid() {
			if (!this.duration) {
				this.toastError(`You need to specify a duration!`);
				return false;
			}
			return true;
		},
		saveGradient() {
			if (!this.isGradientUnqiue(this.currentGradient)) {
				return;
			}
			if (!this.isGradientValid()) {
				return;
			}
			this.$store.dispatch("savedStates/insert", this.currentGradient);
		},
		apply() {
			if (!this.isGradientValid()) {
				return;
			}
			this.sendGradient(this.unit, this.currentGradient);
			this.$store.dispatch("units/setState", {
				id: this.unit.id,
				data: {
					gradient: this.currentGradient,
				},
			});
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>
<style lang="scss" scoped>
.inputs {
	display: flex;
	align-items: center;
	max-width: 300px;
	padding: 0 2px;
	margin: 0 auto;

	.input {
		flex: 1;
		margin: 0 2px;
	}
	input.input {
		border-bottom: 1px solid var(--color-border);
	}
}

.duration input {
	text-align: right;
}
</style>
