<template>
  <div class="toolbar acrylic">
    <div class="title">SmartLight <span>🔥 Firebase 🔥</span></div>
    <div class="user" @click="logOut">
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
    &:after{
      background-color: rgba(205, 220, 57, .6);
    }
    .title{
      font-size: 2rem;
      span{
        font-size: 1rem;
        text-color: #999;
      }
    }
    .user{
      .username{
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 2rem;
        vertical-align: middle;
        text-shadow: 1px 1px 5px rgba(255,255,255,.75);
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
