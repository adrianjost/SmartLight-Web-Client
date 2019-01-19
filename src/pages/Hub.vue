<template>
	<div class="hub">
		<h1>
			IoT-Hub is always active :)
		</h1>
		<i class="material-icons md-64">
			device_hub
		</i>
		<p>As long as you have any page of this app open, the website acts as an hub for external communication.</p>
		<p>So you can control your lights from anywhere on earth, as long as one device in your local network has this page opened.</p>
		<p>This is also required to be able to use Google Home & IFTTT.</p>
	</div>
</template>

<script>
import hub from '@/mixins/hub.js'
import { UIStateNestedDefault } from '@/helpers/ui-states.js';

export default {
	mixins: [hub],
	mounted(){
		this.$store.commit("ui/set", {
			component: "appBarTop",
			payload: UIStateNestedDefault.appBarTop("IoT-Hub")
		});
	},
}
</script>

<style scoped>
.hub{
	text-align: center;
	margin: 2em 0;
}
.material-icons.md-64 { font-size: 64px; }
</style>
