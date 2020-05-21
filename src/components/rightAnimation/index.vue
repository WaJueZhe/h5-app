<template>
  <div class="rightAnimation-page">
    <van-popup v-model="maskShow" position="right" @click-overlay="close" :close-on-click-overlay='false'>
      <div class="mask-box">
        <slot name="content"></slot>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { Popup } from 'vant';

Vue.use(Popup);
export default {
  props: {
    maskShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    };
  },
  watch: {

  },
  methods: {
    close() {
      this.$emit('mask', this.maskShow)
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.rightAnimation-page {
  width: 100%;

  .van-popup {
    height: 100%;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 9999;
  }

  .mask-box {
    height: 100%;
    background-color: #fff;
    z-index: 9999;
  }
};
</style>
