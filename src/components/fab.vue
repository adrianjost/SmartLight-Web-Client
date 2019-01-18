<template>
	<div
		v-ripple
		class="fab"
	>
		<i class="material-icons">
			{{ icon }}
		</i>
	</div>
</template>

<script>
/*
DON'T USE THIS
replace this code with a fork of vue-fab that enables the missing features
*/
export default {
	name:"Fab",
	props: {
		icon: {
			type: String,
			required: true
		},
	},
}
</script>

<style lang="scss" scoped>
.fab {
	align-items: center;
	background-color: #fff;
	border-radius: 50%;
	box-shadow: 0 6px 6px rgba(0, 0, 0, .24);
	color: var(--color-background);
	cursor: pointer;
	display: flex;
	font-size: 14px;
	height: 56px;
	justify-content: center;
	line-height: 14px;
	width: 56px;

	&:hover,
	&:focus {
		box-shadow: 0 12px 12px rgba(0, 0, 0, .26);
	}
}
</style>