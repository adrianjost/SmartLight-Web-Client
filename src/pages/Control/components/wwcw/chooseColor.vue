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
			:value="currentChannels"
			class="white-tone-picker"
			color-left="#fd9"
			color-right="#9df"
			@input="updateChannels"
		/>
	</section>
</template>

<script>
import SavedStatePicker from "@/components/picker/savedStatePicker";
import WhiteTonePicker from "@adrianjost/two-channel-picker";

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
			connection: new WebSocket("ws://" + this.unit.hostname + ":80"),
		};
	},
	computed: {
		savedWhites() {
			return this.$store.getters["savedStates/list-whitetones"];
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
		this.$eventHub.$on("apply-color", this.apply);
		if ((this.unit.state || {}).color) {
			this.currentChannels = this.extractWhiteChannels(this.unit.state.color);
		}
		return;
		this.connection.onopen = () => {};
		this.connection.onmessage = (event) => {
			console.log(event);
			try {
				const data = JSON.parse(event.data);
				if (data.color) {
					const ww = data.color[this.unit.channelMap.r.toString()] / 255;
					const cw = data.color[this.unit.channelMap.b.toString()] / 255;
					const newColor = [ww, cw];
					const hasChanged = newColor.some(
						(val, i) => this.currentChannels[i].toFixed(2) !== val.toFixed(2)
					);
					console.log(
						hasChanged,
						this.currentChannels.map((a) => a.toFixed(2)),
						newColor.map((a) => a.toFixed(2))
					);
					if (hasChanged) {
						console.log("update color");
						this.$set(this, "currentChannels", newColor);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};
	},
	beforeDestroy() {
		this.$eventHub.$off("apply-color", this.apply);
	},
	methods: {
		updateChannels(to) {
			const hasChanged = to.some(
				(val, i) => this.currentChannels[i].toFixed(2) !== val.toFixed(2)
			);
			if (hasChanged) {
				this.$set(this, "currentChannels", to);
			}
		},
		extractWhiteChannels(color) {
			const rgb = hex2rgb(color);
			rgb.r /= 255;
			rgb.g = 0;
			rgb.b /= 255;
			return [rgb.r, rgb.b];
		},
		loadColor(id) {
			this.currentChannels = this.savedWhites.find((state) => {
				return state.id === id;
			}).channels;
		},
		saveState() {
			// prevent saving the last color again
			if (
				this.savedWhites.find((white) => {
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
			this.$eventHub.$emit("go-back");
		},
	},
};
</script>
<style lang="scss" scoped>
.white-tone-picker {
	max-width: 300px;
	padding: 1rem;
	margin: 2rem auto;
}
</style>
