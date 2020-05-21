<template>
  <div class="recharge-page">
    <div class="banner" v-if="chargeAct == 3">
      <img class="rect" src="@/assets/personalCenter/rectangle.png" alt="">
      <img class="card" src="@/assets/personalCenter/rectangle02.png" alt="">
    </div>
    <div class="balance-recharge">
      <div class="rechargeListTitle">请选择充值套餐</div>
      <div class="recharge" v-if="chargeAct == 2">
        <ul class="r-list">
          <li class="r-item"
            v-for="(item, index) in fundRechargePlan"
            :key="index"
            :class="[selectIndex == index ? 'clickDiv' : '']"
            @click="selectPackage(item, index)"
            >
            <div>
              <p class="price">￥{{ item.amount }}</p>
              <p class="income">到账{{ item.point }}余额</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="recharge" v-if="chargeAct == 3">
        <ul class="r-list">
          <li class="r-item"
            v-for="(item, index) in pointRechargePlan"
            :key="index"
            :class="[selectIndex == index ? 'clickDiv' : '']"
            @click="selectPackage(item, index)"
            >
            <div>
              <p class="price">￥{{ item.price }}</p>
              <p class="income">到账{{ item.point }}个惠呗</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="recharge" v-if="chargeAct == 4">
        <ul class="r-list">
          <li class="r-item"
            v-for="(item, index) in fundToPointPlan"
            :key="index"
            :class="[selectIndex == index ? 'clickDiv' : '']"
            @click="selectPackage(item, index)"
            >
            <div>
              <p class="price">{{ item.amount }}<span>余额</span></p>
              <p class="income">到账{{ item.amount | filterFoalt }}个惠呗</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="recharge-info" v-if="chargeAct == 2 || chargeAct == 3">
      <div class="r-text">充值说明</div>
      <p class="r-desc">1、充值成功后的余额/惠呗不会过期，但无法退款、提现。</p>
      <p class="r-desc">2、遇到无法充值或充值失败等问题，可联系在线客服，我们会耐心解答你的问题。</p>
    </div>
    <div class="recharge-info" v-if="chargeAct == 4">
      <div class="r-text">兑换说明</div>
      <p class="r-desc">1、兑换成功后的惠呗不会过期，但无法退款、提现。</p>
      <p class="r-desc">2、遇到无法兑换或兑换失败等问题，可联系在线客服，我们会耐心解答你的问题。</p>
    </div>
    <div class="btn">
      <div class="sure" @click="pay">确认支付（{{ '￥' + payMoney }}）</div>
    </div>
    <!-- 微信支付弹框 -->
    <van-popup v-model="show" position="bottom">
      <div class="payTitle">
        <span class="payTitleBtn" @click="show = false">X</span>
        <span class="payTitleText">付款</span>
      </div>
      <div class="payAmount">
        <p>
          <span>￥</span><span>{{ payMoney }}</span>
        </p>
        <p>充值{{ payMoneyPoint }}{{ selectionType }}</p>
      </div>
      <div class="paymentMethod">
        <div class="paymentMethodTitle">选择支付方式</div>
        <div class="paymentMethodList">
          <van-radio-group v-model="weChartRadio" v-if="chargeAct == 2 || chargeAct == 3">
            <van-radio name="1" checked-color="#EA3323">
              <div class="img-icon"><img src="@/assets/homePage/wechat.png" alt=""></div>
              <span>微信</span>
            </van-radio>
          </van-radio-group>
          <van-radio-group v-model="balanceRadio" v-if="chargeAct == 4">
            <van-radio name="3" checked-color="#EA3323">
              <div class="img-icon"><img src="@/assets/homePage/balance.png" alt=""></div>
              <span>余额支付</span>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="paymentBtn" @click="getWXPayContent" v-if="chargeAct == 2 || chargeAct == 3">
          <button>付款{{ payMoney }}元</button>
        </div>
        <div class="paymentBtn" @click="goGetbalanceToPoint" v-if="chargeAct == 4">
          <button>付款{{ payMoney }}元</button>
        </div>
      </div>
    </van-popup>
    <!-- 密码支付弹框 -->
    <van-popup v-model="showKeyboard" position="bottom">
      <payPassword @goPay="getbalanceToPoint" @offPayWindow="offEnterPassword" :value1="value1"></payPassword>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import payPassword from "@/components/payPassword";
import Models from "@/models";
import wx from "weixin-js-sdk";
import { Popup, Toast, Icon, Loading , Dialog, RadioGroup, Radio } from "vant";
Vue.use(Popup).use(Toast).use(Dialog).use(Loading).use(RadioGroup).use(Radio);
export default {
  name: 'recharge',
  data() {
    return {
      huibeiCode: undefined,//是否从惠呗商家码支付过来充值的
      chargeAct: '',//余额充值
      fundRechargePlan: [],//余额充值套餐
      pointRechargePlan: [],//惠贝充值套餐
      fundToPointPlan: [],//惠贝兑换套餐
      selectIndex: '0',//套餐的索引
      point: '',//充值的惠呗
      keyId: 0,
      payMoney: '',
      payMoneyPoint: '',//充值多少余额
      show: false,
      selectionType: '余额',
      weChartRadio: '1',
      balanceRadio: '3',
      WXPayContentJson: {},
      showKeyboard: false,
      value1: '',//支付密码
      goodId: '',//选择套餐的goodId
      skuId: '',//选择套餐的sku
      goodsObj: {
        tokenId: '',
        addressId: '',
        yfrom: 'direct',
        depoint: '0',
        goods: [],
      },
      WXPayContentJson: {
        userId: '',
        payId: '',
        payAmount: '',
      },
    };
  },
  filters: {
    filterFoalt(val) {
      return parseFloat(val)
    }
  },
  watch: {

  },
  methods: {
    //充值余额和惠呗的接口
    getPrepareCharge(data) {
      Models.User
      .prepareCharge(data)
      .then(res => {
        if (res.data.code === '0') {
          this.WXPayContentJson = res.data.info;
        }
      });
    },
    //获取所有套餐接口
    getRechargePlan() {
      Models.User
      .rechargePlan()
      .then(res => {
        if(res.data.code === '0') {
          this.fundRechargePlan = res.data.info.fundRechargePlan; //余额充值套餐
          this.fundToPointPlan = res.data.info.fundToPointPlan; //惠贝兑换套餐
          if(this.chargeAct == 2) {
            this.payMoney = this.fundRechargePlan[0].amount
            this.payMoneyPoint = this.fundRechargePlan[0].point
            this.keyId = this.fundRechargePlan[0].keyId
          }else if(this.chargeAct == 4) {
            this.payMoney = this.fundToPointPlan[0].amount
            this.keyId = this.fundToPointPlan[0].keyId
          }
        }else {
          Toast(res.data.msg)
        }
      });
    },
    //获取惠呗充值套餐
    getpPintrecharge() {
       Models.User
      .pointrecharge()
      .then(res => {
        if(res.data.code === '0') {
          this.pointRechargePlan = res.data.info.goodRechargeSkuMOList
          this.payMoney = this.pointRechargePlan[0].price
          this.goodId = res.data.info.goodId
          if(this.selectIndex === '0') {
            this.skuId = res.data.info.goodRechargeSkuMOList[0].skuId
            this.point = res.data.info.goodRechargeSkuMOList[0].point
          }
        }else {
          Toast(res.data.msg)
        }
      })
    },
    // 选择套餐
    selectPackage(item, index) {
      this.selectIndex = index
      this.keyId = item.keyId
      if(this.chargeAct == 3) {
        this.payMoney = item.price
        for(let i = 0; i < this.pointRechargePlan.length; i++) {
          if(index == i) {
            this.skuId = this.pointRechargePlan[i].skuId
            this.point = this.pointRechargePlan[i].point
          }
        }
      }else {
        this.payMoney = item.amount
        this.payMoneyPoint = item.point
      }
    },
    //确认支付
    pay() {
      if(this.chargeAct == 3) {
        let data = {
          goodId: this.goodId,
          skuId: this.skuId
        }
        Models.Home
        .submitForDirect(data)
        .then(res => {
          if(res.data.code === '0') {
            this.WXPayContentJson.userId = res.data.info.userId
            this.WXPayContentJson.payId = res.data.info.payId
            this.WXPayContentJson.payAmount = res.data.info.payAmount
            this.$router.replace({
              name: 'orderPay',
              query: {
                totalAmount: this.WXPayContentJson.payAmount,
                userId: this.WXPayContentJson.userId,
                payId: this.WXPayContentJson.payId,
                payAmount: this.WXPayContentJson.payAmount,
                payAct: 'pointRecharge',
                point: this.point,
                huibeiCode: this.huibeiCode,
              }
            })
          }else if(res.data.code === '20933') {
            Toast(res.data.msg)
          }else {
            Toast(res.data.msg)
          }
        })
      }else {
        this.show = true;
        if(this.chargeAct != 4) {
          let data = {
            keyId: this.keyId,
            chargeAct: this.chargeAct
          };
          this.getPrepareCharge(data);
        }
      }
    },
    //查询支付结果
    payResult () {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '支付中...'
      });
      let data = {
        id: this.WXPayContentJson.payId
      }
      Models.User
      .getPayResult(data)
      .then(res => {
        this.bus.$emit('getLoading', {loading: false})
        if (res.data.info.hadPay === 'yes') {
          this.$router.go(-1);
        }else {
          Toast('支付失败')
        }
      })
    },
    //付款----微信
    getWXPayContent() {
      if(this.weChartRadio == '') {
        Toast({
          position: 'bottom',
          message: '请选择支付方式'
        })
        return
      }
      let aData = {
        userId: this.WXPayContentJson.userId,
        payId: this.WXPayContentJson.payId,
        payAmount: this.WXPayContentJson.payAmount
      };
      Models.User
      .WXPayContent(aData)
      .then(res => {
        if (res.data.code === 200) {
          this.goPay(res.data.data);
        }
      });
    },
    goPay(data) {
      let that = this;
      WeixinJSBridge.invoke("getBrandWCPayRequest", JSON.parse(data), function(
        data
      ) {
        if (data.err_msg.substr(-2) == "ok") {
          that.showKeyboard = false;
          // that.$router.go(-1);
          that.payResult();
        } else if (data.err_msg.substr(-6) == "cancel") {
          that.skuId = ''
          that.point = ''
          Toast("您已取消支付");
        } else {
          Toast("支付失败");
        }
      });
    },
    //付款---余额
    goGetbalanceToPoint() {
      let data = {
        var: 'pay'
      };
      Models.Home
      .checkPassword(data)
      .then(res => {
        if(res.data.info.status === 'no') {
          Dialog.confirm({
            title: '温馨提示',
            message: '请先设置支付密码'
          }).then(() => {
            this.$router.push({
              name: 'phoneVerification',
              query:{
                editType: 4
              }
            })
          }).catch(() => {
            this.showKeyboard = false;
            this.value1 = ''
          });
        }else {
          this.showKeyboard = true
        }
      })
    },
    //密码框付款
    getbalanceToPoint(password) {
      let data = {
        id: this.keyId,
        payPassword: password
      };
      Models.User
      .balanceToPoint(data)
      .then(res => {
        if (res.data.code === '0') {
          this.$router.go(-1);
          this.showKeyboard = false;
          Toast('兑换成功');
        } else {
          Toast(res.data.msg);
        }
      });
    },
    offEnterPassword() {
      this.showKeyboard = false;
      Toast('您已取消支付')
    },
  },
  computed: {

  },
  created() {
    this.chargeAct = this.$route.query.chargeAct
    this.huibeiCode = this.$route.query.huibeiCode
    if(this.chargeAct == 3) {
      this.getpPintrecharge()
    }else {
      this.getRechargePlan()
    }
  },
  mounted() {

  },
  components: {
    payPassword
  },
};
</script>

<style lang="less">
.recharge-page {
  padding-bottom: 70px;
  width: 100%;

  .banner {
    position: relative;
    width: 100%;
    height: 181px;
    overflow: hidden;

    .rect {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .card {
      position: absolute;
      top: 24px;
      left: 15px;
      width: 345px;
    }
  }

  .balance-recharge {
    padding: 0 15px;
    width: 100%;

    .rechargeListTitle {
      margin-top: 30px;
      margin-bottom: 20px;
      width: 100%;
      font-size: 15px;
      color: #333;
    }

    .recharge {
      width: 100%;

      .r-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .r-item {
          margin: 0 15px 15px 0;
          width: 165px;
          height: 90px;
          display: flex;
          align-items: center;
          background-color: #fff;
          border-radius: 8px;

          &.clickDiv {
            border: 1px solid #EA3323;
            color: #EA3323;
            border-radius: 8px;

            > div > p {
              color: #EA3323;
            }
          }

          &:nth-child(2n) {
            margin-right: 0;
          }

          div {
            width: 100%;
            color: #333;

            .price {
              font-size: 24px;
              font-weight: bold;
              width: 100%;
              text-align: center;

              > span {
                font-size: 18px;
              }
            }

            .income {
              width: 100%;
              font-size: 14px;
              text-align: center;
              color: #999;
            }
          }
        }
      }
    }
  }

  .recharge-info {
    padding: 0 15px;
    width: 100%;

    .r-text {
      font-size: 15px;
      color: #333;
    }

    .r-desc {
      margin-top: 15px;
      font-size: 12px;
      color: #999;
    }
  }

  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 5px 15px;
    width: 100%;
    background-color: #fff;

    .sure {
      padding: 15px 0;
      width: 100%;
      font-size: 16px;
      text-align: center;
      background: -webkit-linear-gradient(left,  #F12F4B , #ED2E60 ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #F12F4B , #ED2E60); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #F12F4B , #ED2E60); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #F12F4B , #ED2E60) ; /* 标准的语法 */
      color: #fff;
      border-radius: 25px;
    }
  }

  .payTitle {
    width: 100%;
    height: 47px;
    line-height: 40px;
    position: relative;
    text-align: center;
    border-bottom: 1px solid #eaeaea;

    .payTitleBtn {
      font-size: 20px;
      left: 13px;
      top: 5px;
      position: absolute;
    }

    .payTitleText {
      vertical-align: middle;
      position: relative;
      color: #333333;
      font-size: 15px;
    }
  }

  .payAmount {
    width: 100%;
    height: auto;
    text-align: center;
    padding: 30px 0;

    p:first-child {
      color: #333333;
      margin-bottom: 3px;

      span:first-child {
        font-size: 15px;
      }

      span:last-child {
        font-size: 24px;
      }
    }

    p:last-child {
      color: #999999;
      font-size: 12px;
    }
  }

  .paymentMethod {
    width: 100%;

    .paymentMethodTitle {
      color: #333333;
      font-size: 15px;
      padding: 0 15px;
    }

    .paymentMethodList {
      width: 100%;
      font-size: 15px;

      .van-radio-group {
        .van-radio {
          padding: 14px 16px;
          border-bottom: 1px solid #EAEAEA;
          overflow: hidden;
          display: inherit;

          &::after {
            display: block;
            clear: both;
            content: ' ';
          }

          .van-radio__icon {
            float: right;
            margin-top: 4px;
          }
          .van-radio__label {
            margin-left: 0;
            width: 91%;
            line-height: 28px;

            .img-icon {
              float: left;
              width: 28px;
              height: 28px;
              border-radius: 4px;
              overflow: hidden;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
              }
            }

            > span {
              margin-left: 16px;
            }
          }
        }
      }
    }
  }

  .paymentBtn {
    width: 100%;
    height: auto;
    padding: 37px 15px 16px;

    button {
      width: 100%;
      height: 40px;
      font-size: 15px;
      color: #ffffff;
      border-radius: 8px;
      border: none;
      background-color: #ea3323;
    }
  }
};
</style>
