<template>
  <div id="app">
    <app-bar-top
      v-if="appBarTop.visible"
      :back_action="appBarTop.back_action"
      :title="appBarTop.title"
      :actions="appBarTop.actions"
      :user_avatar="appBarTop.user_avatar"
      @action="handleAction"
    />
    <main class="container">
      <router-view ></router-view>
    </main>
    <bottom-navigation
      v-if="bottomNav.visible"
      :fab="bottomNav.fab"
      :actions="bottomNav.actions"
      @action="handleAction"
    />
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation.vue'
import AppBarTop from '@/components/AppBarTop.vue'

export default {
  name: 'app',
  components: {
    AppBarTop,
    BottomNavigation
  },
  data(){
    return {
      appBarTop: {
        visible: true,
        back_action: {
          icon: "arrow_back",
          src: "https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=40&name=TV",
          to: "/",
          event: "back"
        },
        title: {
          text: "Page Title"
        },
        actions: [
          {
            icon: "power_off",
            event: "power_off"
          },
          {
            icon: "delete",
            event: "delete"
          }
        ],
        user_avatar: {
          src: "http://i.pravatar.cc/48?img=60",
          event: "logout"
        },
      },
      bottomNav: {
        visible: true,
        fab: {
          icon: "add",
          event: "add",
          actions: [

          ],
        },
        actions: [
          {
            icon: "settings_remote",
            name: "Control",
            to: "/control",
            active: true
          },
          {
            icon: "settings",
            name: "Settings",
            to: "/settings"
          },
        ]
      }
    }
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
    },
    handleAction(event){
      console.log("parent event:", event);
    }
  },
  created() {
    this.redirectOnAuthStateChange(this.isAuthenticated);
  },
  watch: {
    isAuthenticated: function(to, from){
      this.redirectOnAuthStateChange(to);
    },
    '$route': function(to){
      this.bottomNav.actions = this.bottomNav.actions.map((action) => {
        action.active = to.path.includes(action.to);
        return action;
      })
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
  @import "./styles/base";
</style>
