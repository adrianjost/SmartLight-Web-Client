import colorConversion from "@/mixins/colorConversion.js";

export default {
	data() {
		return {
			connections: {},
			connectionTimeouts: {},
		};
	},
	mixins: [colorConversion],
	beforeCreate() {
		// TODO [#60]: refactor to VUEX
		if (!window.connections) {
			window.connections = {};
		}
		if (!window.connectionTimeouts) {
			window.connectionTimeouts = {};
		}
	},
	methods: {
		openConnection({ hostname, ip }, cb) {
			// cb is called when the connection is established
			let url;
			if (window.connections[hostname]) {
				url = hostname;
			} else if (window.connections[ip]) {
				url = ip;
			} else {
				url = hostname || ip;
			}
			if (!url) {
				return new Error("hostname/ip missing");
			}

			let connection = window.connections[url];
			if (connection && connection.readyState === 1) {
				// connection established
				cb(connection);
			} else if (!connection || connection.readyState >= 2) {
				// No active connection => open new Socket
				connection = window.connections[url] = new WebSocket(
					"ws://" + url + ":80"
				);
				window.connectionTimeouts[url] = window.setInterval(() => {
					this.closeConnection(url);
					if (url === hostname && ip) {
						this.openConnection({ ip }, cb);
					}
				}, 5000);
			}
			connection.onopen = () => {
				this.disableTimeout(url);
				cb(connection);
			};
			connection.onerror = () => {
				this.closeConnection(url);
			};
			connection.onclose = () => {
				this.disableTimeout(url);
				delete window.connections[url];
			};
		},
		closeConnection(url) {
			const connection = window.connections[url];
			if (!connection) {
				return;
			}
			connection.close();
		},
		disableTimeout(url) {
			window.clearInterval(window.connectionTimeouts[url]);
			if (delete window.connectionTimeouts[url]) {
				delete window.connectionTimeouts[url];
			}
		},
		extractLampsFromUnit(unit) {
			const { type } = unit;
			if (type === "LAMP") {
				return [unit];
			} else {
				return unit.lamps.map((lampId) => {
					return this.$store.getters["units/get"](lampId);
				});
			}
		},
		_send(connection, message) {
			/*message = {
				gradient: {
					colors: [
						{
							r: 255,
							g: 0,
							b: 0
						},
						{
							r: 0,
							g: 0,
							b: 255
						},
						{
							r: 0,
							g: 255,
							b: 0
						},
						{
							r: 255,
							g: 0,
							b: 0
						}
					],
					transitionTimes: [0, 300, 400, 1000],
					loop: true
				}
			}*/
			connection.send(JSON.stringify(message));
		},
		send(lamp, message) {
			const { hostname, ip } = lamp;
			if (!hostname && !ip) {
				return new Error("hostname and ip missing");
			}
			this.openConnection(lamp, (connection) => {
				this._send(connection, message);
			});
		},
		sendHexColor(unit, hexColor) {
			const newColor = this.hex2rgb(hexColor);
			const lamps = this.extractLampsFromUnit(unit);
			lamps.forEach((lamp) => {
				const channelValues = this.colorToChannel(lamp.channelMap, newColor);
				this.send(lamp, { color: channelValues });
			});
		},
		sendGradient(unit, gradient) {
			const lamps = this.extractLampsFromUnit(unit);
			lamps.forEach((lamp) => {
				const colors = gradient.colors.map((hexColor) => {
					return this.colorToChannel(lamp.channelMap, this.hex2rgb(hexColor));
				});
				this.send(lamp, {
					gradient: {
						colors: colors,
						loop: gradient.loop,
						transitionTimes: gradient.transitionTimes,
					},
				});
			});
		},
		sendState(unit, state) {
			if (!state) {
				console.warn("sendState: missing state");
				return;
			}
			if (state.color) {
				this.sendHexColor(unit, state.color);
			} else if (state.gradient) {
				this.sendGradient(unit, state.gradient);
			}
		},
	},
};
