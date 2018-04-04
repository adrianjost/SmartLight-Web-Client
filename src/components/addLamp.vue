<template>
  <modal name="hello-world">
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
    <icon-picker v-model="data.icon"></icon-picker>
    <button @click="hide" >CLOSE</button>
    <button @click="addLamp" >ADD</button>
  </modal>
</template>

<script>
  import firebase from 'firebase'
  import iconPicker from './iconPicker.vue'

  export default {
    name: "add_lamp_modal",
    components: {
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
      show () {
        this.$modal.show('hello-world');
      },
      hide () {
        this.$modal.hide('hello-world');
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
  .v--modal *{
    margin: 8px auto;
    display: block;
  }
</style>
