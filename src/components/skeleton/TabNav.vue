<template>
	<div class="tab-nav">
		<div v-for="tab in tabNames" :key="tab" class="tab">
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
	},
};
</script>

<style lang="scss" scoped>
.tab-nav {
	display: flex;
	max-width: 250px;
	margin: 16px auto;
	font-size: 0;
	user-select: none;
	background-color: var(--color-skeleton);
	border: 1px solid var(--color-skeleton-border);
	border-radius: 4px;

	.tab {
		display: inline-block;
		flex: 1;
		padding: 8px;
		font-size: 16px;
		line-height: 16px;
		color: transparent;
		&:first-of-type {
			background-color: var(--color-skeleton);
		}
	}
}
</style>
