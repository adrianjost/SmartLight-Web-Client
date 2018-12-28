<template>
  <div>
    <div class="item-wrapper">
      <controlUnit
        v-for="obj in lamps"
        :key="obj.id"
        :object="obj"
        class="item card"
      />

      <router-link
        class="item card"
        id="add"
        to="/add">
        <i class="icon material-icons">
          add
        </i>
      </router-link>
    </div>
  </div>
</template>

<script>
// COMPONENTS
import controlUnit from "./controlUnit.vue";

// MIXINS
import hub from "@/mixins/hub.js";

export default {
  components: {
    controlUnit
  },
  // mixins: [ hub ], // TODO: fix hub
  computed: {
    lamps () {
      return this.$store.getters["lamps/list"];
    },
  }
};
</script>
<style lang="scss" scoped>
.item-wrapper{
  margin: -8px;
  font-size: 0;
  line-height: 0;
  // 600px, 900px, 1200px, and 1800px
  .item{
    position: relative;
    display: inline-block;
    margin: 8px;
    width: calc(100% - 16px);
    padding-bottom: calc(100% - 16px);
    @for $i from 1 through 3{
      @media screen and (min-width: #{300 * $i}px) {
        width: calc(100% / #{$i + 1} - 16px);
        padding-bottom: calc(100% / #{$i + 1} - 16px);
      }
    }
    &#add{
      i.icon{
        color: inherit;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
      }
    }
  }
}
</style>
