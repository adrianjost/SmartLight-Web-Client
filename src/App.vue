<template>
  <div id="app" class="wrapper">
    <main v-if="user">
      <toolbar :userInfo="user" />
      <router-view></router-view>
    </main>
    <auth v-else/>
  </div>
</template>

<script>
import firebase from 'firebase'
import auth from "./components/Auth.vue";
import toolbar from "./components/Toolbar.vue";

export default {
  name: 'app',
  components: {
    auth,
    toolbar
  },
  data(){
    return {
      user: {"Hi":"Ho"}
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(this.updateUser);
  },
  methods: {
    updateUser(user){
      if(user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.user = user;
      } else {
        localStorage.removeItem("user");
        this.user = undefined;
      }
    }
  }
}
</script>
<style>
  body{
    margin: 0;
    padding: 0;
    width: 100vw;
    min-width: 250px;
    min-height: 100vh;
    font: 400 16px/16px sans-serif;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: #eee;
  }
  *{
    box-sizing: border-box;
  }

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
    background: url(https://unsplash.com/photos/4Y_f_LvAu3U/download) center center / cover no-repeat;
    //background: url(https://source.unsplash.com/collection/1484854/daily) center center / cover no-repeat;
  }

  /* Fluent Design Acrilic by https://codepen.io/ErickPetru/pen/eRzBgJ?editors=1100 */
  .acrylic {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .acrylic::before {
    content: "";
    position: absolute;
    left: -8px;
    top: -8px;
    right: -8px;
    bottom: -8px;
    z-index: -1;
    background-blend-mode: exclusion;
    filter: blur(8px);
    -webkit-filter: blur(8px);
    filter: url(#blur);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius='8');
  }

  .acrylic::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.8);
    background-image: url("http://api.thumbr.it/whitenoise-361x370.png?background=ffffff00&noise=a0a0a0&density=35&opacity=10");
  }

  .acrylic.low::after {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .acrylic.medium::after {
    background-color: rgba(255, 255, 255, 0.4);
  }

  .acrylic.medium-high::after {
    background-color: rgba(255, 255, 255, 0.6);
  }

</style>
