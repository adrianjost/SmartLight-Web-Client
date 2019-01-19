<template>
	<header class="bar">
		<div class="container">
			<!-- BACK BUTTON -->
			<template v-if="backAction">
				<RouterLink
					v-if="backAction.to"
					v-ripple
					:to="backAction.to"
					class="navigation_back"
				>
					<i class="material-icons">
						{{ backAction.icon }}
					</i>
					<img
						v-if="backAction && backAction.src"
						:src="backAction.src"
						:alt="backAction.alt"
						class="avatar"
					>
				</RouterLink>

				<button
					v-if="backAction.event"
					v-ripple
					class="navigation_back"
					@click="sendEvent(backAction.event)"
				>
					<i class="material-icons">
						{{ backAction.icon }}
					</i>
					<img
						v-if="backAction && backAction.src"
						:src="backAction.src"
						:alt="backAction.alt"
						class="avatar"
					>
				</button>
			</template>


			<!-- PAGE TITLE -->
			<h6
				class="page_title"
				@click="sendEvent(title.event)"
			>
				{{ title.text }}
			</h6>

			<!-- ACTIONS -->
			<template v-for="action in actions">
				<RouterLink
					v-if="action.to"
					:key="action.to + action.icon"
					v-ripple
					tag="button"
					:to="action.to"
					class="action"
				>
					<i class="material-icons">
						{{ action.icon }}
					</i>
				</RouterLink>

				<button
					v-if="action.event"
					:key="action.event + action.icon"
					v-ripple
					class="action"
					@click="sendEvent(action.event)"
				>
					<i class="material-icons">
						{{ action.icon }}
					</i>
				</button>
			</template>

			<!-- USER AVATAR -->
			<img
				v-if="userAvatar && userAvatar.src"
				:src="userAvatar.src"
				:alt="userAvatar.alt"
				class="avatar"
				@click="sendEvent(userAvatar.event)"
			>
		</div>
	</header>
</template>

<script>

/*
EXAMPLE CONFIG

backAction: {
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
		backAction: {
			type: Object,
			default: () => {},
			validator: function (value) {
				return value.icon || (value.src && value.alt)
			}
		},
		title: {
			type: Object,
			required: true,
			validator: function (value) {
				return typeof value.text === "string";
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
		userAvatar: {
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
	background: var(--color-overlay);
	height: 56px;
	left: 0;
	position: fixed;
	top: 0;
	user-select: none;
	width: 100%;
	z-index: 9999;
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
	align-items: center;
	border-radius: 20px;
	display: flex;
	height: 40px;
	justify-content: center;
	margin-right: 8px;
	min-width: 40px;
	text-decoration: none;
}

.page_title {
	flex: 1;
	font-size: 20px;
	font-weight: 500;
	line-height: 20px;
	margin: 0;
	padding: 8px;
}

.avatar {
	border-radius: 20px;
	height: 40px;
	margin: 0 12px;
	width: 40px;

	&:last-of-type {
		margin-right: 0;
	}
}

.action {
	border-radius: 20px;
	color: var(--color-text-active);
	cursor: pointer;
	height: 40px;
	margin: 0 4px;
	padding: 8px;
	position: relative;
	width: 40px;

	&:last-of-type {
		margin-right: 0;
	}
}
</style>