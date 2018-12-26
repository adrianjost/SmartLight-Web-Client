<template>
  <div id="app" class="wrapper" :style="{'--background-image': 'url('+backgroundurl+')'}">
    <main>
      <toolbar v-if="user"/>
      <router-view></router-view>
    </main>
    <portal-target name="dialog-container" />
  </div>
</template>

<script>
import firebase from 'firebase'
import toolbar from "@/components/Toolbar.vue";

export default {
  name: 'app',
  components: {
    toolbar
  },
  data(){
    return {
      backgroundurl: ''
    };
  },
  mounted(){
    //this.backgroundurl = `https://source.unsplash.com/${window.screen.width}x${window.screen.height}/?Light`;
  },
  computed: {
    user () {
      return this.$store.getters["user/get"];
    }
  }
}
</script>
<style>
  body{
    margin: 0;
    padding: 0;
    min-width: 250px;
    width: 100%;
    min-height: 100vh;
    font: 400 16px/16px sans-serif;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: #333;
  }
  *{
    box-sizing: border-box;
  }
</style>
<style scoped>
  .wrapper, .wrapper:after{
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
  .wrapper:after{
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: var(--background-image);
  }
</style>
