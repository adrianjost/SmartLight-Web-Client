<template>
  <div>
    <!-- list of icons taken from https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints-->
    <div id="selected-icon-container">
      <i class="material-icons" id="selected-icon">{{selection}}</i>
    </div>
    <div id="icons">
      <i class="material-icons"
        v-for="icon in iconList"
        @click="iconSelected(icon)">{{icon}}</i>
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
      font-size: 64px;
      margin: 5px;
      background: #ccc;
      border-radius: 4px;
      padding: 5px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);;
      transition: background 0.2s ease;
      cursor: pointer;
    }
    &:hover {
      i {
        background: #af0;
      }
      &+#icons {
        display: block;
      }
    }
  }

  #icons {
    background: #f1f1f1;
    overflow: auto;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);;
    display: none;
    &:hover {
      display: block;
    }
    i {
      display: inline-block;
      margin: 5px;
      background: #ccc;
      border-radius: 4px;
      padding: 5px;
      transition: background 0.2s ease;
      cursor: pointer;
      &:hover {
        background: #af0;
      }
    }
  }
</style>
