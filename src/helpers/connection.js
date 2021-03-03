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
	constructor(addresses, options = { timeout: 5000 }) {
		this.addresses = [...new Set(addresses)]; // hostname or IP
		this.options = options; // { connectTimeout: number in ms }
	}

	state = "closed";
	connection = null;
	connectionPromise = null;

	async open() {
		if (this.state === "pending" || this.state === "connected") {
			return this.connectionPromise;
		}

		const _open = async () => {
			let connectionPromise;
			let connection;
			let latestError;
			for (const address of this.addresses) {
				try {
					connectionPromise = this.createConnection(address);
					connection = await connectionPromise;
					latestError = null;
					break;
				} catch (error) {
					latestError = error;
					connectionPromise = null;
				}
			}
			if (connectionPromise === null) {
				throw new Error(latestError);
			}
			this.connection = connection;
			this.state = "connected";
			this.connection.onmessage = (event) => {
				this.message(event);
			};
			this.connection.onerror = () => {
				this.state = "error";
				reject(this);
			};
			this.connection.onclose = () => {
				this.state = "closed";
				reject(this);
			};
			return connection;
		};
		this.connectionPromise = _open();
	}

	async close() {
		this.connection.close();
		this.state = "closed";
		this.connectionPromise = null;
		this.connection = null;
	}

	callbacks = [];
	onMessage(callback) {
		// (messageData) => void
		this.callbacks.push(callback);
	}
	message(event) {
		const message = JSON.parse(event.data);
		this.callbacks.forEach((cb) => cb(message));
	}

	async send(message) {
		try {
			if (this.state !== "connected") {
				await this.open();
			}
			this.connection.send(JSON.stringify(message));
		} catch (e) {}
	}

	async createConnection(address) {
		return new Promise((resolve, reject) => {
			const connection = new WebSocket("ws://" + address + ":80");
			const timeout = setTimeout(() => {
				connection.close();
				reject("connection timed out");
			}, this.options.timeout);
			connection.onopen = () => {
				clearTimeout(timeout);
				resolve(connection);
			};
			connection.onerror = () => {
				clearTimeout(timeout);
				reject("connection errored");
			};
			connection.onclose = () => {
				clearTimeout(timeout);
				reject("connection closed");
			};
		});
	}
}

export default Connection;
