<template>
	<div class="tab-nav">
		<div
			v-for="tab in tabNames"
			:key="tab"
			:class="{
				tab: true,
				active: modelValue === tab,
			}"
			@click.prevent="$emit('update:modelValue', tab)"
		>
			{{ tab }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		tabNames: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.tab-nav {
	display: flex;
	max-width: 250px;
	margin: 16px auto;
	overflow: hidden;
	font-size: 0;
	user-select: none;
	border: 1px solid var(--color-border);
	border-radius: 4px;

	.tab {
		display: inline-block;
		flex: 1;
		padding: 8px;
		font-size: 16px;
		line-height: 16px;
		text-align: center;
		cursor: pointer;

		&.active {
			background-color: var(--color-overlay);
		}
	}
}
</style>
