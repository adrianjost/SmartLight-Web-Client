<template>
	<div>
		<label>
			<span :class="{label: true, active: (_value && _value !== 0)}">{{label}}</span>
			<input
				:type="type"
				:value="_value"
				:placeholder="placeholder"
				:required="required"
			/>
		</label>
		<small v-if="hint" v-html="hint" class="hint"/>
	</div>
</template>

<script>
export default {
	name: "SLInput",
	props: {
		value: {
			required: true
		},
		label: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: "text"
		},
		placeholder: {
			type: String,
			default: "text"
		},
		required: {
			type: Boolean,
			default: false
		},
		hint: {
			type: String
		}
	},
	data() {
		return { _value: this.value }
	},
	watch: {
		_value(to){
			this.$emit("input", to);
		}
	}
}
</script>

<style lang="scss" scoped>
$input-padding-left: 12px;

label {
	border: 1px solid var(--color-border);
	border-radius: 4px;
	clear: both;
	display: block;
	margin: 1em 0 .75em;
	position: relative;
}

.label {
	background: var(--color-background);
	border-left: 1px solid var(--color-background);
	border-right: 1px solid var(--color-background);
	font-size: .75em;
	left: $input-padding-left;
	position: absolute;
	top: 0;
	transform: translateY(-.75em);
}

input {
	background: transparent;
	border: 0;
	outline: none;
	padding: 8px $input-padding-left;
	transition: color .2s linear;
	width: 100%;

	&:focus {
		color: var(--color-text-active);
	}
}

.hint {
	display: block;
	margin-bottom: 1em;
	margin-left: $input-padding-left;
	margin-top: -.75em;
}
</style>