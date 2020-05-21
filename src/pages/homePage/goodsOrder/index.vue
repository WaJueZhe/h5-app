<template>
  <div class="goodsOrder-page">
    <div class="goodsOrder" v-if="VIPGoods != '1'">
      <div class="no-address" v-if="JSON.stringify(this.addressObj) == '{}'">
        <router-link to="/addressManagement?statusType=1">
          <span>请添加收货地址</span>
          <img src="@/assets/homePage/right.png" alt="">
        </router-link>
      </div>
      <div class="address" v-if="JSON.stringify(this.addressObj) != '{}'">
        <router-link to="/addressManagement?statusType=1">
          <div class="msg">
            <span>收货人：</span>
            <span class="name">{{ addressObj.name }}</span>
            <span class="phone">{{ addressObj.phone }}</span>
          </div>
          <div class="loc">
            <div class="pos"><img src="@/assets/homePage/pos_icon.png" alt=""></div>
            <span>{{ addressObj.addressHead }}{{ addressObj.addressTail }}</span>
            <div class="right"><img src="@/assets/homePage/right.png" alt=""></div>
          </div>
        </router-link>
      </div>
      <div class="bot"><img src="@/assets/homePage/border-img.png" alt=""></div>
    </div>
    <div class="order-group" v-if="goodsList.length > 0 && VIPGoods == undefined">
      <ul class="list">
        <li class="item" v-for="(item, index) in goodsList" :key="index">
          <div class="top">
            <div class="top-l"><img v-lazy="item.goodHeadPic" alt=""></div>
            <div class="top-r">
              <div class="tit">{{ item.goodTitle }}</div>
              <div class="text" v-if="item.skuAttrs.length > 0">
                <span v-for="(nav, nIndex) in item.skuAttrs" :key="nIndex">{{ nav.name }}：{{nav.value}}，</span>
              </div>
              <div class="price">
                <div class="money">￥{{ item.price | moneyFloat }}</div>
                <div class="sum">x{{item.goodNum}}</div>
              </div>
              <div class="after-sale" v-for="(s, sIdx) in item.svcAttrs" :key="sIdx">
                <div class="asle-msg">
                  <div class="sale-l">{{ '[' + s.name + ']' }} {{ s.value }}</div>
                  <div class="sale-r">￥{{ s.fee }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="nav-item" @click="devType(index)">
              <div class="nav-text">
                <span class="delivery">配送方式</span>
                <span class="type" v-if="!item.shipName" style="color: #999">请选择配送方式</span>
                <span class="type">{{ item.shipName }}</span>
                <!-- <span class="type" v-if="item.shipFee !== undefined">{{ item.shipName }}{{ '￥' + item.shipFee }}</span> -->
                <img class="img" src="@/assets/homePage/right.png" alt="">
              </div>
            </div>
            <div class="nav-item" @click="goInvoice(item, index)" v-if="item.canInvoice == '1'">
              <div class="nav-text">
                <span class="delivery">发票</span>
                <span class="type" v-if="item.invoiceId && item.invoiceId != '0'">纸质发票</span>
                <span class="type" v-else>不开发票</span>
                <img class="img" src="@/assets/homePage/right.png" alt="">
              </div>
            </div>
            <div class="nav-item">
              <div class="nav-text">
                <span class="delivery">订单备注</span>
                <input type="text" placeholder="选填" maxlength="80" ref="remark" @change="remarkChange(index)">
              </div>
            </div>
            <div class="huibei-box">
              <div class="huibei" v-if="item.depoint > 0">
                <div class="left-title">优惠</div>
                <div class="select">
                  <div class="selrct-text">可用{{ item.depoint || 0 }}惠呗抵用{{ item.depoint }}元</div>
                  <div class="selrct-icon" @click="changeChecked(item, index)">
                    <img v-if="item.checkResult" src="@/assets/homePage/checked-icon.png" alt="">
                    <img v-else src="@/assets/homePage/no-checked-icon.png" alt="">
                  </div>
                </div>
              </div>
              <div class="huibei" v-if="item.point > 0">
                <div class="left-title">福利</div>
                <div class="select">
                  <div class="selrct-text">赠送惠呗{{ item.point }}个</div>
                  <div class="selrct-icon">
                    <img src="@/assets/homePage/checked-icon.png" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="huibei" v-if="VIPGoods == '1'">
        <img src="@/assets/homePage/gift2.png" alt="">
        <span>福利</span>
        <div class="give">赠送{{ priceObj.totalPoint }}个惠呗</div>
      </div>
      <div class="huibei" v-if="priceObj.finalDepoint > 0 && point > 0">
        <img src="@/assets/homePage/hui-bai.png" alt="">
        <span>可用{{ priceObj.finalDepoint || 0 }}惠呗抵用{{ priceObj.finalYhAmount }}元</span>
        <div class="check">
          <van-checkbox v-model="checked" checked-color="#EA3323"></van-checkbox>
        </div>
      </div> -->
    </div>
    <div class="order-group" v-if="goodsList.length > 0 && VIPGoods == '1'">
      <ul class="list">
        <li class="item" v-for="(item, index) in goodsList" :key="index">
          <div class="top">
            <div class="top-l"><img :src="item.goodHeadPic" alt=""></div>
            <div class="top-r">
              <div class="tit">{{ item.goodTitle }}</div>
              <div class="text" v-if="item.skuAttrs.length > 0">
                <span v-for="(nav, nIndex) in item.skuAttrs" :key="nIndex">{{ nav.name }}：{{nav.value}}</span>
              </div>
              <div class="price">
                <div class="money">￥{{ item.price | moneyFloat }}</div>
                <div class="sum">x{{item.goodNum}}</div>
              </div>
              <div class="after-sale" v-for="(s, sIdx) in item.svcAttrs" :key="sIdx">
                <div class="asle-msg">
                  <div class="sale-l">{{ '[' + s.name + ']' }} {{ s.value }}</div>
                  <div class="sale-r">￥{{ s.fee }}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="huibei">
        <img src="@/assets/homePage/gift2.png" alt="">
        <span>福利</span>
        <div class="give">赠送{{ priceObj.totalPoint }}个惠呗</div>
      </div>
      <div class="huibei" v-if="priceObj.finalDepoint > 0 && point > 0">
        <img src="@/assets/homePage/hui-bai.png" alt="">
        <span>可用{{ priceObj.finalDepoint || 0 }}惠呗抵用{{ priceObj.finalYhAmount }}元</span>
        <div class="check">
          <van-checkbox v-model="checked" checked-color="#EA3323"></van-checkbox>
        </div>
      </div>
    </div>
    <div class="bot-btn">
      <van-submit-bar
        :price="priceObj.sumOfAmount | priceFormat"
        label='应付金额：'
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>

    <div class="no-order" v-if="goodsList.length <= 0">
      <img src="@/assets/noOrders.png" alt="">
      <div class="no-text">您还没有相关订单</div>
    </div>

    <!-- 配送方式 -->
    <div class="delivery-type">
      <van-popup v-model="isType" position="bottom">
         <div class="delivery-box">
          <div class="delivery-text">配送方式</div>
          <div class="d-list">
            <van-radio-group v-model="radio[selectIndex].radio">
              <!-- <van-radio :name="dev.shipWay" checked-color="#EA3323" v-for="( dev, devIndex ) in shipList[selectIndex]" :key="devIndex">{{ dev.shipName }} ￥{{dev.shipFee}}</van-radio> -->
              <van-radio :name="dev.shipWay" checked-color="#EA3323" v-for="( dev, devIndex ) in shipList[selectIndex]" :key="devIndex">{{ dev | expressPrice }}</van-radio>
            </van-radio-group>
          </div>
          <div class="d-btn" @click="comfig()">确认</div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from "@/models";
import sdk from '@/js/weixin.js';
import { Checkbox, CheckboxGroup, SubmitBar, RadioGroup, Radio, Toast, Dialog, Popup, Lazyload } from 'vant';

Vue.use(Checkbox).use(CheckboxGroup).use(SubmitBar).use(RadioGroup).use(Radio).use(Toast).use(Dialog).use(Popup).use(Lazyload)
export default {
  name: 'goodsOrder',
  data() {
    return {
      addressObj: {},//收货地址
      checked: false,
      fromData: sessionStorage.getItem('fromData'),
      info: {},
      goodsList: [],
      priceObj: {},
      radio: [{radio: ''}],
      //配送方式
      isType: false,
      devText: '快递 包邮',
      shipList: [],
      selectIndex: 0,

      //发票
      invoiceShow: false,

      //数据
      goodsObj: {
        tokenId: '',
        addressId: '',
        yfrom: 'direct',
        depoint: '0',
        goods: [],
      },
      goodsIndex: '',
      // depoint: '0',
      point: undefined,//当前账户惠呗量
      myPoint: undefined,//当前账户惠呗量 -- 为了计算用户手动勾选抵扣惠呗

      WXPayContentJson: {
        userId: '',
        payId: '',
        payAmount: '',
      },
      VIPGoods: '',//是否是会员升级，1是，0否
      ytype: '',//4--会员升级商品
      cardId: '0',//扫码获取提货卡后填入,没有填:0
      luckyUserId: '',

      selectRadio: '1',
    };
  },
  filters: {
    priceFormat(val){
      if(val == null || '') {
        return 0
      }
      return Number(val * 100)
    },
    expressPrice(val) {
      if(parseFloat(val.shipFee) == 0) {
        if (val.shipWay === '1') {
          return '包邮'
        }else if (val.shipWay === '2') {
          return '货到付款'
        }else {
          return val.shipName
        }
      }else {
        return val.shipName + '：' + val.shipFee + '元'
      }
    },
  },
  watch: {
    // checked() {
    //   if(this.checked) {
    //     this.depoint = this.priceObj.finalDepoint
    //     this.orderPrice()
    //   }else {
    //     this.depoint = '0'
    //     this.orderPrice()
    //   }
    // },
  },
  methods: {
    changeChecked (item, index) {
      if (item.checkResult) {
        item.checkResult = false
        this.point = this.point + Number(item.depoint) * item.goodNum
        this.orderPrice()
      }else if (!item.checkResult) {
        if (this.point -  Number(item.depoint) * item.goodNum > 0) {
          item.checkResult = true
          this.point = this.point - Number(item.depoint) * item.goodNum
          this.orderPrice()
        }else {
          item.checkResult = false
          Toast('可抵扣的惠贝数量不足')
        }
      }
    },
    init() {
      let fromData = JSON.parse(this.fromData)
      Models.Home
      .shopConfirm(fromData)
      .then(res => {
        if(res.data.code === '0') {
          this.info = res.data.info
          this.goodsList = res.data.info.goods
          this.priceObj = res.data.info.price
          this.goodsObj.tokenId = res.data.info.tokenId
          //如果有惠呗抵扣并且自己账户拥有惠呗，默认选上
          // if (this.priceObj.finalDepoint > 0 && this.point > 0) {
          // if (this.point > 0) {
          //   this.goodsList.forEach((nav, key) => {
          //     Vue.set(nav, 'checkResult', true)
          //   })
          //   this.orderPrice()
          // }
          this.goodsList.forEach((item, index)=> {
            if (this.point > 0 && this.point - Number(item.depoint) > 0) {
              Vue.set(item, 'checkResult', true)
              this.point = this.point - Number(item.depoint) * item.goodNum
            }
            item.invoiceId = '0'
            if(item.shipList.length > 0) {
              this.shipList.push(item.shipList);
              this.radio.push({radio: ''});
              if(item.shipList.length == 1){
                this.radio[index].radio = item.shipList[0].shipWay;
                // item.shipName = this.shipList[index][this.radio[index].radio-1].shipName;
                // item.shipWay =  this.shipList[index][this.radio[index].radio-1].shipWay;
                // if (parseInt(this.shipList[index][this.radio[index].radio-1].shipFee) == 0) {
                //   if (this.shipList[index][this.radio[index].radio-1].shipWay === '1') {
                //     item.shipName = '包邮'
                //     item.shipWay = this.shipList[index][this.radio[index].radio-1].shipWay
                //   }else if(this.shipList[index][this.radio[index].radio-1].shipWay === '2') {
                //     console.log(this.shipList[index][this.radio[index].radio-1].shipWay)
                //     item.shipName = '货到付款'
                //     item.shipWay = this.shipList[index][this.radio[index].radio-1].shipWay
                //   }
                // }else {
                //   item.shipName = this.shipList[index][this.radio[index].radio-1].shipName + '：' + this.shipList[index][this.radio[index].radio-1].shipFee + '元'
                //   item.shipWay = this.shipList[index][this.radio[index].radio-1].shipWay
                // }
                if (parseInt(item.shipList[0].shipFee) == 0) {
                  if (item.shipList[0].shipWay === '1') {
                    item.shipName = '包邮'
                    item.shipWay = item.shipList[0].shipWay
                  }else if(item.shipList[0].shipWay === '2') {
                    item.shipName = '货到付款'
                    item.shipWay = item.shipList[0].shipWay
                  }
                }else {
                  item.shipName = this.shipList[index][this.radio[index].radio-1].shipName + '：' + this.shipList[index][this.radio[index].radio-1].shipFee + '元'
                  item.shipWay = this.shipList[index][this.radio[index].radio-1].shipWay
                }
                // if (this.shipList[index][this.radio[index].radio-1].shipFee > 0) {
                //   item.shipFee = this.shipList[index][this.radio[index].radio-1].shipFee;
                // }
                this.orderPrice()
              }
            }
          })
        }else {
          Toast(res.data.msg)
        }
      })
    },
    //获取账户惠呗
    getBalanceMoney() {
      Models.User
      .getBalance()
      .then(res => {
        if (res.data.code === '0') {
          this.point = Number(res.data.info.point)
          this.myPoint = Number(res.data.info.point)
        }
      })
    },
    //获取默认地址
    getAddress() {
      Models.Home
      .getDefault()
      .then(res => {
        // this.addressObj = JSON.parse(sessionStorage.getItem('address')) || res.data.info
        this.addressObj = res.data.info
      })
    },
    //订单询价
    orderPrice() {
      this.goodsObj = {}
      this.goodsObj.goods = []
      this.goodsObj.tokenId = '0'
      this.goodsObj.addressId = '0'
      this.goodsObj.yfrom = 'direct'
      this.goodsObj.cardId = this.cardId || '0'
      let svcs = []
      let depoint = 0
      for(let i = 0; i < this.goodsList.length; i++) {
        if (!this.goodsList[i].checkResult) {
          depoint = 0
        }else {
          depoint = this.goodsList[i].depoint * this.goodsList[i].goodNum
        }
        if(this.goodsList[i].svcAttrs.length > 0) {
          for(let k = 0; k < this.goodsList[i].svcAttrs.length; k++) {
            svcs.push(this.goodsList[i].svcAttrs[k].svcId)
            let a = {
              cartId: this.goodsList[i].cartId,
              skuId: this.goodsList[i].skuId,
              num: this.goodsList[i].goodNum,
              invoiceId: this.goodsList[i].invoiceId,
              shipWay: this.goodsList[i].shipWay,
              svcs: svcs,
              remark: '',
              depoint: depoint
            }
            this.goodsObj.goods.push(a)
          }
        }else {
          let a = {
            cartId: this.goodsList[i].cartId,
            skuId: this.goodsList[i].skuId,
            num: this.goodsList[i].goodNum,
            invoiceId: this.goodsList[i].invoiceId,
            shipWay: this.goodsList[i].shipWay,
            svcs: svcs,
            remark: '',
            depoint: depoint
          }
          this.goodsObj.goods.push(a)
        }
      }
      Models.Home
      .orderPreSettle(this.goodsObj)
      .then(res => {
        if(res.data.code === '0') {
          this.priceObj.sumOfAmount = res.data.info.sumOfAmount
        }
      })
    },
    //提交订单
    onSubmit() {
        if(JSON.stringify(this.addressObj) == '{}' && this.VIPGoods != '1') {
          Toast('请选择收货地址')
          return false
        }
        this.goodsObj = {}
        this.goodsObj.goods = []
        this.goodsObj.tokenId = this.info.tokenId
        this.goodsObj.addressId = this.addressObj.addressId
        this.goodsObj.yfrom = 'direct'
        this.goodsObj.cardId = this.cardId || '0'
        if (this.luckyUserId > 0) {
          this.goodsObj.luckyUserId = this.luckyUserId
        }
        let svcs = []
        let depoint = 0
        for(let i = 0; i < this.goodsList.length; i++) {
          if (!this.goodsList[i].checkResult) {
            depoint = 0
          }else {
            depoint = this.goodsList[i].depoint * this.goodsList[i].goodNum
          }
          if(this.VIPGoods != '1') {//普通商品
            if(this.goodsList[i].shipWay === undefined || this.goodsList[i].shipWay === '') {
              Toast('请选择配送方式')
              return false
            }
            if(this.goodsList[i].svcAttrs.length > 0) {
              for(let j = 0; j<this.goodsList[i].svcAttrs.length; j++) {
                svcs.push(this.goodsList[i].svcAttrs[j].svcId)
                let a = {
                  cartId: this.goodsList[i].cartId,
                  skuId: this.goodsList[i].skuId,
                  num: this.goodsList[i].goodNum,
                  invoiceId: this.goodsList[i].invoiceId,
                  shipWay: this.goodsList[i].shipWay,
                  svcs: svcs,
                  remark: this.goodsList[i].remark || '',
                  depoint: depoint
                }
                this.goodsObj.goods.push(a)
              }
            }else {
              let a = {
                cartId: this.goodsList[i].cartId,
                skuId: this.goodsList[i].skuId,
                num: this.goodsList[i].goodNum,
                invoiceId: this.goodsList[i].invoiceId,
                shipWay: this.goodsList[i].shipWay,
                svcs: svcs,
                remark: this.goodsList[i].remark || '',
                depoint: depoint
              }
              this.goodsObj.goods.push(a)
            }
          }else {//会员升级的商品
            this.goodsObj.addressId = ''//如果是会员升级的商品，不用选择默认地址
            if(this.goodsList[i].svcAttrs.length > 0) {
              for(let j = 0; j<this.goodsList[i].svcAttrs.length; j++) {
                svcs.push(this.goodsList[i].svcAttrs[j].svcId)
                let a = {
                  cartId: this.goodsList[i].cartId,
                  skuId: this.goodsList[i].skuId,
                  num: this.goodsList[i].goodNum,
                  invoiceId: this.goodsList[i].invoiceId,
                  shipWay: this.goodsList[i].shipWay,
                  svcs: svcs,
                  remark: this.goodsList[i].remark || '',
                  depoint: depoint
                }
                this.goodsObj.goods.push(a)
              }
            }else {
              let shipWay = '0'
              if(this.goodsList[i].hasShip == '1') {
                shipWay = this.goodsList[i].shipList[0].shipWay
              }
              let a = {
                cartId: this.goodsList[i].cartId,
                skuId: this.goodsList[i].skuId,
                num: this.goodsList[i].goodNum,
                invoiceId: this.goodsList[i].invoiceId,
                shipWay: shipWay,
                svcs: svcs,
                remark: this.goodsList[i].remark || '',
                depoint: depoint
              }
              this.goodsObj.goods.push(a)
            }
          }
        }
        Models.Home
        .submit(this.goodsObj)
        .then(res => {
          if(res.data.code === '0') {
            this.WXPayContentJson.userId = res.data.info.userId
            this.WXPayContentJson.payId = res.data.info.payId
            this.WXPayContentJson.payAmount = res.data.info.payAmount
            this.$router.replace({
              name: 'orderPay',
              query: {
                totalAmount: this.priceObj.totalAmount,
                userId: this.WXPayContentJson.userId,
                payId: this.WXPayContentJson.payId,
                payAmount: this.WXPayContentJson.payAmount,
                ytype: this.ytype
              }
            })
          }else if(res.data.code === '20933') {
            sessionStorage.setItem('fromData', '')
            Toast(res.data.msg)
          }else {
            Toast(res.data.msg)
          }
        })
    },
    goInvoice(item, index) {
      this.$router.push({
        name: 'openInvoice',
        query: {
          number: index,
          invoiceId: item.invoiceId
        }
      })
    },
    //配送方式
    devType(index) {
      this.selectIndex = index;
      this.goodsIndex = index;
      this.isType = true
    },
    //配送方式确定按钮
    comfig() {
      this.isType = false;
      this.goodsList[this.goodsIndex].shipWay = this.radio[this.selectIndex].radio;
      this.shipList[this.selectIndex].forEach(((item, idx)=>{
        if( item.shipWay == this.radio[this.selectIndex].radio){
          if(parseFloat(item.shipFee) == 0) {
            if (item.shipWay === '1') {
              this.goodsList[this.selectIndex].shipName = '包邮'
            }else if (item.shipWay === '2') {
              this.goodsList[this.selectIndex].shipName = '货到付款'
            }else {
              this.goodsList[this.selectIndex].shipName = item.shipName
            }
          }else {
            // this.goodsList[this.selectIndex].shipName = item.shipName + '￥' + item.shipFee
            this.goodsList[this.selectIndex].shipName = item.shipName + '：' + item.shipFee + '元'
            // this.goodsList[this.selectIndex].shipFee = item.shipFee
          }
        }
      }))
      this.orderPrice()
    },
    onClickLeft() {
      this.invoiceShow = false
    },
    remarkChange(idx){
      this.goodsList[idx].remark = this.$refs.remark[idx].value;
    },
  },
  computed: {

  },
  created() {
    this.VIPGoods = this.$route.query.VIPGoods
    this.ytype = this.$route.query.ytype
    this.cardId = this.$route.query.cardId
    this.luckyUserId = this.$route.query.luckyUserId; // 抽奖提货卡id
    this.init()
  },
  activated() {
    this.getBalanceMoney()
    if (JSON.parse(sessionStorage.getItem('address')) != null) {
      this.addressObj = JSON.parse(sessionStorage.getItem('address'))
    }else {
      this.getAddress()
    }
    if(sessionStorage.getItem('number') != null && sessionStorage.getItem('number') >= 0) {
      this.goodsList[sessionStorage.getItem('number')].invoiceId = sessionStorage.getItem('invoiceId')
    }
  },
  mounted() {
  },
  components: {
  },
};
</script>

<style lang="less">
.goodsOrder-page {
  width: 100%;
  height: 100%;

  .goodsOrder {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    height: 70px;
    background-color: #fff;
    overflow: hidden;

    .no-address {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      > a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        > span {
          position: absolute;
          top: 50%;
          left: 40px;
          transform: translateY(-50%);
          font-size: 15px;
          color: #0F050B;
        }

        > img {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          width: 9px;
          height: 16px;
        }
      }
    }

    .address {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      > a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .msg {
          padding-left: 35px;
          margin-top: 15px;
          width: 100%;
          width: 100%;
          font-size: 15px;
          font-weight: bold;
          color: #0F050B;

          .phone {
            padding-left: 15px;
          }

        }

        .loc {
          position: relative;
          padding: 0 15px;
          width: 100%;
          height: 20px;

          .pos {
            position: absolute;
            top: 0;
            left: 15px;
            width: 15px;
            height: 100%;

            > img {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 15px;
              height: 15px;
            }
          }

          > span {
            position: absolute;
            top: 50%;
            left: 32px;
            transform: translateY(-50%);
            font-size: 12px;
            color: #0F050B;
          }

          .right {
            position: absolute;
            top: 54%;
            right: 16px;
            transform: translateY(-50%);
            width: 6px;
            height: 12px;
          }
        }
      }
    }

    .bot {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .order-group {
    padding-bottom: 60px;
    width: 100%;

    .list {
      width: 100%;

      .item {
        margin-bottom: 8px;
        width: 100%;
        // background-color: #fff;

        &:last-child {
          margin-bottom: 0;
        }

        .top {
          position: relative;
          padding: 15px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          background-color: #fff;

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

          .top-l {
            width: 80px;
            height: 80px;
            border-radius: 4px;

            > img {
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }
          }

          .top-r {
            padding-left: 15px;
            flex: 1;
            height: 100%;

            .tit {
              font-size: 12px;
              color: #333;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
            }

            .text {
              margin-top: 10px;
              width: 100%;
              font-size: 12px;
              color: #999;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
            }

            .price {
              margin-top: 2px;
              width: 100%;
              height: 20px;
              font-size: 15px;
              display: flex;

              .money {
                color: #EA3323;
              }

              .sum {
                padding-left: 20px;
                color: #999;
              }
            }

            .after-sale {
              width: 100%;

              .asle-msg {
                margin-top: 14px;
                width: 100%;
                display: flex;
                justify-content: space-between;

                .sale-l {
                  font-size: 12px;
                }

                .sale-r {
                  font-size: 12px;
                }
              }
            }
          }
        }

        .content {
          width: 100%;

          .nav-item {
            padding: 0 15px;
            width: 100%;
            height: 44px;
            background-color: #fff;

            &:last-child {
              .nav-text {
                border-bottom: none;
              }
            }

            .nav-text {
              position: relative;
              width: 100%;
              height: 44px;
              font-size: 15px;
              overflow: hidden;

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

              .delivery {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
              }

              .type {
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
              }

              .img {
                position: absolute;
                top: 50%;
                right: 0px;
                transform: translateY(-50%);
                width: 6px;
                height: 12px;
              }

              > input {
                position: absolute;
                top: 50%;
                left: 80px;
                transform: translateY(-50%);
                width: 74%;
                background-color: #fff;
              }
            }
          }

          .huibei-box {
            margin-top: 8px;
            width: 100%;
            background-color: #fff;

            .huibei {
              padding: 0 15px;
              width: 100%;
              display: flex;
              justify-content: space-between;

              &:last-child {
                .select {
                  border-bottom: none;
                }
              }

              .left-title {
                padding: 10px 3px 10px 0;
                font-size: 15px;
                color: #333;
                text-align: right;
              }

              .select {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #EAEAEA;

                .selrct-text {
                  flex: 1;
                  font-size: 13px;
                  text-align: right;
                  color: #333;
                }

                .selrct-icon {
                  margin-left: 10px;
                  width: 18px;
                  height: 100%;
                  border-radius: 50%;
                  overflow: hidden;
                  display: flex;
                  align-items: center;

                  > img {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                  }
                }

                // .van-checkbox, .van-radio {
                //   position: relative;
                //   height: 100%;

                //   .van-checkbox__icon, .van-radio__icon {
                //     position: absolute;
                //     right: 0;
                //   }

                //   .van-checkbox__label, .van-radio__label {
                //     position: absolute;
                //     right: 35px;
                //     margin-left: 0;
                //     font-size: 14px;
                //   }
                // }
              }
            }
          }
        }
      }
    }

    .huibei {
      position: relative;
      padding: 10px 15px;
      margin-top: 10px;
      width: 100%;
      height: 42px;
      background-color: #fff;

      > img {
        position: absolute;
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
      }

      > span {
        position: absolute;
        top: 50%;
        left: 36px;
        transform: translateY(-50%);
        font-size: 15px;
      }

      .give {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        font-size: 15px;
        color: #EA3323;
      }

      .check {
        position: absolute;
        top: 10px;
        right: 15px;
        height: 22px;

        .van-checkbox {
          width: 100%;
          height: 100%;
          overflow: visible;

          .van-checkbox__icon {
            display: block;
            height: 100%;
            text-align: right;

            > i {
              vertical-align: top
            }
          }
        }
      }
    }
  }

  .no-order {
    width: 100%;

    > img {
      margin: auto;
      margin-top: 46px;
      width: 90px;
      height: 100px;
    }

    .no-text {
      margin-top: 8px;
      font-size: 18px;
      color: #999;
      text-align: center;
    }
  }

  .bot-btn {
    width: 100%;
  }

  .delivery-type {
    width: 100%;

    .delivery-box {
      padding: 25px 15px 0 15px;
      width: 100%;
      height: 300px;
      background-color: #fff;
      z-index: 9999;

      .delivery-text {
        font-size: 16px;
        text-align: center;
        color: #333;
      }

      .d-list {
        width: 100%;
        font-size: 15px;

        .van-radio-group {
          .van-radio {
            position: relative;
            padding: 15px 0;
            border-bottom: 1px solid #EAEAEA;

            &:last-child {
              border-bottom: none;
            }
            .van-radio__icon {
              position: absolute;
              right: 0;
            }
            .van-radio__label {
              width: 91%;
            }
          }
        }
      }

      .d-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 15px 0;
        width: 100%;
        font-size: 15px;
        text-align: center;
        color: #fff;
         /*! autoprefixer: off */
        background: -webkit-linear-gradient(right, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法（必须放在最后） */
        /* autoprefixer: on */
      }
    }
  }
};
</style>
