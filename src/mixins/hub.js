import localAPI from './localAPI.js'

export default {
  mixins: [localAPI],
  data(){
    return {}
  },
  created() {
    // TODO move this to an vuex state watch handler
    //let dbLampRef = firebase.database().ref("users/"+this.user.uid+"/lamps");
    //dbLampRef.on('child_changed', this.lampListener);
  },
  methods: {
    /*
    lampListener(snap){
      const snapVal = snap.val();
      if(!snapVal){return false;}
      if(snapVal.current.color){
        this.sendHexColor(snapVal.hostname, snapVal.current.color);
      } else if(snapVal.current.mode){
        this.sendGradient(snapVal.hostname, snapVal.current.mode);
      }
    },
    updateLamps(to, from){
      to.forEach(lamp => {
        if(!lamp.state){
          lamp.state = {};
        }
        if(lamp.state.color){
          this.sendHexColor(lamp.hostname, lamp.state.color);
        } else if(lamp.state.gradient){
          this.sendGradient(lamp.hostname, lamp.state.gradient);
        }
      });
    }*/
  },
  /*
  computed: {
    units () {
      return this.$store.getters["units/list"];
    }
  },
  watch: {
    lamps: {
      handler: this.updateLamps,
      deep: true
    }
  }*/
};
