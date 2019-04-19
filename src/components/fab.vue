<template>
	<div v-ripple class="fab">
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
	name: "Fab",
	props: {
		icon: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.fab {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	font-size: 14px;
	line-height: 14px;
	color: var(--color-background);
	cursor: pointer;
	background-color: #fff;
	border-radius: 50%;
	box-shadow: 0 6px 6px rgba(0, 0, 0, 0.24);

	&:hover,
	&:focus {
		box-shadow: 0 12px 12px rgba(0, 0, 0, 0.26);
	}
}
</style>
