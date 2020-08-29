<template>
	<div class="units">
		<RouterLink
			v-for="controlUnit in controlUnits"
			:key="controlUnit.id"
			class="unit"
			:to="'/settings/edit/' + controlUnit.id"
			:style="{ background: controlUnit.background }"
		>
			<div class="icon-container">
				<i class="material-icons">
					{{ controlUnit.icon }}
				</i>
			</div>
		</RouterLink>
		<RouterLink class="unit add" :to="addUrl">
			<div class="icon-container">
				<i class="material-icons">add</i>
			</div>
		</RouterLink>
	</div>
</template>

<script>
export default {
	props: {
		controlUnits: {
			type: Array,
			required: true,
		},
		addUrl: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
$iconSize: 24px;
$iconPadding: 16px;
.unit {
	position: relative;
	display: inline-block;
	width: $iconSize + (2 * $iconPadding) + 2px;
	height: $iconSize + (2 * $iconPadding) + 2px;
	padding: $iconPadding;
	margin: 8px;
	font-size: 0;
	border: 1px solid var(--color-border);
	border-radius: 50%;

	.icon-container {
		position: absolute;
		top: 0;
		left: 0;
		padding: $iconPadding;
		color: var(--color-text);
	}

	&:before {
		$spaceAround: 8px;
		position: absolute;
		top: $spaceAround;
		left: $spaceAround;
		width: calc(100% - 2 * #{$spaceAround});
		height: calc(100% - 2 * #{$spaceAround});
		content: "";
		background: var(--color-overlay);
		border-radius: 100%;
	}

	&.add {
		color: var(--color-border);
		border-width: 2px;
		.icon-container {
			// stylelint-disable plugin/8-point-grid
			// adjust offset because the border is 1px larger
			// this moves the 0 position by 1 px;
			top: -1px;
			left: -1px;
			// stylelint-enable plugin/8-point-grid
		}
	}
}
</style>
