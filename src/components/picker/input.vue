<template>
	<div>
		<label class="input-wrapper">
			<span
				:class="{ label: true, active: internalValue && internalValue !== 0 }"
			>
				{{ label }}
			</span>
			<slot>
				<input
					v-model="internalValue"
					class="input"
					:type="type"
					:placeholder="placeholder"
					:required="required"
				/>
			</slot>
		</label>
		<small v-if="hint || $slots.hint" class="hint">
			<template v-if="hint">
				{{ hint }}
			</template>
			<slot v-else name="hint" />
		</small>
	</div>
</template>

<script>
export default {
	name: "SLInput",
	props: {
		modelValue: {
			type: [String, Number],
			default: "",
		},
		label: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			default: "text",
		},
		placeholder: {
			type: String,
			default: "text",
		},
		required: {
			type: Boolean,
			default: false,
		},
		hint: {
			type: String,
			default: "",
		},
	},
	data() {
		return { internalValue: this.modelValue };
	},
	watch: {
		internalValue: function (to) {
			if (to !== this.modelValue) {
				this.$emit("update:modelValue", to);
			}
		},
		modelValue: function (to) {
			if (to !== this.internalValue) {
				this.internalValue = to;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
$input-padding-left: 12px;

.input-wrapper {
	position: relative;
	display: block;
	margin: 1em 0 0.75em;
	clear: both;
	border: 1px solid var(--color-border);
	border-radius: 4px;
}

.label {
	position: absolute;
	top: 0;
	left: $input-padding-left;
	font-size: 0.75em;
	background: var(--color-background);
	border-right: 1px solid var(--color-background);
	border-left: 1px solid var(--color-background);
	transform: translateY(-0.75em);
}

.input {
	width: 100%;
	padding: 8px $input-padding-left;
	background: transparent;
	border: 0;
	outline: none;
	transition: color 0.2s linear;

	&:focus {
		color: var(--color-text-active);
	}
}

.hint {
	display: block;
	margin-top: -0.75em;
	margin-bottom: 1em;
	margin-left: $input-padding-left;
}
</style>
