<template>
  <transition name="fade">
    <div class="popupBottom" v-show="show">
      <div @click="amd()" class="overlay"></div>
      <transition name="appear">
        <div v-show="show" class="popupWindow">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition> 
</template>
<script>
export default {
  name:"popupBottom",
  data () {
    return {
    }
  },
  props:[
    'show'
  ],
  methods:{
    amd () {
      this.$emit('update:show',false)
    }
  }
}
</script>

<style lang="less" scoped>
  .popupBottom {
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 99;
    position: fixed;
    background:rgba(0,0,0,0.3);

    .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      
    }

    .popupWindow {
      width: 100%;
      bottom:0;
      position: absolute;
      background: rgba(255,255,255,1);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .appear-enter-active, .appear-leave-active {
    transition: all .3s;
  }

  .appear-enter, .appear-leave-to
{
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
</style>

