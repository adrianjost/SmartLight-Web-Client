<template>
	<section>
		<!-- TODO [#627]: add chart preview of data -->
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
							tabindex="0"
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
			<div class="slider">
				<button
					@click="
						() => {
							brightness = Math.max(0, brightness - 1);
						}
					"
				>
					-
				</button>
				<input
					v-model.number="brightness"
					type="range"
					:min="0"
					:max="brightnessMax"
					:step="1"
				/>
				<button
					@click="
						() => {
							brightness = Math.min(brightness + 1, brightnessMax);
						}
					"
				>
					+
				</button>
			</div>
		</label>

		<label>
			Temperature
			<div class="slider">
				<button
					@click="
						() => {
							ratio = Math.max(0, ratio - 1);
						}
					"
				>
					-
				</button>
				<input
					v-model.number="ratio"
					type="range"
					:min="0"
					:max="tempMax"
					:step="1"
				/>
				<button
					@click="
						() => {
							ratio = Math.min(ratio + 1, tempMax);
						}
					"
				>
					+
				</button>
			</div>
		</label>

		<SLInput
			v-model.number="data.utcOffset"
			label="UTC Offset"
			type="number"
			placeholder="1"
		/>

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
import { throttle } from "throttle-debounce";
import Input from "@/components/picker/input";

export default {
	name: "ChooseColor",
	components: {
		SLInput: Input,
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
			hourPickerValue: 0,
			brightnessMax: 255,
			tempMax: 100,
			hours: new Array(24).fill(0).map((a, i) => i),
			data: {
				brightness: [],
				ratio: [],
				utcOffset: 0,
			},
			messageTimeout: null,
			connection: null,
			previewActiveHour: throttle(100, async () => {
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
				this.data.brightness[this.hourPicker] = value;
				this.previewActiveHour();
			},
		},
		ratio: {
			get() {
				return this.data.ratio[this.hourPicker];
			},
			set(value) {
				this.hapticStep();
				this.data.ratio[this.hourPicker] = value;
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
	beforeUnmount() {
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

.slider {
	display: grid;
	grid-template-columns: auto 1fr auto;
	width: 100%;
	> button {
		position: relative;
		padding: 0.5em 1em;
		color: var(--color-text);
		border-radius: 20em;
		$clickable-offset: -0.5em;
		&::before {
			position: absolute;
			top: $clickable-offset;
			right: $clickable-offset;
			bottom: $clickable-offset;
			left: $clickable-offset;
			content: "";
			border-radius: 20em;
		}
	}
}

.button-reset {
	display: flex;
	align-items: center;
	margin-left: auto;
}
</style>
