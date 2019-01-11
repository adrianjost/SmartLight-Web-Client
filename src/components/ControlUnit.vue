<template>
  <div
    class="control-unit"
    :style="{ 'background': data.background }"
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
.control-unit {
  position: relative;
  display: inline-block;
  width: 128px;
  height: 128px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
}

.link {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.material-icons {
  padding: 12px;
  font-size: 28px;
  color: var(--color-text-active-i);
  background: var(--color-overlay-i);
  border: 1px solid var(--color-border);
  border-radius: 50%;
}
</style>