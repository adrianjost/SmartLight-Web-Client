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
		// TODO [$5dd14fbbf66ebd000711ec5c]: refactor to VUEX
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
		send(lamps, message) {
			lamps.forEach((lamp) => {
				const { hostname, ip } = lamp;
				if (!hostname && !ip) {
					return new Error("hostname and ip missing");
				}
				this.openConnection(lamp, (connection) => {
					this._send(connection, message);
				});
			});
		},
		sendHexColor(unit, hexColor) {
			const newColor = this.hex2rgb(hexColor);
			this.send(this.extractLampsFromUnit(unit), { color: newColor });
		},
		sendGradient(unit, gradient) {
			gradient = JSON.parse(JSON.stringify(gradient));
			gradient.colors = gradient.colors.map((hexColor) =>
				this.hex2rgb(hexColor)
			);
			this.send(this.extractLampsFromUnit(unit), {
				gradient: {
					colors: gradient.colors,
					loop: gradient.loop,
					transitionTimes: gradient.transitionTimes,
				},
			});
		},
		sendState(unit, state) {
			if (!state) {
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
