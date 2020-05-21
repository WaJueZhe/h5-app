<template>
  <div class="myPrize-page">
    <div class="tab-nav">
      <van-tabs :azy-render="false" sticky v-model="active" @click="tabActive">
        <van-tab style="flex-basis: 0;" title="全部"></van-tab>
        <van-tab style="flex-basis: 0;" title="未领奖"></van-tab>
        <van-tab style="flex-basis: 0;" title="已领奖"></van-tab>
      </van-tabs>
    </div>

    <div class="content" v-if="prizeList.length > 0">
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
            <li class="item" v-for="(item, index) in prizeList" :key="index" @click.stop="goToJump(item)">
              <div class="pic">
                <img :src="item.giftPic" alt="">
              </div>
              <div class="info">
                <div class="top">
                  <div class="title">{{ item.giftName }}</div>
                  <div class="state" v-if="item.takeTime > 0">已领奖</div>
                  <div class="state" v-else  style="color: #EA3323">未领取</div>
                </div>
                <div class="time">中奖时间：{{ item.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</div>
                <div class="prize">
                  <div class="desc" v-if="item.takeTime > 0 && item.giftType == '1'">请在惠呗查看</div>
                  <div class="desc" v-if="item.takeTime > 0 && item.giftType == '2'">请在账户余额查看</div>
                  <div class="go-btn" v-if="item.takeTime == 0">去领奖</div>
                </div>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="no-info" v-else>
      <span>暂无奖品</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import { Tab , Tabs, PullRefresh, List, Toast } from 'vant'
Vue.use(Tab).use(Tabs).use(PullRefresh).use(List).use(Toast)
export default {
  name: 'myPrize',
  data() {
    return {
      active: 0,
      prizeList: [], // 奖品数据
      getType: 1, // 1 - 全部 2- 已领取 3-未领取
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
        this.getType = 1
      }else if (index === 1) {
        this.getType = 3
      }else if (index === 2) {
        this.getType = 2
      }
      this.prizeList = []
      this.init()
    },
    // 判断跳转---
    /**
     * 奖品类型 giftType 1-惠贝 2-余额 3-提货卡；
     * 奖品状态 takeTime 大于0-已领取 否则-未领取
    */
    goToJump (item) {
      if (item.takeTime > 0 && item.giftType == 1) {
        this.$router.push({
          name: 'balance',
          query: {
            chargeAct: '3'
          }
        })
      }else if (item.takeTime > 0 && item.giftType == 2) {
        this.$router.push({
          name: 'balance',
          query: {
            chargeAct: '2'
          }
        })
      }else if (item.giftType == 3) {
        if (item.takeTime > 0) {
          sessionStorage.statusType = 0;
          this.$router.push({ name: 'allOrders' })
        }else {
          if (item.giftGoodId > 0 && item.giftCardId > 0) {
            this.$router.push({
              name: 'goodsDetails',
              query: {
                goodId: item.giftGoodId,
                cardId: item.giftCardId,
                luckyUserId: item.luckyUserId
              }
            })
          }else {
            Toast('没有商品id')
          }
        }
      }
    },
    // 获取奖品数据
    init () {
      this.loading = true
      this.finished = false
      let data = {
        getType: this.getType,
        page: this.page,
        size: this.size,
      }
      Models.User
      .getMyLuckyGift(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.prizeList = this.prizeList.concat(res.data.info.list);
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
        if(this.prizeList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1;
          let data = {
            getType: this.getType,
            page: this.page,
            size: this.size,
          };
          Models.User
          .getMyLuckyGift(data)
          .then( res => {
            if ( res.data.code == '0' ) {
              this.isLoading = false
              // 加载状态结束
              this.loading = false
              this.prizeList = []
              this.prizeList = res.data.info.list
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
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.myPrize-page {
  width: 100%;

  .tab-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    background-color: #fff;
    border-bottom: 1px solid #EAEAEA;

    .van-tabs {
      .van-tabs__wrap {
        .van-tabs__nav {
          display: flex;
          .van-tab {
            flex: 1 !important;
            min-width: unset !important;
            padding: 0 10px !important;
            color: #333;
          }

          .van-tabs__line {
            width: 40px !important;
          }

          .van-tab--active {
            color: #EA3323
          }
        }
      }
    }
  }

  .content {
    margin-top: 45px;
    width: 100%;

    .list {
      width: 100%;
      background-color: #fff;

      .item {
        padding: 15px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #EAEAEA;
        overflow: hidden;

        &:last-child {
          border-bottom: none;
        }

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

        .info {
          padding-left: 15px;
          flex: 1;

          .top {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              font-size: 14px;
              color: #333;
            }

            .state {
              font-size: 14px;
              color: #999;
            }
          }

          .time {
            margin-top: 8px;
            font-size: 14px;
            color: #999;
          }

          .prize {
            margin-top: 8px;
            width: 100%;

            &::after {
              display: block;
              clear: both;
              content: ' ';
            }

            .desc {
              float: left;
              font-size: 14px;
              color: #EA3323;
            }

            .go-btn {
              float: right;
              width: 62px;
              height: 25px;
              line-height: 25px;
              font-size: 12px;
              text-align: center;
              background-color: #FB1F16;
              color: #fff;
              border-radius: 14px;
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

    > span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 15px;
      color: #333;
    }
  }
};
</style>
