<template>
  <div
    class="control-unit"
    :style="{ 'background-color': (data.state || {}).color }"
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