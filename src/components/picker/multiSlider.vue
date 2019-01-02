<template>
  <div class="multi-slider"
    :style="{ background: background }"
    @mousedown.prevent="start"
    @touchstart.prevent="start"
  >
    <GlobalEvents
      @mousemove="move"
      @touchmove="move"
      @mouseup.prevent="end"
      @touchend.prevent="end"
    />
    <div class="markers" ref="markers">
      <div
        v-for="(marker, index) in markers"
        :key="index"
        :style="{ left: marker.position + '%', background: marker.color }"
        :class="{marker: true, active: marker.active}"
        :data-index="index"
        tabindex="0"
      ></div>
    </div>
  </div>
</template>

<script>
import GlobalEvents from 'vue-global-events'

export default {
  components: { GlobalEvents },
  props: {
    color: {
      type: String
    },
    gradient: {
      type: Array,
      default: function () {
        return [
          {position: 0, color: "#0f419f"},
          {position: 100, color: "#659fff"}
        ]
      },
      validator: function (value) {
        return value.length >= 2 && value.every(marker => { return marker.position >= 0 && marker.color; });
      }
    },
  },
  data(){
    return {
      markers: []
    }
  },
  animation: {
    target: undefined,
    animationFrame: undefined,
  },
  created(){
    this.importGradient(this.gradient);
  },
  mounted(){
    const boundingBox = this.$refs.markers.getBoundingClientRect();
    this.$options.animation.minX = boundingBox.left;
    this.$options.animation.maxX = boundingBox.right;
  },
  methods: {
    emit(){
      this.$emit("update:gradient", this.markers.map((marker) => { return {
        position: marker.position,
        color: marker.color
      }}));
    },
    importGradient(to){
      this.markers = to.map(marker => {
        if( marker.position == 0 || marker.position == 100 ){ marker.fixed = true; }
        return marker;
      })
      if(!this.hasActiveMarker()){
        this.makeActive(0);
      }
    },
    updateColor(color){
      this.markers = this.markers.map((marker) => {
        if(marker.active){
          marker.color = color;
        }
        return marker;
      })
    },
    hasActiveMarker(){
      return this.markers.some((marker) => { return marker.active});
    },
    makeActive(index){
      this.markers = this.markers.map((marker, markerIndex) => {
        marker.active = index == markerIndex;
        return marker;
      })
    },
    cleanupMarkers(){
      const activePosition = (this.markers.find((marker) => { return marker.active}) || {} ).position;

      this.markers = this.markers
        .sort((a, b) => { return a.position - b.position; })
        .filter((marker) => { return !((marker.position == 0 || marker.position == 100) && !marker.fixed); });

      if(!this.hasActiveMarker()){
        const newActiveIndex = this.markers.findIndex((marker) => { return marker.position == activePosition });
        this.markers[newActiveIndex || 0].active = true;
      }
    },
    _getEventPosition(event){
      return event.x || event.changedTouches[0].clientX;
    },
    getRelativeEventPosition(event){
      const min = this.$options.animation.minX;
      const max = this.$options.animation.maxX;
      const newX = Math.min(Math.max(min, this._getEventPosition(event)), max);
      return (newX - min) / (max - min) * 100;
    },
    addMarker(event){
      if(!event.target.classList.contains("multi-slider")){ return; }

      this.markers = this.markers.map((marker) => {
        marker.active = false;
        return marker;
      })
      this.markers.push({
        position: this.getRelativeEventPosition(event),
        color: "#fff",
        active: true
      });
      this.cleanupMarkers();
    },
    start(event){
      if(this.$options.animation.index || !event.target.classList.contains("marker")){ return; }

      const markerIndex = event.target.dataset.index;
      this.makeActive(markerIndex);
      this.$options.animation.index = markerIndex;
      if(this.markers[markerIndex].fixed){ return; }
    },
    move(event){
      if(!this.$options.animation.index || this.markers[this.$options.animation.index].fixed || this.$options.animation.animationFrame){ return; }

      this.$options.animation.animationFrame = window.requestAnimationFrame(() => {
        this.markers[this.$options.animation.index].position = this.getRelativeEventPosition(event);
        this.$options.animation.animationFrame = undefined;
      });
    },
    end(event){
      if(!this.$options.animation.index){
        return this.addMarker(event);
      }
      const markerIndex = this.$options.animation.index;
      this.$options.animation.index = undefined;

      if( this.markers[markerIndex].fixed ){ return; }

      window.cancelAnimationFrame(this.$options.animation.animationFrame);
      this.$options.animation.animationFrame = undefined;

      this.markers[markerIndex].position = this.getRelativeEventPosition(event);
      this.cleanupMarkers();
    }
  },
  computed: {
    background(){
      const sortedMarkers = this.markers.slice(0).sort((a, b) => { return a.position - b.position; });
      return `linear-gradient(90deg,${sortedMarkers.map((marker) => { return `${marker.color} ${marker.position}%`}).join(',')})`;
    },
  },
  watch: {
    "gradient": {
      handler: function(to){
        this.importGradient(to);
      },
      deep: true
    },
    "color": function(to){
      this.updateColor(to);
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 24px;
$borderWidth: 2px;
$activeScaleFactor: 1.5;

.multi-slider{
  max-width: 300px;
  height: $height;
  border-radius: $height / 2;
  margin: 16px auto;
  padding: 0 ($height / 2);
}
.markers{
  position: relative;
}
.marker{
  position: absolute;
  top: 0;
  display: inline-block;
  padding: ($height / 2) - $borderWidth;
  margin-left: -($height / 2);
  border: $borderWidth solid var(--color-border-i);
  border-radius: 50%;
  &.active{
    z-index: 2;
    box-shadow: 0 0 0 2px var(--color-border), 0 0 0 2px var(--color-border) inset;
  }
}
</style>