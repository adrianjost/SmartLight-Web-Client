<template>
	<section>
		<!-- TODO [$60c5fce2e1a8c6000839cbf3]: add chart preview of data -->
		<div class="data-view custom-scrollbar">
			<table>
				<thead>
					<tr>
						<th scope="row">Time</th>
						<th
							v-for="hour of hours"
							:id="`hour-${hour}`"
							:key="hour"
							scope="column"
							:class="{
								active: hour === hourPicker,
							}"
							@click="
								() => {
									hourPicker = hour;
								}
							"
						>
							{{ hour }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Brightness</th>
						<td
							v-for="(br, hour) of data.brightness"
							:key="hour"
							:class="{
								active: hour === hourPicker,
							}"
							@click="
								() => {
									hourPicker = hour;
								}
							"
						>
							{{ br }}
						</td>
					</tr>
					<tr>
						<th scope="row">Temperature</th>
						<td
							v-for="(temp, hour) of data.ratio"
							:key="hour"
							:class="{
								active: hour === hourPicker,
							}"
							@click="
								() => {
									hourPicker = hour;
								}
							"
						>
							{{ temp }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<label>
			Hour
			<input
				v-model.number="hourPicker"
				type="range"
				:min="0"
				:max="23"
				:step="1"
			/>
		</label>

		<label>
			Brightness
			<input
				v-model.number="brightness"
				type="range"
				:min="0"
				:max="brightnessMax"
				:step="1"
			/>
		</label>

		<label>
			Temperature
			<input
				v-model.number="ratio"
				type="range"
				:min="0"
				:max="tempMax"
				:step="1"
			/>
		</label>

		<button
			v-ripple
			type="button"
			class="button button-reset"
			@click="fetchConfig"
		>
			<i class="material-icons">restart_alt</i>
			Reset
		</button>
	</section>
</template>

<script>
import { undoableStateDelete } from "@/mixins/undoableStateDelete.js";
import { hex2rgb, rgb2hex } from "@/mixins/colorConversion";
import { throttle } from "throttle-debounce";

export default {
	name: "ChooseColor",
	components: {},
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
			hourPickerValue: 0,
			brightnessMax: 255,
			tempMax: 100,
			hours: new Array(24).fill(0).map((a, i) => i),
			data: {
				brightness: [],
				ratio: [],
			},
			messageTimeout: null,
			connection: null,
			previewActiveHour: throttle(100, false, async () => {
				const id = Math.round(Math.random() * 1000000);
				try {
					this.connection.send(
						JSON.stringify({
							action: "SET /output/brightness-and-ratio",
							id,
							data: [
								this.data.brightness[this.hourPicker],
								this.data.ratio[this.hourPicker],
							],
						})
					);
				} catch (error) {
					console.error(error);
					return;
				}
			}),
		};
	},
	computed: {
		hourPicker: {
			get() {
				return this.hourPickerValue;
			},
			set(value) {
				this.hapticStep();
				document.getElementById(`hour-${value}`).scrollIntoView({
					block: "nearest",
					inline: "center",
				});
				this.hourPickerValue = value;
				this.previewActiveHour();
			},
		},
		brightness: {
			get() {
				return this.data.brightness[this.hourPicker];
			},
			set(value) {
				this.hapticStep();
				this.$set(this.data.brightness, this.hourPicker, value);
				this.previewActiveHour();
			},
		},
		ratio: {
			get() {
				return this.data.ratio[this.hourPicker];
			},
			set(value) {
				this.hapticStep();
				this.$set(this.data.ratio, this.hourPicker, value);
				this.previewActiveHour();
			},
		},
	},
	watch: {},
	async created() {
		this.connection = await this.$store.dispatch(
			"localAPI/openConnection",
			this.unit
		);
		await this.fetchConfig();
		this.loading = false;
		this.$eventHub.on("apply-auto-config", this.apply);
		await this.previewActiveHour();
	},
	beforeDestroy() {
		if (this.messageTimeout !== null) {
			clearTimeout(this.messageTimeout);
		}
		this.$eventHub.off("apply-auto-config", this.apply);
	},
	methods: {
		async fetchConfig() {
			const id = Math.round(Math.random() * 1000000);
			try {
				const messageAcknowledged = new Promise((resolve, reject) => {
					this.messageTimeout = setTimeout(reject, 5000);
					this.connection.onmessage = (event) => {
						const message = JSON.parse(event.data);
						if (
							message.action === "GET /settings/daylight" &&
							message.id === id
						) {
							this.data = message.data;

							clearTimeout(this.messageTimeout);
							resolve();
						}
					};
				});
				this.connection.send(
					JSON.stringify({
						action: "GET /settings/daylight",
						id,
						data: {
							...this.data,
						},
					})
				);
				await messageAcknowledged;
			} catch (error) {
				console.error(error);
				this.toastError("Failed to fetch config.");
				return;
			}
		},
		async apply() {
			const id = Math.round(Math.random() * 1000000);
			try {
				const messageAcknowledged = new Promise((resolve, reject) => {
					this.messageTimeout = setTimeout(reject, 5000);
					this.connection.onmessage = (event) => {
						const message = JSON.parse(event.data);
						if (message.id === id && message.status === "OK") {
							clearTimeout(this.messageTimeout);
							resolve();
						}
					};
				});
				this.connection.send(
					JSON.stringify({
						action: "SET /settings/daylight",
						id,
						data: {
							...this.data,
						},
					})
				);
				await messageAcknowledged;
			} catch (error) {
				console.error(error);
				this.toastError("Failed to update unit.");
				return;
			}
			this.toast("Updated Configuration");
		},
		hapticStep() {
			window.navigator.vibrate(20);
		},
	},
};
</script>
<style lang="scss" scoped>
.data-view {
	width: 100%;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	user-select: none;
}

table {
	text-align: center;
	border-collapse: collapse;

	th[scope="row"] {
		padding-right: 1em;
		text-align: left;
	}
	tr > * {
		min-width: 4ch;
		padding: 0.5em;
	}
	.active {
		background-color: var(--color-overlay);
	}
}

label {
	display: block;
	margin: 32px 0;
	text-align: left;
}

.button-reset {
	display: flex;
	align-items: center;
	margin-left: auto;
}
</style>
