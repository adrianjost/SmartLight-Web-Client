<template>
  <div class="units">
    <router-link
      class="unit"
      v-for="controlUnit in controlUnits"
      :key="controlUnit.id"
      :to="'/settings/'+ controlUnit.id"
      :style="{background: controlUnit.background}"
    >
      <i class="material-icons">{{controlUnit.icon}}</i>
    </router-link>
    <router-link
      class="unit add"
      :to="'/settings/add'"
    >
      <i class="material-icons">add</i>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["controlUnits"]
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