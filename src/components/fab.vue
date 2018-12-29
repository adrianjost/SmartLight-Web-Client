<template>
  <div class="fab" v-ripple>
    <i class="material-icons">{{icon}}</i>
  </div>
</template>

<script>
/*
DON'T USE THIS
replace this code with a fork of vue-fab that enables the missing features
*/
export default {
  name:"fab",
  props: ["icon"]
}
</script>

<style lang="scss" scoped>
.fab{
  background-color: #fff;
  border-radius: 50%;

  width: 56px;
  height: 56px;

  color: var(--color-background);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  line-height: 14px;
  cursor: pointer;

  box-shadow: 0 6px 6px rgba(0,0,0,.24);
  &:hover{
    box-shadow: 0 12px 12px rgba(0,0,0,.26);
  }
}
</style>