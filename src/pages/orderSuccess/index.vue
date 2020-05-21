<template>
  <div class="orderSuccess">
    <div class="paymentSuccessfulIcon">
      <img src="@/assets/chosen.png" alt="">
    </div>
    <!-- 普通商品升级店主 -->
    <div class="upgrade-box">
      <div class="level">
        <div class="paymentSuccessfulTitle">
          <p>订单已完成</p>
        </div>
        <div class="paymentSuccessfulBtn">
          <router-link :to="{ name: 'verified', query: { ygrade: myInfo.member.ygrade, partnerShip: myInfo.partnerShip } }">继续完善资料</router-link>
          <router-link :to="{ name: 'home' }">跳过</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Models from '@/models';
export default {
  name:'orderSuccess',
  data () {
    return {
      myInfo: {}
    }
  },
  methods:{
    // 重新获取级别
    getLevel() {
      Models.User
      .getInfo()
      .then(res => {
        if(res.data.code == '0') {
          this.myInfo = res.data.info;
        }
      })
    },
  },
  created () {
    this.getLevel()
  },
  components: {
  },
}
</script>
<style lang="less" scoped>
.orderSuccess {
  width: 100%;
  height: auto;

  .paymentSuccessfulIcon {
    width: 100%;
    height: auto;
    margin: 132px 0 22px;

    img {
      width: 84px;
      height: 84px;
      margin: 0 auto;
      vertical-align: middle;
    }
  }

  .upgrade-box {
    width: 100%;

    .level {
      width: 100%;

      .paymentSuccessfulTitle {
        width: 100%;
        height: auto;
        margin-bottom: 44px;

        p {
          line-height: 30px;
          width: 100%;
          font-weight: 800;
          color: #EA3323;
          font-size: 18px;
          text-align: center
        }
      }

      .paymentSuccessfulBtn {
        padding: 0 77px;
        margin-top: 68px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        > a {
          padding: 4px;
          width: 120px;
          font-size: 15px;
          text-align: center;
          color: #EA3323;
          border: 1px solid #EA3323;
          border-radius: 20px;

          &:last-child {
            margin-left: 24px;
            width: 80px;
            background-color: #EA3323;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>


