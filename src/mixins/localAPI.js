export default {
  data(){
    return {
      connections: {}
    }
  },
  methods: {
    textColor(backgroundHexColor){
      const rgb = this.hex2rgb(backgroundHexColor);
      return (Math.sqrt(Math.pow(rgb.r,2)*0.299 + Math.pow(rgb.g,2)*0.587 + Math.pow(rgb.b,2)*0.114) > 186)?"black":"white";
    },
    hex2rgb(hexColor){
      // remove leading #
      if(hexColor.length === 7 || hexColor.length === 4){ hexColor = hexColor.substr(1)}
      // convert 3 digit to 6 digit color
      if(hexColor.length === 3){ hexColor = hexColor[0]+hexColor[0]+hexColor[1]+hexColor[1]+hexColor[2]+hexColor[2]}
      const bigint = parseInt(hexColor, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return {"r":r,"g":g,"b":b}
    },
    send(url, message){
      if(this.connections[url] && this.connections[url].readyState === 1) {
        //console.log("already connected! send message:",message);
        this.connections[url].send("J" + JSON.stringify(message));
      } else {
        let connection = this.connections[url];
        if(!connection || this.connections[url].readyState >= 2){
          //console.log("connecting to",'ws://' + url + ':80...');
          connection = this.connections[url] = new WebSocket('ws://' + url + ':80');
        }
        connection.onopen = function (e) {
          // wait for etablished connection then send message
          // console.log("connected! send message:",message);
          connection.send("J"+JSON.stringify(message));
        };
        connection.onerror = function (e) {
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
      this.send(url, newColor)
    },
    sendMode(url, mode) {
      this.send(url, mode)
    },
    sendScene(url, scene) {
      this.send(url, scene)
    }
  }
};
