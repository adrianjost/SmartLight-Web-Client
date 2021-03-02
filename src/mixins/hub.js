import Connection from "../helpers/connection";
import { rgb2hex } from "./colorConversion";
import debounce from "debounce";
const cache = {};

// TODO: cleanup connections for removed hub_units
// TODO: create new connection if hub IP changes

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
							// TODO fallback to IP based connection if hostname connection fails within a given amount of time
							connection: new Connection(unit.hostname || unit.ip),
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
							/* TODO execute action in regular intervals even if we get continously messages
								if the lamp is in time control mode, we constantly get messages so the debounced
								would never trigger, but we still want to save the current state in regular
								intervals (5mins or so) anyway.
							*/
							debounce((message) => {
								if (message.action !== "GET /output") {
									// irrelevant message
									return;
								}
								// TODO debounce updates to reduce server load (firstore)
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
							}, 5000)
						);
					}
					if (cache[unit.id].state === JSON.stringify(unit.state)) {
						// nothing changed
						return;
					}
					const { connection, state } = cache[unit.id];
					connection.send({
						// TODO use new firmware API
						color: unit.state.color,
					});
					cache[unit.id].state = JSON.stringify(unit.state);
				});
			},
			deep: true,
			immediate: true,
		},
	},
};
