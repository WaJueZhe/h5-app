<template>
  <div class="login-page">
    <div class="login">
      <div class="info" v-show="info">
        <h1>我的手机号码？</h1>
        <div class="input-box">
          <div class="input-text">
            <input type="tel" placeholder="请输入手机号注册或登录" :maxlength="11" v-model.trim="phone">
            <van-icon name="close" size="20px" color="#999" @click="phone = ''" v-show="phone.length != 0"/>
          </div>
        </div>
        <div class="next" @click="nextBtn">下一步</div>
        <div class="agree">
          <van-checkbox class="agree-left" v-model="checked" checked-color="#EA3323" icon-size="16">我已阅读并同意</van-checkbox>
          <a href="http://h5.no1qh.com/view/agree.html" replace class="agree-right">《用户服务协议》、</a>
          <a href="http://h5.no1qh.com/view/privacy.html" replace class="agree-right">《隐私政策》、</a>
          <a href="http://h5.no1qh.com/view/partner.html" replace class="agree-right">《代理商推广服务协议》</a>
        </div>
        <div class="itn-code" v-if="nickName === undefined">
          <div class="code-img" @click="scan">
            <img src="@/assets/homePage/Invitation.png" alt="">
          </div>
          <p class="have-itn">我有邀请码</p>
        </div>
        <div class="itn-code" v-if="nickName !== undefined">
          <div class="code-img" v-if="headPic !== undefined" @click="scan">
            <img :src="headPic" alt="">
          </div>
          <div class="code-img" v-if="headPic === undefined" @click="scan">
            <img src="@/assets/homePage/avatar.png" alt="">
          </div>
          <p class="have-itn">{{ nickName }}</p>
          <p class="have-desc">邀请你进入企惠壹号</p>
        </div>
      </div>
      <div class="info-code" v-show="phoneCode">
        <h1>输入4位验证码</h1>
        <div class="text">我们向您<span>{{ phoneText }}</span>手机号发送了验证码</div>
        <div class="input">
          <input ref="pwd" type="tel" :maxlength="digits.length" autofocus="autofocus" v-model.trim="code" style="position: absolute;z-index: -1;opacity: 0; outline: none; color: transparent; margin-left: -100%"/>
          <ul class="pwd-wrap" @click="focus">
            <li v-for="(item,key) in digits"
              :key="key"
              :style="{'margin-right': (100-15*digits.length)/(digits.length-1)+'%','width':'10%'}"
              :class="{'input-active': code.length == key || code.length > key || key == 0}"
              >
              <span v-if="msgLength > key">{{code.substring(key,key+1)}}</span>
            </li>
          </ul>
        </div>
        <div class="time"><input type="button" v-model="codeMsg" @click="getCode" :disabled="codeDisabled"></div>
        <div class="next" @click="idyLogin"><span>立即登录</span></div>
      </div>
      <!-- 新用户赠送惠呗提示框 -->
      <div class="new-box" v-if="isNewFlage" @touchmove.prevent>
        <div class="give-box">
          <div class="img">
            <img src="@/assets/homePage/giveTip.png" alt="">
          </div>
          <div class="close-btn" @click="closeGive">
            <img src="@/assets/homePage/close_icon.png" alt="">
          </div>
        </div>
      </div>
      <div class="new-box" v-if="welfareFlage" @touchmove.prevent>
        <div class="welfare-box">
          <div class="welfare">
            <img class="tankuang" src="@/assets/homePage/tankuang.png" alt="">
            <img class="anniu" src="@/assets/homePage/anniu.png" alt="" @click="rushToBuy">
          </div>
          <div class="close-btn" @click="closeWelfare">
            <img src="@/assets/homePage/close_icon.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk';
import CryptoJS from "crypto-js";
import { Checkbox, CheckboxGroup, Toast , Icon, Dialog } from 'vant';
import { setTimeout } from 'timers';
Vue.use(Checkbox).use(CheckboxGroup).use(Toast).use(Icon).use(Dialog);
export default {
  name: 'login',
  data() {
    return {
      isNewFlage: false,//新用户赠送100惠呗弹框
      welfareFlage: false,//新人专属福利弹框
      goodId: '',
      phone: '',
      checked: true,
      info: true,
      phoneCode: false,
      phoneText: '',
      digits:['','','',''],  //input框位数控制,这里可以配置多少个“输入框”
      code:'',
      msgLength:0,
      // 是否禁用按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '发送验证码',
      // 定时器
      timer: null,
      codeColor: false,
      sessionId:"",
      headPic: '',//邀请人头像
      nickName: '',//邀请人名字
      inviteCode: '',//邀请码
      stateType: localStorage.getItem('stateType'),
      goType: localStorage.getItem('goType'),
      subscribe: '',//是否关注公众号
      gtype: '',//是否是会员升级的商品
      jump: '',
    };
  },
  watch: {
    code(curVal){
      //监听输入的长度，如果输入完，自动调用校验接口函数
      // if(curVal.trim().length===this.digits.length){
      //     this.verifyTels();
      // }
      this.msgLength = curVal.length;
    },
    phone (newVal, oldVal) {
      sessionStorage.setItem('lPhone', newVal)
    }
    // 'page':{
    //   handler:function (newValue, oldValue) {
    //     if( oldValue == 0 && newValue == 1 ){
    //       this.timer = setTimeout(()=>{this.$refs.pwd.focus()},500);
    //     }
    //   },
    //   deep:true
    // }
  },
  methods: {
    //扫一扫获取邀请码
    scan() {
      let that = this;
       wx.ready(() => {
         wx.scanQRCode({
           needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
           scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
           success: (res) => {
              var result = res.resultStr; //扫码返回的结果
              let agrs = that.$common.getRequest(result);//解析参数
              if (result.indexOf('qr') >= 0) {
                window.location.href = result
              }else {
                if(agrs.qhyh == 8) {
                  that.headPic = agrs.headPic;
                  that.nickName = agrs.nickName;
                  that.inviteCode = agrs.ucode
                }else {
                  Toast("扫描的二维码不合法");
                }
              }
            }
         })
       })
    },
    //获取Session
    getSession() {
      Models.User
      .session()
      .then(res => {
        this.sessionId = res.data;
        // 设置缓存
        sessionStorage.setItem('sessionId', res.data);
      })
    },
    // 获取COOKIE 
    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            let showCipherText = c.substring(name.length, c.length);
            let bytes = CryptoJS.AES.decrypt(showCipherText, "QHYHwuzhibin2019");
            return bytes.toString(CryptoJS.enc.Utf8);
          }
      }
      return false;
    },
    //下一步
    nextBtn() {
      if(this.phone == '') {
        Toast('请输入手机号码');
        return;
      }else if(this.$rules.phone(this.phone) !== true) {
        Toast('请输入正确的手机号码');
        return false;
      }else if(this.checked == false) {
        Toast('是否同意服务协议');
        return false;
      }
      this.info = false;
      this.phoneCode = true;
      this.phoneText = this.phone.slice(0,3) + '****' + this.phone.slice(-4);
      this.getCode()
    },
    //使input框获得焦点
    focus(){
      this.$refs.pwd.focus();
    },
    //跳转
    jumpTo () {
      if (this.jump === '1') {
        this.$router.go(-1)
      }else {
        this.$router.replace({
          name: 'home'
        })
      }
    },
    // 是否关注公众号
    followPublicAccount () {
      let userId = localStorage.getItem('userId')
      if(this.subscribe == '1') {//1是已经关注公众，但没有绑定关系；
        this.alreadyFollow(userId)
      }else if(this.subscribe == '0') {//0是没关注公众号，2放行
        if(this.goodId != null || this.goodId != undefined || this.goodId != '') {
          this.$router.push({
            name: 'follow',
            query: {
              goodId: this.goodId,
              userId: userId
            }
          })
        }else {
          this.$router.push({
            name: 'follow',
            query: {
              goodId: '666',
              userId: userId
            }
          })
        }
      }else {
        this.jumpTo()//从哪里过来的登录，回到对呀的页面
      }
    },
    //登录
    idyLogin() {
      this.code.replace(/\s+/g, "");
      this.phone.replace(/\s+/g, "");
      let data = {
        phone: this.phone,
        code: this.code,
        inviteCode: this.inviteCode
      };
      Models.User
      .login(data)
      .then(res => {
        if( res.data.code === '0' ) {
          window.localStorage.phone = this.phone;
          localStorage.setItem('userId', res.data.info.userId);
          localStorage.setItem('userCode', res.data.info.userCode);
          localStorage.setItem('sessionId', this.sessionId);
          localStorage.setItem('gradeName', res.data.info.member.gradeName);
          localStorage.setItem('nextGradeName', res.data.info.member.nextGradeName);
          localStorage.setItem('headImagePic', res.data.info.headImagePic);
          localStorage.setItem('nickName', res.data.info.nickName);
          localStorage.setItem('ygrade', res.data.info.member.ygrade);
          sessionStorage.removeItem('lPhone')
          // 设置用户COOKIE 30 天有效
          this.setCookie('sessionId',this.sessionId,30);
          if(res.data.info.isNew === '1') {//是否新用户  0-否 1-是
            this.isNewFlage = true
          }else {
            this.followPublicAccount()// 是否关注公众号
          }
        }else if(res.data.code == '210110' || res.data.code == '210112' || res.data.code == '23432') {
          Dialog.alert({
            message: res.data.msg + '，继续登录',
            confirmButtonText: '继续登录',
            confirmButtonColor: '#EA3323'
          }).then(() => {
            // this.loginBtn()
            this.inviteCode = ''
            this.idyLogin()
          });
        }else {
          Toast(res.data.msg)
        }
      })
    },
    // 设置COOKIES
    setCookie(cname,cvalue,exdays){
      let d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires=" + d.toGMTString();
      let cvalueText = CryptoJS.AES.encrypt(
      cvalue,
      "QHYHwuzhibin2019"
      ).toString();
      document.cookie = cname + "=" + cvalueText + ";" + expires + ";path=/";
    },
    //继续登录
    loginBtn() {
      this.code.replace(/\s+/g, "");
      this.phone.replace(/\s+/g, "");
      let data = {
        phone: this.phone,
        code: this.code,
        inviteCode: ''
      };
       Models.User
       .login(data)
       .then(res => {
         if(res.data.code === '0') {
          sessionStorage.removeItem('lPhone')
          localStorage.removeItem('agrsDInfo')
          window.localStorage.phone = this.phone;
          localStorage.setItem('userId', res.data.info.userId);
          localStorage.setItem('sessionId', this.sessionId);
          localStorage.setItem('gradeName', res.data.info.member.gradeName);
          localStorage.setItem('nextGradeName', res.data.info.member.nextGradeName);
          localStorage.setItem('headImagePic', res.data.info.headImagePic);
          localStorage.setItem('nickName', res.data.info.nickName);
          localStorage.setItem('ygrade', res.data.info.member.ygrade);
          // 设置用户COOKIE 30 天有效
          this.setCookie('sessionId',this.sessionId,30);
          if(res.data.info.isNew === '1') {
            this.isNewFlage = true
            this.$common.forbidBodyScroll()
          }else {
            this.followPublicAccount()// 是否关注公众号
          }
         }else {
           Toast(res.data.msg)
         }
       })
    },

    // 验证码60秒倒计时
    time(){
      this.timer = setInterval(() => {
        if (this.countdown > 0 && this.countdown <= 60) {
          this.countdown--;
          if (this.countdown !== 0) {
            this.codeMsg = "" + this.countdown + "s后重新发送验证码";
          } else {
            clearInterval(this.timer);
            this.codeMsg = "获取验证码";
            this.countdown = 60;
            this.timer = null;
            this.codeDisabled = false;
          }
        }
      }, 1000)
    },
    //获取验证码
    getCode() {
      if(!this.timer) {
        this.time();
        let data = {
          phone: this.phone,
          vcat:"registry"
        };
        Models.User
        .code(data)
        .then(res => {
          if( res.code == 0 ) {
            Toast('发送成功')
          }
        })
      }
    },
    //默认绑定关系--已登录并且没绑定关系
    confirm(ucode) {
      let data = {
        id: ucode
      };
      Models.User
      .bindMyInvitor(data)
      .then(res => {
        sessionStorage.removeItem('lPhone')
        this.followPublicAccount()// 是否关注公众号
      })
    },
    //已经关注的老用户静默绑定
    alreadyFollow(userId) {
      let data = {
        userId: userId
      }
      Models.User
      .binduser(data)
      .then(res => {
        if(res.data.code == 200) {
          sessionStorage.removeItem('lPhone')
          this.jumpTo()//从哪里过来的登录，回到对呀的页面
        }
      })
    },
    //关闭惠呗弹框提示
    closeGive() {
      sessionStorage.removeItem('lPhone')
      this.isNewFlage = false
      this.welfareFlage = true
    },
    //关闭新人专属福利弹框提示
    closeWelfare () {
      this.welfareFlage = false
      this.followPublicAccount()// 是否关注公众号
    },
    //立即抢购
    rushToBuy () {
      let userId = localStorage.getItem('userId')
      if(this.subscribe == '1') {//1是已经关注公众，但没有绑定关系；
        this.alreadyFollow(userId)
      }else if(this.subscribe == '0') {//0是没关注公众号，2放行
        if(this.goodId != null || this.goodId != undefined || this.goodId != '') {
          this.$router.push({
            name: 'follow',
            query: {
              goodId: this.goodId,
              userId: userId
            }
          })
        }else {
          this.$router.push({
            name: 'follow',
            query: {
              goodId: '666',
              userId: userId
            }
          })
        }
      }else {
        this.$router.push({
          name: 'newcomerBenefits',
          query: {
            newPeople: '1',
            zoneCode: 'newEmployeeBenefitsZone',
            zoneName: '新人专属福利'
          }
        })
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(localStorage.sessionId !== undefined) {
        vm.goodId = vm.$route.query.goodId
        let agrs = vm.$common.getRequest(window.location.href)
        vm.confirm(agrs.ucode)
      }
    })
  },
  created() {
    if(localStorage.sessionId == undefined) {
      let cookieSessionId = this.getCookie('sessionId');
  
      if(cookieSessionId !== false){
        // 设置缓存
        window.localStorage.setItem('sessionId', cookieSessionId);
      }else{
        // 重新获取session
        this.getSession();
      }
    }
    if (sessionStorage.getItem('lPhone') != null) {
      this.phone = sessionStorage.getItem('lPhone')
    }
    // if(window.location.href.indexOf('action') >= 0) {
      let agrs = this.$common.getRequest(window.location.href)
      // if(localStorage.sessionId == undefined && sessionStorage.getItem('agrsInfo') != null) {
      //   let agrsData = JSON.parse(sessionStorage.getItem('agrsInfo'))
      //   this.headPic = agrsData.headPic
      //   this.nickName = agrsData.nickName
      //   this.inviteCode = agrsData.ucode
      //   let url = window.location.href.split('#')[0]
      //   sdk.getJSSDK(url)
      // }
      this.goodId = agrs.goodId
      this.headPic = agrs.headPic
      this.nickName = agrs.nickName
      this.inviteCode = agrs.ucode
      this.subscribe = agrs.subscribe
      this.gtype = agrs.gtype
      this.jump = agrs.jump
      let url = window.location.href.split('#')[0]
      sdk.getJSSDK(url)
    // }
    // if(window.location.href.indexOf('action') == -1) {
    //   let url = window.location.href.split('#')[0]
    //   sdk.getJSSDK(url)
    // }
  },
  mounted() {

  },
  //页面里面清除定时器
  destroyed() {
    clearTimeout(this.timer);
  },
  components: {

  },
};
</script>

<style lang="less">
.login-page {
  width: 100%;
  height: 100vh;
  background-color: #fff;

  .login {
    padding: 0 28px;
    width: 100%;

    .info {
      width: 100%;
      overflow: hidden;

      h1 {
        margin-top: 46px;
        font-size: 30px;
      }

      .input-box {
        padding: 60px 0 16px 0;
        width: 100%;
        border-bottom: 1px solid #999;

        .input-text {
          width: 100%;
          height: 28px;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;

          > input {
            width: 100%;
            height: 100%;
            font-size: 20px;
            z-index: 99;
            overflow: hidden;
          }

          > i {
            z-index: 333;
          }
        }
      }



      .next {
        padding: 15px 0;
        margin-top: 38px;
        width: 100%;
        font-size: 16px;
        text-align: center;
        background-color: #EA3323;
        border-radius: 6px;
        color: #fff;
      }

      .agree {
        margin-top: 10px;
        font-size: 12px;

        &::after {
          display: block;
          clear: both;
          content: ' ';
        }

        .agree-left {
          float: left;
          vertical-align: middle;

          .van-checkbox__icon {
            width: 15px;
            height: 15px;
            line-height: 13px;

            > i {
              width: 15px;
              height: 15px;
              font-size: 10px;
            }
          }

          .van-checkbox__label {
            margin-left: 4px
          }
        }

        .agree-right {
          float: left;
          height: 20px;
          line-height: 20px;
          color: #5890DC;
          vertical-align: middle;
        }
      }

      .itn-code {
        margin-top: 100px;
        width: 100%;

        .code-img {
          margin: auto;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #fff;
          overflow: hidden;

          > img {
            width: 100%;
            height: 100%;
            // border-radius: 50%;
          }
        }

        .have-itn {
          margin-top: 6px;
          font-size: 15px;
          text-align: center;
          color: #333;
        }

        .have-desc {
          margin-top: 4px;
          font-size: 13px;
          text-align: center;
          color: #333;
        }
      }
    }

    .info-code {
      width: 100%;
      overflow: hidden;

      h1 {
        margin-top: 46px;
        font-size: 30px;
      }

      .text {
        margin-bottom: 20px;
        font-size: 14px;
        color: #999;
        overflow: hidden;
      }

      .input {
        width: 100%;

        > input {
          width: 10%;
          border: none;
          border-bottom: 1px solid #C8C7CC;
          background-color: #fff;
          text-align: center;
          margin-right: 18%;
          font-size: 35px;
          &:focus{
            border-bottom: 1px solid deepskyblue;
          }
          &:last-of-type{
            margin-right: 0 !important;
          }
        }

        .pwd-wrap {
          padding-left: 0;
          width: 100%;
          height: 44px;
          padding-bottom: 1px;
          margin: 0 auto;
          display: flex;
          display: -webkit-box;
          display: -webkit-flex;
          cursor: pointer;
          border: none;
          background-color: #fff;

          > li {
            list-style-type:none;
            text-align: center;
            line-height: 44px;
            -webkit-box-flex: 1;
            flex: 1;
            -webkit-flex: 1;
            border: none;
            border-bottom:1px solid #C8C7CC;
            background-color: #fff;

            &.input-active {
              border-bottom: 2px solid #333;
            }

            &:last-of-type{
              margin-right: 0 !important;
            }

            &:last-child {
              border-right: 0;
            }

            > span {
              font-size: 20px;
            }

            > i {
              height: 10px;
              width: 10px;
              border-radius:50% ;
              background: #000;
              display: inline-block;
            }
          }
        }
      }

      .time {
        margin-top: 10px;
        width: 46%;
        height: 26px;

        > input {
          position: absolute;
          width: 100%;
          line-height: 26px;
          text-align: left;
          font-size: 14px;
          background: transparent;
          color: #999;
          border: transparent;  //自定义边框
          outline: none;    //消除默认点击蓝色边框效果
        }
      }

      .next {
        padding: 15px 0;
        margin-top: 38px;
        width: 100%;
        font-size: 16px;
        text-align: center;
        background-color: #EA3323;
        border-radius: 6px;
        color: #fff;
      }
    }

    .new-box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.5);
      z-index: 99999;
      overflow: hidden;

      .give-box {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
        width: 343px;
        z-index: 99999;

        .img {
          margin-bottom: 47px;
          width: 343px;

          > img {
            width: 100%;
          }
        }

        .close-btn {
          margin: auto;
          width: 27px;
          height: 27px;

          > img {
            width: 100%;
          }
        }
      }

      .welfare-box {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
        width: 273px;
        z-index: 99999;

        .welfare {
          margin-bottom: 47px;
          width: 273px;

          .tankuang {
            width: 100%;
          }

          .anniu {
            position: absolute;
            bottom: 80px;
          }
        }

        .close-btn {
          margin: auto;
          width: 27px;
          height: 27px;

          > img {
            width: 100%;
          }
        }
      }
    }
  }
};
</style>
