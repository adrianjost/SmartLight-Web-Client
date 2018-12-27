<template>
  <div id="app" class="wrapper" :style="{'--background-image': 'url('+backgroundurl+')'}">
    <main>
      <toolbar v-if="isAuthenticated"/>
      <router-view></router-view>
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
  mounted(){
    //this.backgroundurl = `https://source.unsplash.com/${window.screen.width}x${window.screen.height}/?Light`;
  },
  watch: {
    isAuthenticated: function(to, from){
      if(to){
        this.$router.push('/');
      }
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
