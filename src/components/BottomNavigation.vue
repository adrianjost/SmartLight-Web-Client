<template>
  <nav :class="{ bar: true, 'has-fab':fab.icon }">

    <div v-if="fab.icon" class="fab-wrapper" @click="sendEvent(fab.event)">
      <fab class="fab" :icon="fab.icon"/>
    </div>

    <ul class="container">
      <template v-for="action in actions">
        <li
          class="contents"
          :key="(action.to || action.event) + action.icon"
        >
          <router-link
            v-if="action.to"
            :to="action.to"
            :class="{'nav-item': true, 'active': action.active}"
            v-ripple
          >
            <i class="material-icons">{{action.icon}}</i>
            <span v-if="action.name" class="name">{{action.name}}</span>
          </router-link>

          <button
            v-else
            @click="sendEvent(action.event)"
            :class="{'nav-item': true, 'active': action.active}"
            v-ripple
          >
            <i class="material-icons">{{action.icon}}</i>
            <span v-if="action.name" class="name">{{action.name}}</span>
          </button>
        </li>

      </template>
    </ul>
  </nav>
</template>

<script>
import fabComponent from '@/components/fab.vue'
// TODO: fork vue-fab and allow positioning & text-color
//import fab from 'vue-fab'

export default {
  name:"BottomNavigation",
  components: {
    fab: fabComponent
  },
  props: {
    fab: {
      type: Object,
      default: function () {
        return {};
      },
      validator: function (value) {
        const isAction = value.event || value.to
        const actionsList = value.actions || [];
        const validActions = actionsList.every((action) => {
          return action.icon && (action.event || action.to);
        })
        // TODO disallow isAction and actionList at the same time
        return value.icon && (isAction || (actionsList.length > 0 && validActions));
      }
    },
    actions: {
      type: Array,
      default: function () {
        return [];
      },
      validator: function (value) {
        return value.length === 2 || value.length === 4
          && value.every(action => {
              return action.icon && (action.to || action.event);
            })
          && value.some(action => {
            return action.active
          });
      }
    },
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
	bottom: 0;
	left: 0;
	position: fixed;
	user-select: none;
	width: 100%;
	z-index: 9999;
	background: var(--color-overlay);
	&.has-fab{
		$circle-radius: (56px + 16px) / 2;
		background-repeat: no-repeat;
		background-size: 50.01% 100%; // the .01% fixes the gap between both gradients (seems like a chrome rendering bug)
		background:
			radial-gradient(circle at top right, transparent $circle-radius, var(--color-overlay) 0) top left,
			radial-gradient(circle at top left, transparent $circle-radius, var(--color-overlay) 0) top right;
	}
}

.container {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-evenly;
}

.nav-item {
	align-items: center;
	background: transparent;
	border: 0;
	color: var(--color-text-inactive);
	cursor: pointer;
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	font-size: 12px;
	height: 56px;
	justify-content: center;
	line-height: 12px;
	max-width: 168px;
	min-width: 80px;
	padding: 12px 8px 12px 12px;
	text-align: center;
	text-decoration: none;

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
	left: 50%;
	position: absolute;
	top: 0;
	transform: translate(-50%, -50%);
	z-index: 99999;
}
</style>