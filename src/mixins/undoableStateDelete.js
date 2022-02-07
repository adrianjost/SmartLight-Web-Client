export const undoableStateDelete = (listName) => {
	return {
		computed: {
			states() {
				return this.$store.getters["savedStates/list"];
			},
		},
		methods: {
			deleteState(id) {
				const identify = (state) => {
					return state.id === id;
				};

				if (this.states.find(identify) === undefined) {
					this.toastError(`State is not deletable.`);
					return;
				}

				window.navigator.vibrate(50);
				const deletedState = {
					index: this.states.findIndex(identify),
					data: this.states.find(identify),
				};

				this.$toasted.show(
					`<span class="toast-container"><i class="toast-dot" style="background:${
						this[listName].find(identify).background
					}"></i> deleted</span>`,
					{
						icon: "delete",
						action: {
							text: "UNDO",
							onClick: (e, toastObject) => {
								this.restoreState(deletedState);
								toastObject.goAway(0);
							},
						},
					}
				);
				this.$store.dispatch("savedStates/delete", id);
			},
			restoreState(state) {
				this.$store.dispatch("savedStates/set", state.data);
			},
		},
	};
};
