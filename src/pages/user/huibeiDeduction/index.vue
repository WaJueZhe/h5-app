<template>
  <div class="huibeiDeduction-page">
    <div class="user-info">
      <div class="head-img">
        <img v-if="headPic" :src="headPic" alt="">
        <img v-else src="@/assets/homePage/avatar.png" alt="">
      </div>
      <div class="info">
        <div class="name">{{ nickName }}</div>
        <div class="grade"><span>{{ gradeName }}</span></div>
      </div>
    </div>
    <div class="deduction">
      <div class="title">惠呗抵扣</div>
      <div class="entry">
        <img src="@/assets/homePage/hui-bai.png" alt="">
        <div class="input">
          <input type="text" v-model.trim="depoint">
        </div>
      </div>
      <div class="pay-btn">
        <div class="btn" @click="payment">立即支付</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import { Toast } from 'vant';
Vue.use(Toast)
export default {
  name: 'huibeiDeduction',
  data() {
    return {
      depoint: '',//抵扣多少惠呗
      nickName: '',
      gradeName: '',
      headPic: '',
      ucode: '',
      huibeiFlage: false,//判断是不是扫描自己的商家码进来的
    };
  },
  watch: {

  },
  methods: {
    payment () {
      if(this.huibeiFlage) {
        Toast("扫描自己商家码不可以支付哦~");
        return
      }
      this.$router.push({
        name: 'huibeiWay',
        query: {
          depoint: this.depoint,
          shoperUCode: this.ucode,
        }
      })
    }
  },
  computed: {

  },
  created() {
    let userCode = localStorage.getItem('userCode')//自己的邀请码
    let agrs = this.$common.getRequest(window.location.href);
    if(agrs.ucode != undefined && agrs.ucode == this.userCode) {//判断是不是自己的商家码
      Toast("扫描自己商家码不可以支付哦~");
      this.huibeiFlage = true
    }
    if(agrs.action == 'depoint') {//depoint  是惠呗支付
      this.nickName = agrs.nickName
      this.gradeName = agrs.gradeName
      this.headPic = agrs.headPic
      this.ucode = agrs.ucode
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.huibeiDeduction-page {
  width: 100%;

  .user-info {
    padding: 15px;
    width: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    background-color: #fff;

    .head-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;

      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .info {
      margin-left: 15px;
      flex: 1;

      .name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .grade {
        margin-top: 6px;
        width: 100%;
        display: flex;
        align-items: center;

        > span {
          padding: 2px 6px;
          font-size: 10px;
          background-color: #2C343B;
          color: #D3AD71;
          border-radius: 10px;
        }
      }
    }
  }

  .deduction {
    padding: 15px 15px 25px;
    margin-top: 8px;
    width: 100%;
    background-color: #fff;

    .title {
      font-size: 14px;
      color: #333;
    }

    .entry {
      padding: 16px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EAEAEA;

      > img {
        width: 21px;
        height: 21px;
      }

      .input {
        flex: 1;
        padding: 0 10px;
        width: 100%;
        height: 40px;
        overflow: hidden;

        > input {
          width: 100%;
          font-size: 30px;
          font-weight: 500;
          color: #333;
        }
      }
    }

    .pay-btn {
      padding: 0 16px;
      width: 100%;

      .btn {
        padding: 15px 0;
        margin-block-start: 40px;
        width: 100%;
        font-size: 16px;
        text-align: center;
        background-color: #EA3323;
        color: #fff;
        border-radius: 24px;
      }
    }
  }
};
</style>
