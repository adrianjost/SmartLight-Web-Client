<template>
  <h1>/settings</h1>
</template>

<script>
  export default {
    created(){
      this.$store.commit("ui/set", {
        component: "appBarTop",
        payload: {
          visible: true,
          title: {
            text: "Settings"
          },
          user_avatar: {
            src: this.user.photoURL,
            alt: "user avatar",
            event: "logout"
          },
        }
      });
      this.$store.commit("ui/set", {
        component: "bottomNav",
        payload: {
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
              to: "/control"
            },
            {
              icon: "settings",
              name: "Settings",
              to: "/settings",
              active: true
            },
          ]
        }
      });
    },
    computed: {
      user () {
        return this.$store.getters["user/get"];
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>