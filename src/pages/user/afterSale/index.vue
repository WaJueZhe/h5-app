<template>
  <div class="afterSale">
    <div class="productList" v-if="refundInfo != null">
      <ul class="list">
        <li class="item" v-for="(item, index) in refundInfo" :key="index">
          <div class="anyOneProduct">
            <div class="productImg">
              <img :src="item.goodPic" alt="">
            </div>
            <div class="productContent">
              <p class="productName">{{ item.goodTitle }}</p>
              <p class="productStyle">
                <span v-for="(aData,aIndex) in item.skuAttrs" :key="aIndex">{{aData.name}}: {{aData.value}}，</span>
              </p>
              <p class="productMenoy">数量：{{ item.goodNum }}</p>
            </div>
          </div>
          </li>
        </ul>
    </div>
    <div class="afterSaleContent">
      <div class="refund" @click="go(1)">
        <div class="r-box">
          <img src="@/assets/afterSale/refund.png" alt="">
          <p class="afterSaleTitle">我要退款（无需退货）</p>
          <p class="afterSaleExplain">未收到货，或与卖家协商同意不用退货只退款</p>
        </div>
      </div>
      <div class="refund" @click="go(3)" v-if="ystatus === '3' || ystatus === '4' || ystatus === '5'">
        <div class="r-box">
          <img src="@/assets/afterSale/returnGoodsAndRefund.png" alt="">
          <p class="afterSaleTitle">我要退货退款</p>
          <p class="afterSaleExplain">已收到货，需要退换已收到的货物</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"afterSale",
  data () {
    return {
      id: '',
      ystatus: '',//货物状态
      refundInfo: JSON.parse(sessionStorage.getItem('refundInfo'))
    }
  },
  methods:{
    go (status) {
      this.$router.replace({
        name: 'requestARefund',
        query: {
          id: this.id,
          status: status,//1是仅退款，3是退货退款
          statusType: '1'
        }
      });
    },
  },
  components: {
  },
  created() {
    this.id = this.$route.query.id
    this.ystatus = this.$route.query.ystatus
  }
}
</script>
<style lang="less" scoped>
.afterSale {
  width: 100%;
  height: 100%;
  top: 0;
  overflow: auto;

  .productList {
    width: 100%;
    height: auto;
    padding:15px 16px;
    background-color: #fff;

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

  .afterSaleContent {
    width: 100%;
    padding: 30px 15px 0;

    .refund {
      margin-bottom: 30px;
      width:100%;
      height:161px;
      background:#fff;
      border-radius: 10px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      .r-box {
        width: 100%;

        img {
          width: 55px;
          height: 55px;
          margin: 0 auto 8px;
        }

        p.afterSaleTitle {
          font-size: 16px;
          color: #232323;
          text-align: center;
          margin-bottom: 10px;
        }

        p.afterSaleExplain {
          font-size: 12px;
          color: #999999;
          text-align: center;
        }
      }
    }
  }
}
</style>


