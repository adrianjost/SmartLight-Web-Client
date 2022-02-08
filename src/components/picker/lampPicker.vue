<template>
	<ul class="lamps">
		<li
			v-for="lamp in lamps"
			:key="lamp.id"
			:title="lamp.name"
			:class="{
				lamp: true,
				checked: modelValue.includes(lamp.id),
			}"
			@click.prevent="toggleSelection(lamp.id)"
		>
			<i class="material-icons">
				{{ lamp.icon }}
			</i>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		lamps: {
			type: Array,
			required: true,
			validator: function (value) {
				return value.every((state) => {
					return typeof state.id !== undefined;
				});
			},
		},
		modelValue: {
			type: Array,
			required: true,
		},
	},
	methods: {
		toggleSelection(lampId) {
			const index = this.modelValue.indexOf(lampId);
			if (index >= 0) {
				// delete from list
				let newValue = [...this.modelValue];
				newValue.splice(index, 1);
				this.$emit("update:modelValue", newValue);
			} else {
				// add to list
				this.$emit("update:modelValue", [...this.modelValue, lampId]);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.lamps {
	padding: 8px;
	font-size: 0;
	text-align: left;
	user-select: none;
}

.lamp {
	position: relative;
	display: inline-block;
	padding: 16px;
	margin: 4px;
	color: var(--color-text-active-i);
	list-style: none;
	border: 1px solid var(--color-border);
	border-radius: 50%;
	transition: background-color 0.2s ease-in-out;

	&::before {
		position: absolute;
		top: -4px;
		right: -4px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		font-family: "Material Icons", serif;
		font-size: 16px;
		font-style: normal;
		font-weight: normal;
		-webkit-font-feature-settings: "liga";
		line-height: 1;
		color: #fff;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		content: "check";
		background: #34a853;
		border-radius: 50%;
		opacity: 0;
		transition: opacity 0.15s ease-in-out 0s;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
	}

	&.checked {
		background-color: var(--color-overlay-i);

		&::before {
			opacity: 1;
			transition-delay: 0.15s;
		}
	}
}
</style>
