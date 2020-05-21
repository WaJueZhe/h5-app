<template>
  <div class="settingPassword">
    <div class="fromData" v-if="editType == 3">
      <van-field v-model="editPassword.passOld" type="password" :maxlength="6"
        clearable
        label="原密码"
        placeholder="填写原密码">
      </van-field>
      <van-field v-model="editPassword.passNew" type="password" :maxlength="6"
        clearable
        label="新密码"
        placeholder="填写6位数新密码">
      </van-field>
      <van-field v-model="editPassword.passAgain" type="password" :maxlength="6"
        clearable
        label="确认密码"
        placeholder="再次填写确认">
      </van-field>
    </div>
    <div class="fromData" v-else>
      <van-field v-model="newPassword.passNew" type="password" :maxlength="6"
        clearable
        label="密码"
        placeholder="填写6位数新密码">
      </van-field>
      <van-field v-model="newPassword.passAgain" type="password" :maxlength="6"
        clearable
        label="确认密码"
        placeholder="再次填写确认">
      </van-field>
    </div>
    <div class="next">
      <button @click="getSettingPassword()">确认</button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import { Field , Radio , Dialog, Toast } from 'vant';
import { resolve } from 'url';

Vue.use(Field).use(Dialog);
export default {
  name:"settingPassword",
  data () {
    return {
      phone:"",
      settingPasswordTitle:"设置支付密码",
      editType:1,
      checked:true,
      editPassword:{
        passOld:"",
        passNew:"",
        passAgain:"",
        type:"pay",
        act:"change",
        tokenId:this.$route.query.id || '',
      },
      newPassword:{
        passNew:"",
        type:"pay",
        act:"reset",
        passAgain:"",
        tokenId:this.$route.query.id,
      },
    }
  },
  methods:{
    getSettingPassword () {
      let data = {};
      //1是在个人中心到手机验证然后跳转过来，2是从账号与安全到手机验证然后跳转过来，3是从修改密码直接进来，4是从支付页面到手机验证然后跳转过来
      if ( this.editType === 1 || this.editType === 2 || this.editType === 4 ) {
        data = this.newPassword;
        if(this.newPassword.passNew.length != 6) {
          Toast('请输入6位数的密码')
          return
        }else if(Number(this.newPassword.passNew) != Number(this.newPassword.passAgain)) {
          Toast('两次输入密码不一致')
          return
        }
      }else {
        data = this.editPassword;
        if(this.editPassword.passNew.length != 6) {
          Toast('请输入6位数的密码')
          return
        }else if(Number(this.editPassword.passNew) != Number(this.editPassword.passAgain)) {
          Toast('两次输入密码不一致')
          return
        }
      }
      Models.User
      .setPassword(data)
      .then(res => {
        if ( res.data.code == '0' ) {
          Dialog.alert({
            message: '修改密码成功'
          }).then(() => {
            if ( this.editType === 1 || this.editType === 4 || this.editType === 3) {
              this.$router.go(-2)
            }else if ( this.editType === 2 ) {
              this.$router.go(-3)
            }
          });
        }else {
          Toast(res.data.msg)
        }
      })
    }
  },
  components: {

  },
  created () {
    this.editType = Number(this.$route.query.editType);
    if ( this.editType === 1 ) {
      this.settingPasswordTitle = "设置支付密码";
    }else {
      this.settingPasswordTitle = "修改支付密码";
    }
  }
}
</script>

<style lang="less">
.settingPassword {
  width: 100%;

  .fromData {
    width:100%;
    height:auto;
    margin-bottom: 38px;
    padding:60px 29px 0;

    &>div.phoneInput {
      margin-bottom:8px;
      font-size: 15px;
      color:#999999;
      border-bottom:1px solid #eaeaea;
    }

    &>.van-cell {
      border-bottom:1px solid #eaeaea;
    }

    &>.van-cell:not(:last-child)::after {
      border:none;
    }

    &>div.verificationCode {
      display: flex;
      width: 100%;
      display:-webkit-flex;

      .verificationCodeInput {
        width: 100%;
        border-bottom:1px solid #eaeaea;
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
          background:rgba(234,51,35,1);
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
</style>

