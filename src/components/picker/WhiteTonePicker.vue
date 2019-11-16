<template>
	<!-- TODO decouple visual color value from v-model value to fade between full 255 and 0 on only 2 channels -->
	<div>
		{{ value }}
		{{ currentColor }}
		<div class="wrapper-tone-picker">
			<GlobalEvents
				@mousemove="move"
				@touchmove="move"
				@mouseup="end"
				@touchend="end"
			/>
			<div
				ref="picker"
				class="tone-picker"
				:style="
					`background: linear-gradient(to right, ${colorLeft} 0%, ${colorRight} 100%);`
				"
				@mousedown="start"
				@touchstart="start"
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
	</div>
</template>

<script>
import colorConversion from "@/mixins/colorConversion.js";
import GlobalEvents from "vue-global-events";

export default {
	components: {
		GlobalEvents,
	},
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
		readOnly: {
			type: Boolean,
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
			return this.getColorForPosition({
				x: this.x,
				y: this.y,
			});
		},
		colorPositions() {
			// TODO this implementation is bullshit
			const map = {};
			for (let x = 0; x < 256; x++) {
				for (let y = 0; y < 256; y++) {
					const color = this.getColorForPosition({ x: x / 255, y: y / 255 });
					map[color] = { x, y };
				}
			}
			return map;
		},
	},
	watch: {
		currentColor(to) {
			this.$emit("input", to);
		},
		value(to) {
			if (to === this.currentColor) {
				return;
			}
			const position = this.getPositionForColor(to);
			if (!this.position) {
				return console.warn("position for color not defined", to);
			}
			this.x = position.x;
			this.y = position.y;
		},
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
	},
	methods: {
		start(event) {
			if (this.readOnly) {
				return;
			}
			this.dragActive = true;
			this.move(event);
		},
		end(event) {
			if (this.readOnly) {
				return;
			}
			this.move(event);
			this.dragActive = false;
		},
		move(event) {
			if (this.readOnly) {
				return;
			}
			// event.preventDefault();
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
			// mouse
			if (event.x !== undefined && event.y !== undefined) {
				return { x: event.x, y: event.y };
			}
			// touch
			return {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
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
		getColorForPosition({ x, y }) {
			const cL = this.hex2rgb(this.colorLeft);
			const cR = this.hex2rgb(this.colorRight);
			let currentColor = {
				r: cL.r + (cR.r - cL.r) * x,
				g: cL.g + (cR.g - cL.g) * x,
				b: cL.b + (cR.b - cL.b) * x,
			};
			currentColor.r = Math.round(currentColor.r * y);
			currentColor.g = Math.round(currentColor.g * y);
			currentColor.b = Math.round(currentColor.b * y);
			return this.rgb2hex(currentColor);
		},
		getPositionForColor(color) {
			// TODO this implementation is bullshit
			const cache = this.colorPositions;
			// console.log(color, this.colorPositions[color]);
			return this.colorPositions[color];
		},
	},
};
</script>

<style lang="scss" scoped>
$height: 32px;
$borderWidth: 2px;

.wrapper-tone-picker {
	padding: $height;
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
