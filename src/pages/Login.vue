<template lang="html">
  <div class="wrapper_centered card">
    <h1>Welcome to SmartLight</h1>
    <p>Sign in to continue</p>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import firebase from 'firebase';
import firebaseui from 'firebaseui';

export default {
  name: 'auth',
  created(){
    firebase.auth().onAuthStateChanged(this.updateUser);
  },
  mounted() {
    const uiConfig = {
      signInSuccessUrl: this.$route.path,
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
        ]
      };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  },
  methods: {
    updateUser(user){
      if(user) {
        this.$store.dispatch("user/login", user);
      } else {
        this.$store.dispatch("user/logout");
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  @import "~firebaseui/dist/firebaseui.css";
  @import "../helpers/base";
  .wrapper_centered{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    text-align: center;
    white-space: nowrap;
    padding: 32px;
    border-radius: 8px;
  }
</style>
