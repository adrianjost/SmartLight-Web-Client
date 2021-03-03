import Connection from "../helpers/connection";
import { rgb2hex, hex2rgb } from "./colorConversion";
import { throttle } from "throttle-debounce";
const cache = {};

// TODO: cleanup connections for removed hub_units
// TODO: create new connection if lamp IP changes

export default {
	computed: {
		hub_units() {
			return this.$store.getters["units/list"];
		},
	},
	beforeDestroy() {
		Object.values(cache).forEach(({ connection }) => {
			connection.close();
		});
	},
	watch: {
		hub_units: {
			handler: function (to) {
				to.forEach((unit) => {
					if (unit.type !== "LAMP") {
						// TODO handle updates to GROUPS
						return;
					}
					if (!cache[unit.id]) {
						cache[unit.id] = {
							connection: new Connection([unit.hostname, unit.ip]),
							state: JSON.stringify(unit.state),
						};
						const connection = cache[unit.id].connection;
						connection.open();
						setInterval(() => {
							if (connection.state !== "open") {
								connection.open();
							}
						}, 60 * 1000);
						connection.onMessage(
							throttle(5000, false, (message) => {
								if (message.action !== "GET /output") {
									// irrelevant message
									return;
								}
								const [r, b] = message.data.channel;
								const newState = {
									color: rgb2hex({ r, g: 0, b }),
								};
								cache[unit.id].state = JSON.stringify(newState);
								cache[unit.id].lastUpdate = Date.now();
								this.$store.dispatch("units/setState", {
									id: unit.id,
									data: newState,
								});
							})
						);
					}
					if (cache[unit.id].state === JSON.stringify(unit.state)) {
						// nothing changed
						return;
					}
					const { connection } = cache[unit.id];
					const { r, b } = hex2rgb(unit.state.color);
					connection.send({
						action: "SET /output/channel",
						data: [r, b],
					});
					cache[unit.id].state = JSON.stringify(unit.state);
				});
			},
			deep: true,
			immediate: true,
		},
	},
};
