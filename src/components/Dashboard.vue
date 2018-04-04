<template>
  <div>
    <div class="item-wrapper">
      <div v-for="obj in groups.concat(lamps)"
           class="item acrylic"
           @click="colorPicker(obj.id, (obj.current||{}).color)">
        <div class="item-content">
          <i class="material-icons">{{obj.icon}}</i><br/>
          Name: {{obj.name}} <br/>
          Color: {{(obj.current||{}).color}} <br/>
          <button @click.stop="deleteLamp(obj.id)">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </div>
      <div @click="add" class="item acrylic">
        <div class="item-content">
          <i class="material-icons">add</i>
        </div>
      </div>
      <add-modal @newLamp="addLamp"/>
      <select-color-modal @newColor="newColor"/>
    </div>
    <div class="user-content-wrapper acrylic">
      <h1>Signup succeeded</h1>
      <pre>{{userInfo.user}}</pre>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import addModal from "./addLamp.vue";
import selectColorModal from "./colorModal.vue";

import hub from "./hub.js";


export default {
  components: {
    toolbar,
    addModal,
    selectColorModal
  },
  mixins: [hub],
  data(){
     return {
       lamps: [],
       groups: [],
       userInfo: {},
     }
   },
   created() {
     let vm = this;
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         console.log("user",user);
         let userInfo = {};
         userInfo.user = user;
         userInfo.name = user.displayName;
         userInfo.email = user.email;
         userInfo.photo = user.photoURL;
         userInfo.userId = user.uid;
         vm.userInfo = userInfo;

         var dbRef = firebase.database().ref("users/"+userInfo.userId);
         dbRef.on('value', snap => {
           const snapVal = snap.val();
           if(!snapVal){return false;}
           vm.lamps = vm.ObjectToList(snapVal.lamps);
           vm.groups = vm.ObjectToList(snapVal.groups);
           //console.log(vm.lamps, vm.groups);
         })
       }
    });
  },
  methods: {
    add() {
      console.log("addLamp");
      this.$emit("show");
    },
    addLamp(lampData) {
      const id = lampData.id;
      delete lampData.id;
      var dbRef = firebase.database().ref("users/"+this.userInfo.userId+"/lamps");
      dbRef.child(id).set(lampData)
        .then(function() {
          console.log('Synchronization succeeded');
        })
        .catch(function(error) {
          console.log('Synchronization failed');
        });
    },
    colorPicker(id, color){
      this.$emit("show-color-picker", id, color);
    },
    newColor(id, value){
      var adaNameRef = firebase.database().ref("users/"+this.userInfo.userId+"/lamps/"+id+"/current");
      adaNameRef.update({ color: value });
    },
    deleteLamp(id){
      const lampRef = firebase.database().ref("users/"+this.userInfo.userId+"/lamps/"+id);
      lampRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
    },
    ObjectToList(object){
      let list = [];
      for (let key in object){
        let tmp = object[key];
        tmp["id"] = key;
        list.push(tmp);
      }
      return list;
    }
  },
};
</script>
<style lang="scss" scoped>
  .item-wrapper{
    padding: 16px;
    font-size: 0;
    line-height: 0;
    // 600px, 900px, 1200px, and 1800px
    .item{
      font-size: 16px;
      line-height: 16px;
      position: relative;
      display: inline-block;
      margin: 8px;
      border-radius: 8px;
      width: calc(100% - 16px);
      padding-bottom: calc(100% - 16px);
      @media screen and (min-width: 600px) {
        width: calc(100% / 3 - 16px);
        padding-bottom: calc(100% / 3 - 16px);
      }
      @media screen and (min-width: 900px) {
        width: calc(25% - 16px);
        padding-bottom: calc(25% - 16px);
      }
      @media screen and (min-width: 1200px) {
        width: calc(20% - 16px);
        padding-bottom: calc(20% - 16px);
      }
      @media screen and (min-width: 1800px) {
        width: calc(100% / 6 - 16px);
        padding-bottom: calc(100% / 6 - 16px);
      }
      .item-content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        word-break: break-all;
        word-break: break-word;
      }
    }
  }
  .user-content-wrapper{
    margin: 24px;
    padding: 32px;
    border-radius: 16px;
  }
</style>
