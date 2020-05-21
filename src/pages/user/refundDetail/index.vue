<template>
  <div class="refundDetail-page">
    <div class="refund-info">
      <div class="refund-box" v-if="info.ystatus === '1'">
        <div class="refund-title">请等待商家处理</div>
      </div>
      <div class="refund-box" v-if="info.ystatus === '2' && expressBook.id === ''">
        <div class="refund-title">请退货给商家</div>
        <div class="time" v-if="flageTime">
          <van-count-down
            :time="time"
            :auto-start="false"
            format="还剩 DD 天 HH 小时 mm 分"
            @finish="finished"
          />
        </div>
      </div>
      <div class="refund-box" v-if="info.ystatus === '2' && expressBook.id !== ''">
        <div class="refund-title">请等待商家收货并退款</div>
      </div>
      <div class="refund-box" v-if="info.ystatus === '3'">
        <div class="refund-title">退款成功</div>
        <div class="time">{{ info.downTime | timeStampFilter('年-月-日 时：分') }}</div>
        <div class="desc-text">退款金额将在3个工作日内原路退还到您的账户</div>
      </div>
      <div class="refund-box" v-if="info.ystatus === '4'">
        <div class="refund-title">商家已拒绝</div>
        <div class="time" v-if="flageTime">
          <van-count-down
            :time="time"
            :auto-start="false"
            format="还剩 DD 天 HH 小时 mm 分"
            @finish="finished"
          />
        </div>
      </div>
      <div class="refund-box" v-if="info.ystatus === '5'">
        <div class="refund-title">退款关闭</div>
      </div>
    </div>
    <div class="info-detail">
      <div class="detail-title" v-if="info.ystatus === '1'">
        <p>您已成功发起退款申请，请耐心等待商家处理</p>
      </div>
      <div class="detail-title" v-if="info.ystatus === '2'">
        <p>如果商家收到货并验货无误，将操作退款给您</p>
      </div>
      <div class="detail-title tmoney" v-if="info.ystatus === '3'">
        <div class="tit">退款总金额</div>
        <div class="money">¥{{ info.amount }}</div>
      </div>
      <div class="detail-title" v-if="info.ystatus === '4'">
        <p>{{ info.refuseReason }}</p>
        <p>{{ info.refuseRemark }}</p>
      </div>
      <!-- 收货地址 -->
      <div class="address-info" v-if="info.refundType === '3' && info.ystatus === '2' && expressBook.id === ''">
        <div class="icon"><img src="@/assets/personalCenter/add_icon.png" alt=""></div>
        <div class="address">
          <div class="user-desc">
            <div class="name">收货人：{{ addressBook.name }}</div>
            <div class="phone">{{ addressBook.phone }}</div>
          </div>
          <div class="user-address">{{ addressBook.addressHead }}{{ addressBook.addressTail }}</div>
        </div>
      </div>
      <!-- 退货物流 -->
      <div class="logistics-info" v-if="info.ystatus === '2' && expressBook.id !== ''">
        <div class="icon"><img src="@/assets/logistics_icon.png" alt=""></div>
        <div class="logistics">
          <div class="type">退货物流：{{ expressBook.logisticsName }}（{{ expressBook.logisticsNumber }}）</div>
        </div>
      </div>
      <!-- 处理结果 -->
      <div class="refund-close" v-if="info.ystatus === '5'">本次退款申请关闭，如问题仍未解决，您可以重新发起申请</div>
      <div class="result" v-if="info.ystatus != '3' && info.ystatus != '5'">
        <div class="result-text" v-if="info.ystatus === '1'">
          <p>· 商家同意后，系统将退款给您。</p>
          <p>· 如果商家拒绝，您可以修改退款申请后再次发起，商家会重新   处理。</p>
        </div>
        <div class="result-text" v-if="info.ystatus === '2'">
          <p>· 如果商家拒绝退款，需要您修改退货申请。</p>
        </div>
        <div class="result-text" v-if="info.ystatus === '4'">
          <p>· 您可以修改申请后再次发起，商家会重新处理。</p>
          <p>· 如果您逾期未处理，本次申请将自动关闭。</p>
        </div>
        <div class="result-btn">
          <div class="btn" @click="cancel">
            <div>
              <div class="btn-text">
                <span>撤销申请</span>
              </div>
            </div>
          </div>
          <div class="btn" v-if="info.ystatus != '2'" @click="modify">
            <div>
              <div class="btn-text">
                <span>修改申请</span>
              </div>
            </div>
          </div>
          <div class="btn" v-if="info.ystatus === '2' && expressBook.id != ''" @click="modify">
            <div>
              <div class="btn-text">
                <span>修改申请</span>
              </div>
            </div>
          </div>
          <div class="btn" v-if="info.ystatus === '2' && addressBook.id != '' && expressBook.id == ''">
            <router-link :to="{ name: 'returnFlow', query: { refundId: refundId } }">
              <div class="btn-text">
                <div>我要寄出</div>
                <div class="small">点击填写物流单号</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 协商历史 -->
    <div class="consult">
      <router-link :to="{ name: 'consultHistory', query: { refundId: refundId } }">
        <div class="tit">协商历史</div>
        <div class="text">
          <van-icon name="arrow" size="16px" color="#999999"/>
        </div>
      </router-link>
    </div>
    <!-- 退款明细 -->
    <div class="refundDetails">
      <div class="tip-title">退款明细</div>
      <div class="productList">
        <ul class="list">
          <li class="item">
            <div class="anyOneProduct">
              <div class="productImg">
                <img :src="good.goodPic" alt="">
              </div>
              <div class="productContent">
                <p class="productName">{{ good.goodTitle }}</p>
                <p class="productStyle">
                  <span v-for="(item, index) in good.skuAttrs" :key="index">{{item.name}}:{{item.value}}</span>
                </p>
                <p class="productMenoy">数量：{{ good.goodNum }}</p>
              </div>
            </div>
          </li>
          </ul>
      </div>
      <div class="reason">
        <ul class="r-list">
          <li class="r-item">退款原因：{{ info.refundReason }}</li>
          <li class="r-item">退款金额：{{ info.amount }} </li>
          <li class="r-item">申请时间：{{ info.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</li>
          <li class="r-item">退款编号：{{ info.refundId }}</li>
        </ul>
      </div>
    </div>
    <div class="service">
      <a href="tel://4001667595" class="call-service">拨打客服电话</a>
      <a @click.stop="onlineSer" class="call-service">联系客服</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { CountDown, Icon, Toast, Dialog } from 'vant';
Vue.use(CountDown).use(Icon).use(Toast).use(Dialog);
export default {
  name: 'refundDetail',
  data() {
    return {
      time: undefined,
      flageTime: true,
      refundId: '',//售后单id
      status: '',//1是仅退款，3是退货退款
      info: {},
      good: {},
      addressBook: {},//收货人地址
      expressBook: {},//退货物流
    };
  },
  watch: {

  },
  methods: {
    init () {
      let data = {
        id: this.refundId
      }
      Models.User
      .detail(data)
      .then(res => {
        if(res.data.code == '0') {
          this.info = res.data.info
          this.good = res.data.info.good
          this.addressBook = res.data.info.addressBook
          this.expressBook = res.data.info.expressBook
          this.time = res.data.info.downTime - new Date().getTime()//要减去当前时间
        }else {
          Toast(res.data.msg)
        }
      })
    },
    //修改申请
    modify () {
      let modifyInfo = JSON.stringify(this.info)
      sessionStorage.setItem('modifyInfo', modifyInfo)
      this.$router.replace({
        name: 'requestARefund',
        query: {
          id: this.info.orderId,
          refundId: this.info.refundId,
          status: this.info.refundType,
          statusType: 2,
        }
      })
    },
    //撤销申请
    cancel () {
      Dialog.confirm({
        title: '温馨提示',
        message: '您确定撤销申请吗？'
      }).then(() => {
        let data = {
          id: this.refundId
        }
        Models.User
        .refundCancel(data)
        .then(res => {
          if (res.data.code === '0') {
            this.$router.replace({
              name: 'orderDetails',
              query: {
                id: this.info.orderId
              }
            })
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    //倒计时完成的操作
    finished () {
      this.flageTime = false
    },
    onlineSer () {
      let phone = localStorage.getItem('phone')
      window.location.href = `http://p.qiao.baidu.com/cps/chat?siteId=14231340&userId=26831413&cp=weixin2.4&cr=refundDetail-${this.refundId}&cw=${phone}`
    }
  },
  computed: {

  },
  created() {
  },
  activated() {
    this.refundId = this.$route.query.refundId
    this.status = this.$route.query.status
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.refundDetail-page {
  padding-bottom: 50px;
  width: 100%;
  overflow: hidden;

  .refund-info {
    padding: 33px 0;
    background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
    display: flex;
    align-items: center;

    .refund-box {
      padding: 0 15px;
      width: 100%;
      color: #fff;

      .refund-title {
        margin-bottom: 6px;
        font-size: 18px;
        line-height: 1;
      }

      .time {
        font-size: 12px;
        color: #fff;

        .van-count-down {
          font-size: 12px;
          color: #fff;
        }
      }

      .desc-text {
        margin-top: 2px;
        font-size: 12px;
        color: #fff;
      }
    }
  }

  .info-detail {
    padding: 0 16px;
    width: 100%;
    background-color: #fff;

    .detail-title {
      position: relative;
      padding: 12px 0;
      font-size: 14px;
      color: #333;
      overflow: hidden;

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

      > p {
        margin-bottom: 2px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .tit {
        float: left;
        font-size: 15px;
        color: #333;
      }

      .money {
        float: right;
        font-size: 15px;
        color: #EA3323;
      }

      &.tmoney {
        padding: 15px 0;
      }
    }

    .address-info {
      position: relative;
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

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

      .icon {
        width: 18px;

        > img {
          width: 100%;
        }
      }

      .address {
        margin-left: 16px;
        width: 308px;
        color: #333;

        .user-desc {
          width: 100%;
          display: flex;
          justify-content: space-between;
          overflow: hidden;

          .name {
            margin-right: 15px;
            width: 65%;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .phone {
            width: 35%;
            font-size: 14px;
          }
        }

        .user-address {
          margin-top: 8px;
          width: 100%;
          font-size: 14px;
        }
      }
    }

    .logistics-info {
      position: relative;
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

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

      .icon {
        width: 22px;

        > img {
          width: 100%;
        }
      }

      .logistics {
        width: 300px;
        overflow: hidden;

        .type {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .state {
          margin-top: 2px;
          font-size: 12px;
          color: #333;
        }
      }

      .text {
        width: 16px;
        display: flex;
        align-items: center;
      }
    }

    .refund-close {
      padding: 15px 0;
      width: 100%;
      font-size: 15px;
      color: #333;
    }

    .result {
      padding: 15px 0;
      width: 100%;

      .result-text {
        font-size: 12px;
        color: #999;

        > p {
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .result-btn {
        padding-left: 102px;
        margin-top: 15px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn {
          flex: 1;

          > div {
            margin-right: 10px;
            flex: 1;
            height: 50px;
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            border-radius: 5px;
            background-color: #EAEAEA;
            color: #999;

            .btn-text {
              width: 100%;
              text-align: center;

              > span {
                display: block;
                width: 100%;
              }

              .small {
                font-size: 12px;
              }
            }
          }

          &:last-child {
            > div {
              margin-right: 0;
              background-color: #EA3323;
              color: #fff;
            }
          }

          > a {
            margin-right: 10px;
            flex: 1;
            height: 50px;
            font-size: 14px;
            display: flex;
            align-items: center;
            border-radius: 5px;
            background-color: #EA3323;
            color: #fff;

            .btn-text {
              width: 100%;
              text-align: center;

              > span {
                display: block;
                width: 100%;
              }

              .small {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }

  .consult {
    width: 100%;

    > a {
      padding: 15px;
      margin-top: 10px;
      width: 100%;
      font-size: 15px;
      color: #333;
      background-color: #fff;
      display: flex;
      justify-content: space-between;

      .text {
        display: flex;
        align-items: center;
      }
    }
  }

  .refundDetails {
    margin-top: 10px;
    width: 100%;
    background-color: #fff;

    .tip-title {
      padding: 12px 15px;
      font-size: 15px;
      color: #333;
    }

    .productList {
      width: 100%;
      height: auto;
      padding:15px 16px;
      background-color: #F2F2F2;

      .list {
        width: 100%;

        .item {
          width: 100%;
          height: auto;

          .anyOneProduct {
            width: 100%;
            height:auto;
            display: flex;
            display: -webkit-flex;

              div {
              -webkit-box-flex: 1;

              &.productImg {
                flex-basis: 88px;
                flex-shrink:0;
                height: 88px;
                margin-right: 16px;

                img {
                  width: 88px;
                  height: 88px;
                }
              }

              &.productContent {

                p.productName {
                  font-size: 12px;
                  color:#333;
                  margin-bottom: 6px;
                }

                p.productStyle {
                  font-size: 12px;
                  color:#999;
                  margin-bottom: 6px;
                }

                p.productMenoy {
                  font-size: 12px;
                  color: #999;
                }
              }
            }
          }
        }
      }
    }

    .reason {
      padding-left: 15px;
      width: 100%;

      .r-list {
        width: 100%;

        .r-item {
          position: relative;
          padding: 12px 0;
          width: 100%;
          font-size: 15px;
          color: #333;

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
            border:none;
          }
        }
      }
    }
  }

  .service {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px 15px;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .call-service {
      position: relative;
      padding: 5px 12px;
      margin-right: 8px;
      min-width: 80px;
      font-size: 14px;
      color: #666;
      border-radius:30px;

      &:last-child {
        margin-right: 0;
        color: #EA3323;

        &::after {
          content: "";
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid #EA3323;
          border-radius: 30px;
          -webkit-transform: scale(.5);
          transform: scale(.5);
          -webkit-transform-origin: top left;
          transform-origin: top left;
        }
      }

      &::after {
        content: "";
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #999;
        border-radius: 30px;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: top left;
        transform-origin: top left;
      }
    }
  }
};
</style>
