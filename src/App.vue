<template>
  <div id="app" class="background" :style="{'--background-image': 'url('+backgroundurl+')'}">
    <toolbar v-if="isAuthenticated"/>
    <main class="content-wrapper">
      <router-view ></router-view>
    </main>
    <portal-target name="dialog-container" />
  </div>
</template>

<script>
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
  methods: {
    redirectOnAuthStateChange(isAuthenticated) {
      if(isAuthenticated && this.$route.query.redirect){
        this.$router.push(this.$route.query.redirect);
      }else if(!isAuthenticated && this.$route.path !== '/login'){
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath,
          },
        });
      }
    }
  },
  created() {
    this.redirectOnAuthStateChange(this.isAuthenticated);
  },
  mounted(){
    //this.backgroundurl = `https://source.unsplash.com/${window.screen.width}x${window.screen.height}/?Light`;
  },
  watch: {
    isAuthenticated: function(to, from){
      this.redirectOnAuthStateChange(to);
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters["user/isAuthenticated"];
    }
  }
}
</script>
<style lang="scss">
  @import "./helpers/base";
</style>
<style scoped>
  #app{
    position: relative;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
  .background{
    position: relative;
  }
  .background:after{
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: var(--background-image);
  }
  .content-wrapper{
    padding: 8px;
    margin: 16px auto;
    max-width: 750px;
  }
</style>
