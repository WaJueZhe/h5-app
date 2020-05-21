<template>
  <div class="huibeiWay-page">
    <div class="payAmount">
      <div class="payAmount-box">
        <p class="mongy-text">惠呗抵扣</p>
        <p class="mongy">{{ depoint }} <span>个</span> </p>
      </div>
    </div>
    <div class="paymentMethod">
      <div class="paymentMethodTitle">选择支付方式</div>
      <div class="pay-way">
        <van-radio-group v-model="radio">
          <van-radio name="3" checked-color="#EA3323">
            <div class="img-icon"><img src="@/assets/homePage/hui-bai.png" alt=""></div>
            <span>惠呗抵扣 ( {{ '惠呗：' + point }} ) </span>
          </van-radio>
        </van-radio-group>
      </div>
      <div class="desc" v-if="ygrade >= 5 && blFlage == true">
        <span class="text">*您当前账户惠呗不足,请充值后支付</span>
        <router-link :to="{ name: 'recharge', query: { chargeAct: '3', huibeiCode: true } }" class="go-balance">去充值</router-link>
      </div>
      <div class="pay-btn">
        <div class="btn" @click="payMoney">立即支付</div>
      </div>
    </div>

    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <PayPassword @goPay="getConfirmReceive" @offPayWindow="offShowKeyboard" :value1="value1"></PayPassword>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import PayPassword from "@/components/payPassword";
import { Popup , Toast, RadioGroup, Radio , Dialog } from 'vant'
Vue.use(Popup).use(Toast).use(RadioGroup).use(Radio).use(Dialog);
export default {
  name: 'huibeiWay',
  data() {
    return {
      radio: '3',
      point: '',
      depoint: '',//支付数量
      shoperUCode: '',//支付商家码
      showKeyboard: false,//余额支付
      value1: '',//支付密码
      blFlage: false,//当前惠呗是否低于支付惠呗
      ygrade: localStorage.getItem('ygrade'),//获取等级
    };
  },
  watch: {
     showKeyboard() {
      if(this.showKeyboard == false) {
        this.value1 = ''
      }
    },
  },
  methods: {
    getBalance() {
      Models.User
      .getBalance()
      .then(res => {
        this.point = res.data.info.point;
        if(this.radio == '3') {
          if(Number(this.point) < Number(this.depoint)) {
            this.blFlage = true
          }else {
            this.blFlage = false
          }
        }
      })
    },
    init() {
      let data = {
        var: 'pay'
      };
      Models.Home
      .checkPassword(data)
      .then(res => {
        if(res.data.info.status == 'no') {
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
    offShowKeyboard () {
      this.showKeyboard = false;
      Toast('您已取消支付')
    },
    payMoney() {
      if(this.radio == '3') {
        if(this.blFlage) {
          Toast('惠呗不足，无法支付')
          return
        }
        this.init()
      }
    },
    //余额支付
    getConfirmReceive(password) {
      let data = {
        shoperUCode: this.shoperUCode,
        depoint: this.depoint,
        payPassword: password,
      };
      Models.User
      .offlineDepoint(data)
      .then(res => {
        if(res.data.code == '0') {
          this.shoperUCode = null;
          this.depoint = null;
          this.value1 = '';
          this.$router.replace({
            name: 'paymentSuccessful',
            query: {
              type: 'business',
              ytype: 'huibei'
            }
          })
        }else {
          Toast(res.data.msg);
        }
      })
    },
  },
  computed: {

  },
  created() {

  },
  activated () {
    this.depoint = this.$route.query.depoint;
    this.shoperUCode = this.$route.query.shoperUCode;
    this.getBalance()
  },
  mounted() {

  },
  components: {
    PayPassword
  },
};
</script>

<style lang="less">
.huibeiWay-page {
  width: 100%;
  background-color: #fff;

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
      padding: 32px 0;
      width: 100%;
      border-bottom: 1px solid #EAEAEA;

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

        > span {
          font-size: 12px;
          font-weight: normal;
        }
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
         padding: 0 28px;

        .van-radio {
          padding: 14px 0;
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
          }

          .van-radio__label {
            margin-left: 0;
            width: 91%;
            line-height: 21px;

            .img-icon {
              float: left;
              width: 21px;
              height: 21px;
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
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        font-size: 14px;
        color: #EA3323;
      }

      .go-balance {
        padding: 2px 10px;
        font-size: 14px;
        color: #EA3323;
        border: 1px solid #EA3323;
        border-radius: 13px;
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
};
</style>
