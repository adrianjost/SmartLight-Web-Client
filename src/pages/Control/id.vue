<template>
  <section class="control">
    <div class="tab-nav">
      <div v-for="tab in tabNames"
        :key="tab"
        @click="activeTab = tab"
        :class="{
          tab: true,
          active: (activeTab == tab)
        }">
        {{tab}}
      </div>
    </div>
    <choose-color
      v-if="activeTab == 'Color'"
      :unit="unit"
    />
    <choose-gradient
      v-if="activeTab == 'Gradient'"
      :unit="unit"
    />
  </section>
</template>

<script>
import chooseColor from "./components/chooseColor"
import chooseGradient from "./components/chooseGradient"

import { UIStateNestedDefault } from '@/helpers/ui-states.js';

export default {
  name: "control-detail",
  components: {
    chooseColor,
    chooseGradient
  },
  data(){
    return {
      tabNames: ["Color", "Gradient"],
      activeTab: "Gradient", // TODO switch to "Color"
    }
  },
  created(){
    this.$store.commit("ui/set", {
      component: "appBarTop",
      payload: Object.assign(UIStateNestedDefault.appBarTop(this.unit.name), {
        back_action: {
          event: "go-back",
          icon: "arrow_back"
        },
        actions: [
          {
            icon: "edit",
            to: `/settings/${this.unit.id}`
          }
        ]
      })
    });
    this.$store.commit("ui/patch", {
      component: "bottomNav",
      payload: Object.assign(UIStateNestedDefault.bottomNav(0), {
        fab: {
          icon: "check",
          event: "apply"
        }
      })
    });

    this.$eventHub.$on('go-back', this.goBack );
    this.$eventHub.$on('applied', this.goBack );
  },
  beforeDestroy(){
    this.$eventHub.$off('go-back', this.goBack);
    this.$eventHub.$off('applied', this.goBack );
  },
  methods: {
    goBack(){
      console.log("go back");
      this.$router.go(-1);
    },
  },
  computed: {
    unit () {
      return this.$store.getters["units/get"](this.$route.params.id) || {};
    },
  }
};
</script>

<style lang="scss" scoped>
.control{
  text-align: center;
}
.tab-nav{
  display: flex;
  margin: 16px auto;
  max-width: 250px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0;
  user-select: none;
  .tab{
    flex: 1;
    font-size: 16px;
    line-height: 16px;
    display: inline-block;
    cursor: pointer;
    padding: 8px;
    text-align: center;
    &.active{
      background-color: var(--color-overlay);
    }
  }
}
</style>
<style lang="scss">
.toast-dot{
  display: inline-block;
  vertical-align: bottom;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 4px;
}
</style>