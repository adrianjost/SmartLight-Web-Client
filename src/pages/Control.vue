<template>
  <div class="wrapper card">
    <h2>
      {{obj.name}}
    </h2>
    <tabs :options="{ useUrlFragment: false }" class="dialog-content">
      <tab name="color">
          <iro v-model="color" :config="iroConfig"/>
      </tab>
      <tab v-if="false" name="music">
          <music v-model="color"/>
      </tab>
    </tabs>
      
    <div class="dialog-footer">
      <router-link to="/" replace>CANCEL</router-link>
      <button class="primary" :style="{'background-color': color, color: textColor(color)}" @click="apply" @keyup.space="apply" >APPLY</button>
    </div>
  </div>
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
    data(){
      return {
        color: "#FA00AA",
        iroConfig: {
          width: 280,//Math.min(window.innerWidth * 0.8, 300),
          height: 350,
          sliderMargin: 16,
          markerRadius: 10
        },
      }
    },
    methods: {
      apply () {
        this.closeConnection(this.obj.hostname);
        this.updateValues();
        this.$router.push("/");
      },
      close(){
        // reset to old color
        this.sendHexColor(this.obj.hostname, this.obj.current.color);
        this.closeConnection();
        this.$router.push("/");
      },
      updateValues(){
        // TODO: update color
        this.$emit("update:obj.current", {color: this.color});
        this.$emit("newColor", this.color);
      }
    },
    watch:{
      "color": function(){
        //this.sendHexColor(this.obj.hostname, this.color);
        this.sendHexColor(this.obj.ip, this.color);
      },
    },
    computed: {
      obj () {
        return this.$store.getters["lamps/get"](this.$route.params.id) || {};
      },
    }
  };
</script>

<style scoped>
  .wrapper{
    /*
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    text-align: center;
    white-space: nowrap;
    padding: 32px;
    border-radius: 8px;
    */
  }
</style>