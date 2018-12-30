<template>
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
</template>

<script>
import { UIStateNestedDefault } from '@/helpers/ui-states.js';
import { EventBus } from '@/helpers/event-bus.js';

export default {
  name: "control-detail",
  data(){
    return {
      tabNames: ["Color", "Gradient"],
      activeTab: "Color"
    }
  },
  created(){
    this.$store.commit("ui/set", {
      component: "appBarTop",
      payload: Object.assign(UIStateNestedDefault.appBarTop(this.lamp.name), {
        back_action: {
          to: "/control",
          icon: "arrow_back"
        },
        actions: [
          {
            icon: "edit",
            to: `/settings/${this.lamp.id}`
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

    this.$eventHub.$on('apply', this.apply);
  },
  beforeDestroy(){
    this.$eventHub.$off('apply');
  },
  methods: {
    apply(){
      // TODO: save new state
      console.log("apply state");
      this.$router.push("/control");
    }
  },
  computed: {
    lamp () {
      return this.$store.getters["lamps/get"](this.$route.params.id);
    },
  }
};
</script>

<style lang="scss" scoped>
.tab-nav{
  display: flex;
  margin: 16px auto;
  max-width: 250px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0;
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
    /*
    $border-radius: 4px;
    &:first-of-type{
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }
    &:last-of-type{
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
    */
  }
}
</style>