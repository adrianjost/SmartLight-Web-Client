<template>
  <a11y-dialog :active.sync="activeProxy">
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
  import iro from '@/components/picker/iro.vue'
  import a11yDialog from '@/components/modals/Dialog.vue'
  import localApi from '@/mixins/localAPI.js'

  export default {
    components: {
      iro,
      a11yDialog
    },
    mixins: [localApi],
    props: ['active', 'obj'],
    data(){
      return {
        color: "FA00AA",
        iroConfig: {
          width: Math.min(window.innerWidth * 0.8, 300),
          height: 350,
          sliderMargin: 16,
          markerRadius: 10
        },
        activeProxy: false,
      }
    },
    methods: {
      apply () {
        this.emit();
        this.hide();
      },
      close(){
        // reset to old color
        this.send(this.obj.hostname, this.hex2rgb(this.obj.current.color));
        this.hide();
      },
      hide () {
        this.closeConnection(this.obj.hostname);
        this.activeProxy = false;
      },
      emit(){
        let newObj = JSON.parse(JSON.stringify(this.obj));
        if(!newObj.current){newObj.current = {};}
        newObj.current.color = this.color;
        this.$emit("update:obj", newObj);
        this.$emit("newColor", newObj.current.color);
      }
    },
    watch:{
      "color": function(){
        this.send(this.obj.hostname, this.hex2rgb(this.color));
      },
      "active": function(to){
        this.activeProxy = to;
      },
      "activeProxy": function(to){
        if(to === false){
          this.color = this.obj.current.color;
        }
        this.$emit("update:active", to);
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
