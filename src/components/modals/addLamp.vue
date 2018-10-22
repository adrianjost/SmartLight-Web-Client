<template>
  <a11y-dialog :active.sync="activeProxy">
    <header class="dialog-title">
      Add Lamp
    </header>
    <div class="dialog-content">
      <input type="text" placeholder="id" v-model="data.id"/>
      <input type="text" placeholder="name (Home)" v-model="data.name"/>
      <input type="text" placeholder="ip (192.168.2.xxx)" v-model="data.ip"/>
      <input type="text" placeholder="hostname (SmartLight-[id])" v-model="data.hostname"/>
      <select v-model="data.colorMode">
        <option value="switch">switch</option>
        <option value="single">single color</option>
        <option value="dual">dual color</option>
        <option value="RGB">RGB</option>
      </select>
      <icon-picker v-model="data.icon"/>
    </div>
    <div class="dialog-footer">
      <button @click="hide" @keyup.space="hide">CANCLE</button>
      <button class="primary" @click="addLamp" @keyup.space="addLamp" >ADD</button>
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
          id: "",
          name: "",
          ip: "",
          hostname: "",
          icon: "lightbulb_outline",
          colorMode: "RGB"
        },
        activeProxy: false,
      }
    },
    methods: {
      addLamp() {
        this.$emit("newLamp", JSON.parse(JSON.stringify(this.data)));
        this.hide();
      },
      hide () {
        this.activeProxy = false;
      }
    },
    watch:{
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
@import "../../helpers/base";
  .dialog-content{
    padding: 16px;
    text-align: center;
    input, select{
      width: 70vw;
      max-width: 300px;
    }
  }
  .dialog-footer{
    padding: 16px;
    text-align: right;
  }
</style>
