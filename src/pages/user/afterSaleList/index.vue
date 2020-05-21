<template>
  <div class="afterSaleList">
      <van-pull-refresh v-model="isLoading"
      @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
      <div class="ordersList" v-for="(data,index) in afterSaleList" :key="index" >
        <div class="ordersContent">
          <div class="ordersNumAndStatus">
            <div class="ordersNum">
              <span>订单号：{{data.orderId}}</span>
            </div>
            <div class="ordersStatus"></div>
          </div>
          <div class="productList">
            <ul>
              <li>
                <div class="productImg">
                  <img :src="data.good.goodPic" alt="">
                </div>
                <div class="productContent">
                  <p class="productName">{{data.good.goodTitle}}</p>
                  <p class="productStyle">
                    <span v-for="(skuData,skuIndex) in data.good.skuAttrs" :key="skuIndex">{{skuData.name}}：{{skuData.value}}，</span>
                  </p>
                  <p class="productMenoy">
                    <span>￥{{data.good.goodPrice}}</span>
                    <span>x{{data.good.goodNum}}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="productNum">
            <span>{{backRefundType(data.refundType)}} </span>
            <span>{{backYstatus(data.ystatus)}}</span>
          </div>
          <div class="operationButton">
            <button @click="btnCLickmode(data)" class="redBtn" >查看详情</button>
          </div>
        </div>
      </div>
     </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import Vue from 'vue';
import qs from "qs";
import Models from '@/models';
import { Tab, Tabs ,Loading, PullRefresh, List } from 'vant';

Vue.use(Tab).use(Tabs).use(Loading).use(PullRefresh).use(List);
export default {
  name:'afterSaleList',
  data () {
    return {
      page: '1',
      size: '10',
      total: '',
      noOrder:false,
      statusType:"all",
      loading: false,
      afterSaleList:[],

      loading: false,
      finished: false,
      isLoading: false
    }
  },
  watch:{},
  methods:{
    backRefundType (type) {
      let typeText = "";
      switch (type) {
        case '1':
          typeText = '退款：';
          break;
        case '2':
          typeText = '仅换货：';
          break;
        case '3':
          typeText = '退货退款：';
          break;
      }
      return typeText;
    },
    backYstatus (status) {
      let statusText = "";
      switch (status) {
        case '1':
          statusText = '退款中';
          break;
        case '2':
          statusText = '退款中';
          break;
        case '3':
          statusText = '退款成功';
          break;
        case '4':
          statusText = '退款中';
          break;
        case '5':
          statusText = '退款关闭';
          break;
      }

      return statusText;
    },
    btnCLickmode (item) {
      this.$router.push({
        name: 'refundDetail',
        query: {
          refundId: item.refundId,
          status: item.refundType
        }
      });
    },
    getAfterSaleList () {
      let data = {
        page:this.page,
        size:this.size
      };
      Models.User
      .afterSaleList(data)
      .then(res => {
        this.isLoading = false
        // 加载状态结束
        this.loading = false
        let arr = res.data.info.list;
        this.afterSaleList = this.afterSaleList.concat(arr);
        this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
      })
    },
    /**
     * 下拉刷新
    */
    onRefresh() {
      let self = this;
      setTimeout(() => {
          self.page = '1';
          self.afterSaleList = [],
          self.getAfterSaleList(); //加载数据
      }, 500);
    },

    /**
     * 上拉获取
    */
    onLoad() {
      setTimeout(() => {
        this.page = Number(this.page) + 1;
        this.getAfterSaleList();

        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }, 1500);
    },
  },
  mounted () {},
  activated () {

  },
  created () {
    this.getAfterSaleList();
  },
  components: {
  }
}
</script>
<style lang="less">
.afterSaleList {
  width: 100%;
  height: 100%;

  .ordersList {
    width: 100%;
    padding:  16px 15px 0;
    position:relative;

    .ordersContent {
      width: 100%;
      height: auto;
      background:rgba(255,255,255,1);
      box-shadow:0px 5px 21px 0px rgba(221,221,221,0.72);
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
        padding:0 16px 0;
        margin-bottom: 7px;

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

      .productNum {
        width: 100%;
        padding:0 16px 16px;
        color:#333333;
        font-size: 14px;
        text-align: right;
        border-bottom:1px solid #EAEAEA;
      }

      .operationButton {
        width: 100%;
        height: 64px;
        padding:14px 16px 0;
        text-align: right;

        button {
          width:80px;
          height:30px;
          border:none;
          font-size: 14px;
          vertical-align: middle;
          border-radius:30px;
          background-color: #ffffff;

          &.deleteBtn {
            color:#999999;
            border:1px solid #999999;
          }

          &.redBtn {
            color:#EA3323;
            border:1px solid #EA3323;
          }
        }
      }
    }
  }

  .loading {
    width: 100%;
    height: auto;
    padding-top:150px;
    position: relative;
    font-size: 14px;
    text-align: center;
    top: 0;
    color:#999999;

    &>div {
      margin: 0 auto 10px;
    }
  }

  .noOrder {
    width: 100%;
    margin: 46px 0 0;

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
}
</style>


