<template>
	<div class="state-list custom-scrollbar">
		<ul class="contents">
			<li
				v-for="state in data"
				:key="state.id"
				:style="{ background: state.background }"
				class="state"
				@click="sendEvent(event, state.id)"
				@contextmenu.prevent="sendEvent(contextEvent, state.id)"
			>
				<template v-if="state.icon">
					<i class="material-icons">{{ state.icon }}</i>
				</template>
			</li>

			<li class="state add" @click="sendEvent(addEvent)">
				<i class="material-icons">add</i>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Array,
			required: true,
			validator: function (value) {
				return value.every((state) => {
					return typeof state.id !== undefined && state.background;
				});
			},
		},
		event: {
			type: String,
			default: "state-picked",
		},
		addEvent: {
			type: String,
			default: "state-add",
		},
		contextEvent: {
			type: String,
			default: "state-context",
		},
	},
	methods: {
		sendEvent(event, data) {
			this.$emit(event, data);
		},
	},
};
</script>

<style lang="scss" scoped>
.state-list {
	max-width: 300px;
	padding: 8px;
	margin: 8px auto;
	overflow-x: auto;
	font-size: 0;
	text-align: left;
	white-space: nowrap;
	user-select: none;
	border: 1px solid var(--color-border);
	border-radius: 4px;
}

.state {
	position: relative;
	display: inline-block;
	padding: 20px;
	margin: 0 4px;
	color: var(--color-text-active-i);
	list-style: none;
	border: 1px solid var(--color-border);
	border-radius: 50%;

	&:first-of-type {
		margin-left: 0;
	}

	&:last-of-type {
		margin-right: 0;
	}

	.material-icons {
		position: absolute;
		top: 50%;
		left: 50%;
		text-shadow: var(--color-text-active) 0 0 4px;
		transform: translate(-50%, -50%);
	}

	&.add {
		border-width: 2px;
		.material-icons {
			text-shadow: none;
		}
	}
}
</style>
