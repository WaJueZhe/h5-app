<template>
  <div class="returnFlow-page">
    <div class="productList">
      <ul class="list">
        <li class="item">
          <div class="anyOneProduct">
            <div class="productImg">
              <img :src="good.goodPic" alt="">
            </div>
            <div class="productContent">
              <p class="productName">{{ good.goodTitle }}</p>
              <p class="productStyle">
                <span v-for="(item, index) in good.skuAttrs" :key="index">{{item.name}}:{{item.value}}</span>
              </p>
              <p class="productMenoy">数量：{{ good.goodNum }}</p>
            </div>
          </div>
          </li>
        </ul>
    </div>

    <div class="logistics">
      <ul class="l-list">
        <li class="l-item">
          <div class="title">物流单号</div>
          <div class="input">
            <input type="text" v-model="logisticsCode" placeholder="填写或扫描物流单号">
          </div>
          <div class="icon" @click="scan">
            <img src="@/assets/user/search_icon.png" alt="">
          </div>
        </li>
        <li class="l-item" @click="shouPup">
          <div class="title">物流公司</div>
          <div class="desc-text" v-if="logisticsCompany == '请选择物流公司'">请选择物流公司</div>
          <div class="desc-text" v-else>{{ logisticsCompany }}</div>
          <div class="right-icon">
            <van-icon name="arrow" size="16px" color="#999999"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="user-phone">
      <div class="title">联系电话</div>
      <div class="input">
        <input type="text" v-model="phone" :maxlength="11" placeholder="填写联系电话">
      </div>
    </div>
    <div class="submit" @click="submit">提交</div>
    <!-- <van-popup v-model="show" position="bottom" :overlay="true" class="selectCpy">
      <van-picker show-toolbar title="选择物流快递" :columns="columns" @cancel="onCancel" @confirm="onConfirm" @change="onChange" />
    </van-popup> -->

    <van-popup v-model="show" position="bottom" :overlay="true" @click-overlay="overlay" class="selectCpy">
      <div class="popupTitle">
        <div class="cancle" @click="cancel">取消</div>
        <div class="cancle">选择物流快递</div>
        <div class="cancle" @click="onConfirm">确定</div>
      </div>
      <div class="radioDiv">
        <van-radio-group v-model="companyCode" >
          <van-radio checked-color="#EA3323" v-for="(item,index) in columns" :key="index" :name="item.keyId">
            <span>{{ item.text }}</span>
          </van-radio>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import { Icon, Popup, Picker, Toast, Cell, CellGroup, RadioGroup, Radio, } from 'vant';
Vue.use(Icon).use(Popup).use(Picker).use(Toast).use(Cell).use(CellGroup).use(RadioGroup).use(Radio);
export default {
  name: 'returnFlow',
  data() {
    return {
      refundId: '',
      good: {},
      mssage: '选择物流快递',
      show: false,
      columns: [],
      logisticsCode: '',//物流单号
      logisticsCompany: '请选择物流公司',//物流公司名称
      logisticsCompanyCode: '',//物流公司id
      phone: localStorage.getItem('phone') || '',//联系电话
      companyCode: '',//选择物流公司时候的id
    };
  },
  watch: {

  },
  methods: {
    init () {
      let data = {
        id: this.refundId
      }
      Models.User
      .detail(data)
      .then(res => {
        if(res.data.code == '0') {
          this.info = res.data.info
          this.good = res.data.info.good
        }else {
          Toast(res.data.msg)
        }
      })
    },
    scan () {
      let that = this
       wx.ready(() => {
         wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: (res) => {
              var result = res.resultStr; //扫码返回的结果
              that.logisticsCode = result
            }
         })
       })
    },
    //获取物流公司列表
    obtainKdlist () {
      Models.User
      .kdlist()
      .then(res => {
        if(res.data.code === '0') {
          this.columns = res.data.info.list
          for(let i = 0; i < this.columns.length; i++) {
            this.columns[i].text = this.columns[i].name
            delete this.columns[i].name
            this.columns[i].keyId = this.columns[i].id
            delete this.columns[i].id
          }
        }
      })
    },
    //提交
    submit () {
      if (this.logisticsCode === '') {
        Toast('请填写或扫描物流单号')
        return
      }else if (this.logisticsCompanyCode === '') {
        Toast('请选择物流公司')
        return
      }else if (this.phone === '') {
        Toast('请填写联系电话')
        return
      }
      let data = {
        refundId: this.refundId,
        code: this.logisticsCompanyCode,
        refundExpressNumber: this.logisticsCode,
        phone: this.phone
      }
      Models.User
      .refundexpress(data)
      .then(res => {
        if(res.data.code === '0') {
          this.$router.go(-1)
        }else {
          Toast(res.data.msg)
        }
      })
    },
    // onChange (picker, value, index) {
    //   this.mssage = value
    // },
    // onCancel () {
    //   this.show = false
    // },
    // onConfirm (picker, value, index) {
    //   this.show = false
    //   this.logisticsCompany = picker.text
    //   this.logisticsCompanyCode = picker.code
    // },
    //点击遮罩层
    overlay () {
      this.cancel()
    },
    //取消选择
    cancel () {
      this.show = false
      if (this.companyCode != this.logisticsCompanyCode) {
        this.companyCode = this.logisticsCompanyCode
      }
      for (let i = 0; i < this.columns.length; i++) {
        if (this.logisticsCompanyCode == this.columns[i].keyId) {
          this.logisticsCompanyCode = this.columns[i].code
        }
      }
    },
    //确定物流公司
    onConfirm () {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.companyCode == this.columns[i].keyId) {
          this.logisticsCompany = this.columns[i].text
          this.logisticsCompanyCode = this.columns[i].code
          this.show = false
        }
      }
    },
    //选择物流公司
    shouPup () {
      this.show = true
      for (let i = 0; i < this.columns.length; i++) {
        if (this.logisticsCompanyCode == this.columns[i].code) {
          this.logisticsCompanyCode = this.columns[i].keyId
        }
      }
    },
    tabReasonText (item) {

    }
  },
  computed: {

  },
  created() {
    this.refundId = this.$route.query.refundId
    this.init()
    this.obtainKdlist()
    let url = window.location.href.split('#')[0]
    sdk.getJSSDK(url);
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.returnFlow-page {
  width: 100%;

  .productList {
    width: 100%;
    height: auto;
    padding:15px 16px;
    background-color: #fff;

    .list {
      width: 100%;

      .item {
        width: 100%;
        height: auto;

        .anyOneProduct {
          width: 100%;
          height:auto;
          display: flex;
          display: -webkit-flex;

            div {
            -webkit-box-flex: 1;

            &.productImg {
              flex-basis: 88px;
              flex-shrink:0;
              height: 88px;
              margin-right: 16px;

              img {
                width: 88px;
                height: 88px;
              }
            }

            &.productContent {

              p.productName {
                font-size: 12px;
                color:#333;
                margin-bottom: 6px;
              }

              p.productStyle {
                font-size: 12px;
                color:#999;
                margin-bottom: 6px;
              }

              p.productMenoy {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }
  }

  .logistics {
    padding-left: 15px;
    margin-top: 10px;
    width: 100%;
    background-color: #fff;

    .l-list {
      width: 100%;

      .l-item {
        position: relative;
        padding: 12px 0;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;

        &::after {
          display: block;
          clear: both;
          content: ' ';
        }

        &:first-child {
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

        .title {
          font-size: 15px;
          color: #333;
        }

        .input {
          margin-left: 16px;
          width: 230px;
          height: 20px;
          font-size: 15px;
          color: #999;
          overflow: hidden;
          display: flex;
          align-items: center;

          > input {
            width: 100%;
            height: 100%;
          }
        }

        .desc-text {
          float: left;
          margin-left: 16px;
          width: 250px;
          font-size: 15px;
          color: #999;
          text-align: right;
        }

        .icon {
          position: absolute;
          right: 15px;
          padding-left: 10px;
          width: 30px;
          height: 20px;
          text-align: right;
        }

        .right-icon {
          position: absolute;
          right: 15px;
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .user-phone {
    padding: 12px 15px;
    margin-top: 10px;
    width: 100%;
    background-color: #fff;

    &::after {
      display: block;
      clear: both;
      content: ' ';
    }

    .title {
      float: left;
      font-size: 15px;
      color: #333;
    }

    .input {
      float: left;
      margin-left: 16px;
      width: 230px;
      height: 20px;
      font-size: 15px;
      color: #999;
      overflow: hidden;

      > input {
        width: 100%;
        height: 100%;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 15px 0;
    width: 100%;
    font-size: 16px;
    text-align: center;
    background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
    color: #fff;
  }

  .selectCpy {
    width: 100%;

    .popupTitle {
      padding: 15px;
      display: flex;
      justify-content: space-between;

      .cancle {
        font-size: 15px;
        color: #333;

        &:last-child {
          color: #EA3323
        }
      }
    }
    .radioDiv {
      width: 100%;
      min-height:274px;
      max-height:324px;
      overflow: auto;
      font-size: 15px;

      .van-radio-group {
        .van-radio {
          position: relative;
          padding: 10px 15px;
          overflow: hidden;
          display: inherit;

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

          &:last-child {
            border-bottom: none;
          }

           &::after {
            display: block;
            clear: both;
            content: ' ';
          }

          .van-radio__icon {
            float: right;
            margin-top: 4px;
          }

          .van-radio__label {
            margin-left: 0;
            width: 91%;
            line-height: 28px;
          }
        }
      }

      // .van-radio-group {
      //   .van-cell-group {
      //     .van-cell {
      //       .van-cell__title {
      //         flex: 1;
      //       }
      //       .van-cell__value {
      //         flex: inherit;
      //         float: right;
      //         width: 20px;
      //       }
      //     }
      //   }
      // }
    }
  }
};
</style>
