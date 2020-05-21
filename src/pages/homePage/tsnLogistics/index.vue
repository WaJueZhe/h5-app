<template>
  <div class="tsnLogistics-page">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        class="van-clearfix"
      >
        <div class="tsnLogistics" v-if="logisticsList.length > 0">
          <ul class="list">
            <li class="item" v-for="(item, index) in logisticsList" :key="index" @click="jumpChange(item)">
              <van-swipe-cell>
                <div class="box">
                  <div class="top">
                    <div class="title">{{ item.msgTitle }}</div>
                    <div class="time">{{ item.createTime | timeStamp }}</div>
                  </div>
                  <div class="content">
                    <div class="img">
                      <img :src="item.messagePic" alt="">
                    </div>
                    <div class="text">{{ item.msgDesc }}</div>
                  </div>
                </div>
                <template slot="right">
                  <div class="delete" @click="del(item.id)">
                    <img src="@/assets/del_icon.png" alt="">
                  </div>
                </template>
              </van-swipe-cell>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from "@/models";
import { SwipeCell, Cell, PullRefresh, List, Toast, Dialog } from 'vant';
Vue.use(SwipeCell).use(Cell).use(PullRefresh).use(List).use(Toast).use(Dialog)
export default {
  name: 'tsnLogistics',
  data() {
    return {
      logisticsList: [],
      id: '',
      page: 1,
      size: 10,
      loading: false,
      finished: false,
      isLoading: false,
    };
   },
   watch: {

   },
   filters: {
     timeStamp (val) {
        let time = new Date(val * 1);
        let y = time.getFullYear();
        let m = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)
        let d = time.getDate() < 10 ? '0' +  (time.getDate()) : time.getDate()
        return y + '/' + m + '/' + d
     }
   },
   methods: {
     init () {
        this.loading = true
        this.finished = false
        let data = {
          id: this.id,
          page: this.page,
          size: this.size
        }
        Models.Home
        .getUserMessage(data)
        .then(res => {
          if (res.data.code === '0') {
            this.isLoading = false
            this.logisticsList = this.logisticsList.concat(res.data.info.list)
            // 加载状态结束
            this.loading = false
            this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
            this.page = Number(this.page) + 1
          }
        })
     },
     //跳转
     jumpChange (item) {
       let str = item.link.lastIndexOf(':')
       let name = item.link.substring(0, str)
       let val = item.link.substring(str + 3)
       if (item.msgType === '3') {
        if (name === 'http' || name === 'https') {
          window.location.href = item.link
        }else if (name === 'good') {//商品详情
          this.$router.push({
            name: 'goodsDetails',
            query: {
              goodId: val
            }
          })
        }else if (name === 'refund') {//退款详情
          this.$router.push({
            name: 'refundDetail',
            query: {
              refundId: val
            }
          })
        }else if (name === 'withdraw') {//提现明细
          this.$router.push({
            name: 'withdrawalsRecord'
          })
        }else if (name === 'order') {//订单详情
            this.$router.push({
            name: 'orderDetails',
            query: {
              id: val
            }
          })
        }else if (name === 'express') {//物流信息
            this.$router.push({
            name: 'logisticsInformation',
            query: {
              orderId: val,
              goodPic: item.messagePic
            }
          })
        }
       }else if (item.msgType === '4') {
         this.$router.push({
            name: 'balance',
            query: {
              chargeAct: '2'
            }
          })
       }
     },
     //删除交易物流
     del (id) {
       let data = {
         id: id
       }
       Models.Home
       .delUserMessage(data)
       .then(res => {
         if (res.data.code === '0') {
           Toast('删除成功')
           this.page = 1;
           this.logisticsList = []
           this.init()
         }else {
           Toast(res.data.msg)
         }
       })
     },
     /**
     * 下拉刷新
     */
     onRefresh() {
        setTimeout(() => {
          if(this.logisticsList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.noOrder = false
            this.isShowGoodList = false;
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              id: this.id,
              page: this.page,
              size: this.size
            };
            Models.Home
            .getUserMessage(data)
            .then(res => {
              if(res.data.code === '0') {
                this.isLoading = false;
                // 加载状态结束
                this.loading = false
                this.logisticsList = [];
                this.logisticsList = res.data.info.list;
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
                this.page = Number(this.page) + 1;
              }
            })
          }
        }, 500);
      },
      /**
     * 上拉获取
     */
      onLoad () {
        this.init();
        //数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }
   },
   computed: {

   },
   created() {
    this.id = this.$route.query.id;
    this.init()
   },
   mounted() {

   },
   components: {

   },
};
</script>

<style lang="less">

.tsnLogistics-page {
  width: 100%;

  .tsnLogistics {
    width: 100%;

    .list {
      padding: 15px 0;
      width: 100%;

      .item {
        margin-bottom: 15px;
        width: 100%;


        &:last-child {
          margin-bottom: 0;
        }

        .box {
          margin: auto;
          padding: 15px;
          width: 345px;
          background-color: #fff;
          border-radius: 10px;

          .top {
            margin-bottom: 15px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              font-size: 18px;
              font-weight: bold;
            }

            .time {
              font-size: 12px;
              color: #999;
            }
          }

          .content {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .img {
              margin-right: 15px;
              width: 67px;
              height: 67px;
              overflow: hidden;

              > img {
                width: 100%;
              }
            }

            .text {
              flex: 1;
              font-size: 14px;
              color: #333;
            }
          }
        }

        .van-swipe-cell__right {
          .delete {
            margin-right: 15px;
            width: 60px;
            height: 100%;
            display: flex;
            align-items: center;

            > img {
              margin: auto;
              width: 34px;
              height: 34px;
            }
          }
        }
      }
    }
  }
};
</style>
