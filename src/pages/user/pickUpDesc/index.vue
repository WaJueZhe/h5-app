<template>
  <div class="pickUpDesc-page">
    <div class="tab-nav">
      <van-tabs :azy-render="false" sticky v-model="active" @click="tabActive">
        <van-tab style="flex-basis: 0;" title="今日"></van-tab>
        <van-tab style="flex-basis: 0;" title="近七天"></van-tab>
        <van-tab style="flex-basis: 0;" title="本月"></van-tab>
        <van-tab style="flex-basis: 0;" title="全部"></van-tab>
      </van-tabs>
    </div>
    <div class="group" v-if="detailedList.length > 0">
      <h5 class="h5">提货卡使用明细</h5>
      <van-pull-refresh v-model="isLoading"
        @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="我也是有底线的~"
            @load="onLoad"
            :immediate-check="false"
            class="van-clearfix"
          >
          <ul class="list">
            <li class="item" v-for="(item, index) in detailedList" :key="index">
              <div class="top">
                <div class="order">订单号：{{ item.orderId }}</div>
                <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</div>
              </div>
              <div class="info">
                <div class="pic">
                  <img :src="item.goodPic" alt="">
                </div>
                <div class="desc">
                  <div class="title">{{ item.goodTitle }}</div>
                  <div class="price">￥{{ item.goodAmount }}</div>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="no-info" v-else>
      <img src="@/assets/homePage/defaultpage_icon.png" alt="">
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Tab, Tabs, PullRefresh, List } from 'vant';
Vue.use(Tab).use(Tabs).use(PullRefresh).use(List);
export default {
  name: 'pickUpDesc',
  data() {
    return {
      active: 0,
      detailedList: [], // 提货明细数据
      uid: '',
      getType: 2, // 1- 全部，2-今天， 3-最近7天，4-当月
      page: 1,
      size: 10,
      total: '',
      loading: false,
      finished: false,
      isLoading: false,
    };
  },
  watch: {

  },
  methods: {
    tabActive (index) {
      this.active = index
      this.page = 1
      if (index === 0) {
        this.getType = 2
      }else if (index === 1) {
        this.getType = 3
      }else if (index === 2) {
        this.getType = 4
      }else if (index === 3) {
        this.getType = 1
      }
      this.detailedList = []
      this.init()
    },
    init () {
      this.loading = true
      this.finished = false
      let data = {
        uid: this.uid,
        getType: this.getType,
        page: this.page,
        size: this.size,
      }
      Models.User
      .getGoodSaleCard(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.detailedList = this.detailedList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.detailedList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1;
          let data = {
            uid: this.uid,
            getType: this.getType,
            page: this.page,
            size: this.size,
          };
          Models.User
          .getGoodSaleCard(data)
          .then( res => {
            if ( res.data.code == '0' ) {
              this.isLoading = false
              // 加载状态结束
              this.loading = false
              this.detailedList = []
              this.detailedList = res.data.info.list
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
      this.init();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
  },
  computed: {

  },
  created() {
    this.uid = this.$route.query.uid
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.pickUpDesc-page {
  width: 100%;

  .tab-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #EAEAEA;
  }

  .group {
    margin-top: 45px;
    width: 100%;
    min-height: calc(100vh - 60px);
    background-color: #fff;
    overflow: hidden;

    .h5 {
      padding: 0 15px;
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
    }

    .list {
      width: 100%;

      .item {
        padding: 15px;
        width: 100%;
        border-bottom: 1px solid #EAEAEA;

        &:last-child {
          border-bottom: none;
        }

        .top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
        }

        .info {
          margin-top: 8px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          overflow: hidden;

          .pic {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            overflow: hidden;

            > img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }

          .desc {
            padding-left: 15px;
            flex: 1;

            .title {
              width: 100%;
              font-size: 14px;
              color: #333;
            }

            .price {
              margin-top: 20px;
              width: 100%;
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
    }
  }

  .no-info {
    position: relative;
    width: 100%;
    height: calc(100vh - 20px);

    > img {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 227px;
    }
  }
};
</style>
