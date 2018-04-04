<template>
  <a11y-dialog ref="adddialog">
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
import a11yDialog from './Dialog.vue'
import iconPicker from './iconPicker.vue'

  export default {
    name: "add_lamp_modal",
    components: {
      a11yDialog,
      iconPicker
    },
    data(){
      return {
        data: {
          id: "00",
          ip: "SmartLight-005",
          icon: "lightbulb_outline",
          hostname: "SmartLight-005",
          name: "TV",
          colorMode: "RGB"
        }
      }
    },
    created() {
      this.$parent.$on('show', this.show);
      this.$parent.$on('hide', this.hide);
    },
    methods: {
      addLamp() {
        this.data.name += ("-" + this.data.id);
        console.log("add", this.data);
        this.$emit("newLamp", JSON.parse(JSON.stringify(this.data)));
        this.hide();
      },
      show (  ) {
        this.$refs.adddialog.open();
      },
      hide () {
        this.$refs.adddialog.close();
      }
    },
    watch:{
      "data.id": function(to){
        this.data.ip = "SmartLight-"+to;
        this.data.hostname = "SmartLight-"+to;
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
