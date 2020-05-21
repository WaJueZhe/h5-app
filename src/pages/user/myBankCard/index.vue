<template>
  <div class="myBankCard">
    <div class="noBankCard" v-if="myBankCardList.length === 0" >
      <img src="@/assets/bankCard.png" alt="">
      <p>暂无银行卡信息</p>
    </div>
    <div class="bankCardList">
      <ul>
        <li v-for="(data,index) in myBankCardList" :key="index">
          <div class="bankCardCenter">
            <div class="bankCardLogo">
              <img src="@/assets/myBankCard.png" alt="">
            </div>
            <div class="bankCardName">
              <p>{{data.bankName}}</p>
              <p>储蓄卡</p>
            </div>
          </div>
          <div class="bankCardNum">**** **** **** {{returnBankNumber(data.bankNumber)}}</div>
        </li>
      </ul>
    </div>
    <div class="addBankCard">
      <router-link to="/bindingBankCard">
        <button class="clickBtn">绑定银行卡</button>
      </router-link>
    </div>
  </div>
</template>
<script>
  import Models from '@/models';
  export default {
    name:'myBankCard',
    data () {
      return {
        titleName:"银行卡管理",
        addOrSeeList:true,
        myBankCardList:[],
      }
    },
    methods:{
      goAddBank () {
      },
      myBankCard () {
        Models.User
          .getMybank()
          .then(res => {
            if ( res.data.code == 0 ) {
              this.myBankCardList = res.data.info.list;
            }
          })
      },
      //返回银行卡后四位
      returnBankNumber (num) {
        return num.substr(num.length-4)
      }
    },
    activated () {
      this.myBankCard();
    },
    created () {

    },
    components: {
    },
  }
</script>
<style lang="less">
.myBankCard {
  width: 100%;

  .noBankCard {
    width: 100%;
    padding-top: 60px;

    img {
      margin: 0 auto 22px;
      width: 100px;
      height: auto;
    }

    p {
      width: 100%;
      text-align: center;
      font-size: 18px;
      color:#999999;
    }
  }

  .bankCardList {
    width: 100%;
    height: auto;
    padding: 16px 15px 0;

    li {
      width: 100%;
      height: 125px;
      padding:10px 16px;
      margin-bottom: 16px;
      background-size: 100% 100%;
      background-image: url('../../../assets/gsyh.png');

      .bankCardCenter {
        width: 100%;
        height: auto;
        display: -webkit-flex;
        display: flex;

        .bankCardLogo {
          width: 32px;
          padding-top: 8px;
          margin-right: 16px;

          img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }
        }

        .bankCardName {
          width:267px;
          color: #ffffff;

          p:first-child {
            font-size: 15px;
            margin-bottom: 8px;
          }

          p:last-child {
            font-size: 12px;
          }
        }
      }

      .bankCardNum {
        width: 100%;
        margin-top: 24px;
        font-size: 18px;
        color: #ffffff;
        padding-left: 48px;
      }
    }
  }

  .addBankCard {
    width: 100%;
    position: fixed;
    bottom:16px;
    margin-top: 16px;
    text-align: center;

    button {
      background-color: #EA3323;
      border: none;
      color: #ffffff;
      font-size:15px;
      width:345px;
      height:40px;
    }
  }
}
</style>

