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
let loginUi;

export default {
  name: 'auth',
  created(){
    loginUi = new firebaseui.auth.AuthUI(firebase.auth());
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
    loginUi.start('#firebaseui-auth-container', uiConfig);
  }
}
</script>

<style lang="scss" scoped>
  @import "~firebaseui/dist/firebaseui.css";
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
