<template>
  <div class="phoneVerification">
    <div class="fromData">
      <div class="phoneInput">
        <van-field v-model="phone" placeholder="请输入手机号码" readonly/>
      </div>
      <div class="verificationCode">
        <div class="verificationCodeInput">
          <van-field v-model="code" placeholder="请输入验证码" />
        </div>
        <div class="verificationCodeBtn" >
          <button :class="[ acccc]" @click="getCode()" :disabled="codeDisabled">{{codeMsg}}</button>
        </div>
      </div>
    </div>
    <div class="next">
      <button @click="next()">下一步</button>
    </div>
    <div class="agree">
      <div class="btn" @click="checked = !checked">
        <img v-show="checked" src="@/assets/chosen.png" alt="">
        <img v-show="!checked" src="@/assets/noChosen.png" alt="">
      </div>
      <div class="title">
        <span>我已阅读并同意</span><a href="http://h5.no1qh.com/view/agree.html" class="protocol">《企惠壹号产品服务协议》</a>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import { Popup , Field, Toast } from 'vant';
import { resolve } from 'url';

Vue.use(Field).use(Toast).use(Popup);
export default {
  name:"phoneVerification",
  data () {
    return {
      phone:"",
      code:"",
      acccc:"red",
      checked: true,
      // 是否禁用按钮
      codeDisabled: false,
      // 倒计时秒数
      countdown: 60,
      // 按钮上的文字
      codeMsg: '发送验证码',
      // 定时器
      timer: null,
      show:false,
    }
  },
  methods:{
    next () {
      if ( !this.checked ) {
        Toast("请同意服务协议");
      }else if ( this.code.length === 0 ) {
        Toast("请输入验证码");
      }else {
        this.checkPhone();
      }
    },
    checkPhone () {
      let data = {
        phone:this.phone,
        vcat:"setPass",
        code:this.code
      };
      Models.User
      .checkPhoneCode(data)
      .then( res => {
        if ( res.data.code == 0 ) {
          let tokenId = res.data.info.tokenId;
          this.$router.push(`/settingPassword?editType=${this.$route.query.editType}&id=${tokenId}`)
        }else {
          Toast(res.data.msg);
        }
      })
    },
    time(){
      this.timer = setInterval(() => {
        if (this.countdown > 0 && this.countdown <= 60) {
          this.countdown--;
          if (this.countdown !== 0) {
            this.codeMsg =  `${this.countdown}s`;
          } else {
            clearInterval(this.timer);
            this.codeMsg = "获取验证码";
            this.countdown = 60;
            this.timer = null;
            this.acccc = "red";
            this.codeDisabled = false;
          }
        }
      }, 1000)
    },
    getCode() {
      var reg = 11 && /^((11|12|13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if ( !reg.test( this.phone )  ) {
        Toast('请输入正确的手机号码')
      } else {
        if (!this.timer) {
          this.acccc = "ddd";
          this.codeMsg = `${this.countdown}s`;
          this.codeDisabled = true;
          this.time();
          let data = {
            phone: this.phone,
            vcat: "setPass"
          };
          Models.User
            .code(data)
            .then(res => {
              if (res.data.code == 0) {
                Toast('发送成功')
              } else {
                Toast(res.data.msg);
              }
            })
        }
      }
    },
  },
  created () {
    this.phone = window.localStorage.phone;
  },
  components: {
  },
}
</script>

<style lang="less">
.phoneVerification {
  width: 100%;

  .fromData {
    width:100%;
    height:auto;
    margin-bottom: 38px;
    padding:80px 29px 0;

    &>div.phoneInput {
      position: relative;
      margin-bottom:8px;
      font-size: 15px;
      color:#999999;

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

    &>div.verificationCode {
      display: flex;
      width: 100%;
      display:-webkit-flex;

      .verificationCodeInput {
        position: relative;
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
      }

      .verificationCodeBtn {
        flex-shrink:0;
        width: 94px;
        padding-left: 10px;

        button {
          width:84px;
          height:36px;
          color:#ffffff;
          font-size:12px;
          border:none;
          border-radius:8px;
        }
      }
    }
  }

  .next {
    width: 100%;
    height: auto;
    padding:0 29px;
    margin-bottom: 10px;

    button {
      width: 100%;
      height: 40px;
      color:#ffffff;
      font-size:18px;
      border:none;
      background:#EA3323;
      border-radius:8px;
    }
  }

  .agree {
    display: flex;
    width: 100%;
    display:-webkit-flex;
    height: auto;
    padding:0 29px;

    .btn {
      width: 15px;
      height: 20px;
      padding-top: 2px;
      flex-shrink:0;
      margin-right: 5px;

      img {
        width: 15px;
        height: 15px;
      }
    }

    .title {
      width: 100%;
      font-size: 12px;
      height: 20px;
      line-height:20px;

      .protocol {
        color:#5890DC;
        margin-left: 3px;
        display: inline-block;
        border-bottom:1px solid #5890DC;
      }
    }
  }
}

.red {
  background-color: #EA3323;
}

.ddd {
  background-color: #dddddd;
}

.description {
  width:328px;
  height: 421px;
  overflow: hidden;
  border:none;
  background: #ffffff;
  border-radius: 16px!important;


  .descriptionTitle {
    width: 100%;
    color: #232323;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 15px;


    border-bottom:1px solid #EAEAEA;
  }

  .descriptionContent {
    width: 100%;
    height: 333px;
    overflow: auto;
  }

  .descriptionBtn {
    width: 100%;
    color: #EA3323;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 15px;
    border-top:1px solid #EAEAEA;
  }
}
</style>
