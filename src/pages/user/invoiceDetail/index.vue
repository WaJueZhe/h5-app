<template>
  <div class="invoiceDetail">
     <div class="invoiceDetailDiv">
       <div class="oneDetail">
         <div class="oneDetailTitle">发票类型</div>
         <div class="oneDetailContent">纸质发票</div>
       </div>
       <div class="oneDetail">
         <div class="oneDetailTitle">申请时间</div>
         <div class="oneDetailContent">{{ invoice.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</div>
       </div>
       <div class="oneDetail">
         <div class="oneDetailTitle">发票抬头</div>
         <div class="oneDetailContent">{{invoice.invoiceTitle}}</div>
       </div>
       <div class="oneDetail">
         <div class="oneDetailTitle">税号</div>
         <div class="oneDetailContent">{{invoice.taxNumber}}</div>
       </div>
       <div class="oneDetail">
         <div class="oneDetailTitle">发票内容</div>
         <div class="oneDetailContent">商品明细</div>
       </div>
     </div>
  </div>
</template>
<script>
import Models from '@/models';
export default {
  name:"invoiceDetail",
  data () {
    return {
      invoice: {},
    }
  },
  methods:{
    oneInvoice () {
      let data = {
        id:this.$route.query.id,
      };
      Models.User
      .getOneInvoice(data)
      .then( res => {
        if (res.data.code == '0') {
          this.invoice = res.data.info;
        }
      })
    },
  },
  created () {
    this.oneInvoice();
  },
  components: {
  },
}
</script>

<style lang="less" scoped>
.invoiceDetail {
  width: 100%;
  height:100%;
  background-color: #F5F5F5;

  .invoiceDetailDiv {
    width: 100%;
    height:auto;
    padding-left:15px;
    background-color: #ffffff;

    .oneDetail {
      width:100%;
      height:44px;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      border-bottom:1px solid #EAEAEA;

      .oneDetailTitle {
        flex-basis: 60px;
        flex-shrink: 0;
        font-size: 15px;
        color: #333333;
      }

      .oneDetailContent {
        width: 100%;
        font-size: 14px;
        text-align: right;
        color:#999999;
        padding-right: 15px;
      }
    }
  }
}
</style>
