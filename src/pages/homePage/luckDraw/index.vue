<template>
  <div class="luckDraw-page">
    <div class="luckDraw">
      <div class="banner">
        <img src="@/assets/choujiang/top_banner.png" alt="">
        <!-- <div class="time" v-if="startTime >= info.startTime">剩余 {{ (info.endTime - startTime) | timeStampFilter('天 时：分：秒') }}</div> -->
        <div class="time" v-if="startTime < info.startTime">即将开始 {{ (info.startTime - startTime) | textFilter }}</div>
        <div class="time" v-if="startTime >= info.startTime && startTime < info.endTime">剩余 {{ (info.endTime - startTime) | textFilter }}</div>
        <div class="rule">
          <a href="http://h5.no1qh.com/view/lotteryRules.html" replace>规则</a>
        </div>
      </div>
      <div class="turntable-box">
        <div class="bg-img">
          <img src="@/assets/choujiang/shoujiangji.png" alt="">
        </div>
        <div class="turntable">
          <div class="flash" :class="['run-item-' + current]"></div>
          <div class="present-content">
            <ul class="list">
              <li class="item">
                <div class="img-box" v-if="giftList[0]">
                  <div class="pic">
                    <img :src="giftList[0].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[0].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[1]">
                  <div class="pic">
                    <img :src="giftList[1].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[1].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[2]">
                  <div class="pic">
                    <img :src="giftList[2].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[2].giftName }}</div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item item-color">
                <div class="img-box" v-if="giftList[7]">
                  <div class="pic">
                    <img :src="giftList[7].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[7].giftName }}</div>
                </div>
              </li>
              <li class="item nop-adding">
                <div class="chou-btn" v-show="startTime >= info.startTime && isRuningLucky == false" @click="handleStart">
                  <div class="chou-num">{{ info.activityPoint }}个惠呗</div>
                </div>
                <img src="@/assets/choujiang/chou02.png" v-show="startTime >= info.startTime && isRuningLucky == true" alt="">
                <img src="@/assets/choujiang/chou03.png" @click="noStart" v-if="startTime < info.startTime" alt="">
                <img src="@/assets/choujiang/chou04.png" @click="alreadyEnd" v-if="startTime > info.endTime" alt="">
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[3]">
                  <div class="pic">
                    <img :src="giftList[3].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[3].giftName }}</div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="img-box" v-if="giftList[6]">
                  <div class="pic">
                    <img :src="giftList[6].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[6].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[5]">
                  <div class="pic">
                    <img :src="giftList[5].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[5].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[4]">
                  <div class="pic">
                    <img :src="giftList[4].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[4].giftName }}</div>
                </div>
              </li>
            </ul>
          </div>
          <!-- <div class="present-content">
            <ul class="list">
              <li class="item">
                <div class="img-box" v-if="giftList[0]">
                  <div class="pic">
                    <img :src="giftList[0].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[0].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[1]">
                  <div class="pic">
                    <img :src="giftList[1].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[1].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[2]">
                  <div class="pic">
                    <img :src="giftList[2].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[2].giftName }}</div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item item-color">
                <div class="img-box" v-if="giftList[3]">
                  <div class="pic">
                    <img :src="giftList[3].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[3].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <img src="@/assets/choujiang/chou.png" v-if="startTime >= info.startTime && isRuningLucky == false" @click="handleStart" alt="">
                <img src="@/assets/choujiang/chou02.png" v-if="startTime >= info.startTime && isRuningLucky == true" alt="">
                <img src="@/assets/choujiang/chou03.png" @click="noStart" v-if="startTime < info.startTime" alt="">
                <img src="@/assets/choujiang/chou04.png" v-if="startTime > info.endTime" alt="">
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[4]">
                  <div class="pic">
                    <img :src="giftList[4].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[4].giftName }}</div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="img-box" v-if="giftList[5]">
                  <div class="pic">
                    <img :src="giftList[5].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[5].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[6]">
                  <div class="pic">
                    <img :src="giftList[6].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[6].giftName }}</div>
                </div>
              </li>
              <li class="item">
                <div class="img-box" v-if="giftList[7]">
                  <div class="pic">
                    <img :src="giftList[7].giftPic" alt="">
                  </div>
                  <div class="small-name">{{ giftList[7].giftName }}</div>
                </div>
              </li>
            </ul>
          </div> -->
        </div>
        <div class="prizer">
          <div class="top">
            <div class="winning-record">中奖记录</div>
            <div class="my-price" @click="goMyprice">我的奖品</div>
          </div>
          <div class="bg-scroll">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="暂无数据~"
                @load="onLoad"
                :immediate-check="false"
                class="van-clearfix"
              >
              <ul class="scroll-list">
                <li class="scroll-item" v-for="(item, index) in list" :key="index">
                  <span class="name">{{ item }}</span>
                </li>
              </ul>
            </van-list>
          </div>
        </div>
      </div>
    </div>
    <!-- 抽奖失败提示框 -->
    <div class="draw-failed" v-show="isShow">
      <div class="failed">
        <div class="failed-tip">
          <div class="tip">
            <p>很遗憾</p>
            <p>惠呗不够，邀请好友赚惠呗</p>
          </div>
        </div>
        <div class="failed-btn">
          <div class="cancel" @click="isShow = false">取消</div>
          <div class="invitation" @click="inviteFriends">邀请好友</div>
        </div>
      </div>
    </div>
    <!-- 中奖提示框 -->
    <div class="draw-success" v-show="successShow">
      <div class="success-box">
        <div class="success">
          <div class="success-tip">
            <div class="tip">
              <div class="price-img">
                <img :src="drawImg" alt="">
              </div>
              <p>{{ '恭喜获得 ' + drawText }}</p>
            </div>
          </div>
        </div>
        <div class="clode-btn" @click="successShow = false">
          <img src="@/assets/homePage/close_icon.png" alt="">
        </div>
      </div>
    </div>
    <!-- 分享按钮 -->
    <div class="share-btn" @click="shareTip">分享活动</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import { Toast, PullRefresh, List, Dialog } from 'vant'
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
Vue.use(Toast).use(PullRefresh).use(List).use(Dialog)
export default {
  name: 'luckDraw',
  data() {
    return {
      animate: false,
			initSpeed: 200,  // 初始速度
			speed: null,  // 变化速度
			diff: 20,  // 速度变化的值，值越大，变化地越快
			award: {},  // 抽中的奖品
      awards: [],
			time: 0,  // 记录开始抽奖的时间
			current: -1,  // 当前转动的位置
      isRuningLucky: false,  // 是否正在抽奖
      giftList: [], // 返回抽奖的图片
			list: [], // 中间记录
      info: {}, // 数据
      point: '', // 惠呗数量
      startTime: new Date().getTime(), // 本地时间戳
      isShow: false, // 惠呗不足弹框
      activityId: '', // 活动UID（当activityId=0时，表示目前没有可用抽奖活动）
      activityName: '', // 活动名称
      page: 1,
      size: 10,
      loading: false,
      finished: false,
      isLoading: false,

      successShow: false,
      drawImg: '', // 中奖商品图片
      drawText: '', // 中奖商品名称
      shareLink: '', // 活动分享的链接
    };
  },
  watch: {

  },
  filters: {
    textFilter(val) {
      let time = val / 1000
      let day = parseInt(time / 3600 / 24)
      let hour = parseInt((parseFloat(time / 3600 / 24) - parseInt(time / 3600 / 24)) * 24)
      let min = parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)
      let s = parseInt((parseFloat((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) - parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)) * 60)
      if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
          return min + ' ' + '分钟' + ' ' + s + ' ' + '秒'
        }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          return hour + ' ' + '小时' + ' ' + min + ' ' + '分钟' + ' ' + s + ' ' + '秒'
        }else if (time >= 60 * 60 * 24) {
           return day + ' ' + '天' + ' ' + hour + ' ' + '小时' + ' ' + min + ' ' + '分钟' + ' ' + s + ' ' + '秒'
        }else {
          return s + ' ' + '秒'
        }
      }
    }
  },
  methods: {
    //获取惠呗数量
    getPoint() {
      Models.User
      .getBalance()
      .then(res => {
        this.point = res.data.info.point;
        localStorage.setItem('point', this.point)
      })
    },
    init () {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      })
      Models.Home
      .getLuckyActivity()
      .then(res => {
        if (res.data.code == '0') {
          this.bus.$emit('getLoading', {
            loading: false,
          })
          this.info = res.data.info
          this.awards = res.data.info.gift
          this.giftList = res.data.info.gift
          // this.awards[0] = res.data.info.gift[0]
          // this.awards[1] = res.data.info.gift[1]
          // this.awards[2] = res.data.info.gift[2]
          this.activityId = res.data.info.activityId
          this.getWinning()
        }else {
          this.bus.$emit('getLoading', {
            loading: false,
          })
          Toast(res.data.msg)
        }
      })
    },
    // 抽奖
    handleStart() {
      if (localStorage.sessionId == undefined) {
        let url = window.location.href
        let agrs = this.$common.getRequest(url);
        Dialog.confirm({
          title: '温馨提示',
          message: '您还未登录，请先登录'
        }).then(() => {
          this.$router.push({
            name: 'login',
            query: {
              goodId: agrs.goodId,
              headPic: agrs.headPic,
              nickName: agrs.nickName,
              ucode: agrs.ucode,
              action: agrs.action,
              subscribe: agrs.subscribe,
              jump: '1',
            }
          })
        }).catch(() => {
          // on cancel
        });
        return false
      }
      if (this.point < 10 ) {
        this.isShow = true
        return
      }
      if (this.isRuningLucky) {
        return Toast("正在抽奖中...");
      }
      if (isNaN(Number(this.initSpeed))) {
        return false;
      }
      this.drawAward();
    },
    drawAward() {
      // 请求接口，模拟一个抽奖数据(假设请求时间为2s)
      // setTimeout(() => {
      //   this.award = {
      //     luckyGiftId: '12312345'
      //   };
      //   console.log("返回的抽奖结果是", this.award);
      // }, 3000);
      let data = {
        uid: this.activityId
      }
      Models.Home
      .getMyLuckyDay(data)
      .then(res => {
        if (res.data.code == '0') {
          this.award.luckyGiftId = res.data.info.luckyGiftId
          this.speed = this.initSpeed;
          // 开始抽奖
          Toast("开始抽奖");
          this.isRuningLucky = true;
          this.time = Date.now();
          this.move();
        }else {
          Toast(res.data.msg)
        }
      })

    },
    move() {
      let timer = setTimeout(() => {
        this.current++;
        if (this.current > 7) {
          this.current = 0;
        }
        // 若抽中的奖品id存在，则开始减速转动
        if (this.award.luckyGiftId && (Date.now() - this.time) / 1000 > 4) {
          this.speed += this.diff; // 转动减速
          // 若转动时间超过6秒，并且奖品id等于小格子的奖品id，则停下来
          if (
            (Date.now() - this.time) / 1000 > 7 &&
            this.award.luckyGiftId == this.awards[this.current].luckyGiftId
          ) {
            clearTimeout(timer);
            setTimeout(() => {
              this.isRuningLucky = false;
              // 这里写停下来要执行的操作（弹出奖品框）
              // Toast(
              //   "您抽中的奖品是" + this.awards[this.current].giftName + ",奖品id是" + this.awards[this.current].luckyGiftId
              // );
              this.drawImg = this.awards[this.current].giftPic
              this.drawText = this.awards[this.current].giftName
              this.successShow = true
              this.getPoint() // 重新获取惠呗数量
            }, 400);
            return;
          }

        // 若抽中的奖品不存在，则加速转动
        } else {
          if (this.speed >= 50) {
            this.speed -= this.diff; // 转动加速
          }
        }
        this.move();
      }, this.speed);
    },

    //获取最近中奖用户信息
    getWinning () {
      this.loading = true
      this.finished = false
      let data = {
        uid: this.activityId,
        page: this.page,
        size: this.size,
      }
      Models.Home
      .getLatestLuckyUser(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.list = this.list.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    shareTip () {
      Toast('请点击点击右上角按钮进行分享')
    },
    noStart () {
      if (localStorage.sessionId == undefined) {
        let url = window.location.href
        let agrs = this.$common.getRequest(url);
        Dialog.confirm({
          title: '温馨提示',
          message: '您还未登录，请先登录'
        }).then(() => {
          this.$router.push({
            name: 'login',
            query: {
              goodId: agrs.goodId,
              headPic: agrs.headPic,
              nickName: agrs.nickName,
              ucode: agrs.ucode,
              action: agrs.action,
              subscribe: agrs.subscribe,
              jump: '1',
            }
          })
        }).catch(() => {
          // on cancel
        });
        return false
      }else {
        Toast('活动暂未开始')
      }
    },
    alreadyEnd () {
      if (localStorage.sessionId == undefined) {
        let url = window.location.href
        let agrs = this.$common.getRequest(url);
        Dialog.confirm({
          title: '温馨提示',
          message: '您还未登录，请先登录'
        }).then(() => {
          this.$router.push({
            name: 'login',
            query: {
              goodId: agrs.goodId,
              headPic: agrs.headPic,
              nickName: agrs.nickName,
              ucode: agrs.ucode,
              action: agrs.action,
              subscribe: agrs.subscribe,
              jump: '1',
            }
          })
        }).catch(() => {
          // on cancel
        });
        return false
      }
    },
    // 去我的奖品
    goMyprice () {
      if (localStorage.sessionId == undefined) {
        let url = window.location.href
        let agrs = this.$common.getRequest(url);
        Dialog.confirm({
          title: '温馨提示',
          message: '您还未登录，请先登录'
        }).then(() => {
          this.$router.push({
            name: 'login',
            query: {
              goodId: agrs.goodId,
              headPic: agrs.headPic,
              nickName: agrs.nickName,
              ucode: agrs.ucode,
              action: agrs.action,
              subscribe: agrs.subscribe,
              jump: '1',
            }
          })
        }).catch(() => {
          // on cancel
        });
        return false
      }else {
        this.$router.push({
          name: 'myPrize'
        })
      }
    },
    // 邀请好友
    inviteFriends () {
      this.$router.push({
        name: 'promotionalMaterials'
      })
    },

    /**
     * 上拉获取
     */
    onLoad() {
      this.getWinning();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    //默认绑定关系
    alreadyFollow (ucode) {
      let data = {
        id: ucode
      };
       Models.User
      .bindMyInvitor(data)
      .then(res => {
      })
    },

    getShare () {
      Models.Home
      .getLuckyDayShare()
      .then(res => {
        if (res.data.code == '0') {
          this.shareLink = res.data.info.link
        }
      })
    },
    wxpay(){
      var vm= this;
      if (typeof WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
        if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(), false);
        }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady());
          document.attachEvent('onWeixinJSBridgeReady',vm.onBridgeReady());
        }
      }else{
        vm.onBridgeReady();
      }
    },
    onBridgeReady(){
      WeixinJSBridge.call('hideOptionMenu');
    },

    openWxpay(){
      WeixinJSBridge.call('showOptionMenu');
    },
  },
  computed: {

  },
  created() {

  },
  activated () {
    this.init()
    let url = window.location.href;
    if(url.indexOf('?from=singlemessage') >= 0) {
      url = url.replace("?from=singlemessage","");
    }
    if(url.indexOf('&isappinstalled=0') >= 0) {
      url = url.replace("&isappinstalled=0","");
    }
    if(url.indexOf('?from=timeline') >= 0) {
      url = url.replace("?from=timeline","");
    }
    if(url.indexOf('?from=groupmessage') >= 0) {
      url = url.replace("?from=groupmessage","");
    }
    let agrs = this.$common.getRequest(url);
    if(localStorage.sessionId != undefined) {
      this.getPoint()
      if (agrs.ucode) {
        this.alreadyFollow(agrs.ucode)
      }
      this.getShare()
    }
  },
  mounted() {
    setTimeout(() => {
      if (localStorage.sessionId != undefined) {
        let url = window.location.href.split('#')[0]
        let data = {
          title: '免费抽大奖，百分百中奖',
          link: this.shareLink,
          imgUrl: 'http://web.no1qh.com/logo.jpg',
          desc: '千元提货卡现金余额等大奖等您拿'
        };
        sdk.getJSSDK(url, data)
      }else {
        this.wxpay()
      }
    }, 1000);
  },
  components: {

  },
};
</script>

<style scoped lang="less">
.luckDraw-page {
  // padding-top: 200px;
  padding-bottom: 51px;
  width: 100%;
  background-color: #FEB90E;
  overflow: hidden;

  .luckDraw {
    width: 100%;

    .banner {
      width: 100%;

      > img {
        width: 100%;
      }

      .time {
        position: absolute;
        top: 106px;
        left: 0;
        width: 100%;
        font-size: 12px;
        text-align: center;
        color: #FFF5D5;
      }

      .rule {
        position: absolute;
        top: 10px;
        right: 0;
        width: 42px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 12px;
        background-color: #EE574F;
        border-radius: 13px 0 0 13px;

        > a {
          display: block;
          color: #fff;
        }
      }
    }

    .turntable-box {
      position: relative;
      padding: 67px 49px 0 49px;
      margin-top: -56px;
      width: 100%;
      height: 625px;
      z-index: 999;

      .bg-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        > img {
          width: 100%;
        }
      }

      .turntable {
        position: relative;
        width: 100%;
        height: 282px;
        z-index: 9999;

        .flash {
          position: absolute;
          width: 90px;
          height: 90px;
          opacity: 0.7;
          z-index: 99;
          border-radius: 16px;
        }

        .run-item-0 {
          top: 0;
          left: 0;
          background-color: #fff;
        }
        .run-item-1 {
          top: 0;
          left: 94px;
          background-color: #fff;
        }
        .run-item-2 {
          top: 0;
          left: 188px;
          background-color: #fff;
        }
        .run-item-3 {
          top: 94px;
          left: 188px;
          background-color: #fff;
        }
        .run-item-4 {
          top: 188px;
          left: 188px;
          background-color: #fff;
        }
        .run-item-5 {
          top: 188px;
          left: 94px;
          background-color: #fff;
        }
        .run-item-6 {
          top: 188px;
          left: 0;
          background-color: #fff;
        }
        .run-item-7 {
          top: 94px;
          left: 0;
          background-color: #fff;
        }

        .present-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;

          .list {
            margin-bottom: 4px;
            width: 100%;
            display: flex;

            .item {
              position: relative;
              margin-right: 4px;
              padding: 6px;
              width: 90px;
              height: 90px;
              background: url('../../../assets/choujiang/wall.png') no-repeat;
              background-size: contain;
              border-radius: 16px;
              overflow: hidden;
              display: flex;
              align-items: center;

              &.nop-adding {
                padding: 0;
              }

              &:last-child {
                margin-right: 0;
              }

              .img-box {
                width: 100%;
                text-align: center;

                .pic {
                  width: 100%;
                  height: 29px;

                  > img {
                    margin: auto;
                    height: 100%;
                  }
                }

                .small-name {
                  margin-top: 10px;
                  font-size: 10px;
                  color: #914B23;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }

              .chou-btn {
                position: relative;
                width: 100%;
                height: 90px;
                background: url('../../../assets/choujiang/chou.png') no-repeat;
                background-size: contain;

                .chou-num {
                  position: absolute;
                  bottom: 17px;
                  left: 0;
                  width: 100%;
                  font-size: 12px;
                  color: #A05526;
                  text-align: center;
                }
              }

              > img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }

      .prizer {
        position: relative;
        margin-top: 60px;
        width: 279px;
        height: 158px;
        background-color: #B71125;
        border-radius: 10px;
        z-index: 9999;
        overflow: hidden;

        .top {
          padding: 0 12px;
          margin-top: 10px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .winning-record {
            font-size: 12px;
            color: #fff;
          }

          .my-price {
            padding: 4px 7px 3px 7px;
            font-size: 12px;
            background-color: #FFC331;
            color: #9B1824;
            border-radius: 4px;
          }
        }

        .bg-scroll {
          padding: 0 20px;
          margin-top: 12px;
          width: 100%;
          height: 90px;
          overflow: auto;

          .scroll-list {
            position: relative;
            width: 100%;

            .scroll-item {
              margin-bottom: 10px;
              width: 100%;
              font-size: 12px;
              color: #FED9DE;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;

              > span {
                margin-right: 6px;
              }

              &:last-child {
                margin-bottom: 0;
              }

              &.anim {
                transition: all 0.5s linear;
                margin-top: -0.74rem;
              }
            }
          }
        }
      }
    }
  }

  .draw-failed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .failed {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 305px;
      height: 259px;
      background: url('../../../assets/choujiang/failed.png') no-repeat;
      background-size: contain;
      z-index: 999;

      .failed-tip {
        position: absolute;
        top: 61px;
        left: 35px;
        width: 235px;
        height: 125px;
        background-color: #901621;
        border-radius: 15px;
        display: flex;
        align-items: center;

        .tip {
          margin: auto;
          font-size: 14px;
          color: #FEC755;

          > p {
            text-align: center;
          }
        }
      }

      .failed-btn {
        position: absolute;
        bottom: 10px;
        left: 0;
        padding: 0 23px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cancel {
          width: 125px;
          height: 45px;
          line-height: 45px;
          font-size: 16px;
          text-align: center;
          background: url('../../../assets/choujiang/chou-btn.png') no-repeat;
          background-size: contain;
          color: #fff;
        }

        .invitation {
          width: 125px;
          height: 45px;
          line-height: 45px;
          font-size: 16px;
          text-align: center;
          background: url('../../../assets/choujiang/Invitation-btn.png') no-repeat;
          background-size: contain;
          color: #901621;
        }
      }
    }
  }

  .draw-success {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .success-box {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -40%);
      width: 100%;
      z-index: 999;

      .success {
        margin: auto;
        width: 305px;
        height: 304px;
        background: url('../../../assets/choujiang/success.png') no-repeat;
        background-size: contain;
        z-index: 999;

        .success-tip {
          position: absolute;
          top: 152px;
          left: 69px;
          width: 235px;
          height: 125px;
          background-color: #901621;
          border-radius: 15px;
          display: flex;
          align-items: center;

          .tip {
            margin: auto;
            font-size: 14px;
            color: #FEC755;

            .price-img {
              margin: 4px auto;
              width: 53px;
              height: 53px;
              overflow: hidden;

              > img {
                margin: auto;
                height: 100%;
              }
            }

            > p {
              text-align: center;
              color: #FEC755;
            }
          }
        }
      }

      .clode-btn {
        margin: 23px auto;
        width: 27px;
        height: 27px;
        overflow: hidden;

        > img {
          width: 100%;
        }
      }
    }
  }

  .share-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 18px 0;
    width: 100%;
    font-size: 18px;
    text-align: center;
    background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
    color: #FED9DE;
    z-index: 999;
  }
};
</style>
