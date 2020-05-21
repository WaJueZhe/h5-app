<template>
  <div class="detailed-page">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="noDataText"
        @load="onLoad"
        :immediate-check="false"
        class="van-clearfix"
      >
      <div class="balance-detailed" v-if="chargeAct == 2">
        <ul class="b-list">
          <li class="b-item" v-for="(item, index) in balanceList" :key="index">
            <div class="b-left">
              <div class="text" v-if="item.subject == 1">平台消费</div>
              <div class="text" v-if="item.subject == 2">余额充值</div>
              <div class="text" v-if="item.subject == 3">分享奖励</div>
              <div class="text" v-if="item.subject == 4">平台退款</div>
              <div class="text" v-if="item.subject == 5">{{ item.drawWay | cwdWay }}提现</div>
              <div class="text" v-if="item.subject == 7">消费奖励</div>
              <div class="text" v-if="item.subject == 8">赠送</div>
              <div class="text" v-if="item.subject == 9">余额兑换惠呗</div>
              <div class="text" v-if="item.subject == 10">会员升级</div>
              <div class="text" v-if="item.subject == 11">系统退还</div>
              <div class="text" v-if="item.subject == 12">线下消费抵扣</div>
              <div class="text" v-if="item.subject == 13">提现返还</div>
              <div class="text" v-if="item.subject == 14">活动抽奖</div>
              <div class="text" v-if="item.subject == 15">线下充值</div>
              <div class="order" v-if="item.subject == 1 || item.subject == 3 || item.subject == 4 || item.subject == 7">订单编号：{{ item.qhyhId }}</div>
              <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd') }}</div>
            </div>
            <div class="b-right">
              <div class="money" v-if="item.ytype == 1" :class="[ item.subject == 2 || item.subject == 3 || item.subject == 4 || item.subject == 7 || item.subject == 13 || item.subject == 14 || item.subject == 15 ? 'active' : '' ]">+￥{{ item.amount }}</div>
              <div class="money" v-if="item.ytype == 2">-￥{{ item.amount }}</div>
              <div class="money" v-if="item.ytype == 3">-{{ item.freeze }}</div>
              <div class="state" v-if="item.subject == 3" :class="[ item.subject == 3 ? 'active' : '' ]">消费￥{{ item.payAmount }}</div>
            </div>
          </li>
        </ul>
        <div class="no-info" v-show="noOrder">
          <img src="@/assets/user/blank_icon.png" alt="">
        </div>
      </div>
      <div class="balance-detailed" v-if="chargeAct == 3">
        <ul class="b-list">
          <li class="b-item" v-for="(item, index) in huibeiList" :key="index">
            <div class="b-left">
              <div class="text" v-if="item.subject == 1">平台消费</div>
              <div class="text" v-if="item.subject == 2">惠呗充值</div>
              <div class="text" v-if="item.subject == 3">分享奖励</div>
              <div class="text" v-if="item.subject == 4">惠呗退还</div>
              <div class="text" v-if="item.subject == 6">注册奖励</div>
              <div class="text" v-if="item.subject == 7">消费奖励</div>
              <div class="text" v-if="item.subject == 8">赠送</div>
              <div class="text" v-if="item.subject == 9">余额兑换惠呗</div>
              <div class="text" v-if="item.subject == 10">会员升级</div>
              <div class="text" v-if="item.subject == 11">系统退还</div>
              <div class="text" v-if="item.subject == 12">线下消费</div>
              <div class="text" v-if="item.subject == 14">活动抽奖</div>
              <div class="text" v-if="item.subject == 15">线下充值</div>
              <div class="order" v-if="item.subject == 1 || item.subject == 3 || item.subject == 4 || item.subject == 7">订单编号：{{ item.qhyhId }}</div>
              <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd') }}</div>
            </div>
            <div class="b-right">
              <div class="money" v-if="item.ytype == 1" :class="[ item.subject == 2 || item.subject == 3 || item.subject == 4 || item.subject == 6 || item.subject == 7 || item.subject == 8 || item.subject == 9 || item.subject == 11 || item.subject == 14 || item.subject == 15 ? 'active' : '' ]">+{{ item.point }}</div>
              <div class="money" v-if="item.ytype == 2">-{{ item.point }}</div>
              <div class="state" v-if="item.subject == 8">{{ item.phone }}</div>
            </div>
          </li>
        </ul>
        <div class="no-info" v-show="noOrder">
          <img src="@/assets/user/blank_icon.png" alt="">
        </div>
      </div>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import { PullRefresh, List } from 'vant';
Vue.use(PullRefresh).use(List);
export default {
  name: 'detailed',
  data() {
    return {
      chargeAct: '',
      page: '1',
      size: '10',
      total: '',
      //余额明细
      balanceList: [],
      //惠呗明细
      huibeiList: [],
      loading: false,
      finished: false,
      isLoading: false,
      noDataText: '',
      noOrder: false
    };
  },
  watch: {

  },
  filters: {
    cwdWay(val) {
      if(val == 1) {
        return '微信'
      }else if(val == 2) {
        return '支付宝'
      }else if(val == 3) {
        return '银行卡'
      }
    }
  },
  methods: {
    balanceInit() {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size
      }
      Models.User
      .getFundBook(data)
      .then(res => {
        if(res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.balanceList = this.balanceList.concat(res.data.info.list)
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.balanceList.length == 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    huibeiInit() {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size
      }
      Models.User
      .getPointBook(data)
      .then(res => {
        if(res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.huibeiList = this.huibeiList.concat(res.data.info.list)
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.huibeiList.length == 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.chargeAct == 2) {
          if(this.balanceList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              page: this.page,
              size: this.size,
            }
            Models.User
            .getFundBook(data)
            .then(res => {
              if(res.data.code == '0') {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.balanceList = []
                this.balanceList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
                if (this.balanceList.length == 0) {
                  this.noOrder = true;
                  this.noDataText = ''
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
            this.page = 1
            let data = {
              page: this.page,
              size: this.size,
            }
            Models.User
            .getPointBook(data)
            .then(res => {
              if(res.data.code == '0') {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.huibeiList = []
                this.huibeiList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
                if (this.huibeiList.length == 0) {
                  this.noOrder = true;
                  this.noDataText = ''
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
      if(this.chargeAct == 2) {
        this.balanceInit();
        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }else {
        this.huibeiInit();
        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }
    }
  },
  computed: {

  },
  created() {
    this.chargeAct = this.$route.query.chargeAct
    if(this.chargeAct == 2) {
      this.balanceInit()
    }else {
      this.huibeiInit()
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.detailed-page {
  width: 100%;

  .balance-detailed {
    width: 100%;

    .b-list {
      width: 100%;
      background-color: #fff;

      .b-item {
        padding: 16px;
        width: 100%;
        border-bottom: 1px solid #EAEAEA;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .b-left {
          width: 70%;

          .text {
            font-size: 15px;
            font-weight: bold;
            color: #232323;
          }

          .order {
            margin-top: 4px;
            font-size: 12px;
            color: #333;
          }

          .time {
            margin-top: 4px;
            font-size: 12px;
            font-weight: normal;
            color: #999;
          }
        }

        .b-right {
          width: 30%;
          text-align: right;

          .money {
            font-size: 15px;
            font-weight: bold;
            color: #232323;

            &.active {
              color: #EA3323;
            }
          }

          .state {
            margin-top: 6px;
            font-size: 12px;
            font-weight: normal;
            color: #333;

            &.active {
              color: #EA3323;
            }
          }
        }
      }
    }

    .no-info {
      position: relative;
      width: 100%;
      height: calc(100vh - 60px);

      > img {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 227px;
      }
    }
  }
};
</style>
