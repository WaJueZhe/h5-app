<template>
  <div class="withdrawalsRecord">
    <div class="withdrawalsRecordTitle">
      <div class="withdrawaDte" @click="show = true">
        <span style="color:#232323;font-size:18px;">{{year}}年{{month}}月</span>
        <van-icon name="arrow-down"/>
      </div>
      <div class="withdrawaSuccess">
        <span style="color:#666666;">成功提现:</span>
        <span style="color:#EA3323;" v-show="totalDraw.length !== 0 ">￥{{totalDraw}}</span>
      </div>
    </div>
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
        <div class="withdrawalsRecordList">
          <ul>
            <li class v-for="(data,index) in theWithdrawList" :key="index">
              <div class="withdrawalImg">
                <img v-if="data.drawWay == 2" src="@/assets/alipay.png" alt>
                <img v-if="data.drawWay == 1" src="@/assets/wxpay.png" alt>
                <img v-if="data.drawWay == 3" src="@/assets/yinlian.png" alt>
              </div>
              <div class="withdrawalMethod">
                <p>{{returnDrawWayText(data.drawWay)}}</p>
                <p>{{ data.updateTime | timeStampFilter('yy-mm-dd') }}</p>
              </div>
              <div class="withdrawalMenoy">
                <p>
                  ￥
                  <span style="font-size:18px;">{{data.amount}}</span>
                </p>
                <p :class="[data.ystatus == 4 ? 'fail' : 'pass']">{{returnStatusText(data.ystatus)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :formatter="formatter"
        @cancel="cancel"
        @confirm="confirm"
        type="year-month"/>
    </van-popup>
  </div>
</template>
<script>
  import Vue from "vue";
  import Models from '@/models';
  import { Icon ,Popup ,DatetimePicker, PullRefresh, List } from "vant";

  Vue.use(DatetimePicker).use(Popup).use(Icon).use(PullRefresh).use(List);

  export default {
    name: "withdrawalsRecord",
    data() {
      return {
        show: false,
        page: '1',//第几页
        size: '10',//每页条数
        total: '',
        year:"2018",
        month:"10",
        totalDraw:"",
        theWithdrawList:[],
        currentDate:new Date(),

        loading: false,
        finished: false,
        isLoading: false
      };
    },
    methods: {
      /**
       * 下拉刷新
       */
      onRefresh() {
        setTimeout(() => {
          if(this.theWithdrawList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              monthFlag:`${this.year}${this.month}`,
              page: this.page,
              size: this.size
            };
            Models.User
            .getWithdrawList(data)
            .then( res => {
              if(res.data.code == '0') {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.theWithdrawList = []
                this.theWithdrawList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
                this.page = Number(this.page) + 1;
              }
            })
          }
        }, 500);
      },

      cancel () {
        this.show = false;
      },

      /**
       * 上拉获取
       */
      onLoad() {
        this.withdrawList();
        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      },

      //获取当前的年月
      getThisTime () {
        let date=new Date();
        let month = date.getMonth()+1;
        this.year = date.getFullYear();
        this.month = month < 10 ? `0${month}` : month;
      },

      //返回提现方法文字
      returnDrawWayText (num) {
        switch(num)
        {
          case '1':return '微信';
          case '2':return '支付宝';
          case '3':return '银行卡';
        }
      },

      //返回状态文字
      returnStatusText (num) {
        switch(num)
        {
          case '1':return '审核中';
          case '2':return '等待放款';
          case '3':return '完成放款';
          case '4':return '拒绝提现';
          case '5':return '用户撤销';
        }
      },
      //获取提现数据
      withdrawList () {
        this.loading = true
        this.finished = false
        let data = {
          monthFlag:`${this.year}${this.month}`,
          page:this.page,
          size:this.size
        };
        Models.User
        .getWithdrawList(data)
        .then( res => {
          if(res.data.code == '0') {
            this.isLoading = false
            // 加载状态结束
            this.loading = false
            this.theWithdrawList = this.theWithdrawList.concat(res.data.info.list);
            this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
            this.page = Number(this.page) + 1;
          }
        })
      },

      totalDrawByMonth () {
        let data = {
          monthFlag:`${this.year}${this.month}`,
        };
        Models.User
          .getTotalDrawByMonth(data)
          .then( res => {
            if ( res.data.code == 0 ) {
              if (  res.data.info.totalDraw == null ) {
                this.totalDraw = 0;
              }else {
                this.totalDraw = res.data.info.totalDraw;
              }
            }
          })
      },

      confirm (value) {
        this.show = false;
        let d = new Date(value);
        this.year = d.getFullYear();
        let num = d.getMonth() + 1;
        if ( num < 10 ) {
          this.month = `0${num}`;
        }else {
          this.month = d.getMonth() + 1 ;
        }

        this.page = 1;
        this.theWithdrawList = [];
        this.totalDrawByMonth();
        this.withdrawList()
      },

      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      }
    },
    components: {
    },
    created () {
      this.getThisTime();
      this.withdrawList();
      this.totalDrawByMonth();
    }
  };
</script>
<style lang="less">
.withdrawalsRecord {
  width: 100%;
  height: 100%;

  .withdrawalsRecordTitle {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 78px;
    padding: 0 15px;
    z-index: 999;
    background-color:#F5F5F5 ;

    .withdrawaDte {
      font-size: 0;
      padding-top: 12px;
      margin-bottom: 12px;

      i {
        font-size: 12px;
      }
    }

    .withdrawaSuccess {
      font-size: 15px;
    }
  }

  .withdrawalsRecordList {
    margin-top: 78px;
    width: 100%;

    li {
      height: 82px;
      padding: 0 15px;
      display: -webkit-flex;
      display: flex;
      border-bottom: 1px solid #eaeaea;

      div {
        -webkit-box-flex: 1;
        width: 100%;

        &.withdrawalImg {
          width: 50px;
          height: 82px;
          margin-right: 15px;
          line-height: 82px;

          img {
            display: inline-block;
            height: 50px;
            width: 50px;
            vertical-align: middle;
            border-radius: 50%;
          }
        }

        &.withdrawalMethod {
          width: 155px;
          height: 100%;
          padding-top: 20px;

          p:first-child {
            margin-bottom: 12px;
            font-size: 15px;
            font-weight: 500;
            color: #232323;
          }

          p:last-child {
            font-size: 12px;
            color: #999999;
          }
        }

        &.withdrawalMenoy {
          width: 135px;
          height: 100%;
          padding-top: 16px;
          text-align: right;

          p:first-child {
            margin-bottom: 12px;
            font-size: 15px;
            font-weight: 500;
            color: #333333;
          }

          p:last-child {
            font-size: 12px;
            color: #999999;

            &.pass {
              color: #44a544;
            }

            &.fail {
              color: #ea3323;
            }
          }
        }
      }
    }
  }
}
</style>
