<template>
	<span class="zoom-picker">
		<button v-ripple type="button" @click="decrement">
			<i class="material-icons">remove</i>
		</button>
		<div class="border" />
		<button v-ripple type="button" @click="increment">
			<i class="material-icons">add</i>
		</button>
	</span>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			required: true,
		},
		min: {
			type: Number,
			default: undefined,
		},
		max: {
			type: Number,
			default: undefined,
		},
		step: {
			type: Number,
			default: 1,
		},
	},
	methods: {
		increment() {
			const nextVal = this.value + this.step;
			if (nextVal > this.max) {
				return this.$emit("error", "maxreached", nextVal);
			}
			this.$emit("input", nextVal);
		},
		decrement() {
			const nextVal = this.value - this.step;
			if (nextVal < this.min) {
				return this.$emit("error", "maxreached", nextVal);
			}
			this.$emit("input", nextVal);
		},
	},
};
</script>

<style lang="scss" scoped>
$border-width: 1px;

.zoom-picker {
	display: inline-flex;
	align-items: center;
	justify-content: space-evenly;
	user-select: none;
	border: $border-width solid var(--color-border);
	border-radius: 4px;
	button {
		display: inline-flex;
		align-items: center;
		padding: 0.25em 0.5em;
		> * {
			font-size: 1.5em;
		}
	}
	.border {
		width: $border-width;
		height: 1em;
		background: var(--color-border);
		border-radius: $border-width;
	}
}
</style>
