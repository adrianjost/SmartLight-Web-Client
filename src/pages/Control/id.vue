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
    <div v-if="activeTab == 'Color'" >
      <saved-state-picker
        :data="[{background:'#f00', id: 0}, {background:'#55a', id: 1}, {background:'#5a9', id: 2}, {background:'#e9a', id: 3}, {background:'#7f0', id: 4},  {background:'#ca3', id: 5}]"
        event="loadColor"
        @loadColor="log"
      />
      <color-picker
        class="color-picker"
        v-model="color"
        :config="{
          width: 250,
          height: 300,
          sliderMargin: 16,
          markerRadius: 10
        }"
      />
    </div>
    <div v-if="activeTab == 'Gradient'" >
      Gradient
    </div>
  </section>
</template>

<script>
import savedStatePicker from "@/components/picker/savedStatePicker"
import colorPicker from "@/components/picker/colorPicker"

import { UIStateNestedDefault } from '@/helpers/ui-states.js';
import { EventBus } from '@/helpers/event-bus.js';

export default {
  name: "control-detail",
  components: {
    savedStatePicker,
    colorPicker
  },
  data(){
    return {
      tabNames: ["Color", "Gradient"],
      activeTab: "Color",
      color: "#ff5577"
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
    },
    log(data){
      console.log(data);
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
.color-picker{
  transform: rotate(-90deg);
}
</style>