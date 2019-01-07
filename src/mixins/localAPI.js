import textColor from "@/mixins/textColor.js";

export default {
  data(){
    return {
      connections: {}
    }
  },
  mixins: [textColor],
  methods: {
    _send(connection, message){
      // gradient testing
      /*
      message = {
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
          transitionTimes: [0, 3, 4, 10],
          loop: true
        }
      }*/
      connection.send(JSON.stringify(message));
      //connection.send("J"+JSON.stringify(message.color));
    },
    send({hostname, ip}, message){
      // TODO implement timeout
      let url;
      if(this.connections[hostname]){
        url = hostname;this.connections[hostname]
      }else if(this.connections[ip]){
        url = ip;
      }else{
        url = hostname || ip;
      }
      if(!url){
        return new Error("hostname/ip missing");
      }
      if(this.connections[url] && this.connections[url].readyState === 1) {
        //console.log("already connected! send message:",message);
        this._send( this.connections[url], message)
      } else {
        let connection = this.connections[url];
        if(!connection || this.connections[url].readyState >= 2){
          connection = this.connections[url] = new WebSocket('ws://' + url + ':80');
        }
        connection.onopen = (e) => {
          // wait for etablished connection then send message
          // console.log("connected! send message:",message);
          this._send(connection, message)
        };
        connection.onerror = (e) => {
          if(hostname){ // prevent loops
            this.closeConnection({hostname});
            return this.send({ip}, message);
          }

          /*
          this.$toasted.show(`<span class="toast-container">connection to Lamp failed</span>`, {
            icon: "sync_problem",
            action : {
              text : 'CLOSE',
              onClick : (e, toastObject) => {
                toastObject.goAway(0);
              }
            },
          });
          */
          this.closeConnection({ip});
        };
      }
    },
    closeConnection({hostname, ip}){
      const connectionHostname = this.connections[hostname];
      const connectionIP = this.connections[ip];
      const connection = connectionHostname || connectionIP;
      if(!connection){ return; }

      connection.onclose = function () {}; // disable onclose handler first
      connection.close();
      delete this.connections[hostname];
      delete this.connections[ip];
    },
    sendHexColor({hostname, ip}, hexColor) {
      const newColor = this.hex2rgb(hexColor);
      this.send({hostname, ip}, {color: newColor})
    },
    sendGradient({hostname, ip}, gradient) {
      gradient = JSON.parse(JSON.stringify(gradient));
      gradient.colors = gradient.colors.map(hexColor => this.hex2rgb(hexColor));
      gradient.transitionTimes = gradient.transitionTimes.map(time => Math.round(time/1000));
      this.send({hostname, ip}, {gradient: gradient})
    },
  }
};
