<template>
  <div class="payPassword">
    <div class="payPasswordHeader">
      <div class="offIcon">
        <van-icon name="cross" color="#b0b0b0" @click="offPayWindow()" />
      </div>
      <span>请输入支付密码</span>
    </div>
    <div style="margin:15px 0;">
      <van-password-input :value="value1"/>
    </div>
    <div @click="goSettingPass()" style="color:#5890DC;font-size:15px;margin-bottom: 20px;width:100%;padding: 0 15px;text-align: right;">忘记密码?</div>
    <van-number-keyboard
      style=" position: relative;"
      :show="true"
      extra-key="."
      @input="onInput"
      @delete="onDelete"/>
  </div>
</template>
<script>
import Vue from 'vue';
import { PasswordInput , NumberKeyboard , Icon , Toast } from 'vant';
Vue.use(PasswordInput).use(NumberKeyboard).use(Icon).use(Toast);
export default {
  name:"payPassword",
  data () {
    return {
      // value1:"",
    }
  },
  props:{
    value1: {
      type: String,
      default: ''
    }
  },
  watch:{
    value1 () {
      if ( this.value1.length === 6 ) {
        this.goPay(this.value1);
      }else if(this.value1.length > 6) {
        return
      }
    },
  },

  methods:{
    goPay (password) {
      this.$emit('goPay',password);
    },
    onInput(key) {
      this.value1 = (this.value1 + key).slice(0, 6);
    },
    onDelete() {
      this.value1 = this.value1.slice(0, this.value1.length - 1);
    },
    goSettingPass () {
      let href = window.location.href;
      window.sessionStorage.goSettingPassWord = href.split("#")[1];
      this.$router.push('/phoneVerification?editType=4');
    },
    offPayWindow () {
      this.$emit('offPayWindow');
      // Toast('您已取消支付')
    }
  },
  created () {
    this.value1 = "";
  }
}
</script>
<style lang="less" scoped>
.payPasswordHeader {
  width: 100%;
  height:auto;
  position: relative;
  font-size: 15px;
  padding: 17px 0;
  color:#333333;
  text-align: center;
  border-bottom:1px solid #EAEAEA;

  .offIcon {
    position: absolute;
    font-size: 24px;
    width:24px;
    height:auto;
    left:15px;
    top:14px;
  }
}
</style>


