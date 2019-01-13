<template>
	<div>
		<div class="inputs">
			<div
				@click="query = value"
				class="icon current"
			>
				<i class="material-icons">{{value}}</i>
			</div>
			<SLInput class="search" label="Search for Icon" type="text" :placeholder="value" v-model="query" />
		</div>

		<ul class="icons" v-if="filteredIcons.length">
			<li
				v-for="icon of filteredIcons"
				:key="icon"
				@click="check(icon)"
				:class="{icon: true, selected: (value === icon)}"
			>
				<i class="material-icons">{{icon}}</i>
			</li>
		</ul>
		<p class="not-found" v-else>No icons found.</p>
	</div>
</template>

<script>
import Input from "@/components/picker/input";
import iconNames from "./material-icons";
console.log(Input);
export default {
	name: "iconPicker",
	components: {
		SLInput: Input,
	},
	props: {
		value: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			icons: iconNames.sort(),
			query: ''
		}
	},
	methods:{
		check(iconName){
			this.$emit("input", iconName);
		}
	},
	computed:{
		filteredIcons: function () {
			return this.icons.filter((icon) => {
				return icon.toLowerCase().includes(this.query.toLowerCase());})
		}
	}
}
</script>


<style lang="scss" scoped>
.inputs{
	display: flex;
	flex-wrap: nowrap;
}
.search{
	flex: 1;
}
.icon.current{
	margin-right: 16px;
	background-color: var(--color-overlay-i);

}
.not-found{
	text-align: center;
}

.icons {
	font-size: 0;
	padding: 8px;
	text-align: left;
	user-select: none;
	max-height: 200px;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
}

.icon {
	font-size: 0;
	border: 1px solid var(--color-border);
	border-radius: 50%;
	color: var(--color-text-active-i);
	display: inline-block;
	list-style: none;
	margin: 4px;
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

	&.selected {
		background-color: var(--color-overlay-i);

		&::before {
			opacity: 1;
			transition-delay: .15s;
		}
	}
}
</style>