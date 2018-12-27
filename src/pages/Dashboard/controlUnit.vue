<template>
  <router-link :to="'/control/'+object.id" class="item card">
      <div class="item-content">
          <i class="icon material-icons"
            :style="'background-color: '+getCurrentColor()+'; color:'+textColor(getCurrentColor())">
            {{object.icon}}
          </i>
        </div>
  </router-link>
</template>

<script>
import textColor from "@/mixins/textColor.js";

export default {
  mixins: [textColor],
  props: ['object'],
  methods: {
    getCurrentColor(){
        if(!this.object || !this.object.state){
          return
        }
        const current = this.object.state || {};
        if(current.color){
          if(current.color. length === 3 || current.color. length === 6){
            return '#'+current.color;
          }
          return current.color || '#000';
        }
        // TODO - extract color of mode
    },
  },
};
</script>
<style lang="scss" scoped>
.item{
  .item-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    word-break: break-all;
    word-break: break-word;
    text-align: center;
    white-space: nowrap;
    color: #555;
    .icon{
        padding: .75em;
        border-radius: 50%;
        margin-bottom: .75em;
        box-shadow: 2px 2px 5px rgba(0,0,0,.5);
    }
    span{
        font-size: 1rem;
        font-weight: 700;
        line-height: 100%;
        &.edit{
        font-size: 1.5rem;
        color: #333;
        }
    }
    button{
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      i{
        padding: 16px;
        text-shadow: 0 0 5px rgba(0,0,0,.2);
        transition: all .2s ease-in-out;
      }
      &:hover i{
        text-shadow: 2px 4px 5px rgba(0,0,0,.5);
        transform: translate(-2px, -4px);
      }
    }
  }
}
</style>
