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
					/>
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
					/>
				</button>
			</template>

			<!-- PAGE TITLE -->
			<h6 class="page_title" @click="sendEvent(title.event)">
				{{ title.text }}
			</h6>

			<!-- ACTIONS -->
			<template v-for="action in actions">
				<RouterLink
					v-if="action.to"
					:key="action.to + action.icon"
					v-slot="{ navigate }"
					:to="action.to"
					custom
				>
					<button v-ripple class="action" @click="navigate">
						<i class="material-icons">
							{{ action.icon }}
						</i>
					</button>
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
			/>
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
				return value.icon || (value.src && value.alt);
			},
		},
		title: {
			type: Object,
			required: true,
			validator: function (value) {
				return typeof value.text === "string";
			},
		},
		actions: {
			type: Array,
			default: () => [],
			validator: function (value) {
				return value.every((action) => {
					return action.icon && (action.event || action.to);
				});
			},
		},
		userAvatar: {
			type: Object,
			default: () => {},
			validator: function (value) {
				return value.src && value.alt;
			},
		},
	},
	methods: {
		sendEvent(eventName) {
			if (eventName) {
				this.$emit("action", eventName);
			}
		},
	},
};
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
	align-items: center;
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
