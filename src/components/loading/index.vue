<template>
  <div class="loading-page">
    <div class="loading" v-show="loadingData.loading">
      <van-loading type="spinner" color="#fff" size="34px" vertical>{{ loadingData.text }}</van-loading>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading } from 'vant';
Vue.use(Loading);
export default {
  data() {
    return {
      loadingData: {
        loading: false,
        text: ''
      }
    };
  },
  watch: {

  },
  methods: {
    getLoading (msg) {
      this.loadingData.loading = msg.loading;
      this.loadingData.text = msg.text
    }
  },
  computed: {

  },
  created() {
    this.bus.$on('getLoading', (msg) => {
      this.getLoading(msg)
      // that.loading = !!data;
    })
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.loading-page {
  width: 100%;

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0,.4);
    z-index: 99999;

    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99999;

      .van-loading__text {
        color: #e8e8e8;
      }
    }
  }
};
</style>
