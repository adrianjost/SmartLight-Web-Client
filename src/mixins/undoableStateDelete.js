export const undoableStateDelete = (listName) => {
  return {
    methods: {
      deleteState(id) {
        const identify = (state)=>{return state.id === id;};

        navigator.vibrate(50);
        const deletedColor = {
          index: this.states.findIndex(identify),
          data: this.states.find(identify)
        }

        this.$toasted.show(`<span class="toast-container"><i class="toast-dot" style="background:${ this[listName].find(identify).background }"></i> deleted</span>`, {
          icon: "delete",
          action : {
            text : 'UNDO',
            onClick : (e, toastObject) => {
              this.restoreState(deletedColor);
              toastObject.goAway(0);
            }
          },
        });
        this.$store.commit("savedStates/delete", id);
      },
      restoreState(state){
        this.$store.commit("savedStates/add", state);
      },
    }
  }
}