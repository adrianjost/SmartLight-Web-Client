<template>
	<SLInput v-bind="$attrs">
		<select v-model="internalValue" class="select">
			<option
				v-for="option in options"
				:key="option.label"
				class="option"
				:value="option.value"
				:disabled="option.disabled"
			>
				{{ option.label }}
			</option>
		</select>
	</SLInput>
</template>

<script>
import input from "./input";
export default {
	components: {
		SLInput: input,
	},
	props: {
		value: {
			type: [String, Number, Object, Array],
			default: undefined,
		},
		options: {
			type: Array,
			required: true,
			validator: (v) =>
				v.every(
					(a) =>
						(a.hasOwnProperty("value") || a.disabled) &&
						a.hasOwnProperty("label")
				),
		},
	},
	data() {
		return { internalValue: this.value };
	},
	watch: {
		internalValue: function (to) {
			if (to !== this.value) {
				this.$emit("input", to);
			}
		},
		value: function (to) {
			if (to !== this.internalValue) {
				this.internalValue = to;
			}
		},
		options: function (to) {
			if (to.length === 1) {
				this.internalValue = to[0].value;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
$input-padding-left: 12px;

.select {
	width: 100%;
	padding: 8px $input-padding-left;
	color: var(--color-text);
	background: transparent;
	border: none;
	outline: none;
	transition: color 0.2s linear;
	&:focus {
		color: var(--color-text-active);
	}
	.option {
		background-color: var(--color-overlay);
		&:hover,
		&:focus {
			filter: invert(1);
		}
	}
}
</style>
