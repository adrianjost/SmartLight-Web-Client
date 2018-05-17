<template>
  <a11y-dialog :active.sync="activeProxy">
    <div class="dialog-content">
      <input type="string" placeholder="id" v-model="data.id"/>
      <input type="string" placeholder="Name" v-model="data.name"/>
      <input type="string" placeholder="Name" v-model="data.ip"/>
      <input type="string" placeholder="Name" v-model="data.hostname"/>
      <select v-model="data.colorMode">
        <option value="switch">switch</option>
        <option value="single">single color</option>
        <option value="dual">dual color</option>
        <option value="RGB">RGB</option>
      </select>
      <icon-picker v-model="data.icon"/>
    </div>
    <div class="dialog-footer">
      <button @click="hide" >CANCLE</button>
      <button @click="addLamp" >ADD</button>
    </div>
  </a11y-dialog>
</template>

<script>
import a11yDialog from '@/components/modals/Dialog.vue'
import iconPicker from '@/components/picker/iconPicker.vue'

  export default {
    name: "add_lamp_modal",
    components: {
      a11yDialog,
      iconPicker
    },
    props: ['active'],
    data(){
      return {
        data: {
          id: "00",
          ip: "SmartLight-005",
          hostname: "SmartLight-005",
          icon: "lightbulb_outline",
          name: "TV",
          colorMode: "RGB"
        },
        activeProxy: false,
      }
    },
    methods: {
      addLamp() {
        this.data.name += ("-" + this.data.id);
        this.$emit("newLamp", JSON.parse(JSON.stringify(this.data)));
        this.hide();
      },
      hide () {
        this.activeProxy = false;
      }
    },
    watch:{
      "data.id": function(to){
        this.data.ip = "SmartLight-"+to;
        this.data.hostname = "SmartLight-"+to;
      },
      "active": function(to){
        this.activeProxy = to;
      },
      "activeProxy": function(to){
        this.$emit("update:active", to);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .dialog-content{
    padding: 16px;
    text-align: center;
    * {
      display: block;
      margin: 4px;
    }
    input, select{
      width: 70vw;
      max-width: 300px;
    }
  }
  .dialog-footer{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    a, button{
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding: 16px;
      outline: none;
      background: none;
      border: none;
      border-top: 1px solid #999;
      border-right: 1px solid #999;
      &:last-of-type{
        border-right: none;
      }
      &:hover{
        background: #ccc;
      }
    }
  }
</style>
