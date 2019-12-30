<template>
	<div
		class="control-unit"
		:style="{ background: background, '--size': `${size}px` }"
	>
		<RouterLink class="link" :to="'/control/' + id">
			<i class="material-icons">
				{{ icon }}
			</i>
		</RouterLink>
	</div>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: "lightbulb_outline",
		},
		background: {
			type: String,
			default: "var(--color-border)",
		},
		size: {
			type: Number,
			default: 96,
		},
	},
};
</script>

<style lang="scss" scoped>
.control-unit {
	position: relative;
	display: inline-block;
	width: var(--size);
	height: var(--size);
	border: 1px solid var(--color-border);
	border-radius: 50%;
}

.link {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.material-icons {
	padding: calc(var(--size) / 8);
	font-size: 28px;
	color: var(--color-text-active);
	background: var(--color-overlay);
	border: 1px solid var(--color-border);
	border-radius: 50%;
}
</style>
