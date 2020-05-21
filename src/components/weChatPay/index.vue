<template>
  <div class="weChatPay-page">
    <!-- 支付方式 -->
    <van-popup v-model="currentShow" @click-overlay="close" position="bottom">
      <div class="payTitle">
          <div class="payTitleBtn" @click="close"><img src="@/assets/homePage/colse-02.png" alt=""></div>
          <div class="payTitleText">付款</div>
        </div>
        <div class="payAmount">
          <p class="mongy">￥{{ money }}</p>
          <p class="mach">充值{{ money | moneyFloat }}余额</p>
        </div>
        <div class="paymentMethod">
          <div class="paymentMethodTitle">选择支付方式</div>
          <div class="pay-way">
            <van-radio-group v-model="radio">
              <van-radio name="1" checked-color="#EA3323">
                <div class="img-icon"><img src="@/assets/homePage/wechat.png" alt=""></div>
                <span>微信</span>
              </van-radio>
              <van-radio name="2" checked-color="#EA3323">
                <div class="img-icon"><img src="@/assets/homePage/alipay.png" alt=""></div>
                <span>支付宝</span>
              </van-radio>
              <van-radio name="3" checked-color="#EA3323">
                <div class="img-icon"><img src="@/assets/homePage/balance.png" alt=""></div>
                <span>余额支付</span>
              </van-radio>
            </van-radio-group>
          </div>
          <div class="pay-btn">
            <div class="btn" @click="payMoney">付款{{ money }}元</div>
          </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import wx from 'weixin-js-sdk';
import { Popup , Toast, RadioGroup, Radio } from 'vant'
Vue.use(Popup).use(Toast).use(RadioGroup).use(Radio)
export default {
  props: {
    payShow: {
      type: Boolean,
      default: false,
    },
    money: {
      type: String,
      default: '0',
    }
  },
  data() {
    return {
      radio: '1',
      currentShow: this.payShow
    };
  },
  filters: {
    moneyFloat(val) {
      return parseFloat(val)
    }
  },
  watch: {
    payShow(val) {
      this.currentShow = val
    }
  },
  methods: {
    close() {
      this.$emit('payClose')
    },
    payMoney() {
      this.$emit('payMoney', this.radio)
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
.weChatPay-page {
  width: 100%;

  .weChatPay-mark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 9999;
  }

  .weChatPay-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 50%;
    background-color: #fff;
    z-index: 9999;
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
        left: 14px;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;

        > img {
          width: 100%;
          height: 100%;
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
      padding: 32px 0;
      width: 100%;

      .mongy {
        font-size: 24px;
        color: #333;
        text-align: center;
      }

      .mach {
        margin-top: 6px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }
    }

    .paymentMethod {
      padding-bottom: 16px;
      width: 100%;

      .paymentMethodTitle {
        padding: 0 16px;
        font-size: 15px;
        color:#333333;
      }

      .pay-way {
        width: 100%;
        font-size: 15px;

        .van-radio-group {
          .van-radio {
            padding: 14px 16px;
            border-bottom:1px solid #EAEAEA;
            overflow: hidden;

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

            .van-radio__icon {
              float: right;
              margin-top: 4px;
            }
            .van-radio__label {
              margin-left: 0;
              width: 91%;
              line-height: 28px;

              > span {
                margin-left: 16px;
              }
            }
          }
        }
      }

      .pay-btn {
        padding: 0 16px;
        margin-top: 38px;
        width: 100%;

        .btn {
          padding: 13px 0;
          width: 100%;
          font-size: 15px;
          text-align: center;
          background-color: #EA3323;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
};
</style>
