<template>
  <ul class="lamps">
    <li
      v-for="lamp in lamps"
      :key="lamp.id"
      @click="toggle(lamp.id)"
      :class="{
        lamp: true,
        checked: value.includes(lamp.id)
      }"
    >
      <i class="material-icons">{{lamp.icon}}</i>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    lamps: {
      type: Array,
      required: true,
      validator: function (value) {
        return value.every((state) => {
          return typeof state.id !== undefined;
        })
      }
    },
    value: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggle(lampId){
      const index = this.value.indexOf(lampId);
      if(index >= 0){
        // delete from list
        let newValue = [...this.value]
        newValue.splice(index, 1)
        this.$emit("input", newValue);
      }else{
        // add to list
        this.$emit("input", [...this.value, lampId]);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lamps{
  padding: 8px;
  text-align: left;
  font-size: 0;
  user-select: none;
}
.lamp{
  position: relative;
  display: inline-block;
  border: 1px solid var(--color-border);
  list-style: none;
  border-radius: 50%;
  padding: 16px;
  margin: 0 4px;
  color: var(--color-text-active-i);

  transition: all .2s ease-in-out;
  &:before{
    transition: all .15s ease-in-out .15s;
    content: "check";
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -4px;
    right: -4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    background: #34A853;
    opacity: 0;

    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 16px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }
  &.checked {
    background: var(--color-overlay-i);
    &:before{
      opacity: 1;
    }
  }
}
</style>