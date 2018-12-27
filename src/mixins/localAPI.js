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
          transitionTimes: [0, 3, 4, 10],
          loop: true
        }
      }*/
      connection.send(JSON.stringify(message));
    },
    send(url, message){
      if(this.connections[url] && this.connections[url].readyState === 1) {
        //console.log("already connected! send message:",message);
        this._send( this.connections[url], message)
      } else {
        let connection = this.connections[url];
        if(!connection || this.connections[url].readyState >= 2){
          //console.log("connecting to",'ws://' + url + ':80...');
          connection = this.connections[url] = new WebSocket('ws://' + url + ':80');
        }
        connection.onopen = (e) => {
          // wait for etablished connection then send message
          // console.log("connected! send message:",message);
          this._send(connection, message)
        };
        connection.onerror = (e) => {
          // connection to lamp failed -> ignore
          // TODO: show non disruptive hint for the user
        };
      }
    },
    closeConnection(url){
      const connection = this.connections[url];
      if(!connection){return;}
      connection.onclose = function () {}; // disable onclose handler first
      connection.close();
      delete this.connections[url];
    },
    sendHexColor(url, hexColor) {
      const newColor = this.hex2rgb(hexColor);
      this.send(url, {color: newColor})
    },
    sendGradient(url, gradient) {
      gradient.colors = gradient.colors.map(hexColor => this.hex2rgb(hexColor));
      this.send(url, gradient)
    },
    sendScene(url, scene) {
      this.send(url, scene)
    }
  }
};
