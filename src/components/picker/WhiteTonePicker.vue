<template>
	<!-- TODO decouple visual color value from v-model value to fade between full 255 and 0 on only 2 channels -->
	<div class="wrapper-tone-picker">
		<div
			ref="picker"
			class="tone-picker"
			:style="
				`background: linear-gradient(to right, ${colorLeft} 0%, ${colorRight} 100%);`
			"
			@mousedown.prevent="start"
			@mouseup.prevent="end"
			@mousemove.prevent="move"
			@touchstart.prevent="start"
			@touchend.prevent="end"
			@touchmove.prevent="move"
		>
			<div
				ref="marker"
				:class="{ marker: true, active: dragActive }"
				:style="{
					background: currentColor,
					left: `${x * 100}%`,
					bottom: `${y * 100}%`,
				}"
			/>
		</div>
	</div>
</template>

<script>
import colorConversion from "@/mixins/colorConversion.js";
export default {
	mixins: [colorConversion],
	props: {
		value: {
			type: String,
			required: true,
		},
		colorLeft: {
			type: String,
			default: "#fd9",
		},
		colorRight: {
			type: String,
			default: "#9df",
		},
	},
	data() {
		return {
			dragActive: false,
			x: 1,
			y: 1,
		};
	},
	animation: {
		animationFrame: undefined,
	},
	computed: {
		currentColor() {
			const cL = this.hex2rgb(this.colorLeft);
			const cR = this.hex2rgb(this.colorRight);
			let currentColor = {
				r: cL.r + (cR.r - cL.r) * this.x,
				g: cL.g + (cR.g - cL.g) * this.x,
				b: cL.b + (cR.b - cL.b) * this.x,
			};
			currentColor.r = Math.round(currentColor.r * this.y);
			currentColor.g = Math.round(currentColor.g * this.y);
			currentColor.b = Math.round(currentColor.b * this.y);
			return this.rgb2hex(currentColor);
		},
	},
	watch: {
		currentColor(to) {
			this.$emit("input", to);
		},
		value(to) {
			// console.log("TODO convert value to x & y");
		},
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
	},
	methods: {
		start(event) {
			this.dragActive = true;
			this.move(event);
		},
		end(event) {
			this.move(event);
			this.dragActive = false;
		},
		move(event) {
			event.preventDefault();
			if (this.$options.animation.animationFrame || !this.dragActive) {
				return;
			}

			this.$options.animation.animationFrame = window.requestAnimationFrame(
				() => {
					const { x, y } = this.getRelativeEventPosition(event);
					this.x = x;
					this.y = y;
					this.$options.animation.animationFrame = undefined;
				}
			);
		},
		resize() {
			if (!this.$refs.picker) {
				return;
			}
			const boundingBox = this.$refs.picker.getBoundingClientRect();
			this.$options.animation.minX = boundingBox.left;
			this.$options.animation.minY = boundingBox.top;
			this.$options.animation.maxX = boundingBox.right;
			this.$options.animation.maxY = boundingBox.bottom;
		},
		_getEventPosition(event) {
			return {
				x: event.x || event.changedTouches[0].clientX,
				y: event.y || event.changedTouches[0].clientY,
			};
		},
		getRelativeEventPosition(event) {
			const { minX, maxX, minY, maxY } = this.$options.animation;
			const { x, y } = this._getEventPosition(event);
			const newX = Math.min(Math.max(minX, x), maxX);
			const newY = Math.min(Math.max(minY, y), maxY);
			return {
				x: (newX - minX) / (maxX - minX),
				y: 1 - (newY - minY) / (maxY - minY),
			};
		},
	},
};
</script>

<style lang="scss" scoped>
$height: 32px;
$borderWidth: 2px;

.wrapper-tone-picker {
	padding: $height / 2;
}
.tone-picker {
	position: relative;
	width: 100%;
	padding-bottom: 100%;
	border-radius: 4px;
	&:after {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: "";
		background: linear-gradient(to bottom, transparent 0%, #000 100%);
		border-radius: 4px;
	}
}

.marker {
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	display: inline-block;
	padding: ($height / 2) - $borderWidth;
	margin-bottom: -($height / 2);
	margin-left: -($height / 2);
	border: $borderWidth solid var(--color-border-i);
	border-radius: 50%;

	&.active {
		box-shadow: 0 0 0 2px var(--color-border),
			0 0 0 2px var(--color-border) inset;
	}
}
</style>
