<template>
  <div 
    class="control-unit"
    :style="{ 'background-color': data.current.color }"
  >
    <router-link class="link" :to="'/control/'+ data.id">
      <i class="material-icons">{{data.icon}}</i>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      validator: function (value) {
        return value.icon && value.id
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.control-unit{
  position: relative;
  display: inline-block;
  border-radius: 50%;
  width: 128px;
  height: 128px;
  border: 1px solid var(--color-border);
  &:before{
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    background-color: rgba(255,255,255,.5);
  }
}
.link{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.material-icons{
  background: var(--color-overlay-i);
  color: var(--color-text-active-i);
  font-size: 28px;
  padding: 12px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}
</style>