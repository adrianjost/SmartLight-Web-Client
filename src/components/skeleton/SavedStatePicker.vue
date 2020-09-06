<template>
	<div class="state-list">
		<div v-for="i in new Array(10)" :key="i" class="state"></div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.state-list {
	max-width: 300px;
	padding: 8px;
	padding-bottom: 12px;
	margin: 8px auto;
	overflow-x: hidden;
	font-size: 0;
	text-align: left;
	white-space: nowrap;
	user-select: none;
	border: 1px solid var(--color-skeleton-border);
	border-radius: 4px;
	animation: skeleton-fadein 0.5s ease-in-out;
}
.state {
	position: relative;
	display: inline-block;
	padding: 20px;
	margin: 0 4px;
	list-style: none;
	background-color: var(--color-skeleton);
	border: 1px solid var(--color-skeleton-border);
	border-radius: 50%;

	&:first-of-type {
		margin-left: 0;
	}

	&:last-of-type {
		margin-right: 0;
	}
}
</style>
