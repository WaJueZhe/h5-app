<template>
  <div class="orderDetails">
    <div class="orderDetailsHeader">
      <span>{{theOrderDetail.ystatus | getYstatus}}</span>
    </div>

    <div class="waybillAndAddress">
      <div class="waybill" v-if="flags.notShip == undefined && theOrderDetail.ystatus != '1' && theOrderDetail.ystatus != '2' && theOrderDetail.ystatus != '6'" @click="goLogistics">
        <div class="waybill-box">
          <div class="waybillIcon">
            <img src="@/assets/logistics_icon.png" alt="">
          </div>
          <div class="waybillcenter">
            <p class="waybillNumbering twoText">{{ logistics.kd[0].context }}</p>
            <p class="waybillTime">{{logistics.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</p>
          </div>
          <div class="waybillCopyBtn">
            <div class="text">
              <van-icon name="arrow" size="16px" color="#999999"/>
            </div>
          </div>
        </div>
      </div>

      <div class="waybill" v-if="theOrderDetail.ystatus == '3' && logistics.kd.length <= 0">
        <div class="waybill-box">
          <div class="waybillIcon">
            <img src="@/assets/logistics_icon.png" alt="">
          </div>
          <div class="waybillcenter no-msg">暂无物流信息</div>
        </div>
      </div>
      <!-- 收货人信息 -->
      <div class="waybill" v-if="shipAddress.name != null && shipAddress.phone != null && shipAddress.addressHead != null">
        <div class="waybill-box">
          <div class="waybillIcon">
            <img src="@/assets/personalCenter/add_icon.png" alt="">
          </div>
          <div class="waybillcenter">
            <p class="waybillNumbering">
              <span class="name">{{ shipAddress.name }}</span>
              <span class="name">{{ shipAddress.phone }}</span>
            </p>
            <p class="waybillTime">{{ shipAddress.addressHead }}{{ shipAddress.addressTail }}</p>
          </div>
        </div>
      </div>

      <div class="waybill second" v-if="theOrderDetail.remark != ''">
        <div class="waybill-box">
          <div class="waybillIcon">
            <img src="@/assets/homePage/news.png" alt="">
          </div>
          <div class="waybillcenter">
            <p class="waybillNumbering">买家留言：</p>
            <p class="waybillTime m-top">{{ theOrderDetail.remark }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="orderDetailscenter">
      <div class="productList">
        <ul>
          <li v-for="(data, index) in theOrderDetail.goods" :key="index">
            <!-- 普通商品 -->
            <div class="p-item" @click="changeJump(theOrderDetail.realtiveYtype, data.goodId)">
              <div class="anyOneProduct">
                <div class="productImg">
                  <img :src="data.goodPic" alt="">
                </div>
                <div class="productContent">
                  <p class="productName">{{data.goodTitle}}</p>
                  <p class="productStyle">
                    <span v-for="(sData, sindex) in data.skuAttrs" :key="sindex">{{sData.name}}: {{sData.value}}，</span>
                  </p>
                  <p class="productMenoy">
                    <span>￥{{data.goodPrice | moneyFloat}}</span>
                    <span>x{{data.goodNum}}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="productBtn" v-for="(aData,aIndex) in theOrderDetail.actions" :key="aIndex">
              <button @click="go()" v-if="aData.action === 'submitRefund'">{{ aData.title }}</button>
            </div>
            <div class="productBtn" v-for="(item, idx) in theOrderDetail.actions" :key="idx">
              <button v-if="item.action == 'refund' || item.action == 'refundFulfill'" @click="refundSuccess" class="refund">{{ item.title }}</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="orderAmount">
        <van-row class="orderAmountAnyone">
          <van-col span="6">增值服务</van-col>
          <van-col span="18" class="amountNum">￥{{theOrderDetail.totalSvcFee}}</van-col>
        </van-row>
        <van-row class="orderAmountAnyone">
          <van-col span="6">运费</van-col>
          <van-col span="18" class="amountNum">￥{{theOrderDetail.totalShipFee}}</van-col>
        </van-row>
        <van-row class="orderAmountAnyone">
          <van-col span="6">惠呗</van-col>
          <van-col span="18" class="amountNum">-￥{{theOrderDetail.totalDepoint}}</van-col>
        </van-row>
        <van-row class="orderAmountAnyone">
          <van-col span="6" style="color:#333333;">应付金额</van-col>
          <van-col span="18" class="amountNum" style="color:#EA3323;">￥{{theOrderDetail.totalAmount | moneyFloat}}</van-col>
        </van-row>
      </div>
    </div>
    <div class="orderInvoice">
      <van-row class="orderInvoiceAnyone">
        <van-col span="6">订单编号：</van-col>
        <van-col span="18">{{theOrderDetail.orderId}}</van-col>
      </van-row>
       <van-row class="orderInvoiceAnyone">
        <van-col span="6">下单时间：</van-col>
        <van-col span="18">{{ theOrderDetail.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</van-col>
      </van-row>
      <van-row class="orderInvoiceAnyone" v-show="theOrderDetail.payTime != '0'">
        <van-col span="6">付款时间：</van-col>
        <van-col span="18">{{ theOrderDetail.payTime | timeStampFilter('yy-mm-dd h：m：s') }}</van-col>
      </van-row>
       <van-row class="orderInvoiceAnyone">
        <van-col span="6">配送方式：</van-col>
        <van-col span="18" v-if="theOrderDetail.shipWay == '0'">无物流</van-col>
        <van-col span="18" v-if="theOrderDetail.shipWay == '1'">普通快递</van-col>
        <van-col span="18" v-if="theOrderDetail.shipWay == '2'">到付</van-col>
      </van-row>
      <van-row class="orderInvoiceAnyone">
        <van-col span="6">发票类型：</van-col>
        <van-col span="18">{{theOrderDetail.Invoice.invoiceId === null ? '不开发票' : '纸质发票'}}</van-col>
      </van-row>
    </div>
    <div class="customerService" @click="cintactCustomerService()">
      <img src="@/assets/personalCenter/service_icon-02.png" alt="">
      <span>在线客服</span>
    </div>
    <div class="orderFooter" v-if="theOrderDetail.actions !== undefined && theOrderDetail.actions.length > 0">
      <div>
        <template v-for="(aData,aIndex) in theOrderDetail.actions" >
          <button :key="aIndex"
            @click="btnCLickmode(theOrderDetail.payId, aData.action, theOrderDetail.totalAmount, theOrderDetail)"
            :class="[aData.action === 'delOrder' || aData.action === 'getLogistics' || aData.action === 'cancelOrder' ? 'deleteBtn' : 'redBtn']"
            v-if=" aData.action === 'cancelOrder' || aData.action === 'delOrder' || aData.action === 'getLogistics' ">
            {{aData.title}}
          </button>
        </template>
      </div>
      <div>
        <template v-for="(aData,aIndex) in theOrderDetail.actions" >
          <!-- 补充收货地址 -->
          <button :key="aIndex"
                  @click="btnCLickmode(theOrderDetail.payId,aData.action,theOrderDetail.totalAmount)"
                  :class="[aData.action === 'recordAddress' ? 'deleteBtn' : 'redBtn']"
                  v-if=" aData.action === 'recordAddress'">
            {{aData.title}}
          </button>
        </template>
      </div>
      <div>
        <template v-for="(aData,aIndex) in theOrderDetail.actions" >
          <!-- 确认收货，付款，评价，查看物流，提醒发货按钮 -->
          <button :key="aIndex"
          @click="btnCLickmode(theOrderDetail.payId, aData.action, theOrderDetail.totalAmount, theOrderDetail)"
          :class="[aData.action === 'delOrder' || aData.action === 'cancelOrder' ? 'deleteBtn' : 'redBtn']"
          v-if=" aData.action === 'confirmOrder' || aData.action === 'goPay' || aData.action === 'remindDelivery' || aData.action === 'goComment' ">
          {{aData.title}}
          </button>
        </template>
      </div>
    </div>
    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <payPassword @goPay="getConfirmReceive" @offPayWindow="offEnterPassword" :value1="value1"></payPassword>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import PayPassword from "@/components/payPassword";
import { Row, Col, Toast, Popup, Dialog, Icon } from 'vant';

Vue.use(Row).use(Col).use(Toast).use(Popup).use(Dialog).use(Icon);
export default {
  name:"orderDetails",
  data () {
    return {
      payId:"",
      totalAmount:"",
      total:0,
      theOrderDetail:{},
      flags:{},
      showKeyboard: false,
      value1: '',
      logistics:"",
      shipAddress:"",

      WXPayContentJson:"",
    }
  },
  filters: {
    getYstatus(val) {
      switch(val) {
        case '1':
          return '待付款'
          break;
        case '2':
          return '买家已付款'
          break;
        case '3':
          return '卖家已发货'
          break;
        case '4':
          return '待评价'
          break;
        case '5':
          return '交易已完成'
          break;
        case '6':
          return '已取消'
          break;
        case '7':
          return '已取消'
          break;
        case '8':
          return '订单异常'
          break;
        case '9':
          return '退款单'
          break;
        default:
          return ''
      }
    }
  },
  watch: {
    showKeyboard() {
      if(this.showKeyboard == false) {
        this.value1 = ''
      }
    }
  },
  methods:{
    //进入商品对应的详情
    changeJump (val, goodId) {
      if (val === '1' || val === '2' || val === '3') {//普通商品
        this.$router.push({
          name: 'goodsDetails',
          query: {
            goodId: goodId
          }
        })
      }else if (val === '4') {//购买会员的商品
        this.$router.push({
          name: 'upgradeDetail',
          query: {
            goodId: goodId
          }
        })
      }else if (val === '5') {//惠呗充值
        let ygrade = localStorage.getItem('ygrade')
        if (ygrade < 4) {
          Toast('请先升级会员')
        }else {
          this.$router.push({
            name: 'recharge',
            query:{
              chargeAct: '3'
            }
          })
        }
      }else {//否则不给跳转
        return false
      }
    },

    go () {
      let refundInfo = JSON.stringify(this.theOrderDetail.goods)
      sessionStorage.setItem('refundInfo', refundInfo)
      this.$router.push({
        name: 'afterSale',
        query: {
          id: this.$route.query.id,
          ystatus: this.theOrderDetail.ystatus
        }
      });
    },
    //退款成功
    refundSuccess () {
      this.$router.push({
        name: 'refundDetail',
        query: {
          refundId: this.theOrderDetail.refundSimpleBo.refundId
        }
      })
    },
    cintactCustomerService() {
      let phone = localStorage.getItem('phone')
      let orderId = this.$route.query.id
      window.location.href = `http://p.qiao.baidu.com/cps/chat?siteId=12820204&userId=26831413&cp=weixin2.4&cr=orderDetails-${orderId}&cw=${phone}`
    },
    //获取订单详情
    getOrderDetail (id) {
      let data = {
        id: this.$route.query.id,
      };
      Models.User
      .orderDetail(data)
      .then(res => {
        this.theOrderDetail = res.data.info;
        this.flags = res.data.info.flags;
        this.logistics = res.data.info.logistics;
        if ( res.data.info.shipAddress === null ) {
          this.shipAddress = {
            addressId: "",
            addressHead: "", //头部地址
            addressTail: "", //尾地址
            name: "",        //收货人
            phone: "",       //收货人电话
          }
        }else {
          this.shipAddress = res.data.info.shipAddress;
        }
      })
    },
    //取消订单
    getCancelOrder (id) {
      let data = {
        id:this.$route.query.id,
      };
      Models.User
      .cancelOrder(data)
      .then(res => {
        this.getOrderDetail();
        Toast('取消成功');
      })
    },
    //确认收货
    goGetConfirmReceive () {
      this.showKeyboard = true;
    },
    //确认收货
    getConfirmReceive (password) {
      let data = {
        orderId:this.theOrderDetail.orderId,
        payPassword:password,
      };
      Models.User
        .confirmReceive(data)
        .then(res => {
          if ( res.data.code == 0 ) {
            this.showKeyboard = false;
            let num = Number(sessionStorage.statusType);
            this.getOrderDetail();
            Toast('已确认');
          }else {
            Toast(res.data.msg);
          }
        })
    },
    offEnterPassword() {
      this.showKeyboard = false;
    },
    //发表评论
    getAddComment () {
      this.$router.push(`/postEvaluation?id=${this.$route.query.id}`);
    },
    //提醒发货
    getRemindShip () {
      let data = {
        id:this.$route.query.id,
      };
       Models.User
      .remindShip(data)
      .then(res => {
        Toast('提醒成功');
      })
    },
    //删除订单
    goDelOrder () {
      let data = {
        id:this.$route.query.id,
      };
       Models.User
      .delOrder(data)
      .then(res => {
        Toast('删除成功');
        this.$router.push('/allOrders')
      })
    },
    btnCLickmode (payId, status, totalAmount, item) {
      //goPay-付款, cancelOrder -取消订单, remindDelivery-提醒发货
      //confirmOrder - 确认收货, getLogistics - 查看物流,goComment - 评价, delOrder - 删除订单
      if ( status === "cancelOrder" ) {   //取消订单
        this.getCancelOrder();
      }else if ( status === "delOrder" ) {    //删除订单
        this.goDelOrder();
      }else if ( status === "confirmOrder" ) {    //确认收货
        this.goGetConfirmReceive();
      }else if ( status === "goComment" ) {     //评价
        this.getAddComment();
      }else if ( status === "remindDelivery" ) {    //提醒发货
        this.getRemindShip();
      }else if( status === "getLogistics" ) {     //查看物流
        this.$router.push({
          name: 'logisticsInformation',
          query: {
            orderId: item.orderId,
            goodPic: item.goods[0].goodPic
          }
        })
      }else if ( status === "recordAddress" ) {     //补充收货地址
        this.$router.push({
          name:"addressManagement",
          query:{
            statusType:2,
            orderId:this.theOrderDetail.orderId
          }
        })
      }else if ( status === "goPay" ) {   //去付款
        let ytype = ''
        if(item.flags.memberShip != undefined) {
          ytype = 'memberShip'
        }
        this.$router.push({
          name: 'orderPay',
          query: {
            totalAmount: totalAmount,
            userId: window.sessionStorage.userId,
            payId: payId,
            payAmount: totalAmount,
            ytype: ytype,
            totalPoint: parseInt(item.totalPoint)
          }
        })
      }
    },
    clearSession () {
      window.sessionStorage.removeItem('payId');
      window.sessionStorage.removeItem('totalAmount');
      window.sessionStorage.removeItem('goSettingPassWord');
    },
    goLogistics() {
      this.$router.push({
        name: 'logisticsInformation',
        query: {
          orderId: this.$route.query.id,
          goodPic: this.theOrderDetail.goods[0].goodPic
        }
      })
    }
  },
  components: {
    PayPassword
  },
  beforeDestroy () {
    this.clearSession();
  },
  created () {

  },
  activated () {
    this.getOrderDetail();
  },
}
</script>
<style lang="less" scoped>
.orderDetails {
  width: 100%;
  height:auto;
  padding-bottom: 48px;
  background:#ffffff;

  .orderDetailsHeader {
    width:100%;
    height:108px;
    line-height: 108px;
    padding-left:37px;
    font-size: 18px;
    color: #ffffff;
    background:linear-gradient(90deg,rgba(234,51,35,1),rgba(234,35,96,1));
  }

  .waybillAndAddress {
    width: 100%;
    height: auto;
    padding-left: 15px;
    border-bottom:8px solid #F2F2F2;

    .waybill {
      position: relative;
      padding-right: 15px;
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

      &:last-child {
        border-bottom: none;
      }

      .waybill-box {
        padding: 20px 0;
        display: flex;

        .waybillIcon {
          flex-shrink:0;
          margin-right: 11px;
          flex-basis: 22px;
          display: flex;
          align-items: center;

          img {
            width: 22px;
            height: 22px;;
          }
        }

        .waybillcenter {
          width: 100%;

          &.no-msg {
            font-size: 14px;
            color: #333;
          }

          .waybillNumbering {
            color:#333333;
            font-size: 13px;

            &.twoText {
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
            }

            .name {
              font-size: 14px;
              font-weight: bold;
              color: #0F050B;

              &:last-child {
                margin-left: 8px;
              }
            }
          }

          .waybillTime {
            margin-top: 6px;
            color:#0F050B;
            font-size: 12px;

            &.m-top {
              margin-top: 4px
            }
          }
        }

        .waybillCopyBtn {
          flex-shrink:0;
          flex-basis:41px;
          padding-top: 10px;
          display: flex;
          align-items: center;

          .text {
            width: 100%;
            text-align: right;
          }

          button {
            font-size: 12px;
            color:#999999;
            width: 41px;
            height: 18px;
            border:1px solid rgba(153,153,153,1);
            border-radius:18px;
            background-color: #ffffff;
          }
        }
      }
    }

    .addressAndpeople {
      padding-top: 20px;
      width: 100%;
      height: 81px;

      .nameAndPhone {
        width: 100%;
        height: auto;
        font-size: 15px;
        color: #0F050B;
        padding-left: 24px;
      }

      .address {
        width: 100%;
        height: auto;
        color: #0F050B;
        font-size: 12px;
        margin-top: 10px;

        img {
          display: inline-block;
          width: 15px;
          height: 15px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }

  .orderDetailscenter {
    width:100%;
    height: auto;
    border-bottom:8px solid #F2F2F2;

    .productList {
      width: 100%;
      height: auto;
      padding:15px 16px;

      li {
        width: 100%;
        height: auto;
        margin-bottom: 15px;

        .p-item {
          display: block;
          width: 100%;
          height: 100%;

          .anyOneProduct {
            width: 100%;
            height:auto;
            margin-bottom: 10px;
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
                  color:#333333;
                  margin-bottom: 6px;
                }

                p.productStyle {
                  font-size: 12px;
                  color:#999999;
                  margin-bottom: 6px;
                }

                p.productMenoy {
                  font-size: 15px;
                  span:first-child {
                    margin-right: 8px;
                    color: #333333;
                  }

                  span:last-child {
                    color: #999999;
                  }
                }
              }
            }
          }
        }

        .productBtn {
          width: 100%;
          height: auto;
          text-align: right;

          button {
            position: relative;
            padding: 5px 12px;
            min-width: 80px;
            border:none;
            font-size: 14px;
            vertical-align: middle;
            border-radius:30px;
            background-color: #ffffff;
            color: #666;

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


        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .orderAmount {
      position: relative;
      width: 100%;
      padding-left: 15px;

      &::before {
        content: "";
        width: 200%;
        height: 0;
        display: block;
        border-top: 1px solid #EAEAEA;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        transform: scale(.5);
        transform-origin: left top;
      }

      .orderAmountAnyone {
        position: relative;
        height: 44px;
        font-size:15px;
        color:#999999;
        line-height: 44px;

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

        .amountNum {
          color: #333333;
          padding-right: 15px;
          text-align: right;
        }
      }
    }
  }

  .orderInvoice {
    width: 100%;
    height: auto;
    padding-left:12px;

    .orderInvoiceAnyone {
      position: relative;
      width: 100%;
      height: 44px;
      font-size:12px;
      color:#333333;
      line-height: 44px;

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

  .customerService {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size:15px;
    text-align: center;

    img {
      display: inline-block;
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }

    span {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .orderFooter {
    width: 100%;
    padding: 9px 15px;
    position: fixed;
    bottom: 0;
    text-align: right;
    z-index: 10;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &::before {
      content: "";
      width: 200%;
      height: 0;
      display: block;
      border-top: 1px solid #EAEAEA;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      transform: scale(.5);
      transform-origin: left top;
    }

    div {
      margin-right: 8px;
      font-size: 0;

      &:last-child {
        margin-right: 0;
      }

      button {
        padding: 5px 12px;
        min-width: 80px;
        border:none;
        font-size: 14px;
        vertical-align: middle;
        border-radius:30px;
        background-color: #ffffff;

        &.deleteBtn {
          position: relative;
          color:#999;

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

        &.redBtn {
          position: relative;
          color:#EA3323;

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
      }
    }
  }
}
</style>
