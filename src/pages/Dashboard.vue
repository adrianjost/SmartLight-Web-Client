<template>
  <div>
    <div class="item-wrapper">
      <control-unit 
        v-for="obj in groups.concat(lamps)"
        :key="obj.id"
        :value="obj"
        :edit="edit"
        class="item acrylic medium" />
      <div 
        class="item acrylic medium" 
        id="add" 
        v-show="!edit"
        @click="add">
        <i class="icon material-icons">
          add
        </i>
        <add-modal :active.sync="addModalVisible" @newLamp="addLamp"/>
      </div>
    </div>
    <button class="edit-button" @click="edit = !edit"><i class="material-icons">{{edit?"close":"edit"}}</i></button>
  </div>
</template>

<script>
import firebase from 'firebase'
const addModal = () => import(/* webpackChunkName: "addModal" */ '@/components/modals/addLamp.vue');
import controlUnit from "@/components/controlUnit.vue";

import hub from "@/mixins/hub.js";

export default {
  components: {
    addModal,
    controlUnit
  },
  mixins: [hub],
  data(){
     return {
       lamps: [],
       groups: [],
       edit: false,
       addModalVisible: false,
     }
   },
   created() {
    let vm = this;
    let dbRef = firebase.database().ref("users/"+this.user.uid);
    dbRef.on('value', snap => {
      const snapVal = snap.val();
      if(!snapVal){return false;}
      vm.lamps = vm.ObjectToList(snapVal.lamps);
      //vm.groups = vm.ObjectToList(snapVal.groups);
    })
  },
  methods: {
    add() {
      this.addModalVisible = true;
    },
    addLamp(lampData) {
      const id = lampData.id;
      delete lampData.id;
      let dbRef = firebase.database().ref("users/"+this.user.uid+"/lamps");
      dbRef.child(id).set(lampData)
        .then(function() {
          console.log('Synchronization succeeded');
        })
        .catch(function(error) {
          console.error('Synchronization failed');
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
  padding: 8px;
  font-size: 0;
  line-height: 0;
  // 600px, 900px, 1200px, and 1800px
  .item{
    overflow: visible;
    font-size: 16px;
    line-height: 16px;
    position: relative;
    display: inline-block;
    margin: 8px;
    &, &:before, &:after{
      border-radius: 8px;
    }
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
    &#add{
      i.icon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
      }
    }
  }
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
