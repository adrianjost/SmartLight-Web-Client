<template>
	<div>
		<div class="inputs">
			<div class="icon current" @click="query = modelValue">
				<i class="material-icons">
					{{ modelValue }}
				</i>
			</div>
			<SLInput
				v-model="query"
				class="search"
				label="Search for Icon"
				type="text"
				:placeholder="modelValue"
			/>
		</div>

		<ul v-if="filteredIcons.length" class="icons">
			<li
				v-for="icon of filteredIcons"
				:key="icon"
				:class="{ icon: true, selected: modelValue === icon }"
				@click="check(icon)"
			>
				<i class="material-icons">
					{{ icon }}
				</i>
			</li>
		</ul>
		<p v-else class="not-found">No icons found.</p>
	</div>
</template>

<script>
import Input from "@/components/picker/input";
import iconNames from "./material-icons";

export default {
	name: "IconPicker",
	components: {
		SLInput: Input,
	},
	props: {
		modelValue: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			icons: iconNames.sort(),
			query: "",
		};
	},
	computed: {
		filteredIcons: function () {
			return this.icons
				.filter((icon) => {
					return icon.toLowerCase().includes(this.query.toLowerCase());
				})
				.slice(0, 20);
		},
	},
	methods: {
		check(iconName) {
			this.$emit("update:modelValue", iconName);
		},
	},
};
</script>

<style lang="scss" scoped>
.inputs {
	display: flex;
	flex-wrap: nowrap;
}
.search {
	flex: 1;
}
.icon.current {
	margin-right: 16px;
	background-color: var(--color-overlay-i);
}
.not-found {
	text-align: center;
}

.icons {
	max-height: 200px;
	padding: 8px;
	overflow: auto;
	font-size: 0;
	text-align: center;
	user-select: none;
	-webkit-overflow-scrolling: touch;
}

.icon {
	position: relative;
	display: inline-block;
	padding: 16px;
	margin: 4px;
	font-size: 0;
	color: var(--color-text-active-i);
	list-style: none;
	border: 1px solid var(--color-border);
	border-radius: 50%;
	transition: background-color 0.2s ease-in-out;

	&::before {
		position: absolute;
		top: -4px;
		right: -4px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		font-family: "Material Icons", serif;
		font-size: 16px;
		font-style: normal;
		font-weight: normal;
		-webkit-font-feature-settings: "liga";
		line-height: 1;
		color: #fff;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		content: "check";
		background: #34a853;
		border-radius: 50%;
		opacity: 0;
		transition: opacity 0.15s ease-in-out 0s;
		direction: ltr;
		-webkit-font-smoothing: antialiased;
	}

	&.selected {
		background-color: var(--color-overlay-i);

		&::before {
			opacity: 1;
			transition-delay: 0.15s;
		}
	}
}
</style>
