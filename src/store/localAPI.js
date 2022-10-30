import { hex2rgb } from "@/mixins/colorConversion.js";

const PENDING_TIMEOUT = 5000;
const ACTIVE_TIMEOUT = 60000;

Promise.any = function (promises) {
	let errors = [];
	return Promise.race(
		promises.map(function (p) {
			return p.catch(function (e) {
				errors.push(e);
				if (errors.length >= promises.length) throw errors;
			});
		})
	);
};

class Connection {
	static connections = {};

	constructor(addresses) {
		this.addresses = [...new Set(addresses)];
		this.open();
	}

	getActiveConnection() {
		return this.addresses
			.map((address) => Connection.connections[address])
			.find((connection) => connection?.status === "connected");
	}

	async keepAlive() {
		let activeConnection = this.getActiveConnection();
		if (!activeConnection) {
			return;
		}
		clearTimeout(activeConnection.timeout);
		Connection.connections[activeConnection.address].timeout =
			window.setInterval(() => {
				this.close([activeConnection.address]);
			}, ACTIVE_TIMEOUT);
	}

	async open() {
		const _open = async (address) => {
			if (Connection.connections[address]) {
				return Connection.connections[address].connectionPromise;
			}
			Connection.connections[address] = {
				address,
				status: "pending",
				timeout: window.setInterval(() => {
					this.close([address]);
				}, PENDING_TIMEOUT),
			};
			const connectionPromise = new Promise((resolve, reject) => {
				const connection = new WebSocket("ws://" + address + ":80");
				connection.onopen = () => {
					if (Connection.connections[address]) {
						Connection.connections[address].status = "connected";
					}
					resolve(connection);
				};
				connection.onerror = () => {
					this.close([address]);
					reject(connection);
				};
				connection.onclose = () => {
					this.close([address]);
					reject(connection);
				};
				Connection.connections[address].connection = connection;
			});
			Connection.connections[address].connectionPromise = connectionPromise;

			return connectionPromise;
		};

		let activeConnection = this.getActiveConnection();
		if (activeConnection) {
			return activeConnection.connectionPromise;
		}
		const testConnections = this.addresses.map((address, index) =>
			_open(address).then(() => index)
		);
		let connection;
		try {
			const resolvedIndex = await Promise.any(testConnections);
			connection = testConnections[resolvedIndex];
			this.addresses.forEach((address, index) => {
				if (index !== resolvedIndex) {
					this.close([address]);
				}
			});
		} catch (error) {
			this.addresses.forEach((address) => this.close([address]));
			// throw error;
		}
		return connection;
	}

	async close(addresses = this.addresses) {
		async function _close(address) {
			const connection = Connection.connections[address];
			if (!connection) {
				return;
			}
			delete Connection.connections[address];
			clearTimeout(connection.timeout);
			const ws = connection.connection;
			try {
				ws.close();
				process.setTimeout(() => {
					if ([socket.OPEN, socket.CLOSING].includes(ws.readyState)) {
						// Socket still hangs, hard close
						ws.terminate();
					}
				}, 0);
			} catch (e) {}
		}
		return Promise.all(addresses.map(_close));
	}

	async getConnection() {
		let activeConnection = this.getActiveConnection();
		return new Promise(async (resolve, reject) => {
			setTimeout(reject, 5000);
			if (!activeConnection) {
				try {
					await this.open();
					activeConnection = this.getActiveConnection();
				} catch (e) {
					reject();
				}
			}
			if (!activeConnection) {
				return reject();
			}
			resolve(activeConnection.connectionPromise);
		});
	}

	async send(message) {
		try {
			const connection = await this.getConnection();
			this.keepAlive();
			connection.send(JSON.stringify(message));
		} catch (e) {}
	}
}

const state = {};

const getters = {
	extractLampsFromUnit(state, getters, rootState, rootGetters) {
		return (unit) => {
			const { type } = unit;
			if (type === "LAMP") {
				return [unit];
			} else {
				return unit.lamps.map((lampId) => rootGetters["units/get"](lampId));
			}
		};
	},
};

const mutations = {};

const actions = {
	sendHexColor(store, { unit, color }) {
		const newColor = hex2rgb(color);
		const lamps = store.getters.extractLampsFromUnit(unit);
		return Promise.all(
			lamps.map((lamp) => {
				const inverseChannelMap = Object.fromEntries(
					Object.entries(lamp.channelMap).map(([key, value]) => [value, key])
				);
				const channelValues =
					lamp.lamptype === "WWCW"
						? [newColor[inverseChannelMap[1]], newColor[inverseChannelMap[2]]]
						: [
								newColor[inverseChannelMap[1]],
								newColor[inverseChannelMap[2]],
								newColor[inverseChannelMap[3]],
						  ];
				return new Connection([lamp.ip, lamp.hostname]).send({
					action: "SET /output/channel",
					id: 0,
					data: channelValues,
				});
			})
		);
	},
	turnOn(store, { unit }) {
		const lamps = store.getters.extractLampsFromUnit(unit);
		return Promise.all(
			lamps.map((lamp) => {
				return new Connection([lamp.ip, lamp.hostname]).send({
					id: 0,
					action: "SET /output/power",
					data: 1,
				});
			})
		);
	},
	sendState(store, options) {
		const { unit, state } = options;
		if (!state) {
			console.warn("sendState: missing state");
			return;
		}
		if (state.color === undefined) {
			throw new Error("no color to send");
		}
		return store.dispatch("sendHexColor", { color: state.color, unit });
	},
	openConnection(store, unit) {
		return new Connection([unit.ip, unit.hostname]).getConnection();
	},
	closeConnection(store, unit) {
		return new Connection([unit.ip, unit.hostname]).close();
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
