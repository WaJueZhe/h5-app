<template>
  <div class="bindingBankCard">
    <div class="bindingBankCardTitle">请绑定持卡人本人的银行卡</div>
    <div class="editBankCenter">
      <div class="bankCell">
        <div class="bankCellTitle">
          <span>卡号</span>
        </div>
        <div class="bankCellInput">
          <input type="text" v-model="formData.bankNO" placeholder="请输入借记卡号"/>
        </div>
      </div>
      <div class="bankCell" @click="chooseBank()">
        <div class="bankCellTitle">
          <span>银行</span>
        </div>
        <div class="bankCellInput">
          <input type="text" v-model="bankName" readonly placeholder="请选择银行"/>
        </div>
        <div>
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="bankCell">
        <div class="bankCellTitle">
          <span>手机号</span>
        </div>
        <div class="bankCellInput">
          <input type="text" v-model="formData.mobile" placeholder="请输入手机号"/>
        </div>
      </div>
      <div class="bankCell">
        <div class="bankCellTitle">
          <span>验证码</span>
        </div>
        <div class="bankCellInput">
          <input type="text" v-model="formData.code" placeholder="请输入验证码"/>
        </div>
        <div class="getCode">
          <button :class="[ acccc ]" @click="getCode()" :disabled="codeDisabled">{{codeMsg}}</button>
        </div>
      </div>
    </div>
    <div class="next">
      <button class="clickBtn" @click="addBankCard()">下一步</button>
    </div>
    <div class="selectBankPopup" v-show="show">
      <div class="selectBankHeader">
        <div class="selectBankHeaderTitle">
          <div class="go-back" @click="onClickLeft" ><van-icon name="arrow-left" size="22px"/></div>
          <div class="title">选择银行</div>
        </div>
        <div class="searchBankInput">
          <input type="text" v-model="selectBank" placeholder="搜索银行卡">
        </div>
      </div>
      <div class="selectBankWindow">
        <div class="anyOneBank" @click="selectYourBank(data.id,data.bankName)" v-for="(data,index) in theBankList" :key="index">{{data.bankName}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { Cell, CellGroup,Toast,Icon,Field } from 'vant';
  import Models from '@/models';
  Vue.use(Cell).use(CellGroup).use(Toast).use(Icon).use(Field);
  export default {
    name:"bindingBankCard",
    data () {
      return {
        acccc:"red",
        // 是否禁用按钮
        codeDisabled: false,
        // 倒计时秒数
        countdown: 60,
        // 定时器
        timer: null,
        codeMsg: '发送验证码',
        titleName:"添加银行卡",
        bankName:"",
        formData:{
          id:"0",
          bankId:"",
          bankNO:"",
          idName:"",
          idNO:"",
          mobile:localStorage.phone,
          code:""
        },
        show:false,
        selectBank:"",
        allBankList:[],
      }
    },
    computed:{
      theBankList () {
        if ( this.selectBank.length === 0 ) {
          return this.allBankList;
        }else {
          let arr = [];
          let aLength = this.allBankList.length;
          for ( let g = 0; g < aLength ; g++ ) {
            if ( this.allBankList[g].bankName.indexOf(this.selectBank) !== -1 ) {
              arr.push(this.allBankList[g]);
            }
          }
          return arr;
        }
      }
    },
    methods:{
      myFirstBank () {
        Models.User
          .getUserIdentify()
          .then( res => {
            if ( res.data.code == 0 ) {
              this.formData.idName = res.data.info.idName;
              this.formData.idNO = res.data.info.idNumber;
            }else {
            }
          })
      },

      //获取银行列表
      bankList () {
        Models.User
          .getBankList()
          .then( res => {
            if ( res.data.code == 0 ) {
              this.allBankList = res.data.info.list;
            }
          })
      },

      checkData () {
        for ( let a in this.formData ) {
          if ( this.formData[a].length === 0 ) {
            return false;
          }
        }
        return true;
      },

      addBankCard () {
        if ( this.checkData() ) {
          Models.User
            .saveMyBank(this.formData)
            .then(res => {
              if ( res.data.code == 0 ) {
                this.$router.go(-1);
              }else {
                Toast(res.data.msg);
              }
            })
        }else {
          Toast("请填写全部信息");
        }
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
        if ( !reg.test(this.formData.mobile)  ) {
          Toast('请输入正确的手机号码')
        }else {
          if(!this.timer) {
            this.acccc = "ddd";
            this.codeMsg = `${this.countdown}s`;
            this.codeDisabled = true;
            this.time();
            let data = {
              phone: this.formData.mobile,
              vcat:"bankBind"
            };
            Models.User
              .code(data)
              .then(res => {
                if(res.code == 0) {
                  Toast('发送成功')
                }
              })
          }
        }
      },

      chooseBank () {
        this.show = true;
      },

      onClickLeft () {
        this.show = false;
      },

      selectYourBank (id,name) {
        this.bankName = name;
        this.formData.bankId = id;
        this.show = false;
      }
    },
    components : {
    },
    watch : {
      selectBank () {

      }
    },
    created () {
      this.myFirstBank();
      this.bankList();
    }
  }
</script>
<style lang="less" scoped>
  .bindingBankCard {
    width: 100%;

    .editBankCenter {
      width:100%;
      height:auto;
      background: #ffffff;

      .bankCell {
        width: 100%;
        height:47px;
        font-size: 15px;
        display: flex;
        padding: 0 15px;
        align-items: center;
        display:-webkit-flex;
        border-bottom:1px solid #EAEAEA;

        .bankCellTitle {
          flex-basis: 76px;
          flex-shrink: 0;
          height:auto;
          color:#333333;
        }

        .bankCellInput {
          width: 100%;
          color:#999999;
        }

        .getCode {
          flex-basis: 78px;
          flex-shrink: 0;
          height:auto;

          button {
            width: 100%;
            height:28px;
            font-size:12px;
            border:none;
            color:#ffffff;
            border-radius:8px;
          }
        }
      }
    }

    .bindingBankCardTitle {
      width: 100%;
      height: 46px;
      font-size: 15px;
      color: #333333;
      text-align: center;
      line-height: 46px;
      font-weight: 500;
      background-color: #F5F5F5;
    }

    .clickBtn {
      background-color: #EA3323;
      border: none;
      border-radius:8px;
      color: #ffffff;
    }

    .next {
      width: 100%;
      margin-top: 16px;
      text-align: center;

      button {
        border-radius: 0;
        font-size:15px;
        width:345px;
        height:40px;
      }
    }

    .red {
      background-color: #EA3323;
    }

    .ddd {
      background-color: #dddddd;
    }

    .selectBankPopup {
      width:100%;
      height:100%;
      top: 0;
      left: 0;
      z-index: 999;
      overflow: auto;
      position: fixed;
      background: #FFFFFF;

      .selectBankHeader {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #ffffff;

        .selectBankHeaderTitle {
          height: 45px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #faf9f9;

          .go-back {
            left:0;
            height:auto;
            position: absolute;
            padding:0 15px ;
            z-index: 5;
          }

          .title {
            width: 100%;
            text-align: center;
            position: relative;
            font-size: 20px;
            color: #333;
          }
        }

        .searchBankInput {
          width: 100%;
          height: auto;
          font-size: 0;
          padding: 0 36px 10px;

          input {
            width: 100%;
            height:30px;
            font-size: 12px;
            padding: 0 15px;
            border-radius:30px;
            background:#f2f2f2  ;
          }
        }
      }

      .selectBankWindow {
        width: 100%;
        height:auto;
        padding-left: 15px;
        background:#FFFFFF;

        .anyOneBank {
          width: 100%;
          height:51px;
          line-height: 50px;
          font-size: 15px;
          color:#333333;
          border-bottom:1px solid #EAEAEA;
        }
      }
    }
  }
</style>

