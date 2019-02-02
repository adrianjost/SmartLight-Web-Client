export default {
	methods: {
		toast(text, icon) {
			return this.$toasted.show(
				`<span class="toast-container">${text}</span>`,
				{
					icon: icon,
					action: {
						text: "CLOSE",
						onClick: (e, toastObject) => {
							toastObject.goAway(0);
						},
					},
				}
			);
		},
		toastError(text) {
			return this.toast(text, "warning");
		},
	},
};
