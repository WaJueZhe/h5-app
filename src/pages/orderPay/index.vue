<template>
  <div class="orderPay-page">
    <van-popup v-model="currentShow" position="right" :overlay="false">
      <div class="payAmount">
        <div class="payAmount-box">
          <p class="mongy-text">付款</p>
          <p class="mongy">￥{{ WXPayContentJson.payAmount | moneyFloat }}</p>
        </div>
      </div>
      <div class="paymentMethod">
        <div class="paymentMethodTitle">选择支付方式</div>
        <div class="pay-way">
          <van-radio-group v-model="radio">
            <van-radio name="3" checked-color="#EA3323">
              <div class="img-icon"><img src="@/assets/homePage/balance.png" alt=""></div>
              <span>余额支付 ( {{ '余额：' + '￥' + balance }} ) </span>
            </van-radio>
            <van-radio name="1" checked-color="#EA3323">
              <div class="img-icon"><img src="@/assets/homePage/wechat.png" alt=""></div>
              <span>微信</span>
            </van-radio>
            <!-- <van-radio name="2" checked-color="#EA3323">
              <div class="img-icon"><img src="@/assets/homePage/alipay.png" alt=""></div>
              <span>支付宝</span>
            </van-radio> -->
            <van-radio name="4" checked-color="#EA3323" v-if="ytype == 'memberShip'">
              <div class="img-icon"><img src="@/assets/homePage/xianxia.png" alt=""></div>
              <span>线下支付</span>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="desc" v-if="blFlage">
          <span class="text">您当前账户余额不足，请充值后支付！</span>
          <router-link :to="{ name: 'recharge', query: { chargeAct: '2' } }" class="go-balance">去充值</router-link>
        </div>
        <div class="pay-btn">
          <div class="btn" @click="payMoney">立即支付</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <PayPassword @goPay="getConfirmReceive" @offPayWindow="offShowKeyboard" :value1="value1"></PayPassword>
    </van-popup>

    <div class="under-loading" v-show="underLoading">
      <van-loading type="spinner" color="#fff" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import PayPassword from "@/components/payPassword";
import { Popup , Toast, RadioGroup, Radio , Dialog, Loading } from 'vant'
Vue.use(Popup).use(Toast).use(RadioGroup).use(Radio).use(Dialog).use(Loading);
export default {
  data() {
    return {
      radio: '1',
      currentShow: true,
      totalAmount: '',
      balance: '',//当前余额
      blFlage: false,//余额不足开关

      WXPayContentJson: {
        userId: '',
        payId: '',
        payAmount: '',
      },
      showKeyboard: false,//余额支付
      value1: '',//支付密码
      ytype: '',
      underLoading: false,
      payAct: '',//判断是否是惠呗充值
      point: '',//充值多少惠呗
      huibeiCode: undefined,//是否从惠呗商家码支付过来充值的
    };
  },
  watch: {
    showKeyboard() {
      if(this.showKeyboard == false) {
        this.value1 = ''
      }
    },
    radio(newVal, oldVal) {
      if(newVal == 3) {
        if(Number(this.balance) < Number(this.WXPayContentJson.payAmount)) {
          this.blFlage = true
        }
      }else {
        this.blFlage = false
      }
    },
  },
  methods: {
    //获取当前余额
    getBalanceMoney() {
      Models.User
      .getBalance()
      .then(res => {
        if (res.data.code === '0') {
          this.balance = res.data.info.balance;
          localStorage.setItem('hadPayPass', res.data.info.hadPayPass)
        }
      })
    },
    init() {
      let hadPayPass = localStorage.getItem('hadPayPass')
      if(hadPayPass == 'no') {
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
    },
    offShowKeyboard () {
      this.showKeyboard = false;
      Toast('您已取消支付')
    },
    payMoney() {
      if(this.radio == '1') {
        this.weixinPay()
      }else if(this.radio == '2') {
        Toast('暂不支持')
      }else if(this.radio == '3') {
        if(this.blFlage == true) {
          Toast('余额不足，请先充值')
          return
        }
        this.init()
      }else if(this.radio == '4') {
        this.underTheLine()
      }
    },
    //微信支付
    weixinPay() {
      Models.User
      .WXPayContent(this.WXPayContentJson)
      .then(res => {
        if ( res.data.code === 200 ) {
          this.goPay(res.data.data);
        }else {
          Toast('支付失败，请联系客服')
        }
      })
    },
    goPay (data) {
      // let that = this;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
          JSON.parse(data),
            (data) => {
            if (data.err_msg.substr(-2) == 'ok') {
              this.payResult()//查询支付结果
            } else if (data.err_msg.substr(-6) == 'cancel') {
              Toast('您已取消支付')
            }else {
              Toast('支付失败')
            }
          }
        )
    },
    //查询支付结果
    payResult () {
      this.showKeyboard = false;
      this.value1 = ''
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
        if (res.data.info.hadPay === 'yes') {
          this.WXPayContentJson.payAmount = null;
          this.value1 = '';
          if(this.ytype == 'memberShip') {//会员升级订单
            this.$router.replace({
              name: 'paymentSuccessful',
              query: {
                type: 'upgrade',
                ytype: 'memberShip',
                payId: this.WXPayContentJson.payId
              }
            })
          }else {
            if(this.huibeiCode) {
              this.$router.go(-1)
            }else {
              this.$router.replace({
                name: 'paymentSuccessful',
                query: {
                  type: 'paySuc',
                  ytype: '3',
                  payAct: this.payAct,
                  point: this.point,
                  payId: this.WXPayContentJson.payId
                }
              })
            }
          }
        }else {
          this.bus.$emit('getLoading', {loading: false})
          Toast('支付失败')
        }
      })
    },
    //余额支付
    getConfirmReceive(password) {
      let data = {
        payId: this.WXPayContentJson.payId,
        payWay: 'balancePay',
        payAct: 'userUpgrade',
        payAmount: this.WXPayContentJson.payAmount,
        payPassword: password,
      };
      Models.User
      .dopay(data)
      .then(res => {
        if(res.data.code === '0') {
          this.payResult()//查询支付结果
        }else {
          Toast(res.data.msg);
        }
      })
    },
    //线下支付
    underPay(result) {
      this.underLoading = true;
      let data = {
        payId: this.WXPayContentJson.payId,
        payCode: result,
        payAmount: this.WXPayContentJson.payAmount,
      };
      Models.User
      .offlinePay(data)
      .then(res => {
        this.underLoading = false;
        if(res.data.code === '0') {
          this.payResult()//查询支付结果
        }else {
          Toast(res.data.msg)
        }
      })
    },
    //线下扫一扫
    underTheLine() {
      let that = this;
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            var result = res.resultStr; //扫码返回的结果
            that.underPay(result)
          }
        })
      })
    },
  },
  computed: {

  },
  beforeRouteLeave (to, from, next) {
    if(to.path == '/balance' || to.path == '/upgradeDetail' || to.path == '/goodsDetails' || to.path == '/shoppingCart') {
      sessionStorage.statusType = 1
      this.$router.replace({
        name: 'allOrders',
      });
      next(false)
    }
    else {
      next()
    }
  },

  created() {

  },
  activated () {
    this.currentShow = true;
    this.totalAmount = this.$route.query.totalAmount;
    this.WXPayContentJson.userId = this.$route.query.userId;
    this.WXPayContentJson.payId = this.$route.query.payId;
    this.WXPayContentJson.payAmount = this.$route.query.payAmount;
    this.type = this.$route.query.type;
    this.ytype = this.$route.query.ytype;
    this.payAct = this.$route.query.payAct;//判断是不是惠呗充值
    this.point = this.$route.query.point;//充值多少惠呗
    this.huibeiCode = this.$route.query.huibeiCode;//判断是不是惠呗商家码支付过来充值的
    this.radio = '1'
    this.getBalanceMoney()
    let url = window.location.href.split('#')[0];
    sdk.getJSSDK(url);
  },
  mounted() {

  },
  components: {
    PayPassword
  },
};
</script>

<style lang="less">
.orderPay-page {
  width: 100%;

  .van-popup--right {
    width: 100%;
    height: 100%;
  }

  .payTitle {
    position: relative;
    width: 100%;
    height: 47px;
    text-align: center;
    border-bottom:1px solid #EAEAEA;
    overflow: hidden;

    .payTitleBtn {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding: 13px 6px;

      > img {
        width: 20px;
        height: 20px;
      }
    }

    .payTitleText {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size:15px;
      color:#333;
    }
  }

  .payAmount {
    padding: 0 32px;
    width: 100%;

    .payAmount-box {
      position: relative;
      padding: 32px 0;
      width: 100%;

      &::after {
        content: "";
        width: 200%;
        height: 0;
        display: block;
        border-bottom: 1px solid #EAEAEA;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        transform: scale(.5);
        transform-origin: left bottom;
      }

      .mongy-text {
        font-size: 18px;
        color: #333;
        text-align: center;
      }

      .mongy {
        margin-top: 22px;
        font-size: 24px;
        font-weight: bold;
        color: #EA3323;
        text-align: center;
      }
    }
  }

  .paymentMethod {
    padding-bottom: 16px;
    margin-top: 27px;
    width: 100%;

    .paymentMethodTitle {
      position: relative;
      padding: 0 28px;
      font-size: 15px;
      color:#333;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        width: 4px;
        height: 13px;
        border-radius: 2px;
        background-color: #EA3323;
      }
    }

    .pay-way {
      margin-top: 10px;
      width: 100%;
      font-size: 15px;

      .van-radio-group {
        .van-radio {
          position: relative;
          padding: 14px 28px;
          overflow: hidden;
          display: inherit;

          &::after {
            content: "";
            width: 200%;
            height: 0;
            display: block;
            border-bottom: 1px solid #EAEAEA;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            transform: scale(.5);
            transform-origin: left bottom;
          }

          &:last-child {
            border-bottom: none;
          }

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

    .desc {
      padding: 0 20px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        font-size: 14px;
        color: #EA3323;
      }

      .go-balance {
        padding: 2px 6px;
        font-size: 14px;
        color: #fff;
        background-color: #EA3323;
        border-radius: 6px;
      }
    }

    .pay-btn {
      padding: 0 32px;
      margin-top: 20px;
      width: 100%;

      .btn {
        padding: 13px 0;
        width: 100%;
        font-size: 15px;
        text-align: center;
        background-color: #EA3323;
        color: #fff;
        border-radius: 40px;
      }
    }
  }

  .under-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 9999;

    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
};
</style>
