<template>
  <div class="icon-picker">
    <!-- list of icons taken from https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints-->
    <div id="selected-icon-container">
      <i class="material-icons" id="selected-icon">{{selection}}</i>
    </div>
    <div id="icons">
      <i :class="{'material-icons': true, selected: selection==icon}"
        v-for="icon in iconList"
        :key="icon"
        @click="iconSelected(icon)"
        @keyup.space="iconSelected(icon)"
        :tabindex="selection == icon ? '-1' : '0'">
          {{icon}}
        </i>
    </div>
  </div>
</template>

<script>
export default {
  name: "icon-picker",
  props: ['value'],
  data(){
    return {
      selection: (this.value || "lightbulb_outline"),
      iconList: ["lightbulb_outline", "highlight", "smoking_rooms", "room_service", "weekend", "wallpaper"]
    }
  },
  methods: {
    iconSelected(icon) {
      this.selection = icon;
      this.$emit('input', icon);
    }
  }
}
</script>

<style lang="scss" scoped>

#selected-icon-container {
  display: inline-block;
  i {
    font-size: 3.5em;
    margin: 5px;
    color: $color-text-light;
    background: $color-primary;
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

#icons i {
  font-size: 2em;
  display: inline-block;
  margin: 5px;
  background: #ccc;
  color: $color-text-dark;
  border-radius: 4px;
  padding: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
  &.selected{
    opacity: .3;
    cursor: default;
  }
  &:not(.selected){
    &:hover, &:focus{
      color: $color-text-light;
      background: $color-secondary;
      box-shadow: 2px 2px 8px #0009;
      transform: translate(-2px, -2px);
    }
  }
}

</style>
