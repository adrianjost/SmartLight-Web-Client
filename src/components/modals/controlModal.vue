<template>
  <a11y-dialog :active.sync="activeProxy">
    <header class="dialog-title">
      Control {{obj.name}}
    </header>
    <tabs :options="{ useUrlFragment: false }" class="dialog-content">
      <tab name="color">
          <iro v-model="color" :config="iroConfig"/>
      </tab>
      <tab name="music">
          <music v-model="color"/>
      </tab>
    </tabs>
      
    <div class="dialog-footer">
      <button @click="close" >CLOSE</button>
      <button @click="apply" >OKAY</button>
    </div>
  </a11y-dialog>
</template>

<script>
  import Vue from 'vue';
  import Tabs from 'vue-tabs-component';
  Vue.use(Tabs);
  import iro from '@/components/picker/iro.vue'
  import music from '@/components/picker/music-visualizer.vue'
  import a11yDialog from '@/components/modals/Dialog.vue'
  import localApi from '@/mixins/localAPI.js'

  export default {
    components: {
      a11yDialog,
      iro,
      music,
    },
    mixins: [localApi],
    props: ['active', 'obj'],
    data(){
      return {
        color: "#FA00AA",
        iroConfig: {
          width: 280,//Math.min(window.innerWidth * 0.8, 300),
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
  .dialog-title{ 
    color: #fff;
    font-weight: 500;
    font-size: 1.3rem;
    background: #E65100;
    padding: 16px;
  }
  .dialog-content{
    width: 312px;
    min-height: 420x;
    background-color: #ddd;
  }
  .dialog-footer{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
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

<style lang="scss">
  ul.tabs-component-tabs{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    list-style: none;
    margin: 0;
    padding: 0;
    background: #E65100;
    li.tabs-component-tab{
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      background: transparent;
      border: none;
      text-align: center;
      a{
        display: inline-block;
        width: 100%;
        padding: 16px;
        color: #fff;
        text-decoration: none;
        text-transform: uppercase;
      }
      &.is-active{
          border-bottom: 4px solid #fff;
        }
      &:last-of-type{
        border-right: none;
      }
      &:hover{
        background-color: #b64000;
      }
    }
  }
  .tabs-component-panels{
    padding: 16px;
  }
</style>
