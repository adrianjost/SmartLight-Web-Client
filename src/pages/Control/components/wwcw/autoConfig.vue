<template>
	<section>
		<div class="data-view">
			<table>
				<thead>
					<tr>
						<th scope="row">Time</th>
						<th
							v-for="hour of hours"
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
	</section>
</template>

<script>
import { undoableStateDelete } from "@/mixins/undoableStateDelete.js";
import { hex2rgb, rgb2hex } from "@/mixins/colorConversion";

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
			saveTimeout: null,
		};
	},
	computed: {
		hourPicker: {
			get() {
				return this.hourPickerValue;
			},
			set(value) {
				this.hapticStep();
				this.hourPickerValue = value;
			},
		},
		brightness: {
			get() {
				return this.data.brightness[this.hourPicker];
			},
			set(value) {
				this.hapticStep();
				this.$set(this.data.brightness, this.hourPicker, value);
			},
		},
		ratio: {
			get() {
				return this.data.ratio[this.hourPicker];
			},
			set(value) {
				this.hapticStep();
				this.$set(this.data.ratio, this.hourPicker, value);
			},
		},
	},
	watch: {},
	async created() {
		// this.$store.dispatch("localAPI/sendHexColor", {
		// 		unit: this.unit,
		// 		color: to,
		// 	});
		const id = Math.round(Math.random() * 1000000);
		let connection;
		try {
			connection = await this.$store.dispatch(
				"localAPI/openConnection",
				this.unit
			);
		} catch (error) {
			this.toastError(`${this.unit.name} is not in reach.`);
			this.loading = false;
			return;
		}
		connection.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.action === "GET /settings/daylight" && message.id === id) {
				this.data = message.data;
			}
		};
		connection.send(
			JSON.stringify({
				action: "GET /settings/daylight",
				id,
			})
		);

		this.$eventHub.on("apply-auto-config", this.apply);
	},
	beforeDestroy() {
		if (this.saveTimeout !== null) {
			clearTimeout(this.saveTimeout);
		}
		this.$eventHub.off("apply-auto-config", this.apply);
	},
	methods: {
		async apply() {
			// TODO - send new config to unit
			const id = Math.round(Math.random() * 1000000);
			try {
				const connection = await this.$store.dispatch(
					"localAPI/openConnection",
					this.unit
				);
				const messageAcknowledged = new Promise((resolve, reject) => {
					this.saveTimeout = setTimeout(reject, 5000);
					connection.onmessage = (event) => {
						const message = JSON.parse(event.data);
						if (message.id === id && message.status === "OK") {
							clearTimeout(this.saveTimeout);
							resolve();
						}
					};
				});
				connection.send(
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
			window.navigator.vibrate(50);
		},
	},
};
</script>
<style lang="scss" scoped>
.data-view {
	width: 100%;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
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
</style>
