<template>
	<section>
		<SavedStatePicker
			v-if="!noSave"
			:data="savedWhites"
			event="loadColor"
			add-event="addColor"
			context-event="deleteState"
			@loadColor="loadColor"
			@addColor="saveState"
			@deleteState="deleteState"
		/>
		<WhiteTonePicker
			v-model="currentChannels"
			class="white-tone-picker"
			color-left="#fd9"
			color-right="#9df"
		/>
	</section>
</template>

<script>
import SavedStatePicker from "@/components/picker/savedStatePicker";
import WhiteTonePicker from "@adrianjost/two-channel-picker/dist/vue/TwoChannelPicker.umd.min.js";

import { undoableStateDelete } from "@/mixins/undoableStateDelete.js";
import { hex2rgb, rgb2hex } from "@/mixins/colorConversion";

export default {
	name: "ChooseColor",
	components: {
		SavedStatePicker,
		WhiteTonePicker,
	},
	mixins: [undoableStateDelete("savedWhites")],
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
			currentChannels: [1, 1],
		};
	},
	computed: {
		savedWhites() {
			return [
				{
					id: "STATE_AUTO",
					icon: "power_settings_new",
					background:
						"conic-gradient(from 0deg at 50% 50%, #15120d,#15120d,#15120d,#322c1e, #99855c, #caedff, #caedff,#caedff, #ffdd99,#99855c, #322c1e, #15120d)",
				},
				...this.$store.getters["savedStates/list-whitetones"],
			];
		},
		currentColor() {
			const [a, b] = this.currentChannels;
			const newColor = rgb2hex({
				r: Math.round(a * 255),
				g: 0,
				b: Math.round(b * 255),
			});
			return newColor;
		},
	},
	watch: {
		currentColor: function (to) {
			this.$store.dispatch("localAPI/sendHexColor", {
				unit: this.unit,
				color: to,
			});
		},
	},
	created() {
		this.$eventHub.on("apply-color", this.apply);
		if ((this.unit.state || {}).color) {
			this.currentChannels = this.extractWhiteChannels(this.unit.state.color);
		}
	},
	beforeUnmount() {
		this.$eventHub.off("apply-color", this.apply);
	},
	methods: {
		extractWhiteChannels(color) {
			const rgb = hex2rgb(color);
			rgb.r /= 255;
			rgb.g = 0;
			rgb.b /= 255;
			return [rgb.r, rgb.b];
		},
		loadColor(id) {
			if (id === "STATE_AUTO") {
				this.$store.dispatch("localAPI/turnOn", {
					unit: this.unit,
					power: true,
				});
				this.unit.state.type = "AUTO";
				// TODO [#812]: wait for state update from unit and apply to local state
				// implementation can be similar to the initial state fetch in id.vue
				// It's then unnecessary to go back immediately.
				this.$eventHub.emit("go-back");
				return;
			}
			this.currentChannels = this.savedWhites.find((state) => {
				return state.id === id;
			}).channels;
		},
		saveState() {
			// prevent saving the last color again
			if (
				this.savedWhites.find((white) => {
					if (white.id === "STATE_AUTO") {
						return false;
					}
					const accuracy = 2;
					const saved = white.channels.map((a) => a.toFixed(accuracy));
					const active = this.currentChannels.map((a) => a.toFixed(accuracy));
					return JSON.stringify(saved) === JSON.stringify(active);
				})
			) {
				return this.toastError("Whitetone is already saved.");
			}

			this.$store.dispatch("savedStates/insert", {
				type: "whitetone",
				channels: this.currentChannels,
			});
		},
		apply() {
			this.$store.dispatch("units/setState", {
				id: this.unit.id,
				data: {
					color: this.currentColor,
				},
			});
			this.$eventHub.emit("go-back");
		},
	},
};
</script>
<style lang="scss" scoped>
.white-tone-picker {
	max-width: 300px;
	padding: 16px;
	margin: 32px auto;
}
</style>
