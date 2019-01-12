<template>
	<ul class="lamps">
		<li
			v-for="lamp in lamps"
			:key="lamp.id"
			@click="toggle(lamp.id)"
			:class="{
				lamp: true,
				checked: value.includes(lamp.id)
			}"
		>
			<i class="material-icons">{{lamp.icon}}</i>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		lamps: {
			type: Array,
			required: true,
			validator: function (value) {
				return value.every((state) => {
					return typeof state.id !== undefined;
				})
			}
		},
		value: {
			type: Array,
			required: true
		}
	},
	methods: {
		toggle(lampId){
			const index = this.value.indexOf(lampId);
			if(index >= 0){
				// delete from list
				let newValue = [...this.value]
				newValue.splice(index, 1)
				this.$emit("input", newValue);
			}else{
				// add to list
				this.$emit("input", [...this.value, lampId]);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.lamps {
	font-size: 0;
	padding: 8px;
	text-align: left;
	user-select: none;
}

.lamp {
	border: 1px solid var(--color-border);
	border-radius: 50%;
	color: var(--color-text-active-i);
	display: inline-block;
	list-style: none;
	margin: 0 4px;
	padding: 16px;
	position: relative;
	transition: background-color .2s ease-in-out;

	&::before {
		align-items: center;
		background: #34a853;
		border-radius: 50%;
		color: #fff;
		content: "check";
		direction: ltr;
		display: flex;
		font-family: "Material Icons", serif;
		-webkit-font-feature-settings: "liga";
		font-size: 16px;
		-webkit-font-smoothing: antialiased;
		font-style: normal;
		font-weight: normal;
		height: 24px;
		justify-content: center;
		letter-spacing: normal;
		line-height: 1;
		opacity: 0;
		position: absolute;
		right: -4px;
		text-transform: none;
		top: -4px;
		transition: opacity .15s ease-in-out 0s;
		white-space: nowrap;
		width: 24px;
		word-wrap: normal;
	}

	&.checked {
		background-color: var(--color-overlay-i);

		&::before {
			opacity: 1;
			transition-delay: .15s;
		}
	}
}
</style>