<template>
  <div class="goodsTop-page">
    <div class="n-top">
      <img :src="img" alt="">
      <span>{{ regionName }}</span>
      <router-link :to="to">
        <span>更多</span>
        <img src="@/assets/homePage/right.png" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    regionName: {
      type: String,
      default: '',
    },
    to: {
      type: Object,
      default: '',
    },
    img: {
      type: String,
    }
  },
  data() {
    return {

    };
  },
  watch: {

  },
  methods: {

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

<style scoped lang="less">
.goodsTop-page {
  padding: 16px 16px 0 16px;
  width: 100%;

  .n-top {
    position: relative;
    width: 100%;
    height: 30px;

    > img {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
    }

    > span {
      position: absolute;
      top: 50%;
      left: 28px;
      transform: translateY(-50%);
      font-size: 18px;
    }

    > a {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      padding: 4px;
      width: 46px;
      font-size: 14px;
      color: #999;

      > img {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: inline-block;
        width: 8px;
        height: 13px;
      }
    }
  }
};
</style>
