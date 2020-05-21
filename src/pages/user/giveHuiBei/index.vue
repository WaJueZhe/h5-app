<template>
  <div class="giveHuiBei-page">
    <div class="search-top">
      <div class="search-box">
        <img src="@/assets/homePage/srerch_icon2.png" alt="">
        <form action="JavaScript:return true;">
          <input type="search" v-model.trim="phone" :maxlength="11" placeholder="请输入用户的手机号码" @keyup.enter="search">
        </form>
        <img class="close" v-show=" phone != '' " src="@/assets/homePage/close-02.png" alt="" @click="phone = ''">
      </div>
      <div class="news" @click="search">搜索</div>
    </div>
    <div class="search-result" v-if="searchResultInfo.nickName !== undefined">
      <h4>搜索结果</h4>
      <ul class="list">
        <li class="item">
          <div class="pic">
            <img :src="searchResultInfo.headImagePic" alt="">
          </div>
          <div class="right">
            <div class="info">
              <div class="title">
                <span>昵称</span>
                <span>{{ searchResultInfo.nickName }}</span>
              </div>
              <div class="phone">
                <span>手机</span>
                <span>{{ searchResultInfo.phone }}</span>
              </div>
            </div>
            <div class="btn" @click="give(searchResultInfo.userId, searchResultInfo.nickName)">赠送惠呗</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="search-result" v-if="historyResult.length > 0">
      <h4>最近搜索的手机号码</h4>
      <ul class="list">
        <li class="item" v-for="(item, index) in historyResult" :key="index">
          <div class="pic">
            <img :src="item.headImagePic" alt="">
          </div>
          <div class="right">
            <div class="info">
              <div class="title">
                <span>昵称</span>
                <span>{{ item.nickName }}</span>
              </div>
              <div class="phone">
                <span>手机</span>
                <span>{{ item.phone }}</span>
              </div>
            </div>
            <div class="btn" @click="give(item.userId, item.nickName)">赠送惠呗</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="mask" v-show="giveHuiBeiMask">
      <div class="giftWindow">
        <div class="giftTitle">
          给 <span>{{invitorName}}</span> 赠送惠呗
        </div>
        <div class="giftContent" v-if="point !== 0">
          <p class="giftContentTitle">惠呗数量：</p>
          <input class="giftContentInput" type="text" v-model="amount" placeholder="请输入要赠送的惠呗数量，例如：100">
          <p class="giftContentPrompt">* 您当前最大可赠送惠呗数量是{{ point }}个</p>
        </div>
        <div class="noHuibei" v-if="point === 0">
          抱歉，您账号的惠呗数量不足，请先充值！
        </div>
        <div class="giftBtn">
          <div class="cancel" @click="giveHuiBeiMask = false">取消</div>
          <div class="gift" @click="gifthuibei()" v-if="point !== 0">立即赠送</div>
          <div class="gift" @click="goRecharge()" v-if="point === 0">立即充值</div>
        </div>
      </div>
    </div>

    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <PayPassword @goPay="getConfirmReceive" @offPayWindow="offShowKeyboard" :value1="value1"></PayPassword>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import PayPassword from "@/components/payPassword";
import { Popup, Toast } from 'vant';
Vue.use(Popup).use(Toast)
export default {
  name: 'giveHuiBei',
  data() {
    return {
      phone: '',
      searchResultInfo: {},//搜索结果
      historyResult: JSON.parse(localStorage.getItem('historyResult')) || [],//历史搜索结果
      giveHuiBeiMask: false,
      point: undefined,
      amount: undefined,
      invitorName: undefined,
      toUserId: '',//赠送人的id
      invitorName: '',//赠送人的昵称

      showKeyboard: false,//支付密码弹框
      value1: '',//支付密码
    };
   },
   watch: {
     amount (newVal, oldVal) {
       if (Number(newVal) >= this.point) {
         this.amount = this.point
       }
     }
   },
   methods: {
      // 搜索结果
      foundUser () {
        let data = {
          str: this.phone
        }
        Models.User
        .searchUser(data)
        .then(res => {
          if (res.data.code === '0') {
            this.searchResultInfo = res.data.info
            if (this.historyResult.length > 5) {
              this.historyResult.pop()
            }else {
              for (let i = 0; i < this.historyResult.length; i++) {
                if (res.data.info.phone == this.historyResult[i].phone) {
                  this.historyResult.splice(i, 1)
                }
              }
              this.historyResult.unshift(res.data.info)
              let result = JSON.stringify(this.historyResult)
              localStorage.setItem('historyResult', result)
            }
          }else {
            Toast('没有查到此用户~')
          }
        })
      },
      //点击搜索用户
      search () {
        if (this.phone === '') {
          Toast('请输入手机号码')
          return false;
        }else if (this.$rules.phone(this.phone) !== true) {
          Toast('请输入正确的手机号码')
          return false;
        }
        this.foundUser()
      },
      //获取自己惠呗的数量
      balance () {
        Models.User
        .getBalance()
        .then(res => {
          if (res.data.code === '0' ) {
            this.point = Number(res.data.info.point);
          }
        })
      },
      //赠送惠呗
      give (id, name) {
        this.toUserId = id;
        this.invitorName = name;
        this.giveHuiBeiMask = true;
      },
      //立即充值
      goRecharge () {
        this.$router.push({
          name: 'recharge',
          query: {
            chargeAct: '3'
          }
        });
      },
      //立即赠送
      gifthuibei () {
        if (this.amount === undefined) {
          Toast('请输入要赠送的惠呗数量')
          return false
        }
        this.checkInit()
      },
      //校验有没有设置支付密码
      checkInit() {
        let hadPayPass = localStorage.getItem('hadPayPass')
        if(hadPayPass == 'no') {
          Dialog.confirm({
            title: '温馨提示',
            message: '请先设置支付密码'
          }).then(() => {
            this.$router.push({
              name: 'phoneVerification',
              query:{
                editType: 4
              }
            })
          }).catch(() => {
            this.showKeyboard = false;
            this.value1 = ''
          });
        }else {
          this.showKeyboard = true
        }
      },
      offShowKeyboard () {
        this.showKeyboard = false;
        Toast('您已取消支付')
      },
      //密码输入完成
      getConfirmReceive(password) {
        let data = {
          toUserId: this.toUserId,
          point: this.amount,
          payPassword: password
        };
        this.giveHuiBeiMask = false
        this.bus.$emit('getLoading', {
          loading: true,
          text: '赠送中...'
        });
        Models.User
        .sentPoint(data)
        .then( res => {
          this.bus.$emit('getLoading', {
            loading: false
          });
          if ( res.data.code === '0' ) {
            this.amount = undefined
            this.showKeyboard = false
            Toast("惠呗赠送成功");
          }else {
            Toast(res.data.msg);
            this.value1 = ''
          }
        })
      },
   },
   computed: {

   },
   created() {
     this.balance()
   },
   mounted() {

   },
   components: {
     PayPassword
   },
};
</script>

<style scoped lang="less">

.giveHuiBei-page {
  width: 100%;

  .search-top {
    padding-left: 20px;
    padding-right: 10px;
    width: 100%;
    height: 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;

    .scan {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;

      > img {
        margin: auto;
        width: 24px;
      }
    }

    .search-box {
      padding: 0 14px;
      width: 275px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #F2F2F2;
      border-radius: 20px;
      display: flex;
      align-items: center;

      > img {
        display: inline-block;
        width: 13px;
        height: 13px;
        vertical-align: top
      }

      > form {
          width: 100%;

        > input {
          padding: 0 6px;
          width: 100%;
          height: 30px;
          font-size: 14px;
          background-color: #F2F2F2;
          -webkit-appearance:none;

          &::-webkit-input-placeholder {  	/* WebKit browsers */
            color: #333;
          }
          &:-moz-placeholder {            	/* Mozilla Firefox 4 to 18 */
            color: #333;
          }
          &::-moz-placeholder {           	/* Mozilla Firefox 19+ */
            color: #333;
          }
          &:-ms-input-placeholder {       	/* Internet Explorer 10+ */
            color: #333;
          }
        }
      }

      .close {
        width: 20px;
        height: 20px;
      }
    }

    .news {
      padding: 0 6px;
      width: 55px;
      height: 30px;
      line-height: 29px;
      text-align: center;
      font-size: 14px;
      background-color: #EA3323;
      color: #fff;
      border-radius: 20px;
    }
  }

  .search-result {
    padding: 0 15px;
    margin-bottom: 15px;
    width: 100%;

    h4 {
      font-size: 15px;
      color: #333;
    }

    .list {
      width: 100%;

      .item {
        width: 100%;
        display: flex;
        align-items: center;

        &:last-child {
          .right::after {
            border-bottom: none;
          }
        }

        .pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;

          > img {
            width: 100%;
          }
        }

        .right {
          position: relative;
          padding: 16px 0 16px 13px;
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;

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

          .info {
            flex: 1;

            .title {
              margin-bottom: 6px;
              font-size: 15px;
              font-weight: bold;
              color: #333;
              display: flex;

              > span:last-child {
                width: 145px;
                margin-left: 15px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }

            .phone {
              font-size: 12px;
              color: #333;
              display: flex;

              > span:last-child {
                width: 145px;
                margin-left: 22px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }

          .btn {
            width: 73px;
            height: 30px;
            font-size: 12px;
            line-height: 29px;
            text-align: center;
            background-color: #FB1F16;
            color: #fff;
            border-radius: 20px;
          }
        }
      }
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    z-index: 90;
    top: 0;
    background-color: rgba(0,0,0,0.3);

    .giftWindow {
      width: 325px;
      background-color: #ffffff;
      border-radius: 8px;
      height:auto;
      margin: 0 auto;

      .giftTitle {
        width: 100%;
        height:55px;
        line-height: 54px;
        padding: 0 18px;
        color:#333333;
        font-size: 16px;
        border-bottom:1px solid #eaeaea;

        > span {
          font-weight: bold;
        }
      }

      .giftContent {
        width: 100%;
        height:auto;
        padding: 20px 18px 31px;

        .giftContentTitle {
          color: #333333;
          font-size: 15px;
          width: 100%;
          height:auto;
          margin-bottom: 17px;
        }

        .giftContentInput {
          width: 100%;
          height:40px;
          padding: 0 22px;
          border-radius: 40px;
          background-color:#f2f2f2;
          margin-bottom: 12px;
          font-size: 14px;
          border:none;
        }

        .giftContentPrompt{
          font-size: 12px;
          height: auto;
          width:100%;
          color:#EA3323;
        }
      }

      .noHuibei {
        width: 100%;
        height:98px;
        text-align: center;
        line-height: 98px;
        color:#333333;
        font-size: 14px;
      }

      .giftBtn {
        width: 100%;
        display: flex;
        height:55px;
        font-size: 15px;
        border-top:1px solid #eaeaea;
        line-height: 54px;
        display: -webkit-flex;

        >div {
          width: 100%;
          height:54px;
          text-align: center;
          color:#EA3323;

          &:first-child {
            color:#333333;
            border-right:1px solid #eaeaea;
          }
        }
      }
    }
  }
};
</style>
