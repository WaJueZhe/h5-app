<template>
  <div class="messageCenter-page">
    <div class="message-nav">
      <ul class="m-list">
        <li class="m-item">
          <router-link :to="{ name: 'tsnLogistics', query: { id: '3' } }">
            <div class="img">
              <img src="@/assets/homePage/logistics_icon.png" alt="">
              <div class="number" v-if="unreadForm.orderFlow > 0">{{ unreadForm.orderFlow }}</div>
            </div>
            <div class="text">交易物流</div>
          </router-link>
        </li>
        <li class="m-item">
          <router-link :to="{ name: 'tsnLogistics', query: { id: '4' } }">
            <div class="img">
              <img src="@/assets/homePage/Profit_icon.png" alt="">
              <div class="number" v-if="unreadForm.profit > 0">{{ unreadForm.profit }}</div>
            </div>
            <div class="text">收益消息</div>
          </router-link>
        </li>
        <li class="m-item">
          <router-link :to="{ name: 'activityMessage' }">
            <div class="img">
              <img src="@/assets/homePage/activity_icon.png" alt="">
              <div class="number" v-if="unreadForm.activity > 0">{{ unreadForm.activity }}</div>
            </div>
            <div class="text">活动消息</div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="push-box">
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          finished-text="没有更多了"
          :immediate-check="false"
          class="van-clearfix"
        >
          <div class="push-group">
            <ul class="g-list">
              <li class="g-item" v-for="(item, index) in messageList" :key="index" @click="goDesc(item, index)">
                <div class="entry">
                  <div class="pic">
                    <img src="http://web.no1qh.com/logo.jpg" alt="">
                  </div>
                  <div class="right-info">
                    <div class="title">
                      <h4 class="h4">{{ item.msgTitle }}</h4>
                      <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd') }}</div>
                    </div>
                    <div class="desc-box">
                      <div class="desc">{{ item.msgDesc }}</div>
                      <div class="number" v-if="!unreadFlage[index]"></div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from "@/models";
import Footer from '@/components/footer'
import { PullRefresh, List, } from 'vant';
Vue.use(PullRefresh).use(List)
export default {
  name: 'messageCenter',
  data() {
    return {
      unreadForm: {
        activity: '',// 活动消息
        profit: '',//收益结算消息
        orderFlow: '',//交易物流消息
        notice: '',//公告消息
      },
      messageList: [],//消息中心
      unreadMsgList: [],//控制未读消息的状态
      unreadFlage: null,
      page: 1,
      size: 15,
      total: undefined,
      loading: false,
      finished: false,
      isLoading: false,
    };
   },
   watch: {

   },
   methods: {
     //获取未读消息数量
     unread () {
       Models.Home
      .getUnreadMessage()
      .then(res => {
        if (res.data.code === '0') {
          this.unreadForm.activity = res.data.info.activity
          this.unreadForm.profit = res.data.info.profit
          this.unreadForm.orderFlow = res.data.info.orderFlow
        }
      })
     },
     //获取消息中心
     obtainMessage () {
        this.loading = true
        this.finished = false
        let data = {
          id: '1',
          page: this.page,
          size: this.size
        }
        Models.Home
        .getUserMessage(data)
        .then(res => {
          if (res.data.code === '0') {
            this.isLoading = false
            this.messageList = this.messageList.concat(res.data.info.list)
            // 加载状态结束
            this.loading = false
            this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
            this.page = Number(this.page) + 1
            if (localStorage.getItem('unreadMsgList') != null) {
              let list = JSON.parse(localStorage.getItem('unreadMsgList'))
              if(this.messageList.length != list.length){
                let a = this.messageList.length - list.length;
                for(let i=0;i<a;i++){
                  list.unshift(false);
                }

                localStorage.setItem('unreadMsgList', JSON.stringify(list))
                this.unreadFlage = list;
              }
            }else {
              for (let i = this.messageList.length - 1; i >= 0; i--) {
                this.unreadMsgList[i] = false
              }
              localStorage.setItem('unreadMsgList', JSON.stringify(this.unreadMsgList))
            }
          }
        })
     },
     //公告详情
     goDesc (item, index) {
       let noticeDesc = JSON.stringify(item)
       sessionStorage.setItem('noticeDesc', noticeDesc)
       this.$router.push({
         name: 'systemNews'
       })
       let arr = JSON.parse(localStorage.getItem('unreadMsgList'))
       arr[index] = true
       localStorage.setItem('unreadMsgList', JSON.stringify(arr))
     },
     /**
     * 下拉刷新
     */
     onRefresh() {
        setTimeout(() => {
          if(this.messageList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.noOrder = false
            this.isShowGoodList = false;
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              id: '1',
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
                this.messageList = [];
                this.messageList = res.data.info.list;
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                this.page = Number(this.page) + 1;

                if (localStorage.getItem('unreadMsgList') != null) {
                  let list = JSON.parse(localStorage.getItem('unreadMsgList'))
                  if(this.messageList.length != list.length){
                    let a = this.messageList.length - list.length;
                    for(let i=0;i<a;i++){
                      list.unshift(false);
                    }

                    localStorage.setItem('unreadMsgList', JSON.stringify(list))
                    this.unreadFlage = list;
                  }
                }else {
                  for (let i = this.messageList.length - 1; i >= 0; i--) {
                    this.unreadMsgList[i] = false
                  }
                  localStorage.setItem('unreadMsgList', JSON.stringify(this.unreadMsgList))
                }
              }
            })
          }
        }, 500);
      },
      /**
     * 上拉获取
     */
      onLoad () {
        this.obtainMessage();
        //数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }
   },
   computed: {

   },
   created() {

   },
   activated() {
     this.unread()
     this.obtainMessage()
     this.unreadFlage = JSON.parse(localStorage.getItem('unreadMsgList')) || []
   },
   mounted() {

   },
   components: {
     'v-footer': Footer,
   },
};
</script>

<style scoped lang="less">

.messageCenter-page {
  width: 100%;

  .message-nav {
    padding: 15px 15px 0 15px;
    width: 100%;

    .m-list {
      padding: 20px 25px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .m-item {
        width: 50px;

        > a {
          display: block;
          width: 100%;

          .img {
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 50%;

            > img {
              width: 100%;
              height: 100%;
            }

            .number {
              position: absolute;
              top: 0;
              right: 0;
              padding: 0 4px;
              min-width: 16px;
              max-width: 36px;
              font-size: 12px;
              text-align: center;
              background-color: #EA3323;
              color: #fff;
              border-radius: 20px;
              z-index: 999;
            }
          }

          .text {
            margin-top: 8px;
            font-size: 12px;
            text-align: center;
            color: #333;
          }
        }
      }
    }
  }

  .push-box {
     padding-bottom: 43px;

    .push-group {
      width: 100%;

      .g-list {
        width: 100%;

        .g-item {
          width: 100%;

          .entry {
            padding: 0 15px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .pic {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              overflow: hidden;

              > img {
                width: 100%;
              }
            }

            .right-info {
              position: relative;
              padding: 15px 0;
              margin-left: 10px;
              flex: 1;

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

              .title {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .h4 {
                  max-width: 200px;
                  font-size: 16px;
                  font-weight: 600;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }

                .time {
                  font-size: 12px;
                  color: #999;
                }
              }

              .desc-box {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .desc {
                  max-width: 220px;
                  margin-top: 8px;
                  font-size: 12px;
                  color: #999;
                }

                .number {
                  padding: 0 4px;
                  width: 12px;
                  height: 12px;
                  text-align: center;
                  background-color: #EA3323;
                  border-radius: 20px;
                  z-index: 999;
                }
              }
            }
          }

          .van-swipe-cell__right {
            .van-button {
              height: 75px;
            }
          }
        }
      }
    }
  }
};
</style>
