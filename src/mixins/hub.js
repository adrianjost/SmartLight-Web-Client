import firebase from 'firebase'
import localAPI from './localAPI.js'

export default {
  mixins: [localAPI],
  data(){
    return {}
  },
  created() {
    let dbLampRef = firebase.database().ref("users/"+this.user.uid+"/lamps");
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
  },
};
