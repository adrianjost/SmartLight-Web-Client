<template>
	<div class="control-unit" :style="{ background: background }">
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
	},
	/*
	watch: {
		data: {
			handler() {
				this.$forceUpdate();
			},
			deep: true,
		},
	},
	*/
};
</script>

<style lang="scss" scoped>
.control-unit {
	position: relative;
	display: inline-block;
	width: 128px;
	height: 128px;
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
	padding: 12px;
	font-size: 28px;
	color: var(--color-text-active-i);
	background: var(--color-overlay-i);
	border: 1px solid var(--color-border);
	border-radius: 50%;
}
</style>
