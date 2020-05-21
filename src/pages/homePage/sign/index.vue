<template>
  <div class="sign-page">
    <div class="banner">
      <div class="tip-text" v-if="info.activityEndTime > 0">结束时间：{{ info.activityEndTime | timeStampFilter('yy-mm-dd h：m：s') }}</div>
      <div class="rule">
        <router-link :to="{ name: 'activityRules', query: { activityId: info.activityId, zoneCode: info.zoneCode } }">规则</router-link>
      </div>
      <div class="s-img" @click="goSign" v-if="!signFlage">
        <img src="@/assets/homePage/qd_icon.png" alt="">
      </div>
      <div class="s-img" v-else @click="alreadySign">
        <img src="@/assets/homePage/yqd_icon.png" alt="">
      </div>
    </div>
    <div class="currentMonth-box">
      <div class="currentMonth">
        <div class="month">{{ changeMonth(currentMonth) }}月份</div>
        <div class="continuity-sign">您已连续签到<span>{{ info.continueDay || '0' }}天</span>，连续签到{{ info.signDayValue || '0' }}天可参与<span>{{ info.zoneName }}</span></div>
      </div>
    </div>
    <div class="calendar">
      <ul class="list">
        <li class="item" v-for="(item, index) in days" :key="index">
          <span :class="{ 'dayActive': (index + 1) === toDay && !signFlage }">{{index + 1}}</span>
          <img v-if="returnClass(index + 1)" src="@/assets/homePage/sign-hook.png" />
        </li>
      </ul>
    </div>
    <div class="reward" v-if="prizeList.length > 0">
      <div class="title">签到奖励</div>
      <ul class="r-list">
        <li class="r-item" v-for="(item, idx) in info.prizeList" :key="idx">
          <router-link :to="{ name: 'newcomerBenefits', query: { zoneCode: item.zoneCode, zoneName: item.zoneName, buyNumber: item.buyNumber } }">
            <div class="head-img">
              <img :src="item.headImagePic" alt="">
            </div>
            <div class="info">
              <div class="type">{{ item.zoneName }}</div>
              <div class="desc">{{ item.description }}</div>
            </div>
            <div class="btn">
              <div class="rob">立即抢</div>
              <div class="frequency">{{ item.buyNumber }}次</div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 签到 -->
    <div class="alert-tip" v-if="seven">
      <div class="success-box">
        <div class="tip">
          <img src="@/assets/homePage/sign-tip01.png" alt="">
          <div class="seven-day">
            <div class="msg">
              <div class="title">你已连续签到{{ signSum }}天</div>
              <div class="text">连续签到{{ signDayValue }}天可以参与{{ zoneName }}</div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeBtn">
          <img src="@/assets/homePage/close_icon.png" alt="">
        </div>
      </div>
    </div>
    <div class="alert-tip" v-if="exceedSeven">
      <div class="success-box">
        <div class="tip">
          <img src="@/assets/homePage/sign-tip02.png" alt="">
          <div class="fifteen-day">
            <div class="msg">
              <div class="title">你已连续签到{{ signSum }}天</div>
              <div class="text">连续签到{{ signDayValue }}天可以参与{{ zoneName }}</div>
              <div class="img">
                <div class="partake">恭喜您获得参与</div>
                <div class="num">{{ prize.zoneName }}权限1次</div>
                <div class="explain">（请立即使用，活动结束权益清零）</div>
              </div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeBtn">
          <img src="@/assets/homePage/close_icon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Dialog, Toast } from 'vant';
Vue.use(Dialog).use(Toast);
export default {
  name: 'sign',
  data() {
    return {
      days: '',//本月的天数
      currentMonth: new Date().getMonth() + 1,//本月
      toDay: new Date().getDate(),//今天
      dayArr: [],//已签到的数组
      info: {},
      signFlage: false,//是否已签到
      signSum: undefined,//连续签到的天数
      seven: false,
      exceedSeven: false,
      signDayValue: '',//下个阶段目标天数
      zoneName: '',//下个阶段奖励分区
      prize: {},//签到到达目标天数
      prizeList: []
    };
  },
  watch: {

  },
  methods: {
    //获取用户签到列表
    init () {
      let data = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      }
      Models.Home
      .signActivity(data)
      .then(res => {
        if (res.data.code === '0') {
          this.info = res.data.info
          this.prizeList = res.data.info.prizeList
          this.dayArr = res.data.info.signList
          for (let i = 0; i < this.dayArr.length; i++) {
            if (this.dayArr[i] == this.toDay) {
              this.signFlage = true
            }
          }
          if (this.info.activityEndTime === '0') {
            this.info = {}
            this.dayArr = []
            Dialog.alert({
              message: '活动暂未开始',
              confirmButtonText: '知道了',
              confirmButtonColor: '#EA3323'
            }).then(() => {
              this.$router.go(-1)
            });
          }
        }
      })
    },
    //签到
    goSign () {
      if (this.info.activityEndTime > 0) {
         Models.Home
        .signIn()
        .then(res => {
          if (res.data.code === '0') {
            this.signSum = res.data.info.signSum
            this.signDayValue = res.data.info.signDayValue
            this.zoneName = res.data.info.zoneName
            this.signFlage = true
            this.init()
            if (res.data.info.prize.zoneCode === undefined) {//连续签到次数小于目标天数
              this.seven = true
            }else if (res.data.info.prize.zoneCode !== undefined) {//连续签到次数等于目标天数
              this.exceedSeven = true
              this.prize = res.data.info.prize
            }
          }else if (res.data.code === '8009') {
            Toast('您已签到，请明天再来')
            this.init()//如果在其他端已签到，重新去请求数据
          }
        })
      }
    },
    closeBtn () {
      this.seven = false
      this.exceedSeven = false
    },
    //已签到
    alreadySign () {
      Toast('您已签到，请明天再来')
    },

    //获取当月的天数
    getCountDays(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      this.days =  d.getDate();
    },

    returnClass (day) {
      for (let i = 0; i < this.dayArr.length; i++) {
        if (this.dayArr[i] == day) {
          return true
        }
      }
    },
    // 修改数字月份为中文月份
    changeMonth (val) {
      let chineseText = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
      let numberText = ['1', '2','3','4','5','6','7','8','9','10','11','12']
      for (let i = 0; i < numberText.length; i++) {
        if (val == numberText[i]) {
          return chineseText[i]
        }
      }
    }
  },
  computed: {

  },
  created() {

  },
  activated() {
    this.getCountDays()
    this.init()
  },
  mounted() {
  },
  components: {
  },
};
</script>

<style scoped lang="less">
.sign-page {
  width:100%;

  .banner {
    position: relative;
    width: 100%;
    height: 200px;
    background: url('../../../assets/homePage/sign-banner.png') no-repeat;
    background-size: contain;

    .tip-text {
      padding: 15px;
      font-size: 14px;
      color: #fff;
    }

    .rule {
      position: absolute;
      top: 26px;
      right: 0;
      width: 42px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 12px;
      background-color: #FFAE00;
      border-radius: 13px 0 0 13px;

      > a {
        display: block;
        color: #fff;
      }
    }

    .s-img {
      position: absolute;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
      width: 115px;
      height: 115px;
      z-index: 22;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .currentMonth-box {
    padding: 0 15px;
    width: 100%;
    background-color: #fff;

    .currentMonth {
      position: relative;
      padding: 15px 0;
      width: 100%;
      color: #333;

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

      .month {
        font-size: 15px;
      }

      .continuity-sign {
        font-size: 14px;

        > span {
          color: #EA3323;
        }
      }
    }
  }

  .calendar {
    width: 100%;
    background-color: #fff;

    .list {
      padding: 0 30px;
      padding-top: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-flow: wrap;

      .item {
        margin-right: 30px;
        width: 27px;
        height: 54px;
        font-size: 18px;
        color: #333;
        text-align: center;
        overflow: hidden;
        // box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12);

        > span {
          display: block;
          width: 27px;
          height: 27px;
          line-height: 27px;
          text-align: center;
          border-radius: 50%;
          overflow: hidden;

          &.dayActive {
            background: -webkit-linear-gradient(top, #FC5623 , #F90042); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(bottom, #FC5623, #F90042); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(bottom, #FC5623, #F90042); /* Firefox 3.6 - 15 */
            background: linear-gradient(to bottom, #FC5623 , #F90042); /* 标准的语法 */
            color: #fff;
          }
        }

        &:nth-child(6n) {
          margin-right: 0;
        }

        > img {
          margin: auto;
          width: 11px;
          height: 9px;
        }
      }
    }
  }

  .reward {
    padding: 20px 0;
    margin-top: 8px;
    width: 100%;
    background-color: #fff;

    .title {
      padding: 0 15px;
      font-size: 18px;
      color: #333;
    }

    .r-list {
      width: 100%;

      .r-item {
        padding-left: 15px;
        width: 100%;

        &:last-child {
          > a {
            &::after {
              border-bottom: none;
            }
          }
        }

        > a {
          position: relative;
          padding: 20px 15px 20px 0;
          width: 100%;
          display: flex;
          justify-content: space-between;

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

          .head-img {
            width: 65px;
            height: 65px;
            overflow: hidden;

            > img {
              width: 100%;
              height: 100%;
            }
          }

          .info {
            padding: 6px 10px;
            flex: 1;
            height: 65px;
            overflow: hidden;

            .type {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }

            .desc {
              margin-top: 16px;
              font-size: 12px;
              color: #666;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .btn {
            width: 60px;

            .rob {
              width: 60px;
              height: 25px;
              line-height: 24px;
              font-size: 12px;
              text-align: center;
              background: -webkit-linear-gradient(#FC5545 , #E93042); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(#FC5545, #E93042); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(#FC5545, #E93042); /* Firefox 3.6 - 15 */
              background: linear-gradient(left, #FC5545 , #E93042); /* 标准的语法 */
              color: #fff;
              border-radius: 20px;

              &.gray {
                background-color: #999;
              }
            }

            .frequency {
              margin-top: 17px;
              font-size: 12px;
              text-align: center;
              color: #EA3323;
            }
          }
        }
      }
    }
  }

  .alert-tip {
    position: fixed;
    top: 0;
    left: 0;
    padding: 0 48px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    z-index: 111;
    overflow: hidden;
    display: flex;
    align-items: center;

    .success-box {
      width: 100%;

      .tip {
        position: relative;
        width: 100%;

        > img {
          width: 100%;
        }

        .seven-day {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 279px;
          height: 113px;
          border-radius: 0 0 13px 13px;

          .msg {
            width: 100%;

            .title {
              margin-top: 24px;
              font-size: 21px;
              text-align: center;
              color: #333;
            }

            .text {
              margin-top: 10px;
              font-size: 13px;
              text-align: center;
              color: #666;
            }
          }
        }

        .fifteen-day {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 279px;
          height: 191px;
          border-radius: 0 0 13px 13px;

          .msg {
            width: 100%;

            .title {
              margin-top: 14px;
              font-size: 21px;
              text-align: center;
              color: #333;
            }

            .text {
              margin-top: 6px;
              font-size: 13px;
              text-align: center;
              color: #666;
            }

            .img {
              margin: auto;
              margin-top: 15px;
              width: 227px;
              height: 84px;
              text-align: center;
              color: #FDCC74;
              overflow: hidden;

              .partake {
                margin-top: 6px;
                font-size: 12px;
              }

              .num {
                margin-top: 8px;
                font-size: 16px;
              }

              .explain {
                margin-top: 8px;
                font-size: 10px;
              }
            }
          }
        }
      }

      .close {
        margin: 35px auto;
        width: 27px;
      }
    }
  }
}
</style>
