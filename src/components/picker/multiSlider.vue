<template>
	<div
		class="multi-slider"
		:style="{ background: background }"
		@mousedown.prevent="start"
		@touchstart.prevent="start"
	>
		<GlobalEvents
			@mousemove="move"
			@touchmove="move"
			@mouseup="end"
			@touchend="end"
		/>
		<div ref="markers" class="markers">
			<div
				v-for="(marker, index) in markers"
				:key="index"
				:style="{ left: marker.position + '%', background: marker.color }"
				:class="{ marker: true, active: marker.active }"
				:data-index="index"
				tabindex="0"
				@contextmenu.prevent="remove(index)"
			/>
		</div>
	</div>
</template>

<script>
import GlobalEvents from "vue-global-events";

export default {
	components: { GlobalEvents },
	props: {
		color: {
			type: String,
			required: true,
		},
		gradient: {
			type: Array,
			default: function() {
				return [
					{ position: 0, color: "#c8ff00" },
					{ position: 100, color: "#ff00bb" },
				];
			},
			validator: function(value) {
				return (
					value.length >= 2 &&
					value.every((marker) => {
						return marker.position >= 0 && marker.color;
					})
				);
			},
		},
	},
	data() {
		return {
			markers: [],
		};
	},
	animation: {
		target: undefined,
		animationFrame: undefined,
	},
	computed: {
		background() {
			const sortedMarkers = this.markers.slice(0).sort((a, b) => {
				return a.position - b.position;
			});
			return `linear-gradient(90deg,${sortedMarkers
				.map((marker) => {
					return `${marker.color} ${marker.position}%`;
				})
				.join(",")})`;
		},
		activeIndex() {
			return this.markers.findIndex((marker) => {
				return marker.active;
			});
		},
	},
	watch: {
		gradient: {
			handler: function(to, from) {
				if (to === from) {
					return;
				}
				this.importGradient(to);
			},
			deep: true,
		},
		color: function(to) {
			this.updateColor(to);
		},
	},
	created() {
		this.importGradient(this.gradient);
		this.$emit("update:gradient", this.markers);
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
	},
	methods: {
		importGradient(to) {
			if (to.length == 0) {
				return;
			}
			to.sort((a, b) => {
				return a.position - b.position;
			});
			to[0].fixed = true;
			to[to.length - 1].fixed = true;

			this.markers = to;
			if (!this.hasActiveMarker()) {
				this.makeActive(0);
			}
		},
		updateColor(color) {
			this.markers[this.activeIndex].color = color;
		},
		hasActiveMarker() {
			return this.markers.some((marker) => {
				return marker.active;
			});
		},
		makeActive(index) {
			this.markers = this.markers.map((marker, markerIndex) => {
				marker.active = index == markerIndex;
				if (marker.active) {
					this.$emit("update:color", marker.color);
				}
				return marker;
			});
		},
		remove(index) {
			if (index === 0 || index === this.markers.length - 1) {
				return;
			}
			this.markers.splice(index, 1);
			this.makeActive(index);
		},
		cleanupMarkers() {
			// TODO update color of fixed sliders from non fixed at same position
			let markers = this.markers.sort((a, b) => {
				return a.position - b.position;
			});
			const activeMarker = markers.find((marker) => marker.active);
			// remove duplicate markers at start/end and replace them with currently active one
			markers = markers.filter((marker) => {
				return marker.position != activeMarker.position || marker.active;
			});

			// first & last marker must be fixed
			markers[0].fixed = true;
			markers[markers.length - 1].fixed = true;

			this.markers = markers;
			this.$emit("update:gradient", this.markers);
		},
		resize() {
			if (!this.$refs.markers) {
				return;
			}
			const boundingBox = this.$refs.markers.getBoundingClientRect();
			this.$options.animation.minX = boundingBox.left;
			this.$options.animation.maxX = boundingBox.right;
		},
		_getEventPosition(event) {
			return event.x || event.changedTouches[0].clientX;
		},
		getRelativeEventPosition(event) {
			const min = this.$options.animation.minX;
			const max = this.$options.animation.maxX;
			const newX = Math.min(Math.max(min, this._getEventPosition(event)), max);
			return ((newX - min) / (max - min)) * 100;
		},
		addMarker(event) {
			if (!event.target.classList.contains("multi-slider")) {
				return;
			}
			event.preventDefault();
			const newMarkerLength = this.markers.push({
				position: this.getRelativeEventPosition(event),
				color: this.markers[this.activeIndex].color,
			});
			this.makeActive(newMarkerLength - 1);
			this.cleanupMarkers();
		},
		start(event) {
			if (
				this.$options.animation.index ||
				!event.target.classList.contains("marker")
			) {
				return;
			}
			event.preventDefault();
			const markerIndex = event.target.dataset.index;
			this.makeActive(markerIndex);
			this.$options.animation.index = markerIndex;
			if (this.markers[markerIndex].fixed) {
				return;
			}
		},
		move(event) {
			event.preventDefault();
			if (
				!this.$options.animation.index ||
				this.markers[this.$options.animation.index].fixed ||
				this.$options.animation.animationFrame
			) {
				return;
			}

			this.$options.animation.animationFrame = window.requestAnimationFrame(
				() => {
					this.markers[
						this.$options.animation.index
					].position = this.getRelativeEventPosition(event);
					this.$options.animation.animationFrame = undefined;
				}
			);
		},
		end(event) {
			if (!this.$options.animation.index) {
				return this.addMarker(event);
			}
			event.preventDefault();
			const markerIndex = this.$options.animation.index;
			this.$options.animation.index = undefined;

			if (this.markers[markerIndex].fixed) {
				return;
			}

			window.cancelAnimationFrame(this.$options.animation.animationFrame);
			this.$options.animation.animationFrame = undefined;

			this.markers[markerIndex].position = this.getRelativeEventPosition(event);
			this.cleanupMarkers();
		},
	},
};
</script>

<style lang="scss" scoped>
$height: 32px;
$borderWidth: 2px;
$activeScaleFactor: 1.5;

.multi-slider {
	max-width: 300px;
	height: $height;
	padding: 0 ($height / 2);
	margin: 16px auto;
	border-radius: $height / 2;
}

.markers {
	position: relative;
}

.marker {
	position: absolute;
	top: 0;
	display: inline-block;
	padding: ($height / 2) - $borderWidth;
	margin-left: -($height / 2);
	border: $borderWidth solid var(--color-border-i);
	border-radius: 50%;

	&.active {
		z-index: 2;
		box-shadow: 0 0 0 2px var(--color-border),
			0 0 0 2px var(--color-border) inset;
	}
}
</style>
