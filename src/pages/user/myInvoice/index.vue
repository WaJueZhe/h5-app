<template>
  <div class="myInvoice">
      <van-pull-refresh v-model="isLoading"
        @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            class="van-clearfix"
          >
        <div class="invoiceList">
          <div class="anyoneInvoice" v-for="(data,index) in myInvoicesList" :key="index">
            <div class="invoiceTitle">{{data.invoiceTitle}}</div>
            <div class="invoicePrice">￥{{data.invoiceAmount}}</div>
            <div class="invoiceDetail">
              <div>
                <span @click="goInvoiceDetail(data.invoiceId)">发票详情</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import Models from '@/models';
import Vue from 'vue'
import {PullRefresh, List } from 'vant';
Vue.use(PullRefresh).use(List);
export default {
  name:"myInvoice",
  data () {
    return {
      myInvoicesList:[],
      page: '1',//第几页
      size: '10',//每页条数
      total: '',

      loading: false,
      finished: false,
      isLoading: false
    }
  },
  methods:{
     /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.myInvoicesList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1
          let data = {
            page: this.page,
            size: this.size,
          };
          Models.User
          .getMyInvoices(data)
          .then(res => {
            if(res.data.code == '0') {
              this.isLoading = false
              // 加载状态结束
              this.loading = false
              this.myInvoicesList = []
              this.myInvoicesList = res.data.info.list
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
              this.page = Number(this.page) + 1;
            }
          })
        }
      }, 500);
    },

    /**
     * 上拉获取
     */
    onLoad() {
      this.myInvoices();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    //获取我的发票列表
    myInvoices () {
      this.loading = true
      this.finished = false
      let data = {
        page:this.page,
        size:this.size,
      };
      Models.User
      .getMyInvoices(data)
      .then(res => {
        if(res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.myInvoicesList = this.myInvoicesList.concat(res.data.info.list)
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    //跳转详情
    goInvoiceDetail (id) {
      this.$router.push(`/invoiceDetail?id=${id}`)
    }
  },
  components: {
  },
  created () {
    this.myInvoices();
  }
}
</script>

<style lang="less">
.myInvoice {
  width: 100%;
  height:100%;

  .invoiceList {
    width: 100%;
    height:auto;
    padding: 0 15px;

    .anyoneInvoice {
      width:100%;
      height:auto;
      background:rgba(255,255,255,1);
      box-shadow:0px 5px 21px 0px rgba(221,221,221,0.72);
      border-radius:8px;
      margin-top: 16px;

      .invoiceTitle {
        width: 100%;
        height: 42px;
        padding: 15px 15px 0;
        font-size: 14px;
        color:#333333;
      }

      .invoicePrice {
        width: 100%;
        height: 42px;
        font-size: 18px;
        color: #EA3323;
        padding: 3px 15px 0;
      }

      .invoiceDetail {
        width: 100%;
        height: 44px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        padding: 0 15px;
        border-top:1px solid #EAEAEA;

        div {
          width: 100%;
          text-align: right;
          font-size: 14px;
          color:#999999;
        }
      }
    }
  }
}

</style>




