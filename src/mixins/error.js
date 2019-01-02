export default {
  methods: {
    error(text){
      return this.$toasted.show(`<span class="toast-container">${text}</span>`, {
        icon: "warning",
        action : {
          text : 'CLOSE',
          onClick : (e, toastObject) => {toastObject.goAway(0);}
        },
      });
    },
  }
};