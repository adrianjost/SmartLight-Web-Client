<template>
  <div class="item"
    @click="controlModalVisible = true">
      <div class="item-content">
          <i class="icon material-icons"
            v-show="!edit"
            :style="'background-color: '+getCurrentColor()+'; color:'+textColor(getCurrentColor())">
            {{value.icon}}
          </i><br/>
          <span v-bind:class="{ edit: edit }">{{value.name}}</span><br/>
          <button v-show="edit" @click.stop="editLamp(value.id)">
            <i class="material-icons">edit</i>
          </button>
          <button v-show="edit" @click.stop="deleteLamp(value.id)">
            <i class="material-icons">delete</i>
          </button>
        </div>
        <control-modal :active.sync="controlModalVisible" :obj.sync="value" @newColor="newColor"/>
  </div>
</template>

<script>
const controlModal = () => import(/* webpackChunkName: "controlModal" */ '@/components/modals/controlModal.vue');
import firebase from 'firebase'
import textColor from "@/mixins/textColor.js";
export default {
  components: {
    controlModal
  },
  mixins: [textColor],
  props: ['value', 'edit'],
  data(){
    return {
      controlModalVisible: false,
    }
  },  
  methods: {
    editLamp(id){
      console.log("edit lamp")
    },
    deleteLamp(id){
      const lampRef = firebase.database().ref("users/"+this.user.uid+"/lamps/"+id);
      lampRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
    },
    newColor(value){
      let adaNameRef = firebase.database().ref("users/"+this.user.uid+"/lamps/"+this.value.id+"/current");
      adaNameRef.update({ color: value });
    },
    getCurrentColor(){
        if(!this.value || !this.value.current){
          return
        }
        const current = this.value.current
        if(current.color){
          if(current.color. length === 3 || current.color. length === 6){
            return '#'+current.color;
          }
          return current.color || '#000';
        }
        // TODO - extract color of mode
    },
  },
};
</script>
<style lang="scss" scoped>
.item{
  .item-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    word-break: break-all;
    word-break: break-word;
    text-align: center;
    white-space: nowrap;
    color: #555;
    .icon{
        padding: .75em;
        border-radius: 50%;
        margin-bottom: .75em;
        box-shadow: 2px 2px 5px rgba(0,0,0,.5);
    }
    span{
        font-size: 1rem;
        font-weight: 700;
        line-height: 100%;
        &.edit{
        font-size: 1.5rem;
        color: #333;
        }
    }
    button{
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      i{
        padding: 16px;
        text-shadow: 0 0 5px rgba(0,0,0,.2);
        transition: all .2s ease-in-out;
      }
      &:hover i{
        text-shadow: 2px 4px 5px rgba(0,0,0,.5);
        transform: translate(-2px, -4px);
      }
    }
  }
}
</style>
