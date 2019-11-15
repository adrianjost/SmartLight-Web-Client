<template>
	<div>
		{{ value }}
		<button @click.prevent="$emit('input', '#ff0000')">WW</button>
		<button @click.prevent="$emit('input', '#0000ff')">CW</button>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped></style>
