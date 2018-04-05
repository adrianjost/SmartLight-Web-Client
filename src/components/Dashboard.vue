<template>
  <div>
    <div class="item-wrapper">
      <div v-for="obj in groups.concat(lamps)"
           class="item acrylic medium"
           @click="colorPicker(obj.id, (obj.current||{}).color)">
        <div class="item-content">
          <i class="icon material-icons"
             :style="'background-color: '+((obj.current||{}).color||'#fff')+'; color:'+textColor(((obj.current||{}).color||'#ffffff'))">
            {{obj.icon}}
          </i><br/>
          {{obj.name}}<br/>
          <button v-show="edit" @click.stop="editLamp(obj.id)">
            <i class="material-icons">edit</i>
          </button>
          <button v-show="edit" @click.stop="deleteLamp(obj.id)">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </div>
      <div @click="add" class="item acrylic medium">
        <div class="item-content">
          <i class="material-icons">add</i>
        </div>
      </div>
      <add-modal @newLamp="addLamp"/>
      <select-color-modal @newColor="newColor"/>
    </div>
    <button class="edit-button" @click="edit = !edit"><i class="material-icons">{{edit?"close":"edit"}}</i></button>
  </div>
</template>

<script>
import firebase from 'firebase'
const addModal = () => import(/* webpackChunkName: "addModal" */ './addLamp.vue');
const selectColorModal = () => import(/* webpackChunkName: "selectColorModal" */ './colorModal.vue');

import hub from "./hub.js";
import textColor from "./textColor.js";

export default {
  components: {
    toolbar,
    addModal,
    selectColorModal
  },
  mixins: [hub, textColor],
  data(){
     return {
       lamps: [],
       groups: [],
       userInfo: {},
       edit: false,
     }
   },
   created() {
     let vm = this;
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
         let userInfo = {};
         userInfo.user = user;
         userInfo.name = user.displayName;
         userInfo.email = user.email;
         userInfo.photo = user.photoURL;
         userInfo.userId = user.uid;
         vm.userInfo = userInfo;

         let dbRef = firebase.database().ref("users/"+userInfo.userId);
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
      this.$emit("show");
    },
    addLamp(lampData) {
      const id = lampData.id;
      delete lampData.id;
      let dbRef = firebase.database().ref("users/"+this.userInfo.userId+"/lamps");
      dbRef.child(id).set(lampData)
        .then(function() {
          console.log('Synchronization succeeded');
        })
        .catch(function(error) {
          console.error('Synchronization failed');
        });
    },
    colorPicker(id, color){
      this.$emit("show-color-picker", id, color);
    },
    newColor(id, value){
      let adaNameRef = firebase.database().ref("users/"+this.userInfo.userId+"/lamps/"+id+"/current");
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
    editLamp(id){
      console.log("edit lamp")
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
      @media screen and (min-width: 300px) {
        width: calc(50% - 16px);
        padding-bottom: calc(50% - 16px);
      }
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
        text-align: center;
        color: #555;
        .icon{
          padding: 16px;
          border-radius: 50%;
          margin-bottom: 16px;
          box-shadow: 2px 2px 5px rgba(0,0,0,.5);
        }
      }
    }
  }
  .user-content-wrapper{
    margin: 24px;
    padding: 32px;
    border-radius: 16px;
  }
.edit-button{
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 50%;
  opacity: .5;
  color: #fff;
  &:hover{
    opacity: 1;
  }
}
</style>
