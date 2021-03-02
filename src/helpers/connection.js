class Connection {
	constructor(address, options) {
		this.address = address; // hostname or IP
		this.options = options; // { connectTimeout: number in ms, keepAlive: number in ms}
	}

	state = "closed";
	connection = null;
	connectionPromise = null;

	async open() {
		if (this.state === "pending" || this.state === "connected") {
			return this.connectionPromise;
		}
		this.connectionPromise = new Promise((resolve, reject) => {
			this.connection = new WebSocket("ws://" + this.address + ":80");
			this.connection.onopen = () => {
				this.state = "connected";
				resolve(this);
			};
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
		});
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
			// this.keepAlive();
			if (this.state !== "connected") {
				await this.open();
			}
			this.connection.send(JSON.stringify(message));
		} catch (e) {}
	}
}

export default Connection;
