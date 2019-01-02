<template>
  <simplebar class="state-list" tag="ul">
    <ul class="contents">
      <li
        v-for="state in data"
        :key="state.id"
        :style="{background: state.background}"
        @click="sendEvent(event, state.id)"
        @contextmenu.prevent="sendEvent(contextEvent, state.id)"
        class="state"
      >
      </li>

      <li class="state add" @click="sendEvent(addEvent)">
        <i class="material-icons">add</i>
      </li>
    </ul>
  </simplebar>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';

export default {
  components: {
    simplebar
  },
  props: {
    data: {
      type: Array,
      required: true,
      validator: function (value) {
        return value.every((state) => {
          return (typeof state.id !== undefined) && state.background;
        })
      }
    },
    event: {
      type: String,
      default: "state-picked"
    },
    addEvent: {
      type: String,
      default: "state-add"
    },
    contextEvent: {
      type: String,
      default: "state-context"
    },
  },
  methods: {
    sendEvent(event, data){
      this.$emit(event, data);
    }
  }
}
</script>

<style lang="scss" scoped>
.state-list{
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 8px;
  margin: 8px auto;
  max-width: 300px;
  overflow-x: auto;
  white-space: nowrap;
  text-align: left;
  font-size: 0;
  user-select: none;
}
.state{
  position: relative;
  display: inline-block;
  border: 1px solid var(--color-border);
  list-style: none;
  border-radius: 50%;
  padding: 20px;
  margin: 0 4px;
  color: var(--color-text-active-i);
  &:first-of-type{
    margin-left: 0;
  }
  &:last-of-type{
    margin-right: 0;
  }
  &.add {
    border-width: 2px;
    .material-icons{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>