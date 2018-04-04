<template>
  <div class="toolbar">
    <div class="title">SmartLight <span>🔥 Firebase 🔥</span></div>
    <div class="user" @click="logOut" v-if="userInfo">
      <span class="username">{{userInfo.displayName}}</span>
      <img class="avatar" :src="userInfo.photoURL">
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: "toolbar",
  props: ['userInfo'],
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
  }
}
</script>

<style lang="scss" scoped>
  .toolbar{
    padding: .5rem;
    font-size: 1.5rem;
    line-height: 2rem;
    vertical-align: middle;
    display: flex;
    justify-content: space-between;
    background-color: rgba(0,0,0,.5);
    color: #fff;
    box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
    .title{
      font-size: 2rem;
      span{
        font-size: 1rem;
        color: #ccc;
        @media screen and (max-width: 450px) {
          display: none
        }
      }
    }
    .user{
      .username{
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 2rem;
        vertical-align: middle;
        text-shadow: 1px 1px 5px rgba(0,0,0,.75);
        @media screen and (max-width: 340px) {
          display: none
        }
      }
      .avatar{
        margin-left: 8px;
        height: 2rem;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
</style>
