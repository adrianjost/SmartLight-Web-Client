<template>
	<div class="state-picker-wrapper">
		<div class="state-picker">
			<div class="handle"></div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.state-picker-wrapper {
	max-width: 300px;
	padding: 16px;
	margin: 32px auto;
	animation: skeleton-fadein 0.5s ease-in-out;
}
.state-picker {
	position: relative;
	padding-bottom: 100%;
	background-color: var(--color-skeleton);
	border-radius: 4px;
}
.handle {
	position: absolute;
	bottom: 70%;
	left: 30%;
	z-index: 2;
	display: inline-block;
	padding: 16px;
	margin-bottom: -16px;
	margin-left: -16px;
	background: var(--color-skeleton);
	border-width: 2px;
	border-radius: 50%;
}
</style>
