<template>
  <header class="bar">
    <div class="container">

      <!-- BACK BUTTON -->
      <template v-if="back_action">
        <router-link v-if="back_action.to"
          :to="back_action.to" class="navigation_back" v-ripple>
          <i class="material-icons">{{back_action.icon}}</i>
          <img v-if="back_action && back_action.src" :src="back_action.src" :alt="back_action.alt" class="avatar">
        </router-link>

        <button v-if="back_action.event"
          @click="sendEvent(back_action.event)" class="navigation_back" v-ripple
        >
          <i class="material-icons">{{back_action.icon}}</i>
          <img v-if="back_action && back_action.src" :src="back_action.src" :alt="back_action.alt" class="avatar">
        </button>
      </template>


      <!-- PAGE TITLE -->
      <h6 @click="sendEvent(title.event)" class="page_title">
        {{title.text}}
      </h6>

      <!-- ACTIONS -->
      <template v-for="action in actions">
        <router-link
          tag="button"
          v-if="action.to"
          :key="action.to + action.icon"
          :to="action.to"
          class="action" v-ripple
        >
          <i class="material-icons">{{action.icon}}</i>
        </router-link>

        <button
          v-if="action.event"
          :key="action.event + action.icon"
          @click="sendEvent(action.event)"
          class="action" v-ripple
        >
          <i class="material-icons">{{action.icon}}</i>
        </button>
      </template>

      <!-- USER AVATAR -->
      <img v-if="user_avatar && user_avatar.src"
        @click="sendEvent(user_avatar.event)"
        :src="user_avatar.src" :alt="user_avatar.alt" class="avatar">

    </div>
  </header>
</template>

<script>

/*
EXAMPLE CONFIG

back_action: {
  icon: "arrow_back",
  src: "https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=40&name=TV",
  to: "/",  // you have to decide wheather you wan't a router-link or an event triggered
  // event: "back"
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
*/
export default {
  name: "AppBarTop",
  props: {
    back_action: {
      type: Object,
      default: () => {},
      validator: function (value) {
        return value.icon || (value.src && value.alt)
      }
    },
    title: {
      type: Object,
      default: () => { text: "" },
      required: true,
      validator: function (value) {
        return value.text;
      }
    },
    actions: {
      type: Array,
      default: () => [],
      validator: function (value) {
        return value.every((action) => {
          return action.icon && (action.event ||action.to);
        });
      }
    },
    user_avatar: {
      type: Object,
      default: () => {},
      validator: function (value) {
        return value.src && value.alt;
      }
    }
  },
  methods: {
    sendEvent(eventName){
      if(eventName){
        this.$emit('action', eventName);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.bar {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	width: 100%;
	height: 56px;
	user-select: none;
	background: var(--color-overlay);
}

.container {
	display: flex;
	flex-wrap: nowrap;
	padding: 8px;
}

a,
button {
	color: var(--color-text-active);
}

.navigation_back {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 40px;
	height: 40px;
	margin-right: 8px;
	text-decoration: none;
	border-radius: 20px;
}

.page_title {
	flex: 1;
	padding: 8px;
	margin: 0;
	font-size: 20px;
	font-weight: 500;
	line-height: 20px;
}

.avatar {
	width: 40px;
	height: 40px;
	margin: 0 12px;
	border-radius: 20px;

	&:last-of-type {
		margin-right: 0;
	}
}

.action {
	position: relative;
	width: 40px;
	height: 40px;
	padding: 8px;
	margin: 0 4px;
	color: var(--color-text-active);
	cursor: pointer;
	border-radius: 20px;

	&:last-of-type {
		margin-right: 0;
	}
}
</style>