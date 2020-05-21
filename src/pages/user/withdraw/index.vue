<template>
  <div class="withdraw">
    <div class="withdrawWindow">
      <div class="withdrawMain">
        <div class="withdrawTitle">提现余额</div>
        <div class="withdrawInput">
          <span>￥</span>
          <input type="text" v-model="amount">
        </div>
        <div class="balanceNumber">
          <span class="number">现有{{info.balance}}余额，可提现收益为￥{{info.exBalance}}，</span><span class="button" @click="allAmount()">全部提现</span>
        </div>
        <div class="withdrawFun">
          <span class="title">提现方式</span><span class="description">（工作日24小时内到账）</span>
        </div>
        <div class="withdrawFunList">
          <div class="anyoneWithdrawFun">
            <div class="logo">
              <img src="@/assets/wxpay.png" alt="">
              <img class="label" src="@/assets/jisu.png" alt="">
            </div>
            <div class="title">微信</div>
            <div class="select">
              <van-icon name="checked" size="20px"/>
            </div>
          </div>
        </div>
        <div class="withdrawBtn" @click="getAddWeixinDraw()">提现</div>
      </div>
    </div>
    <van-popup position="bottom" v-model="show">
      <payPassword @goPay="getAddWeixinDraw"></payPassword>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Models from '@/models';
  import payPassword from '@/components/payPassword';
  import { Icon , Toast , Popup  } from 'vant';
  Vue.use(Icon).use(Toast).use(Popup);
  export default {
    name:"withdraw",
    data () {
      return {
        show:false,
        drawWay:1,
        userId:"",
        amount:"",
        info:{}
      }
    },
    methods:{
      getMyUser () {
        Models.User
          .getInfo()
          .then(res => {
            this.userId = res.data.info.userId;
          })
      },
      checkBalance () {
        Models.User
          .getBalance()
          .then( res => {
            if ( res.data.code == 0 ) {
              this.info = res.data.info;
            }
          })
      },
      goWithdraw () {
        this.show = true;
      },
      allAmount () {
        this.amount = this.info.exBalance;
      },
      getAddWeixinDraw () {
        if ( this.amount.length === 0 ) {
          Toast('请输入金额');
          return
        }else if ( Number(this.amount) === 0 ) {
          Toast('请输入正确的数字');
          return
        }
        this.getAddDraw();
      },
      getAddDraw () {
        let data = {
          amount:this.amount,
          drawWay:this.drawWay
        };
        Models.User
          .addDraw(data)
          .then( res => {
            if ( res.data.code == 0 ) {
              this.$router.go(-1);
              Toast("提现成功，预计24小时到账");
            }else {
              Toast(res.data.msg);
            }
          })
      }
    },
    created () {
      this.getMyUser();
      this.checkBalance();
    },
    components: {
      payPassword
    },
  }
</script>
<style lang="less">
  .withdraw {
    width: 100%;
    height:100%;

    .withdrawWindow {
      width:100%;
      height:auto;
      padding:16px 15px;

      .withdrawMain {
        width:100%;
        height:100%;
        background-color:#ffffff;
        padding: 16px;
        box-shadow:0 5px 21px 0 rgba(221,221,221,0.72);
        border-radius:8px;

        .withdrawTitle {
          width:100%;
          height:auto;
          font-weight: bold;
          font-size: 15px;
          color:#333333;
        }

        .withdrawInput {
          width: 100%;
          height:70px;
          display: flex;
          align-items: center;
          display: -webkit-flex;
          border-bottom:1px solid #EAEAEA;
          margin-bottom: 16px;

          &>span {
            font-size: 30px;
            font-family: bold;
          }

          &>input {
            width: 100%;
            height:auto;
            font-size: 30px;
            padding-left: 15px;
          }
        }

        .balanceNumber {
          width: 100%;
          height:auto;
          font-size: 12px;
          margin-bottom: 24px;

          .number {
            color:#999999;
          }

          .button {
            color:#ea3323;
          }
        }

        .withdrawFun {
          width: 100%;
          height:auto;
          font-size: 0;
          margin-bottom: 28px;

          .title {
            font-size: 15px;
            color:#333333;
          }

          .description {
            font-size:12px ;
            color:#999999;
          }
        }

        .withdrawFunList {
          width:100%;
          height: auto;
          font-size: 0;
          margin-bottom: 39px;

          .anyoneWithdrawFun {
            width: 100%;
            height:auto;
            display: -webkit-flex;
            display: flex;

            .logo {
              flex-shrink: 0;
              flex-basis: 28px;
              height:28px;
              position: relative;

              img {
                width: 28px;
                height: 28px;
              }

              .label {
                width: 29px;
                height: 13px;
                position: absolute;
                top: -9px;
                right:-21px;
              }
            }

            .title {
              width: 100%;
              font-size: 15px;
              color:#666666;
              padding-left: 16px;
              display: -webkit-flex;
              display: flex;
              align-items: center;;
            }

            .select {
              width:100%;
              font-size: 16px;
              color:#ea3323;
              text-align: right;
              display: -webkit-flex;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
          }
        }

        .withdrawBtn {
          width:100%;
          height:40px;
          line-height: 40px;
          border-radius: 8px;
          font-size:15px;
          text-align: center;
          color:#FFFFFF;
          background: #EA3323;
        }
      }
    }
  }
</style>


