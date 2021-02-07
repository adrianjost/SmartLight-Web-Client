<template>
	<nav :class="{ bar: true, 'has-fab': fab.icon }">
		<div v-if="fab.icon" class="fab-wrapper" @click="sendEvent(fab.event)">
			<Fab class="fab" :icon="fab.icon" />
		</div>

		<ul class="container">
			<li
				v-for="action in actions"
				:key="(action.to || action.event) + action.icon"
				class="contents"
			>
				<RouterLink
					v-if="action.to"
					v-ripple
					:to="action.to"
					:class="{ 'nav-item': true, active: action.active }"
				>
					<i class="material-icons">{{ action.icon }}</i>
					<span v-if="action.name" class="name">{{ action.name }}</span>
				</RouterLink>

				<button
					v-else
					v-ripple
					:class="{ 'nav-item': true, active: action.active }"
					@click="sendEvent(action.event)"
				>
					<i class="material-icons">{{ action.icon }}</i>
					<span v-if="action.name" class="name">{{ action.name }}</span>
				</button>
			</li>
		</ul>
	</nav>
</template>

<script>
import fabComponent from "@/components/fab.vue";
// TODO [#59]: fork vue-fab and allow positioning & text-color
//import fab from 'vue-fab'

export default {
	name: "BottomNavigation",
	components: {
		Fab: fabComponent,
	},
	props: {
		fab: {
			type: Object,
			default: function () {
				return {};
			},
			validator: function (value) {
				if (!Object.keys(value).length) {
					return true;
				}
				const isAction = value.event || value.to;
				const actionsList = value.actions || [];
				const validActions = actionsList.every((action) => {
					return action.icon && (action.event || action.to);
				});
				// TODO disallow isAction and actionList at the same time
				return (
					value.icon && (isAction || (actionsList.length > 0 && validActions))
				);
			},
		},
		actions: {
			type: Array,
			default: function () {
				return [];
			},
			validator: function (value) {
				return (
					value.length === 2 ||
					(value.length === 4 &&
						value.every((action) => {
							return action.icon && (action.to || action.event);
						}) &&
						value.some((action) => {
							return action.active;
						}))
				);
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
	bottom: 0;
	left: 0;
	z-index: 9999;
	width: 100%;
	user-select: none;
	background-color: var(--color-overlay);
	&.has-fab {
		$circle-radius: (56px + 16px) / 2;
		background-color: transparent;
		background-image: radial-gradient(
				circle at top right,
				transparent $circle-radius,
				var(--color-overlay) 0
			),
			radial-gradient(
				circle at top left,
				transparent $circle-radius,
				var(--color-overlay) 0
			);
		background-repeat: no-repeat;
		background-position: top left, top right;
		background-size: 50.01% 100%; // the .01% fixes the gap between both gradients (seems like a chrome rendering bug)
	}
}

.container {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-evenly;
}

.nav-item {
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	min-width: 80px;
	max-width: 168px;
	height: 56px;
	padding: 12px 8px 12px 12px;
	font-size: 12px;
	line-height: 12px;
	color: var(--color-text-inactive);
	text-align: center;
	text-decoration: none;
	cursor: pointer;
	background: transparent;
	border: 0;

	.material-icons {
		width: 100%;
	}

	&:hover,
	&:focus {
		color: var(--color-text);
	}

	&.active {
		color: var(--color-text-active);
	}
}

.fab-wrapper {
	position: absolute;
	top: 0;
	left: 50%;
	z-index: 99999;
	transform: translate(-50%, -50%);
}
</style>
