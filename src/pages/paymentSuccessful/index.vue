<template>
  <div class="paymentSuccessful">
    <div class="paymentSuccessfulIcon">
      <img src="@/assets/personalCenter/success_icon.png" alt="">
    </div>
    <!-- 会员升级 -->
    <div class="upgrade-box" v-if="type = 'upgrade' && ytype == 'memberShip'">
      <div class="level">
        <div class="paymentSuccessfulTitle">
          <p v-if="ygrade == '3'">恭喜您购买{{ gradeName }}成功</p>
          <p v-if="ygrade == '4'">恭喜您购买{{ gradeName }}成功</p>
          <p v-if="ygrade == '5'">恭喜您购买{{ gradeName }}成功</p>
          <p v-if="ygrade == '6'">恭喜您购买{{ gradeName }}成功</p>
          <p v-if="ygrade == '7'">恭喜您购买{{ gradeName }}成功</p>
          <div class="desc" v-if="unCommission != '2'">赠送{{ goodPoint }}个惠呗已到账</div>
          <div class="desc">有效期至{{ usefulTime | timeStampFilter('yy-mm-dd') }}</div>
        </div>
        <div class="orderSuccessfulBtn">
          <router-link :to="{ name: 'home' }" replace>回到首页</router-link>
          <router-link :to="{ name: 'personalCenter' }" replace>个人中心</router-link>
        </div>
      </div>
    </div>

    <div class="upgrade-box" v-if="type= 'paySuc' && ytype == '3'">
      <div class="level">
        <div class="paymentSuccessfulTitle">
          <p v-if="payAct != 'pointRecharge'">支付成功</p>
          <p v-if="payAct == 'pointRecharge'">惠呗充值成功</p>
          <p class="prc" v-if="payAct == 'pointRecharge'">{{ point }}个惠呗已到账</p>
        </div>
        <div class="orderSuccessfulBtn">
          <router-link :to="{ name: 'home' }" class="no-wid">回到首页</router-link>
          <button @click="goOrderFun()" class="no-bgc bn">查看订单</button>
        </div>
      </div>
    </div>

    <!-- 商家码支付成功 -->
    <div class="upgrade-box" v-if="type= 'business' && ytype == 'huibei'">
      <div class="level">
        <div class="paymentSuccessfulTitle">
          <p>支付成功</p>
        </div>
        <div class="orderSuccessfulBtn">
          <router-link :to="{ name: 'home' }" class="no-wid">回到首页</router-link>
          <router-link :to="{ name: 'personalCenter' }" class="no-bgc bn">个人中心</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Models from '@/models'
export default {
  name:'paymentSuccessful',
  data () {
    return {
      type: '',
      ygrade: '',
      ytype: '',
      gradeName: '',
      payAct: '',//判断是否是惠呗充值
      point: '',//充值多少惠呗
      payId: '',//支付id
      usefulTime: '',//会员有效期
      unCommission: '',//1：分佣，2：不分佣
      goodPoint: '',//赠送多少惠呗
    }
  },
  methods:{
    // 重新获取级别
    getLevel() {
      Models.User
      .getInfo()
      .then(res => {
        if(res.data.code == '0') {
          this.ygrade = res.data.info.member.ygrade;
          // this.gradeName = res.data.info.member.gradeName;
          localStorage.setItem('gradeName', res.data.info.member.gradeName);
          localStorage.setItem('nextGradeName', res.data.info.member.nextGradeName);
          localStorage.setItem('headImagePic', res.data.info.headImagePic);
          localStorage.setItem('nickName', res.data.info.nickName);
          localStorage.setItem('ygrade', res.data.info.member.ygrade);
        }
      })
    },

    goOrderFun () {
      if(this.payAct == 'pointRecharge') {//惠呗充值
        sessionStorage.statusType = 0;
        this.$router.replace(`/allOrders`)
      }else {
        sessionStorage.statusType = 2;
        this.$router.replace(`/allOrders`)
      }
    },

    // 支付后查询会员商品
    payGoodsType () {
      let data = {
        id: this.payId
      }
      Models.User
      .laterinfo(data)
      .then(res => {
        if (res.data.code === '0') {
          this.unCommission = res.data.info.unCommission
          this.usefulTime = res.data.info.usefulTime
          this.goodPoint = res.data.info.goodPoint
          this.gradeName = res.data.info.ygrade
        }
      })
    }
  },
  created () {
    this.type = this.$route.query.type;
    this.ytype = this.$route.query.ytype;
    this.payAct = this.$route.query.payAct;//判断是否是惠呗充值
    this.point = this.$route.query.point;//充值多少惠呗
    // this.totalPoint = this.$route.query.totalPoint;
    this.payId = this.$route.query.payId;
    this.getLevel()
    if (this.ytype === 'memberShip') {//会员商品的才去查询
      this.payGoodsType()
    }

  },
  beforeRouteLeave (to, from, next) {
    if(to.path == '/orderPay') {
      this.$router.replace({
        name: 'home',
      });
      next(false)
    }else {
      next()
    }
  },
  components: {
  },
}
</script>
<style lang="less" scoped>
.paymentSuccessful {
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
        margin-bottom: 40px;

        p {
          line-height: 30px;
          width: 100%;
          font-weight: 800;
          color: #333;
          font-size: 18px;
          text-align: center
        }

        .prc {
          font-size: 14px;
          font-weight: normal;
          color: #EA3323
        }

        .desc {
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
          color: #EA3323;

          &:last-child {
            margin-top: 4px;
          }
        }
      }

      .paymentSuccessfulBtn {
        padding: 0 77px;
        margin-top: 40px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        > a {
          flex: 1;
          padding: 4px;
          font-size: 15px;
          text-align: center;
          color: #EA3323;
          border: 1px solid #EA3323;
          border-radius: 20px;

          &:last-child {
            margin-left: 24px;
          }
        }
      }

      .orderSuccessfulBtn {
        padding: 0 77px;
        margin-top: 40px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        > a {
          padding: 6px 4px;
          flex: 1;
          font-size: 15px;
          text-align: center;
          color: #EA3323;
          border: 1px solid #EA3323;
          border-radius: 20px;

          &:last-child {
            margin-left: 24px;
            flex: 1;
            background-color: #EA3323;
            color: #fff;
          }

          &.no-wid {
            flex: 1;
          }

          &.no-bgc {
            flex: 1;
            color: #EA3323;
            background-color: transparent;
          }

          &.bn {
            background-color: #EA3323;
            color: #fff;
          }
        }

        > button {
          padding: 6px 4px;
          flex: 1;
          font-size: 15px;
          text-align: center;
          color: #EA3323;
          border: 1px solid #EA3323;
          border-radius: 20px;

          // &:last-child {
          //   margin-left: 24px;
          //   width: 120px;
          //   background-color: #EA3323;
          //   color: #fff;
          // }

          &:last-child {
            margin-left: 24px;
            flex: 1;
            background-color: #EA3323;
            color: #fff;
          }

          &.no-wid {
            flex: 1;
          }

          &.no-bgc {
            flex: 1;
            color: #EA3323;
            background-color: transparent;
          }

          &.bn {
            background-color: #EA3323;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
