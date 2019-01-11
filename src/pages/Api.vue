<template>
  <div class="content-wrapper acrylic">
    <h1>API token generator</h1>
    <p>Here you can create your authentification token to use the API.<br/>
      Never publish this token anywhere!<br/>
      If someone has this token he has full control over your database entrys.<br/>
      Nevertheless if you loose your token you can regenerate them by clicking the button <br/>
      and you get a new one and the old token gets invalid.
    </p>
    <textarea class="token">{
  "uid": "{{this.user.uid}}",
  "secret": "{{token}}",
  "textString": "{{ingredient}}"
}</textarea><br/>
    <button class="button" @click="newToken">create new auth token</button>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';

const randtoken = require('rand-token');

export default {
  name: "api",
  data(){
    return {
      token: '',
      user: {},
      ingredient: "{{TextField}}"
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(this.updateUser);
  },
  methods: {
    getToken(snap){
      const snapVal = snap.val();
      if(!snapVal){return;}
      this.token = snapVal;
    },
    newToken(){
      if(!confirm("Möchtest du wirklich einen neuen token generieren und den alten ungültig machen?")){return;}
      this.token = this.createToken();
      let dbRef = firebase.database().ref("users/"+this.user.uid+"");
      dbRef.update({"secret": this.token});
    },
    createToken(){
      return randtoken.generate(Math.pow(2,10));
    },
    updateUser(user){
      if(user) {
        this.user = user;
        let dbRef = firebase.database().ref("users/"+this.user.uid+"/secret");
        dbRef.on('value', this.getToken)
      } else {
        this.user = {};
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters["user/get"];
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-wrapper {
    max-width: 700px;
    padding: 32px;
    margin: 2rem auto;
    color: #333;
    text-align: center;
    border-radius: 8px;
  }

  .token {
    width: 90%;
    height: 5.5rem;
    padding: 0.5rem;
    margin: 0 auto;
    overflow: hidden;
    word-wrap: initial;
    white-space: nowrap;
    resize: none;
    background: transparent;
    border: 1px solid #fff;
    outline: none;
  }

  button {
    padding: 1rem;
    margin: 1rem;
    color: #fff;
    background: #dd045f;
    border: none;
    border-radius: 5px;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.5);
      transform: translate(-2px, -4px);
    }
  }
</style>
