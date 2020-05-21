<template>
  <div class="personalCenter">
    <div class="personalContent">
      <div class="personal">
        <div class="personalImg">
          <router-link :to="{ name: 'personalInformation' }" class="photo" v-if="myInfo.headImagePic"><img :src="myInfo.headImagePic" alt=""></router-link>
          <router-link :to="{ name: 'personalInformation' }" class="photo" v-else><img src="@/assets/homePage/avatar.png" alt=""></router-link>
        </div>
        <div class="personalName">
          <div class="p-left" v-if="ygrade > 3 && endTime > 0">
            <div class="name">
              <div class="nick">{{ myInfo.nickName }}</div>
              <div class="level">{{ gradeName }}</div>
            </div>
            <div class="time"  v-if="endTime > 0">有效期至{{ endTime | timeStampFilter('年-月-日') }}</div>
          </div>
          <div class="p-left" v-if="ygrade == 3 || endTime == 0">
            <div class="name-nick">{{ myInfo.nickName }}</div>
            <div class="name-level">
              <span>{{ gradeName }}</span>
            </div>
            <div class="time" v-if="endTime > 0">有效期至{{ endTime | timeStampFilter('年-月-日') }}</div>
          </div>
          <div class="p-right" @click="showShare">
            <div class="invitation-bnt">+邀请好友</div>
          </div>
        </div>
      </div>
      <div class="personalMenoy">
        <router-link :to="{ name: 'balance', query: { chargeAct: '2' } }" class="Balance">
          <p class="personalMenoyNum">{{balance.balance || '0.0'}}</p>
          <p class="personalTitle">
            <span>余额</span>
            <img src="@/assets/user/order_right_icon.png" alt="">
          </p>
        </router-link>
        <router-link :to="{ name: 'balance', query: { chargeAct: '3' } }" class="huibei">
          <p class="personalMenoyNum">{{balance.point || '0'}}</p>
          <p class="personalTitle">
            <span>惠呗</span>
            <img src="@/assets/user/order_right_icon.png" alt="">
          </p>
        </router-link>
      </div>
      <div class="upgrade-box">
        <router-link :to="{ name: 'upgradeShopkeeper' }" class="upgrade">
          <img class="u-small" src="@/assets/personalCenter/up_icon.png" alt="">
          <div class="u-left">升级BOSS，月入5000+</div>
          <div class="u-right">
            <span>立刻升级</span>
            <img src="@/assets/personalCenter/up_right_icon.png" alt="">
          </div>
        </router-link>
      </div>
    </div>
    <div class="incomeBreakdown">
      <div class="i-left">
        <router-link :to="{ name: 'bonusList', query: { status: '1' } }">
          <div class="estimate">
            <div class="personalMenoyNum">{{ statMyProfitList.fundPre || '0' }}</div>
            <div class="personalMenoyTitle">预估收益</div>
          </div>
          <div class="estimate-icon">
            <img src="@/assets/user/order_right_gary.png" alt="">
          </div>
        </router-link>
      </div>
      <div class="i-right">
        <router-link :to="{ name: 'bonusList', query: { status: '2' } }">
          <div class="estimate">
            <div class="personalMenoyNum">{{ statMyProfitList.pointPre || '0' }}</div>
            <div class="personalMenoyTitle">惠呗预收益</div>
          </div>
          <div class="estimate-icon">
            <img src="@/assets/user/order_right_gary.png" alt="">
          </div>
        </router-link>
      </div>
    </div>

    <!-- 我的订单 -->
    <div class="orderModel">
      <div class="orderFuntionList">
        <div class="orderTitle">
          <div class="orderTitleName">我的订单</div>
          <div class="orderTitleBtn" @click="goOrderFun(0)">
            <span>全部订单</span>
            <img src="@/assets/youjiantou.png" alt="">
          </div>
        </div>
        <div class="orderFun">
          <div v-for="(data,index) in orderFun" :key="index" @click="goOrderFun(data.link)">
            <div class="num" v-if="returnNuma(data.link) != 0">{{returnNuma(data.link)}}</div>
            <img :src="data.iconUrl" alt="">
            <p>{{data.name}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的工具 -->
    <div class="tool">
      <div class="my-tool">我的工具</div>
      <ul class="t-list">
        <li class="t-item" v-if="ygrade >= 5">
          <router-link :to="{ name: 'businessCode' }">
            <img src="@/assets/personalCenter/qr_icon.png" alt="">
            <div class="small-title">惠呗商家码</div>
          </router-link>
        </li>
        <li class="t-item">
          <router-link to="/myUser">
            <img src="@/assets/personalCenter/user_icon.png" alt="">
            <div class="small-title">我的用户</div>
          </router-link>
        </li>
        <li class="t-item" @click.stop="waterMachine">
          <a>
            <img src="@/assets/personalCenter/machine.png" alt="">
            <div class="small-title">我的水机</div>
          </a>
        </li>
        <li class="t-item">
          <router-link to="/addressManagement">
            <img src="@/assets/personalCenter/add_icon.png" alt="">
            <div class="small-title">地址管理</div>
          </router-link>
        </li>
        <li class="t-item">
          <router-link :to="{ name: 'myComment', query: { headPic: myInfo.headImagePic, nickName: myInfo.nickName } }">
            <img src="@/assets/personalCenter/comment_icon.png" alt="">
            <div class="small-title">我的评论</div>
          </router-link>
        </li>
        <li class="t-item">
          <router-link :to="{ name: 'promotionalMaterials' }">
            <img src="@/assets/personalCenter/material-icon.png" alt="">
            <div class="small-title">营销素材</div>
          </router-link>
        </li>
        <li class="t-item">
          <router-link :to="{ name: 'myPrize' }">
            <img src="@/assets/personalCenter/prize-icon.png" alt="">
            <div class="small-title">我的奖品</div>
          </router-link>
        </li>
        <!-- <li class="t-item" @click.stop="goBindBankCard">
          <a>
            <img src="@/assets/personalCenter/card_icon.png" alt="">
            <div class="small-title">绑定银行卡</div>
          </a>
        </li> -->
        <li class="t-item" @click.stop="onlineSer">
          <a>
            <img src="@/assets/personalCenter/service_icon-03.png" alt="">
            <div class="small-title">在线客服</div>
          </a>
        </li>
        <li class="t-item">
          <router-link :to="{ name: 'setUp' }">
            <img src="@/assets/personalCenter/set_icon.png" alt="">
            <div class="small-title">设置</div>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 为你推荐 -->
    <div class="recommend" v-if="rmdList.length > 0">
      <div class="recommend-title">
        <span>为你推荐</span>
      </div>
      <div class="recommend-box">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="homeInfinite"
          :immediate-check="false"
          class="van-clearfix"
        >
        <GoodsList v-if="isShowGoodList" :goodsList="rmdList"></GoodsList>
      </van-list>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>
<script>
import Vue from 'vue';
import { Popup , Icon , Dialog , Uploader, Loading, Toast, List, RadioGroup, Radio } from 'vant';
import Models from '@/models';
import Footer from '@/components/footer'
import GoodsList from '@/components/goodsList'
Vue.use(Popup).use(Icon).use(Dialog).use(Uploader).use(Loading).use(Toast).use(List).use(RadioGroup).use(Radio);
export default {
  name:"personalCenter",
  data () {
    return {
      dataURL:"",
      userId: localStorage.getItem('userId'),
      ygrade: '',//会员等级
      balance:{},
      nickName:"",
      gradeName:"",
      endTime:"",
      myInfo:{},
      orderFun: [
        {
          iconUrl:require(`@/assets/personalCenter/pendingPayment.png`),
          link:1,
          name:"待付款",
        },
        {
          iconUrl:require(`@/assets/personalCenter/waitForDelivery.png`),
          link:2,
          name:"待发货",
        },
        {
          iconUrl:require(`@/assets/personalCenter/pendingReceipt.png`),
          link:3,
          name:"待收货",
        },
        {
          iconUrl:require(`@/assets/personalCenter/evaluation.png`),
          link:4,
          name:"待评价",
        },
        {
          iconUrl:require(`@/assets/personalCenter/returnedPurchase.png`),
          link:5,
          name:"退货/售后",
        }
      ],
      accountAndSecuritylink:"",
      userStatus:null,
      corpStatus:null,
      statMyOrderList:[],
      statMyProfitList:[],
      //为你推荐
      isShowGoodList: false,
      loading: false,
      finished: false,
      isLoading: false,
      rmdPage: '1',
      rmdSize: '10',
      rmdTotal: '',
      rmdList: [],
      userRadio: '',//用户分享码选择
    }
  },
  methods:{
    getStatMyProfit () {
      Models.User
        .statMyProfit()
        .then( res => {
          if ( res.data.code === '0' ) {
            this.statMyProfitList = res.data.info;
          }
        })
    },
    getMyUser () {
      Models.User
        .getInfo()
        .then(res => {
          if(res.data.code == '0') {
            this.myInfo = res.data.info;
            this.gradeName = res.data.info.member.gradeName
            this.endTime = res.data.info.member.endTime
            if ( this.myInfo.headImagePic.length === 0 ) {
              this.myInfo.headImagePic = require(`@/assets/personalCenter/defaultAvatar.png`);
            }
            window.sessionStorage.nickName = res.data.info.nickName;
            window.localStorage.phone = res.data.info.phone;
            this.ygrade = res.data.info.member.ygrade;
            localStorage.setItem('hadPayPass', res.data.info.hadPayPass)
            localStorage.setItem('grades', JSON.stringify(res.data.info.grades))
            //等级改变重新设值
            localStorage.setItem('ygrade', res.data.info.member.ygrade)
            localStorage.setItem('userId', res.data.info.userId);
            localStorage.setItem('gradeName', res.data.info.member.gradeName);
            localStorage.setItem('nextGradeName', res.data.info.member.nextGradeName);
            localStorage.setItem('headImagePic', res.data.info.headImagePic);
          }
        })
    },
    goVerified () {
      this.$router.push({
        name: 'realName'
      });
    },
    gobonusList (num) {
      this.$router.push(`/bonusList?num=${num}`)
    },

    gohuibeiList (num) {
      this.$router.push(`/huibeiList?num=${num}`)
    },
    //认证资料
    checkIdentifyStatus (name) {
      let data = {
        str:name,
      };
      Models.User
      .getIdentifyStatus(data)
      .then( res => {
        if ( res.data.code == 0 ) {
          if ( name === "user" ) {
            this.userStatus = res.data.info.ystatus;
          }else {
            this.corpStatus = res.data.info.ystatus;
          }
        }else {
          if ( name === "user" ) {
            this.userStatus = 0;
          }else {
            this.corpStatus = 0;
          }
        }
      })
    },

    getBalance() {
      let data = {};
      Models.User
        .getBalance (data)
        .then(res => {
          this.balance = res.data.info;
          localStorage.setItem('point', this.balance.point)
        })
    },
    checkYourPassword () {
      let data = {
        var:'pay',
      };
      Models.User
        .checkPassword(data)
        .then(res => {
          if ( res.data.info.status === 'yes') {
            this.accountAndSecuritylink = '/accountAndSecurity';
          }else {
            this.accountAndSecuritylink = '/phoneVerification?editType=1';
          }
          sessionStorage.setItem('settingPassWord', res.data.info.status)
        })
    },
    //绑定银行卡
    goBindBankCard() {
      if(Number(this.myInfo.member.ygrade) < 5) {
        if(this.userStatus == 2) {
          this.$router.push({
            name: 'myBankCard'
          });
        }else {
          Dialog.confirm({
            message: '您还没认证，请先去认证',
            closeOnClickOverlay:true
          }).then(() => {
            this.goVerified();
          }).catch(() => {
          });
        }
      }else {
        if(this.userStatus == 2 && this.corpStatus == 2) {
          this.$router.push({
            name: 'myBankCard'
          });
        }else {
           Dialog.confirm({
            message: '您还没认证，请先去认证',
            closeOnClickOverlay:true
          }).then(() => {
            this.goVerified();
          }).catch(() => {
          });
        }
      }
    },
    goOrderFun (num) {
      if ( num === 5 ) {
        this.$router.push('/afterSaleList');
      } else {
        sessionStorage.statusType = num;
        sessionStorage.userId = this.myInfo.userId;
        this.$router.push(`/allOrders`)
      }
    },
    //分享
    showShare () {
      this.$router.push({
        name: 'shareExtensionChart'
      })
    },

    //获取订单统计
    getStatMyOrder () {
      Models.User
        .statMyOrder()
        .then( res => {
          if ( res.data.code === '0' ) {
            this.statMyOrderList = res.data.info;
          }
        })
    },

    qRcode () {
      let data = {
        type: 'user',
        goodId: '',
        cat: 'all'
      };
      Models.User
        .getQRcode(data)
        .then( res => {
          if ( res.data.code === '0' ) {
            this.dataURL = res.data.info.pic
          }
        })
    },

    returnNuma (str) {
      let num = Number(str);
      switch (num) {
        case 1:
          return this.statMyOrderList.waitPay;
        case 2:
          return this.statMyOrderList.waitDelivery;
        case 3:
          return this.statMyOrderList.waitReceive;
        case 4:
          return this.statMyOrderList.waitComment;
        case 5:
          return this.statMyOrderList.waitRefund;
      }
    },

    //已经关注的老用户静默绑定
    alreadyFollow(userId) {
      let data = {
        userId: userId
      }
      Models.User
      .binduser(data)
      .then(res => {
      })
    },
    // 为你推荐数据
    rmdInit() {
      this.loading = true
      this.finished = false
      let data = {
        page: this.rmdPage,
        size: this.rmdSize,
        zoneCode: 'recommendMemberZone',
        keyword: '',
        categoryId: '0',
        brandId: '0',
        shopId: '0',
        orderBy: '',
        orderWay: 'desc',
        price: []
      }
      Models.Home
      .searchZoneGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          // 加载状态结束
          this.loading = false
          this.rmdList = this.rmdList.concat(res.data.info.list)
          this.isShowGoodList = true
          this.rmdPage = Number(this.rmdPage) + 1;
          this.rmdTotal = Math.ceil(Number(res.data.info.total) / Number(this.rmdSize))
        }
      })
    },
    // 为你推荐上拉加载数据
    homeInfinite() {
      this.rmdInit();
      // 数据全部加载完成
      if (this.rmdPage >= this.rmdTotal) {
        this.finished = true;
      }
    },
    //我的水机
    waterMachine () {
      window.location.href = `http://web.no1qh.com/Device/Index/index?usercode=${this.userId}`
    },
    // 在线客服
    onlineSer () {
      let phone = localStorage.getItem('phone')
      window.location.href = `http://p.qiao.baidu.com/cps/chat?siteId=12820204&userId=26831413&cp=weixin2.4&cr=memberCenter&cw=${phone}`
    }
  },
  mounted () {
  },

  deactivated () {

  },

  created () {
    this.rmdInit();
  },
  activated () {
    let url = window.location.href;
    let agrs = this.$common.getRequest(url);
    if(localStorage.sessionId != undefined && agrs.subscribe) {
      if(agrs.subscribe == '1') {//1是已经关注公众，但没有绑定关系
        let userId = localStorage.getItem('userId')
        this.alreadyFollow(userId)
      }else if(agrs.subscribe == '0') {//0是没关注公众号, 2放行
        let userId = localStorage.getItem('userId')
        this.$router.push({
          name: 'follow',
          query: {
            goodId: '666',
            userId: userId
          }
        })
      }
    }
    this.getBalance();
    this.getMyUser();
    this.getStatMyProfit();
    this.checkYourPassword();
    this.checkIdentifyStatus("user");
    this.checkIdentifyStatus("corp");
    this.getStatMyOrder();
  },
  components: {
    'v-footer': Footer,
    GoodsList,
  }
}
</script>
<style lang="less">
.personalCenter {
  padding-bottom: 50px;
  width: 100%;

  //个人信息
  .personalContent {
    position: relative;
    width: 100%;
    height: 190px;
    box-sizing: border-box;
    padding: 16px 15px 0;
    background: -webkit-linear-gradient(left,  #F12F4B , #ED2E60 ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #F12F4B , #ED2E60); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #F12F4B , #ED2E60); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #F12F4B , #ED2E60) ; /* 标准的语法 */

    .personal {
      width: 100%;
      height: 60px;
      display: flex;

      .personalImg {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;

        .photo {
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          z-index: 2;

          > img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .personalName {
        padding-left: 13px;
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: space-between;

        .p-left {
          flex: 1;
          height: 100%;

          .name-nick {
            margin-top: 5px;
            margin-bottom: 4px;
            width: 188px;
            font-weight: bold;
            font-size: 16px;
            color: #fff;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            vertical-align: top;
          }

          .name-level {
            width: 100%;
            font-weight: bold;
            display: flex;
            align-items: center;
            overflow: hidden;

            > span {
              padding: 0 7px;
              line-height: 18px;
              font-size: 10px;
              font-weight: normal;
              color: #934929;
              background: -webkit-linear-gradient(#FCD4AC, #E8AE89); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(#FCD4AC, #E8AE89); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(#FCD4AC, #E8AE89); /* Firefox 3.6 - 15 */
              background: linear-gradient(#FCD4AC, #E8AE89); /* 标准的语法 */
              border-radius: 20px;
            }
          }

          .name {
            margin-top: 5px;
            margin-bottom: 4px;
            width: 100%;
            font-weight: bold;
            color: #fff;
            display: flex;
            align-items: center;
            overflow: hidden;

            .nick {
              margin-right: 10px;
              max-width: 110px;
              height: 21px;
              line-height: 21px;
              font-size: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              vertical-align: top;
            }

            .level {
              padding: 1px 7px 0 7px;
              line-height: 18px;
              font-size: 10px;
              font-weight: normal;
              color: #934929;
              background: -webkit-linear-gradient(#FCD4AC, #E8AE89); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(#FCD4AC, #E8AE89); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(#FCD4AC, #E8AE89); /* Firefox 3.6 - 15 */
              background: linear-gradient(#FCD4AC, #E8AE89); /* 标准的语法 */
              border-radius: 20px;
            }
          }

          .time {
            width: 100%;
            font-size: 10px;
            color: #FDE9ED;
          }
        }

        .p-right {
          position: relative;
          width: 84px;
          height: 100%;

          .invitation-bnt {
            position: absolute;
            left: 0;
            bottom: 10px;
            padding: 7px 10px;
            width: 100%;
            font-size: 12px;
            text-align: center;
            color: #2C343B;
            background-color: #FFD792;
            border-radius: 15px;
          }
        }

        p.label {
          width:62px;
          height:18px;
          text-align: center;
          color:#FFEFE4;
          font-size: 12px;
          background:rgba(0,0,0,1);
          opacity:0.3;
          border-radius:15px;
        }
      }
    }

    .personalMenoy {
      width: 100%;
      display: flex;
      margin-top: 15px;
      display: -webkit-flex;

      .Balance {
        position: relative;

        &::after {
          content: ' ';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 1px;
          height: 20px;
          background-color: #FDCAD6;
        }
      }

      &>a {
        -webkit-box-flex: 1;
        width: 100%;
        text-align: center;
        color: #fff;
      }

      .personalTitle {
        margin-top: 2px;
        font-size: 13px;

        span {
          vertical-align: middle;
          display: inline-block;
        }

        img {
          margin-left: 10px;
          width: 5px;
          height: 9px;
          vertical-align: middle;
          display: inline-block;
        }
      }

      .personalMenoyNum {
        font-size: 15px;
      }
    }

    .upgrade-box {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 36px;
      width: 100%;

      .upgrade {
        position: relative;
        padding: 12px 15px;
        width: 100%;
        border-radius: 9px 9px 0 0;
        color: #944929;
        font-weight: 600;
        display: flex;
        align-items: center;
        background: -webkit-linear-gradient(#FBCFB0, #DF9F79); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(#FBCFB0, #DF9F79); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(#FBCFB0, #DF9F79); /* Firefox 3.6 - 15 */
        background: linear-gradient(#FBCFB0, #DF9F79); /* 标准的语法 */

        .u-small {
          width: 18px;
          height: 18px;
        }

        .u-left {
          margin-left: 6px;
          font-size: 14px;
        }

        .u-right {
          position: absolute;
          right: 15px;
          font-size: 11px;
          line-height: 19px;
          display: flex;
          align-items: center;

          > img {
            margin-left: 6px;
            width: 13px;
            height: 13px;
          }
        }
      }
    }
  }

  .functionModel {
    width: 100%;
    height: 94px;
    padding: 0 15px 15px;
    box-sizing: border-box;
    position: relative;
    background:rgba(245,245,245,1);

    .functionList {
      width:345px;
      height:99px;
      position: absolute;
      top: -20px;
      display: flex;
      display: -webkit-flex;
      background:#ffffff;
      box-shadow:0 5px 21px 0 rgba(221,221,221,0.72);
      border-radius:8px;

      div {
        -webkit-box-flex: 1;
        text-align: center;
        width: 100%;

        a {
          width: 100%;
          height: 100%;
          padding: 17px 0 0;
          display: block;
          text-align: center;

          img {
            width: 50px;
            height: 50px;
            margin: 0 auto 3px;
          }

          p {
            color: #666666;
            font-size: 12px;
          }
        }
      }
    }
  }

  .incomeBreakdown {
    margin: 8px 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-around;

    .i-left {
      width: 50%;

      > a {
        position: relative;
        padding: 17px 0;
        // display: block;
        // text-align: center;
        color: #333;
        display: flex;

        &::after {
          content: ' ';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 1px;
          height: 20px;
          background-color: #EAEAEA;
        }

        .estimate {
          padding-left: 30px;
          flex: 1;
          text-align: center;

          .personalMenoyNum {
            margin-bottom: 6px;
            font-size: 18px;
            font-weight: bold;
          }

          .personalMenoyTitle {
            font-size: 12px;

            span {
              display: inline-block;
            }

            img {
              margin-left: 10px;
              width: 5px;
              height: 9px;
              display: inline-block;
            }
          }
        }

        .estimate-icon {
          width: 36px;
          display: flex;
          align-items: center;

          > img {
            width: 5px;
            height: 9px;
          }
        }
      }
    }

    .i-right {
      width: 50%;

      > a {
        padding: 17px 0;
        // display: block;
        // text-align: center;
        color: #333;
        display: flex;

        .estimate {
          flex: 1;
          padding-left: 30px;
          text-align: center;

          .personalMenoyNum {
            margin-bottom: 6px;
            font-size: 18px;
            font-weight: bold;
          }

          .personalMenoyTitle {
            font-size: 12px;

            span {
              display: inline-block;
            }

            img {
              margin-left: 10px;
              width: 5px;
              height: 9px;
              display: inline-block;
            }
          }
        }

        .estimate-icon {
          width: 36px;
          display: flex;
          align-items: center;

          > img {
            width: 5px;
            height: 9px;
          }
        }
      }
    }
  }
  //我的订单
  .orderModel {
    margin-bottom: 8px;
    width: 100%;
    background-color: #fff;

    .orderFuntionList {
      width:100%;
      height: 111px;
      border-radius: 8px;

      .orderTitle {
        position: relative;
        width: 100%;
        height: 40px;
        display: flex;
        padding: 0 15px;
        display: -webkit-flex;

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

        div {
          line-height: 39px;
          -webkit-box-flex: 1;
          width: 100%;

          &.orderTitleName {
            font-size: 15px;
            color: #232323;
            font-weight: bold;
          }

          &.orderTitleBtn {
            text-align: right;
            font-size: 12px;
            color: #666666;

            span {
              vertical-align: middle;
              display: inline-block;
            }

            img {
              width: 15px;
              height: 15px;
              vertical-align: middle;
              display: inline-block;
            }
          }
        }
      }

      .orderFun {
        padding: 0 8px;
        width: 100%;
        display: flex;
        display: -webkit-flex;

        div {
          -webkit-box-flex: 1;
          text-align: center;
          padding: 17px 0 0;
          width: 100%;
          position: relative;

          .num {
            z-index: 20;
            position: absolute;
            width: 16px;
            line-height: 15px;
            border-radius: 50%;
            border:1px solid #ea3323;
            font-size: 12px;
            padding: 0;
            top: 13px;
            right:15px;
            background-color: #FFFFFF;
            color:#ea3323;
            height: 16px;
            text-align: center;
          }

          img {
            position: relative;
            width: 24px;
            height: 24px;
            margin: 0 auto 3px;
          }

          p {
            color: #666666;
            font-size: 12px;
          }
        }
      }
    }
  }
  //我的工具
  .tool {
    width: 100%;
    background-color: #fff;

    .my-tool {
      padding: 10px 15px;
      font-size: 15px;
      font-weight: bold;
      color: #232323;
    }

    .t-list {
      padding: 15px 10px 0 10px;
      width: 100%;
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;

      .t-item {
        margin-right: 17px;
        margin-bottom: 28px;
        width: 76px;
        text-align: center;

        &:nth-child(4n) {
          margin-right: 0
        }

        > a {
          display: block;
          width: 100%;

          > img {
            margin: auto;
            width: 24px;
            height: 24px;
          }

          .small-title {
            margin-top: 8px;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }

  .recommend {
    width: 100%;

    .recommend-title {
      padding: 17px 0 10px 0;
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #333;

      > span {
        position: relative;

        &::before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: -24px;
          width: 15px;
          height: 2px;
          background-color: #333;
        }

        &::after {
          content: ' ';
          position: absolute;
          top: 50%;
          right: -24px;
          width: 15px;
          height: 2px;
          background-color: #333;
        }
      }
    }
  }

  .expectedEarningsBreakdown {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding:3px 16px 15px;
    background:rgba(245,245,245,1);

    .expectedEarningsBreakdownMain {
      width:100%;
      height:111px;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 21px 0 rgba(221,221,221,0.72);
      border-radius:8px;
      padding: 5px 15px 0;

      .title {
        width: 100%;
        height: 24px;
        line-height: 24px;

        img {
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 24px;
        }

        span {
          font-size: 15px;
          color: #333333;
          display: inline-block;
          vertical-align: middle;
          margin-left: 9px;
        }
      }

      .num {
        width: 100%;
        display: flex;
        margin-top: 15px;
        display: -webkit-flex;

        &>div {
          -webkit-box-flex: 1;
          text-align: center;
          width: 100%;
        }

        .personalMenoyTitle {
          color: #999999;
          font-size: 13px;
        }

        .personalMenoyNum {
          color: #FEC012;
          font-size: 21px;
        }
      }
    }
  }

  .personalMedol {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding:3px 16px 15px;
    background:rgba(245,245,245,1);

    .personalFunctionList {
      width:100%;
      height:auto;
      background:rgba(255,255,255,1);
      box-shadow:0 5px 21px 0 rgba(221,221,221,0.72);
      border-radius:8px;

      .personalFunction {
        width: 100%;
        height: 54px;
        line-height: 53px;
        position: relative;
        border-bottom:1px solid #EAEAEA;

        a {
          padding:0 15px ;
          display: block;
          font-size: 0;
          overflow: hidden;
          width: 100%;
          position: relative;

          &:last-child {
            border:none;
          }

          &>img:first-child {
            width: 28px;
            height: 28px;
            display: inline-block;
            vertical-align: middle;
          }

          &>span {
            font-weight: 600;
            vertical-align: middle;
            font-size: 15px;
            margin-left: 16px;
            color: #333333;
          }

          &>.verifiedResult {
            position: absolute;
            font-size: 12px;
            width:59px;
            height:22px;
            line-height: 22px;
            text-align: center;
            color:#ffffff;
            top: 18px;
            right:40px;
            display: block;
            background:rgba(234,51,35,1);
            border-radius:22px;
          }

          &>i {
            right: 15px;
            top: 20px;
            color:#999999;
            display: inline-block;
            position: absolute;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .cropper {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 2000;

    &.cropper-abs {
      position: absolute;
      top: 0;
    }

    > input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }


    > img {
      margin: 0 auto;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 50%;
    }

    .cropper-dialog {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 4200;
      margin: auto;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom,rgba(0,0,0,.75) 50%, rgba(0,0,0,1) 100%);
      background-color: transparent;

      .cropper-body {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        margin: auto;
        width: 80%;
        transform: translate(-50%, -50%);
      }

      .cropper-toolsbar {
        position: absolute;
        bottom: 15px;
        display: block;
        margin: auto;
        padding: 0 15px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        overflow: hidden;

        .cancel {
          float: left;
          color: #fff;
          cursor: pointer;
        }

        .upload {
          float: right;
          color: #129fdd;
          cursor: pointer;
        }
      }
    }

  }
}
</style>
