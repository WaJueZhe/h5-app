<template>
  <div class="activityMessage-page">
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
        <div class="activityMessage" v-if="activityMessageList.length > 0">
          <ul class="list">
            <li class="item" v-for="(item, index) in activityMessageList" :key="index">
              <div class="top">
                <div class="title">{{ item.msgTitle }}</div>
                <div class="time">{{ item.createTime | timeStamp }}</div>
              </div>
              <div class="pic-img">
                <img :src="item.messagePic" alt="">
              </div>
              <div class="desc">{{ item.msgDesc }}</div>
              <div class="watch-desc" @click="jumpChange(item)">
                <div class="watch">查看详情</div>
                <div class="icon">
                  <van-icon name="arrow" size="16px" color="#999999"/>
                </div>
              </div>
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
import { Icon, PullRefresh, List, } from 'vant';
Vue.use(Icon).use(PullRefresh).use(List)
export default {
  name: 'tsnLogistics',
  data() {
    return {
      activityMessageList: [],
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
          id: '2',
          page: this.page,
          size: this.size
        }
        Models.Home
        .getUserMessage(data)
        .then(res => {
          if (res.data.code === '0') {
            this.isLoading = false
            this.activityMessageList = this.activityMessageList.concat(res.data.info.list)
            // 加载状态结束
            this.loading = false
            this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
            this.page = Number(this.page) + 1
          }
        })
     },
     jumpChange (item) {
       let str = item.link.lastIndexOf(':')
       let name = item.link.substring(0, str)
       let val = item.link.substring(str + 3)
       if (name === 'http' || name === 'https') {
         window.location.href = item.link
       }else if (name === 'good') {//商品详情
          this.$router.push({
            name: 'goodsDetails',
            query: {
              goodId: val
            }
          })
        }
     },
     /**
     * 下拉刷新
     */
     onRefresh() {
        setTimeout(() => {
          if(this.activityMessageList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.noOrder = false
            this.isShowGoodList = false;
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              id: '2',
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
                this.activityMessageList = [];
                this.activityMessageList = res.data.info.list;
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
     this.init()
   },
   mounted() {

   },
   components: {

   },
};
</script>

<style scoped lang="less">

.activityMessage-page {
  width: 100%;

  .activityMessage {
    width: 100%;

    .list {
      padding: 15px;
      width: 100%;

      .item {
        padding: 15px;
        margin-bottom: 15px;
        width: 100%;
        background-color: #fff;
        border-radius: 10px;

        &:last-child {
          margin-bottom: 0;
        }

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

        .pic-img {
          margin: 15px 0;
          width: 100%;
          height: 115px;
          overflow: hidden;

          > img {
            margin: auto;
            height: 115px;
          }
        }

        .desc {
          padding-bottom: 15px;
          font-size: 14px;
          color: #333;
        }

        .watch-desc {
          position: relative;
          display: block;
          padding-top: 8px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // border-top: 1px solid #EAEAEA;

          &::after {
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

          .watch {
            font-size: 14px;
            color: #333;
          }

          .icon {
            .text {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
};
</style>
