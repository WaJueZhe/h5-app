<template>
  <div class="follow-page">
    <div class="follow-box">
      <div class="img">
        <img :src="imgCode" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Models from '@/models';
export default {
  name: 'follow',
  data() {
    return {
      goodId: '',
      userId: '',
      imgCode: ''
    };
  },
  watch: {

  },
  methods: {
    //获取关注二维码
    init() {
      let data = {
        goodId: this.goodId,
        userId: this.userId,
      }
      Models.User
      .shopCode(data)
      .then(res => {
        if(res.data.code == 200) {
          this.imgCode = res.data.data
        }
      })
    }
  },
  computed: {

  },
  created() {
    this.goodId = this.$route.query.goodId || '666'
    this.userId = this.$route.query.userId
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.follow-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f02b30;

  .follow-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 518px;
    background: url('../../../assets/chahua.png') no-repeat;
    background-size: 100% 100%;
    z-index: 99;

    .img {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 170px;
      height: 170px;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
};
</style>
