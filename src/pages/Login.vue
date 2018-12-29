<template>
  <section class="text-center">
    <h1 class="header">Welcome</h1>
    <h2 class="subheader">Sign in to continue</h2>
    <div id="firebaseui-auth-container"></div>
  </section>
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
  .header{
    font-size: 56px;
  }
  .subheader{
    font-size: 24px;
  }
</style>
