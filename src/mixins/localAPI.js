import colorConversion from "@/mixins/colorConversion.js";

export default {
	data(){
		return {
			connections: {},
			connectionTimeouts: {},
		}
	},
	mixins: [colorConversion],
	methods: {
		openConnection({ hostname, ip }, cb){
			// cb is called when the connection is established
			let url;
			if(this.connections[hostname]){ url = hostname; }
			else if(this.connections[ip]){ url = ip; }
			else{ url = hostname || ip; }
			if(!url){ return new Error("hostname/ip missing"); }

			let connection = this.connections[url];
			if(connection && connection.readyState === 1) { // connection established
				cb(connection);
			}else if(!connection || connection.readyState >= 2){ // No active connection => open new Socket
				connection = this.connections[url] = new WebSocket('ws://' + url + ':80');
				this.connectionTimeouts[url] = window.setTimeout(() => {
					this.closeConnection(url);
					if(url === hostname && ip){
						this.openConnection({ ip }, cb);
					}
				}, 5000)
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
				delete this.connections[url];
			};
		},
		closeConnection(url){
			const connection = this.connections[url];
			if(!connection){ return; }
			connection.close();
		},
		disableTimeout(url){
			if(delete this.connectionTimeouts[url]){
				delete this.connectionTimeouts[url];
			}
		},
		extractLampsFromUnit(unit){
			const { hostname, ip } = unit;
			if( hostname || ip){
				return [ unit ];
			}else{
				return unit.lamps.map((lampId) => {
					return this.$store.getters["units/get"](lampId);
				})
			}
		},
		_send(connection, message){
			connection.send(JSON.stringify(message));
		},
		send(lamps, message){
			lamps.forEach((lamp) => {
				const {hostname, ip} = lamp;
				if(!hostname && !ip){
					return new Error("hostname and ip missing");
				}
				this.openConnection(lamp, (connection) => {
					this._send( connection, message);
				})
			})
		},
		sendHexColor(unit, hexColor) {
			const newColor = this.hex2rgb(hexColor);
			this.send(this.extractLampsFromUnit(unit), {color: newColor})
		},
		sendGradient(unit, gradient) {
			gradient = JSON.parse(JSON.stringify(gradient));
			gradient.colors = gradient.colors.map(hexColor => this.hex2rgb(hexColor));
			this.send(this.extractLampsFromUnit(unit), {gradient: gradient})
		},
		sendState(unit, state) {
			if(state.color){
				this.sendHexColor(unit, state.color);
			} else if(state.gradient){
				this.sendGradient(unit, state.gradient);
			}
		},
	}
};
