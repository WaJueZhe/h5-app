<template>
  <div class="allOrders">
    <div class="allOrdersHeader">
      <van-tabs v-model="active" @click="tabActive">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="待发货"></van-tab>
        <van-tab title="待收货"></van-tab>
        <van-tab title="待评价"></van-tab>
      </van-tabs>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="noDataText"
        @load="onLoad"
        :immediate-check="false"
        class="van-clearfix"
        >
        <div class="noOrder" v-show="noOrder">
          <img src="@/assets/noOrders.png" alt="">
        </div>
      <div class="ordersList" v-for="(data,index) in myOrdersList" :key="index" >
        <div class="ordersContent">
          <div class="ordersNumAndStatus">
            <div class="ordersNum">
              <span>订单号：{{data.orderId}}</span>
            </div>
            <div class="ordersStatus">
              <template v-for="(statusData,statusIndex) in ystatusList">
                <span :key="statusIndex" :style="{color:statusData.num == 6 || statusData.num == 7 ? '#999999' : '#EA3323' }" v-if="statusData.num == data.ystatus">{{statusData.name}}</span>
              </template>
            </div>
          </div>
          <div class="productList">
            <router-link :to="`/orderDetails?id=${data.orderId}`">
              <ul>
                <li v-for="( aData,aIndex ) in data.goods" :key="aIndex">
                  <div class="productImg">
                    <img :src="aData.goodPic" alt="">
                  </div>
                  <div class="productContent">
                    <p class="productName">{{aData.goodTitle}}</p>
                    <p class="productStyle">
                      <span v-for="(skuData,skuIndex) in aData.skuAttrs" :key="skuIndex">{{skuData.name}}：{{skuData.value}}，</span>
                    </p>
                    <div class="productMenoy">
                      <div>
                        <span>￥{{aData.goodPrice | moneyFloat}}</span>
                        <span>x{{aData.goodNum}}</span>
                        <template v-for="(aitem, idx) in data.actions">
                          <span :key="idx" v-if="aitem.action === 'refund' || aitem.action === 'refundFulfill'" class="refund">{{ aitem.title }}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </router-link>
          </div>
          <div class="productNum">
            <span style="font-size:12px;color:#333333;">共{{data.goods.goodNum}}件商品 合计：</span>
            <span style="font-size:15px;color:#EA3323;">￥</span>
            <span style="font-size:18px;color:#EA3323;">{{data.totalAmount | moneyFloat}}</span>
          </div>
          <div class="operationButton">
            <div>
              <template v-for="(aData,aIndex) in data.actions" >
                <button :key="aIndex"
                @click="btnCLickmode(data.orderId, data.payId, aData.action, data.totalAmount, data.flags, data)"
                :class="[aData.action === 'delOrder' || aData.action === 'getLogistics' || aData.action === 'cancelOrder' ? 'deleteBtn' : 'redBtn']"
                v-if=" aData.action === 'cancelOrder' || aData.action === 'delOrder' || aData.action === 'getLogistics' ">
                {{aData.title}}
                </button>
              </template>
            </div>
            <div>
              <template v-for="(aData,aIndex) in data.actions" >
                <!-- 补充收货地址 -->
                <button :key="aIndex"
                        @click="btnCLickmode(data.orderId, data.payId, aData.action, data.totalAmount, data.flags, data)"
                        :class="[aData.action === 'recordAddress' ? 'deleteBtn' : 'redBtn']"
                        v-if=" aData.action === 'recordAddress'">
                  {{aData.title}}
                </button>
              </template>
            </div>
            <div>
              <template v-for="(aData,aIndex) in data.actions" >
                <!-- 确认收货，付款，评价，查看物流，提醒发货按钮 -->
                <button :key="aIndex"
                @click="btnCLickmode(data.orderId, data.payId, aData.action, data.totalAmount, data.flags, data)"
                :class="[aData.action === 'delOrder' || aData.action === 'cancelOrder' ? 'deleteBtn' : 'redBtn']"
                v-if=" aData.action === 'confirmOrder' || aData.action === 'goPay' || aData.action === 'remindDelivery' || aData.action === 'goComment'">
                {{aData.title}}
                </button>
            </template>
            </div>
          </div>
        </div>
      </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <payPassword @goPay="getConfirmReceive" @offPayWindow="offShowKeyboard" :value1="value1"></payPassword>
    </van-popup>
    <div class="loading" v-show="loadingBox">
      <van-loading type="spinner" color="#444" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import PayPassword from "@/components/payPassword";
import { Popup , Tab , Tabs  , Toast , PullRefresh , List, Dialog, Loading } from 'vant';

Vue.use(Popup).use(Tab).use(Tabs).use(Toast).use(PullRefresh).use(List).use(Dialog).use(Loading);
export default {
  name:'allOrders',
  data () {
    return {
      showKeyboard:false,
      password:"",
      showPassWord:false,
      active: null,
      orderId:"",
      page: '1',
      size: '10',
      WXPayContentJson:"",
      noOrder:false,
      statusType:"all",
      myOrdersList:[],
      ystatusList:[
        {
          num:1,
          name:"待付款"
        },{
          num:2,
          name:"待发货"
        },{
          num:3,
          name:"待收货"
        },{
          num:4,
          name:"待评价"
        },{
          num:5,
          name:"已完成"
        },{
          num:6,
          name:"取消订单"
        },{
          num:7,
          name:"取消订单"
        },{
          num:8,
          name:"异常单"
        },{
          num:9,
          name:"退款单"
        }
      ],
       //支付方式
      payShow: false,
      payId:"",
      totalAmount:"",
      total:0,
      value1: '',//支付密码,
      loading: false,
      finished: false,
      isLoading: false,
      noDataText:"您还没有相关订单",
      loadingBox: false,//加载遮罩层
    }
  },
  components: {
    PayPassword
  },
  watch:{
    myOrdersList () {
      let num = this.myOrdersList.length;
      if ( num === 0 ) {
        this.noOrder = true;
      }else {
        this.noOrder = false;
      }
    },
    showKeyboard() {
      if(this.showKeyboard == false) {
        this.value1 = ''
      }
    }
  },
  methods:{
    tabActive (index,title) {
      this.loadingBox = true
      this.page = 1;
      this.tabOrdersStatus();
      sessionStorage.statusType = Number(this.active);
    },
    //获取订单详情
    getOrderDetail (id) {
      let data = {
        id:id
      };
      Models.User
        .orderDetail(data)
        .then(res => {
          let aLength = this.myOrdersList.length;
          for ( let g = 0 ; g < aLength ; g++ ) {
            if ( this.myOrdersList[g].orderId === id ) {
              this.myOrdersList[g] = res.data.info;
            }
          }
        })
    },
    /**
     * 下拉刷新
     **/
    onRefresh() {
      setTimeout(() => {
        if(this.myOrdersList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.noOrder = false;
          this.loading = true
          this.finished = false
          this.page = 1;
          let data = {
            status:this.statusType,
            page: this.page,
            size: '10'
          };
          Models.User
          .myOrders(data)
          .then(res => {
            if ( res.data.code == '0' ) {
              this.isLoading = false;
              // 加载状态结束
              this.loading = false;
              this.myOrdersList = []
              this.myOrdersList = res.data.info.list;
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
              if (this.myOrdersList.length === 0) {
                this.noOrder = true;
                this.noDataText = '您还没有相关订单'
              }
              this.page = Number(this.page) + 1;
            }
          })
        }
      }, 500);
    },
    /**
     * 上拉获取
     **/
    onLoad() {
      this.getMyOrders();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },

    getMyOrders () {
      this.noOrder = false
      this.loading = true
      this.finished = false
      let data = {
        status:this.statusType,
        page:this.page,
        size:this.size
      };
      Models.User
      .myOrders(data)
      .then(res => {
        if ( res.data.code == '0' ) {
          this.isLoading = false;
          // 加载状态结束
          this.loading = false
          this.loadingBox = false
          this.myOrdersList = this.myOrdersList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          if (this.myOrdersList.length === 0) {
            this.noOrder = true;
            this.noDataText = '您还没有相关订单'
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    //取消订单
    getCancelOrder (id) {
      let data = {
        id:id,
      };
      Models.User
      .cancelOrder(data)
      .then(res => {
        Toast('取消成功');
        this.tabOrdersStatus();
      })
    },
    goGetConfirmReceive (orderId) {
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
          this.showKeyboard = true;
          this.orderId = orderId;
        }
      })
    },
    //确认收货
    getConfirmReceive (password) {
      let data = {
        orderId:this.orderId,
        payPassword:password,
      };
       Models.User
      .confirmReceive(data)
      .then(res => {
        if ( res.data.code == 0 ) {
          this.showKeyboard = false;
          let num = Number(sessionStorage.statusType);
          this.tabOrdersStatus();
          Toast('已确认');
        }else {
          Toast(res.data.msg);
        }
      })
    },
    offShowKeyboard () {
      this.showKeyboard = false;
    },
    //提醒发货
    getRemindShip (id) {
      let data = {
        id:id,
      };
       Models.User
      .remindShip(data)
      .then(res => {
        Toast('提醒成功');
      })
    },
    //删除订单
    goDelOrder (id) {
      let data = {
        id:id,
      };
       Models.User
      .delOrder(data)
      .then(res => {
        Toast('删除成功');
        this.tabOrdersStatus();
      })
    },
    //发表评论
    getAddComment (id) {
      this.$router.push(`/postEvaluation?id=${id}`);
    },
    tabOrdersStatus () {
      this.myOrdersList = [];
      this.page = 1;
      this.selectType(this.active);
      this.getMyOrders();
    },
    selectType (num) {
      //"all"-全部, "nopay"-待支付, "nodeliver"-待发货,"noreceive" - 待收货,"nocomment"-待评论
      this.active = num;
      switch (num) {
        case 0:
          this.statusType = 'all';
          break;
        case 1:
          this.statusType = 'nopay';
          break;
        case 2:
          this.statusType = 'nodeliver';
          break;
        case 3:
          this.statusType = 'noreceive';
          break;
        case 4:
          this.statusType = 'nocomment';
          break;
      }
    },

    onSubmit () {
      this.payShow = true;
    },

    btnCLickmode(orderId, payId, action, totalAmount, flags, item) {
      this.orderId = orderId;
      //goPay-付款, cancelOrder -取消订单, remindDelivery-提醒发货
      //confirmOrder - 确认收货, getLogistics - 查看物流,goComment - 评价, delOrder - 删除订单
      //submitRefund - 申请售后, recordAddress - 补充收货地址
      if( action === "cancelOrder" ) {   //取消订单
        this.getCancelOrder(orderId);
      }else if( action === "delOrder" ) {    //删除订单
        this.goDelOrder(orderId);
      }else if( action === "confirmOrder" ) {    //确认收货
        this.goGetConfirmReceive(orderId);
      }else if( action === "goComment" ) {     //评价
        this.getAddComment(orderId);
      }else if( action === "remindDelivery" ) {    //提醒发货
        this.getRemindShip(orderId);
      }else if( action === "getLogistics" ) {//查看物流
        this.$router.push({
          name: 'logisticsInformation',
          query: {
            orderId: orderId,
            goodPic: item.goods[0].goodPic
          }
        })
      }else if( action === "recordAddress" ) {    //补充收货地址
        this.$router.push({
          name:"addressManagement",
          query:{
            statusType:2,
            orderId:orderId
          }
        })
      }else if ( action === "goPay" ) {   //去付款
        let ytype = ''
        if(flags.memberShip != undefined) {
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
  },
  mounted () {

  },
  beforeRouteLeave (to, from, next) {
    if(to.path == '/goodsOrder') {
      this.$router.replace({
        name: 'home',
      });
      next(false)
    }else if(to.path == '/paymentSuccessful') {
      this.$router.replace({
        name: 'personalCenter',
      });
      next(false)
    }else if(to.path == '/recharge') {
      this.$router.go(-1);
      next(false)
    }
    else {
      next()
    }
  },
  beforeDestroy () {
    this.clearSession();
  },
  created () {

  },
  activated () {
    let num = Number(sessionStorage.statusType);
    this.selectType(num);
    this.tabOrdersStatus();
  },
  deactivated () {
  },
}
</script>
<style lang="less">
.allOrders {
  width: 100%;
  height: 100%;

  .van-pull-refresh {
    padding-top: 45px;
  }

  .allOrdersHeader {
    width: 100%;
    height: auto;
    top: 0;
    z-index: 10;;
    background-color: #ffffff;
    position: fixed;
  }

  .ordersList {
    width: 100%;
    padding:  16px 15px 0;
    position:relative;

    &:first-child {
      margin-top: 45px;
    }

    .ordersContent {
      width: 100%;
      height: auto;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 21px 0 rgba(221,221,221,0.72);
      border-radius:8px;

      .ordersNumAndStatus {
        width: 100%;
        display: flex;
        display: -webkit-flex;
        padding:16px;

        div {
          font-size: 12px;
          -webkit-box-flex: 1;

          &.ordersNum {
            flex-basis: 265px;
          }

          &.ordersStatus {
            width: 80px;
            text-align: right;
          }
        }
      }

      .productList {
        width: 100%;
        height: auto;
        margin-bottom: 7px;

        a {
          display: block;
          width: 100%;
          height: auto;
          padding:0 16px 0;

          li {
            width: 100%;
            height: auto;
            display: flex;
            margin-bottom: 28px;
            display: -webkit-flex;

            &:last-child {
              margin-bottom: 0;
            }

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
                width: 100%;

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

                div.productMenoy {
                  font-size: 15px;
                  overflow: hidden;

                  > div {
                    position: relative;
                    display: flex;
                    align-items: center;

                    span:first-child {
                      margin-right: 8px;
                      color: #333333;
                      vertical-align: top;
                    }

                    span:nth-child(2) {
                      color: #999999;
                    }

                    .refund {
                      position: absolute;
                      right: 0;
                      font-size: 12px;
                      color: #EA3323;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .productNum {
        position: relative;
        width: 100%;
        padding:0 16px 16px;
        text-align: right;

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
      }

      .operationButton {
        width: 100%;
        padding:0 15px;
        text-align: right;
        overflow: hidden;
        display: flex;
        font-size: 0;
        display: -webkit-flex;
        justify-content: flex-end;
        align-items: center;

        div {
          font-size: 0;

          button {
            min-width: 80px;
            padding: 5px 12px;
            border:none;
            margin:17px 0 17px 10px;
            font-size: 14px;
            vertical-align: middle;
            border-radius:30px;
            background-color: #ffffff;

            &.deleteBtn {
              position: relative;
              color:#999999;

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
  }

  .noOrder {
    width: 100%;
    margin: 70px 0 0;

    img {
      width: 90px;
      height: auto;
      margin: 0 auto 0;
    }

    p {
      width: 100%;
      height: auto;
      font-size: 18px;
      color:#999999;
      margin-top: 8px;
      text-align: center;
    }
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0,.2);
    z-index: 99999;

    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99999;
    }
  }
}
</style>
