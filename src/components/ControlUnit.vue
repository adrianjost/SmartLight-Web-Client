<template>
  <div
    class="control-unit"
    :style="{ 'background': data.background }"
  >
    <router-link
      class="link"
      :to="'/control/'+ data.id"
    >
      <i class="material-icons">
        {{ data.icon }}
      </i>
    </router-link>
  </div>
</template>

<script>
export default {
	props: {
		data: {
			type: Object,
			required: true,
			validator: function (value) {
				return value.icon && value.id
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.control-unit {
	border: 1px solid var(--color-border);
	border-radius: 50%;
	display: inline-block;
	height: 128px;
	position: relative;
	width: 128px;
}

.link {
	left: 50%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
}

.material-icons {
	background: var(--color-overlay-i);
	border: 1px solid var(--color-border);
	border-radius: 50%;
	color: var(--color-text-active-i);
	font-size: 28px;
	padding: 12px;
}
</style>