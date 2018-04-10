<template>
  <a11y-dialog :active.sync="modalVisible">
    <div class="dialog-content">
      <iro v-model="color" :config="iroConfig"/>
    </div>
    <div class="dialog-footer">
      <button @click="close" >CLOSE</button>
      <button @click="apply" >OKAY</button>
    </div>
  </a11y-dialog>
</template>

<script>
  import iro from './iro.vue'
  import a11yDialog from './Dialog.vue'
  import localApi from './localAPI.js'

  export default {
    components: {
      iro,
      a11yDialog
    },
    mixins: [localApi],
    data(){
      return {
        obj: {},
        color: "FA00AA",
        iroConfig: {
          width: Math.min(window.innerWidth * 0.8, 300),
          height: 350,
          sliderMargin: 16,
          markerRadius: 10
        },
        modalVisible: false,
      }
    },
    created() {
      this.$parent.$on('show-color-picker', this.show);
      this.$parent.$on('hide', this.hide);
    },
    methods: {
      apply () {
        this.emit();
        this.hide();
      },
      close(){
        if(!this.obj.current){return;}
        // reset to old color
        this.send(this.obj.hostname, this.hex2rgb(this.obj.current.color));
        this.hide();
      },
      show (obj, color) {
        this.obj = obj;
        this.color = color || "#ffffff";
        this.modalVisible = true;
      },
      hide () {
        this.closeConnection(this.obj.hostname);
        this.obj = {};
        this.modalVisible = false;
      },
      emit(){
        this.$emit("newColor", this.obj.id, JSON.parse(JSON.stringify(this.color)));
      }
    },
    watch:{
      "color": function(){
        this.send(this.obj.hostname, this.hex2rgb(this.color));
      },
      "modalVisible": function(to){
        if(!to){
          this.close();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .dialog-content{
    padding: 16px;
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
