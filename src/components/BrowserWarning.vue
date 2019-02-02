<template>
	<div v-if="!isSupported" class="warning">
		<b>Warning:</b> Your Browser is unsupported!
		<br />
		<small>
			This site uses modern web technologies that are only available on
			<b>Google Chrome (Version >= 69)</b>.
		</small>
	</div>
</template>

<script>
export default {
	name: "BrowserWarning",
	data() {
		return {
			isSupported: false,
		};
	},
	created() {
		this.isSupported = (this.getChromeVersion() || 0) >= 70;
	},
	methods: {
		getChromeVersion() {
			var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
			return raw ? parseInt(raw[2], 10) : undefined;
		},
	},
};
</script>
<style lang="scss" scoped>
.warning {
	width: calc(100% - 16px);
	padding: 8px;
	margin: 8px;
	color: var(--color-text);
	border: 1px solid var(--color-border);
	border-radius: 4px;
}
</style>
