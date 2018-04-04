import firebase from 'firebase'

export default {
  components: {
  },
  data(){
    return {
      userId: JSON.parse(localStorage.getItem("user")).uid,
      connections: {}
    }
  },
  created() {
    let dbLampRef = firebase.database().ref("users/"+this.userId+"/lamps");
    dbLampRef.on('child_changed', this.lampListener);
  },
  methods: {
    lampListener(snap){
      const snapVal = snap.val();
      if(!snapVal){return false;}
      if(snapVal.current.color){
        this.sendHexColor(snapVal.hostname, snapVal.current.color);
      } else if(snapVal.current.mode){
        this.sendMode(snapVal.hostname, snapVal.current.mode);
      }
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
        console.log("already connected! send message:",message);
        this.connections[url].send("J" + JSON.stringify(message));
      } else {
        let connection = this.connections[url] = new WebSocket('ws://' + url + ':80');
        connection.onopen = function (e) {
          // wait for etablished connection
          console.log("connected! send message:",message);
          connection.send("J"+JSON.stringify(message));
        };
      }
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
  },
};
