<template>
	<div class="units">
		<RouterLink
			v-for="controlUnit in controlUnits"
			:key="controlUnit.id"
			class="unit"
			:to="'/settings/edit/'+ controlUnit.id"
			:style="{background: controlUnit.background}"
		>
			<i class="material-icons">
				{{ controlUnit.icon }}
			</i>
		</RouterLink>
		<RouterLink
			class="unit add"
			:to="addUrl"
		>
			<i class="material-icons">
				add
			</i>
		</RouterLink>
	</div>
</template>

<script>
export default {
	props: {
		controlUnits: {
			type: Array,
			required: true
		},
		addUrl: {
			type: String,
			required: true,
		}
	},
}
</script>

<style lang="scss" scoped>
.unit {
	border: 1px solid var(--color-border);
	border-radius: 50%;
	color: var(--color-text);
	display: inline-block;
	font-size: 0;
	margin: 8px;
	padding: 16px;

	&.add {
		border-width: 2px;
	}
}
</style>