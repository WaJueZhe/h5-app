<template>
  <div class="bonusList-page">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading"
        :finished="finished"
        :finished-text="noDataText"
        @load="onLoad"
        :immediate-check="false"
        class="van-clearfix"
        >
        <div class="award-box" v-if="status == 1">
          <div class="bonusListHeader">
            <div class="title">累计收益(元)</div>
            <div class="money">{{ budgetByDate.totalAmount }}</div>
            <div class="price">
              <ul class="p-list">
                <li class="p-item">
                  <div class="p-title">今日收益</div>
                  <div class="p-money">{{ budgetByDate.dayAmount }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">本月收益</div>
                  <div class="p-money">{{ budgetByDate.monthAmount }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">待结算</div>
                  <div class="p-money">{{ budgetByDate.unAccounts }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">已结算</div>
                  <div class="p-money">{{ budgetByDate.accounts }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="settlement" v-if="awardList.length > 0">待结算订单</div>
          <div class="group" v-if="awardList.length > 0">
            <ul class="list">
              <li class="item" v-for="(item,index) in awardList" :key="index">
                <div class="top">
                  <div class="head-img"><img :src="item.user.headImagePic" alt=""></div>
                  <div class="name">
                    <span class="nickName">{{ item.user.nickName }}</span>
                    <span class="grade" v-if="item.user.ygrade > 0">{{ item.user.ygrade | getyGrade }}</span>
                  </div>
                  <div class="number">+￥{{ item.amount }}</div>
                </div>
                <div class="order-number">{{ item.goodSimpleInfos[0].title }}</div>
                <div class="time">
                  <div class="establish">创建日：{{ item.createTime | timeStampFilter('mm-dd h：m') }}</div>
                  <div class="last" v-if="item.lastSettleTime !== '0'">最后结算日：{{ item.lastSettleTime | timeStampFilter('mm-dd h：m') }}</div>
                  <div class="order-money">订单金：￥{{ item.fromAmount }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="noOrder" v-show="noOrder">
            <img src="@/assets/user/blank_icon.png" alt="">
          </div>
        </div>
        <div class="award-box" v-if="status == 2">
          <div class="bonusListHeader">
            <div class="title">累计预奖励惠呗（个）</div>
            <div class="money">{{ budgetByDate.totalAmount }}</div>
            <div class="price">
              <ul class="p-list">
                <li class="p-item">
                  <div class="p-title">今日收益</div>
                  <div class="p-money">{{ budgetByDate.dayAmount }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">本月收益</div>
                  <div class="p-money">{{ budgetByDate.monthAmount }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">待结算</div>
                  <div class="p-money">{{ budgetByDate.unAccounts }}</div>
                </li>
                <li class="p-item">
                  <div class="p-title">已结算</div>
                  <div class="p-money">{{ budgetByDate.accounts }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="settlement" v-if="huibeiList.length > 0">待结算订单</div>
          <div class="group" v-if="huibeiList.length > 0">
            <ul class="list">
              <li class="item" v-for="(item,index) in huibeiList" :key="index">
                <div class="top">
                  <div class="head-img"><img :src="item.user.headImagePic" alt=""></div>
                  <div class="name">
                    <span class="nickName">{{ item.user.nickName }}</span>
                    <span class="grade" v-if="item.user.ygrade > 0">{{ item.user.ygrade | getyGrade }}</span>
                  </div>
                  <div class="number">+{{ item.point }}</div>
                </div>
                <div class="order-number">{{ item.goodSimpleInfos[0].title }}</div>
                <div class="time">
                  <div class="establish">创建日：{{ item.createTime | timeStampFilter('mm-dd h：m') }}</div>
                  <div class="last" v-if="item.lastSettleTime !== '0'">最后结算日：{{ item.lastSettleTime | timeStampFilter('mm-dd h：m') }}</div>
                  <div class="order-money">订单金：￥{{ item.fromAmount }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="noOrder" v-show="noOrder">
            <img src="@/assets/user/blank_icon.png" alt="">
          </div>
        </div>
    </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { PullRefresh , List } from 'vant';

  Vue.use(PullRefresh).use(List);
import Models from '@/models';
export default {
  name:"bonusList",
  data () {
    return {
      page: '1',
      size: '10',
      total: '',
      awardList: [],//奖励金预收益
      huibeiList: [],//惠呗预收益
      budgetByDate: {},//收益明细统计
      num:"",
      status: '',
      loading: false,
      finished: false,
      isLoading: false,
      noDataText:"",
      noOrder: false,
    }
  },
  filters: {
    getyGrade(val) {
      if(val == 3) {
        return 'VIP'
      }else if(val == 4) {
        return '社区BOSS'
      }else if(val == 5) {
        return '金牌BOSS'
      }else if(val == 6) {
        return '合伙商'
      }else if(val == 7) {
        return '运营中心'
      }
    }
  },
   methods:{
    /**
     * 下拉刷新
    */
    onRefresh() {
      setTimeout(() => {
        if (this.status == 1) {
          if(this.awardList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1;
            let data = {
              page: this.page,
              size: this.size
            };
            Models.User
            .getPreFundList(data)
            .then(res => {
              if (res.data.code == '0') {
                this.isLoading = false;
                // 加载状态结束
                this.loading = false;
                this.awardList = []
                this.awardList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                if (this.awardList.length > 0) {
                  this.noDataText = '我也是有底线的~'
                }
                this.page = Number(this.page) + 1;
              }
            })
          }
        }else {
          if(this.huibeiList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1;
            let data = {
              page: this.page,
              size: this.size
            };
            Models.User
            .getPrePointList(data)
            .then(res => {
              if ( res.data.code == 0 ) {
                this.isLoading = false;
                // 加载状态结束
                this.loading = false
                this.huibeiList = []
                this.huibeiList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                if (this.huibeiList.length > 0) {
                  this.noDataText = '我也是有底线的~'
                }
                this.page = Number(this.page) + 1;
              }
            })
          }
        }
      }, 1000);
    },

     /**
      * 上拉获取
      */
    onLoad() {
      if (this.status == 1) {
        this.preRewardIncome();
      }else {
        this.preEarnings();
      }

      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    //惠呗预收益
    preEarnings () {
      this.loading = true
      this.finished = false
      let data = {
        page:this.page,
        size:this.size
      };
      Models.User
      .getPrePointList(data)
      .then(res => {
        if ( res.data.code == '0' ) {
          this.isLoading = false;
          // 加载状态结束
          this.loading = false;
          this.budgetByDate = res.data.info.budgetByDate
          this.huibeiList = this.huibeiList.concat(res.data.info.fundBudgetBOList);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          if (this.huibeiList.length > 0) {
            this.noDataText = '我也是有底线的~'
          }else {
            this.noOrder = true
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    // 奖励金预收益
    preRewardIncome () {
      this.loading = true
      this.finished = false
      let data = {
        page:this.page,
        size:this.size
      };
      Models.User
      .getPreFundList(data)
      .then(res => {
        if ( res.data.code == 0 ) {
          this.isLoading = false;
          // 加载状态结束
          this.loading = false;
          this.budgetByDate = res.data.info.budgetByDate
          this.awardList = this.awardList.concat(res.data.info.fundBudgetBOList);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          if (this.awardList.length > 0) {
            this.noDataText = '我也是有底线的~'
          }else {
            this.noOrder = true
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
  },
  components: {
  },
  created () {
    this.status = this.$route.query.status
    //1是资金预收益，2是惠贝预收益
    if(this.status == 1) {
      this.preRewardIncome();
    }else {
      this.preEarnings();
    }
  }
}
</script>
<style lang="less">
.bonusList-page {
  width: 100%;

  .award-box {
    width: 100%;

    .bonusListHeader {
      padding: 15px;
      width: 100%;
      background-color: #fff;

      .title {
        font-size: 14px;
        text-align: center;
        color: #333;
      }

      .money {
        margin-top: 12px;
        font-size: 36px;
        line-height: 1;
        font-weight: 600;
        text-align: center;
        color: #EA3323;
      }

      .price {
        margin-top: 26px;
        width: 100%;

        .p-list {
          width: 100%;
          display: flex;
          justify-content: space-evenly;
          overflow: hidden;

          .p-item {
            position: relative;
            padding: 0 12px;
            text-align: center;

            &::after {
              content: "";
              width: 0;
              height: 100%;
              display: block;
              border-right: 1px solid #EAEAEA;
              position: absolute;
              right: 0;
              bottom: 0;
              transform: scale(.5);
              transform-origin: right center;
            }

            &:last-child {
              &::after {
                border-right: none;
              }
            }

            .p-title {
              font-size: 12px;
              line-height: 1;
              text-align: center;
              color: #333;
            }

            .p-money {
              margin-top: 8px;
              font-size: 16px;
              line-height: 1;
              text-align: center;
              color: #333;
            }
          }
        }
      }
    }

    .settlement {
      position: relative;
      padding: 18px 15px;
      margin-top: 8px;
      font-size: 14px;
      line-height: 1;
      background-color: #fff;
      color: #44A544;

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

    .group {
      padding: 0 15px;
      width: 100%;
      background-color: #fff;

      .list {
        width: 100%;

        .item {
          position: relative;
          padding: 15px 0;
          width: 100%;

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

          &:last-child {
            border-bottom: none;
          }

          .top {
            position: relative;
            width: 100%;
            height: 30px;

            .head-img {
              position: absolute;
              top: 0;
              left: 0;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              overflow: hidden;
              background-color: #000;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .name {
              position: absolute;
              top: 0;
              left: 38px;
              height: 30px;
              font-size: 14px;
              color: #333;
              display: flex;
              align-items: center;

              .nickName {
                display: inline-block;
                max-width: 165px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .grade {
                display: inline-block;
                padding: 1px 4px 2px 4px;
                margin-left: 8px;
                font-size: 10px;
                color: #BA220F;
                background: -webkit-linear-gradient(left,  #F1D451 , #FAEBA9); /* Safari 5.1 - 6.0 */
                background: -o-linear-gradient(right, #F1D451 , #FAEBA9); /* Opera 11.1 - 12.0 */
                background: -moz-linear-gradient(right, #F1D451 , #FAEBA9); /* Firefox 3.6 - 15 */
                background: linear-gradient(to right, #F1D451 , #FAEBA9) ; /* 标准的语法 */
                border-radius: 2px;
              }
            }

            .number {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 15px;
              line-height: 30px;
              font-weight: 500;
              color: #EA3323;
            }
          }

          .order-number {
            margin-top: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .time {
            margin-top: 8px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            >  div {
              font-size: 10px;
              color: #999;

              &:nth-child(2) {
                text-align: center;
              }
              &:nth-child(3) {
                text-align: right;
              }
            }
          }
        }
      }
    }

    .noOrder {
      position: fixed;
      margin-top: 8px;
      width: 100%;
      height: calc(100vh - 160px);
      background-color: #fff;

      > img {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 227px;
      }
    }
  }
}
</style>
