<template>
  <a11y-dialog :active.sync="modalVisible">
    <div class="dialog-content">
      <iro v-model="color" :config="iroConfig"/>
    </div>
    <div class="dialog-footer">
      <button @click="hide" >CLOSE</button>
      <!--<button @click="apply" >OKAY</button>-->
    </div>
  </a11y-dialog>
</template>

<script>
  import iro from './iro.vue'
  import a11yDialog from './Dialog.vue'

  export default {
    components: {
      iro,
      a11yDialog
    },
    data(){
      return {
        id: undefined,
        color: "FA00AA",
        iroConfig: {
          width: Math.min(window.innerWidth * 0.8, 300),
          height: 350,
          sliderMargin: 16,
          markerRadius: 10
        },
        modalVisible: false,
      }
    },
    created() {
      this.$parent.$on('show-color-picker', this.show);
      this.$parent.$on('hide', this.hide);
    },
    methods: {
      apply () {
        this.emit();
        this.hide();
      },
      emit(){
        this.$emit("newColor", this.id, JSON.parse(JSON.stringify(this.color)));
      },
      show (id, color) {
        this.id = id;
        this.color = color || "#ffffff";
        this.modalVisible = true;
      },
      hide () {
        this.modalVisible = false;
      }
    },
    watch:{
      "color": function(){
        this.emit()
      }
    }
  };
</script>
<style lang="scss" scoped>
  .dialog-content{
    padding: 16px;
  }
  .dialog-footer{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    a, button{
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding: 16px;
      outline: none;
      background: none;
      border: none;
      border-top: 1px solid #999;
      border-right: 1px solid #999;
      &:last-of-type{
        border-right: none;
      }
      &:hover{
        background: #ccc;
      }
    }
  }
</style>
