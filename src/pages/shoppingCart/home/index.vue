<template>
  <div class="shoppingCart">
    <div class="editShoppingCart" v-if="shoppingCartList.length !== 0">
      <span v-if="deleteOrBuy" @click="tabMode()">编辑</span>
      <span v-if="!deleteOrBuy" @click="tabMode()">完成</span>
    </div>
    <div class="shoppingCartList" v-if="shoppingCartList.length !== 0">
      <div class="anyTheOrder" v-for="(data,index) in shoppingCartList " :key="index">
        <div class="theOrder" >
          <div class="optionBtn">
            <!--正常商品的选择框-->
            <van-icon
              v-if="data.ystatus == 1"
              :color="buyListIndex.indexOf(data.skuId) === -1 ? '#999999' : '#EA3323'"
              :name="buyListIndex.indexOf(data.skuId) === -1 ? 'circle' : 'checked'"
              size="24px"
              @click="addGoods(data.skuId,data)" />
            <!--已下架或者不存在的商品在编辑莫斯的选择框-->
            <van-icon
              v-if="(data.ystatus == -1 || data.ystatus == 0) && !deleteOrBuy"
              :color="buyListIndex.indexOf(data.skuId) === -1 ? '#999999' : '#EA3323'"
              :name="buyListIndex.indexOf(data.skuId) === -1 ? 'circle' : 'checked'"
              size="24px"
              @click="addGoods(data.skuId,data)" />
            <!--已下架或者不存在的商品在结算模式的显示文字-->
            <span v-if="(data.ystatus == -1 || data.ystatus == 0) && deleteOrBuy" style="display: inline-block;background-color: #E3E3E3;width:40px;height:23px;line-height:23px;border-radius:23px;color:#666666;font-size: 12px;">失效</span>
          </div>
          <div class="goodCentent">
            <!--正常商品-->
            <div class="goodInformation" v-if="data.ystatus == 1">
              <!-- 普通商品 -->
              <router-link v-if="data.ytype === '1' || data.ytype === '2' || data.ytype === '3'" :to="{ name: 'goodsDetails', query: { goodId: data.goodId } }">
                <div class="goodImg">
                  <img :src="data.goodHeadPic" alt="">
                </div>
                <div class="goodText">
                  <div class="goodName">{{data.goodTitle}}</div>
                  <div class="goodSpecification">
                    <span v-for="(sku,skuIndex) in data.skuAttrs" :key="skuIndex">
                      {{sku.name}}：{{sku.value}}
                    </span>
                  </div>
                </div>
              </router-link>
              <!-- 购买会员升级 -->
              <router-link v-if="data.ytype === '4'" :to="{ name: 'upgradeDetail', query: { goodId: data.goodId } }">
                <div class="goodImg">
                  <img :src="data.goodHeadPic" alt="">
                </div>
                <div class="goodText">
                  <div class="goodName">{{data.goodTitle}}</div>
                  <div class="goodSpecification">
                    <span v-for="(sku,skuIndex) in data.skuAttrs" :key="skuIndex">
                      {{sku.name}}：{{sku.value}}
                    </span>
                  </div>
                </div>
              </router-link>
              <!-- 惠呗充值 -->
              <a v-if="data.ytype === '5'" @click.stop="changeHuiBei">
                <div class="goodImg">
                  <img :src="data.goodHeadPic" alt="">
                </div>
                <div class="goodText">
                  <div class="goodName">{{data.goodTitle}}</div>
                  <div class="goodSpecification">
                    <span v-for="(sku,skuIndex) in data.skuAttrs" :key="skuIndex">
                      {{sku.name}}：{{sku.value}}
                    </span>
                  </div>
                </div>
              </a>
            </div>
            <!--已失效或者已下架的商品-->
            <div class="goodInformation" v-if="data.ystatus == -1 || data.ystatus == 0" @click="promptCannot(data.ystatus)">
              <a>
                <div class="goodImg">
                  <img :src="data.goodHeadPic" alt="">
                </div>
                <div class="goodText">
                  <div class="goodName">{{data.goodTitle}}</div>
                  <div class="goodSpecification">
                    <span v-for="(sku,skuIndex) in data.sku" :key="skuIndex">
                      {{sku.name}}：{{sku.value}}
                    </span>
                  </div>
                  <div class="anyTheOrderTitle" v-if="data.ystatus == -1">*此商品不存在，请联系客服哦</div>
                  <div class="anyTheOrderTitle" v-if="data.ystatus == 0">*此商品已下架，请联系客服哦</div>
                </div>
              </a>
            </div>
            <!--商品价格，和改变数量-->
            <div class="goodPriceAndQuantity" v-if="data.ystatus == 1">
              <div class="goodPrice">￥{{data.price}}</div>
              <div class="goodQuantity">
                <van-stepper v-model="data.goodNum" min="1" :max="data.stock" integer :disabled="data.ystatus != 1" @plus="editGoodNum(data, 'plus')" @minus="editGoodNum(data, 'minus')" @blur="editGoodNum(data, 'blur')"/>
              </div>
            </div>
            <!--商品额外信息-->
            <div class="goodOther" v-if="data.ystatus == 1">
              <div class="goodOther-box" v-for="(svc,svcIndex) in data.svcAttrs" :key="svcIndex">
                <div class="otherName">
                  <span>[{{svc.name}}]&nbsp;&nbsp;{{svc.value}}</span>
                </div>
                <div class="otherPrice">
                  <span>￥{{svc.fee}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noShoppingCartList" v-if="shoppingCartList.length === 0">
      <img class="no-img" src="@/assets/shop_icon.png" alt="">
      <div class="go-stroll">
        <router-link :to="{ name: 'home' }">去逛逛</router-link>
      </div>
    </div>
    <!-- 为你推荐 -->
    <div class="recommend" v-if="rmdList.length > 0">
      <div class="recommend-title">
        <span>为你推荐</span>
      </div>
      <div class="recommend-box">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="homeInfinite"
          :immediate-check="false"
          class="van-clearfix"
        >
        <GoodsList v-if="isShowGoodList" :goodsList="rmdList"></GoodsList>
      </van-list>
      </div>
    </div>
    <v-footer>
      <div class="shoppingCartFooter" v-if="shoppingCartList.length !== 0">
        <div class="selectAllAndTotalPrice">
          <div class="selectAll" @click="selectAll()">
            <van-icon
              :color="selectAllName()"
              :name="selectAllColor()"
              size="24px"/>
            <span>全选</span>
          </div>
          <div class="totalPrice" v-show="allAount !== 0 && deleteOrBuy">
            <span>合计:</span><span v-show="!calculation">￥</span><span v-show="!calculation">{{allAount}}</span><van-loading v-show="calculation" type="spinner" color="#EA3323" size="24px"></van-loading>
          </div>
        </div>
        <div class="postBtn" @click="goShopConfirm()" v-if="deleteOrBuy">结算<span v-show="this.buyList.length !== 0">({{this.buyList.length}})</span></div>
        <div class="postBtn" @click="deleteShopping()" v-if="!deleteOrBuy">删除<span v-show="this.buyList.length !== 0">({{this.buyList.length}})</span></div>
      </div>
    </v-footer>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import GoodsList from '@/components/goodsList'
import { Stepper , SubmitBar , Checkbox , CheckboxGroup , Icon , Loading , Toast, List } from 'vant';
import Footer from '@/components/footer';
Vue.use(Loading).use(Stepper).use(SubmitBar).use(Checkbox).use(CheckboxGroup).use(Icon).use(Toast).use(List);
export default {
  name:"shoppingCart",
  data() {
    return {
      payShow:false,
      money:"",
      calculation:false,
      deleteOrBuy:true,     //true为购买，false为删除
      value:0,
      allAount:0,
      circle:"circle",
      checked:true,
      shoppingCartList:[],
      buyListIndex:[],
      buyList:[],
      cartIdList:[],
      //为你推荐
      isShowGoodList: false,
      loading: false,
      finished: false,
      isLoading: false,
      rmdPage: '1',
      rmdSize: '10',
      rmdTotal: '',
      rmdList: [],
    };
  },
  watch: {
    buyList:{
      deep: true,
      handler(val, oldVal) {
        this.allAount = 0;
        let allAount = 0;
        this.calculation = true;
        let aLength = this.buyList.length;
        for ( let a = 0;a < aLength ;a++ ) {
          let fee = 0;
          let sarr = this.buyList[a].svcAttrs;
          let sarrLength = sarr.length;
          for ( let b = 0;b < sarrLength;b++) {
            fee += this.getFloat(sarr[b].fee);
          }
          allAount += Number(this.buyList[a].goodNum)  * (this.getFloat(this.buyList[a].price) + fee );
          this.allAount = allAount/100;
        }
        this.calculation = false;
      }
    }
  },
  methods: {
    changeHuiBei () {
      let ygrade = localStorage.getItem('ygrade')
      if (ygrade < 4) {
        Toast('请先升级会员')
      }else {
        this.$router.push({
          name: 'recharge',
          query:{
            chargeAct: '3'
          }
        })
      }
    },
    //提示商品已下架或者已失效
    promptCannot (num) {
      let titleText = num == 0 ? "该商品已下架" : "该商品不存在";
      Toast(titleText);
    },
    getFloat (num) {
      let str = parseFloat(num).toFixed(2);
      let arr = str.split(".");
      return Number(`${arr[0]}${arr[1]}`);
    },
    //全选
    selectAll () {
      let effective = 0;
      let arrLength = this.shoppingCartList.length;
      let buyListLength =  this.buyList.length;
      //判断，如果是购物状态，effective（有效商品数量）为当前状态为1（既商品的上架状态，1是已上架）的商品数量，如果不是购物状态，那么有效商品数量就是全部商品
      //这里是购物状态
      if ( this.deleteOrBuy === true ) {
        for (let r = 0; r < arrLength; r++) {
          if (this.shoppingCartList[r].ystatus == 1) {
            effective++;
          }
        }
        //这里是管理商品状态
      }else {
        effective = this.shoppingCartList.length;
      }
      //判断选中的商品数量是不是等于现在有效商品的数量，如果是就全部清除
      if ( buyListLength === effective ) {
        this.buyListIndex = [];
        this.buyList = [];
        this.cartIdList = [];
        //如果不等于，那么就会全部选中
      }else {
        this.buyListIndex = [];
        this.buyList = [];
        this.cartIdList = [];
        for ( let r = 0 ; r < arrLength;r++ ) {
          //判断是不是购物状态，如果是，那么点击全选只会把当前是上架的商品添加到列表
          if ( this.deleteOrBuy === true ) {
            if ( this.shoppingCartList[r].ystatus == 1 ) {
              this.buyListIndex.push(this.shoppingCartList[r].skuId);
              this.cartIdList.push(this.shoppingCartList[r].cartId);
              this.buyList.push(this.shoppingCartList[r])
            }
            //如果不是购物状态，那么全部商品都会添加到列表中
          }else {
            this.buyListIndex.push(this.shoppingCartList[r].skuId);
            this.cartIdList.push(this.shoppingCartList[r].cartId);
            this.buyList.push(this.shoppingCartList[r])
          }
        }
      }
    },

    //更换全选的按钮状态
    selectAllName () {
      let effective = 0;
      let arrLength = this.shoppingCartList.length;
      let buyListLength =  this.buyList.length;
      if ( this.deleteOrBuy === true ) {
        for ( let r =0 ; r < arrLength;r++) {
          if ( this.shoppingCartList[r].ystatus == 1 ) {
            effective++;
          }
        }
      }else {
        effective = this.shoppingCartList.length;
      }
        if ( effective === 0 ) {
          return '#999999';
        }else if ( buyListLength !== effective ) {
          return '#999999';
        }else {
          return '#EA3323';
        }
    },

    //更换全选的按钮颜色
    selectAllColor () {
      let effective = 0;
      let arrLength = this.shoppingCartList.length;
      let buyListLength =  this.buyList.length;
      if ( this.deleteOrBuy === true ) {
        for ( let r =0 ; r < arrLength;r++) {
          if ( this.shoppingCartList[r].ystatus == 1 ) {
            effective++;
          }
        }
      }else {
        effective = this.shoppingCartList.length;
      }
      if ( effective === 0 ) {
        return 'circle';
      }else if ( buyListLength !== effective ) {
        return 'circle';
      }else {
        return 'checked';
      }
    },

    //切换现在的状态
    tabMode () {
      this.deleteOrBuy = !this.deleteOrBuy;
      this.buyListIndex = [];
      this.cartIdList = [];
      this.buyList = [];
    },

    //选择需要支付的商品
    addGoods (index,data) {
      if ( this.buyListIndex.indexOf(index) === -1 ) {
        //判断商品的状态，-1是不存在，0是已下架
        if ( data.ystatus == -1 || data.ystatus == 0 ) {
          //判断是不是删除商品
          if ( this.deleteOrBuy === false ) {
            this.buyListIndex.push(index);
            this.cartIdList.push(data.cartId);
            this.buyList.push(data)
          }else {
            if ( data.ystatus == -1 ) {
              Toast("此商品不存在");
            }else {
              Toast("此商品已下架");
            }
          }
        }else {
          this.buyListIndex.push(index);
          this.cartIdList.push(data.cartId);
          this.buyList.push(data)
        }
      } else {
        let aIndex = this.buyListIndex.indexOf(index);
        this.buyListIndex.splice(aIndex,1);
        let aLength = this.buyList.length;
        for ( let a = 0;a < aLength ;a++ ) {
          if ( this.buyList[a].skuId === index ) {
            this.buyList.splice(a,1);
            this.cartIdList.splice(a,1);
          }
        }
      }
    },
    //添加商品购买个数
    editGoodNum (item, type) {
      let num = item.goodNum
      if (type === 'plus') {//增加
        num ++
      }else if (type === 'minus') {//减少
        num --
      }else if (type === 'blur') {//失去焦点
        if(Number(num) >= Number(item.stock)) {
          num = item.stock
        }
      }
      this.bus.$emit('getLoading', {loading: true});
      let data = {
        cartId: item.cartId,
        skuId: item.skuId,
        num: num
      };
      Models.User
      .changeNum(data)
      .then(res => {
        if ( res.data.code === '0' ) {
          this.bus.$emit('getLoading', {loading: false});
          let dLength = this.shoppingCartList.length;
          let cLength = this.buyList.length;
          for ( let c =0 ;c < cLength ;c++ ) {
            for ( let g =0 ;g < dLength ;g++ ) {
              if ( this.shoppingCartList[g].skuId === this.buyList[c].skuId ) {
                this.buyList[c].goodNum = this.shoppingCartList[g].goodNum;
              }
            }
          }
        }
      })
    },
    //购买确认
    goShopConfirm () {
      if ( this.buyList.length === 0 ) {
        Toast('请选择商品');
      }else {
        let buyListLength = this.buyList.length;
        let good = [];
        for ( let g = 0;g < buyListLength;g++ ) {
          let svcs = [];
          let sarr = this.buyList[g].svcAttrs;
          let sarrLength = sarr.length;
          for ( let b = 0;b < sarrLength;b++) {
            svcs.push(sarr[b].svcId);
          }
          let arr = {
            skuId:this.buyList[g].skuId,
            num:this.buyList[g].goodNum,
            cartId:this.buyList[g].cartId,
            svcs:svcs
          };
          good.push(arr);
        }
        let fromData = {
          yfrom:"cart",
          goods:good,
        };
        fromData = JSON.stringify(fromData);
        this.checkshopConfirm(fromData);
      }
    },
    checkshopConfirm (fromData) {
      Models.Home
      .shopConfirm(fromData)
        .then( res => {
          if ( res.data.code == 0 ) {
            sessionStorage.setItem('fromData', fromData);
            this.$router.push({
              name: 'goodsOrder'
            })
          }else {
            Toast(res.data.msg);
            this.getShoppingCart();
          }
        })
    },
    //批量删除购物车商品
    deleteShopping () {
      if ( this.buyList.length === 0 ) {
        Toast('请选择商品');
      }else {
        let data = {
          idList:this.cartIdList
        };
        Models.User
        .discardMulti(data)
        .then(res => {
          if ( res.data.code == 0 ) {
            this.buyListIndex = [];
            this.cartIdList = [];
            this.buyList = [];
            this.getShoppingCart();
            Toast("删除成功");
          }
        })
      }
    },
    //获取我的购物车
    getShoppingCart () {
      Models.User
      .shoppingCart()
      .then(res => {
        if(res.data.code == '0') {
          this.buyListIndex = [];
          this.buyList = [];
          this.shoppingCartList = res.data.info.list;
        }else if(res.data.code == '8001') {
          Toast('网络开小差，请稍后再试~~')
        }
      })
    },
    // 为你推荐数据
    rmdInit() {
      this.loading = true
      this.finished = false
      let data = {
        page: this.rmdPage,
        size: this.rmdSize,
        keyword: '',
        zoneCode: 'recommendZone',
        categoryId: '0',
        brandId: '0',
        shopId: '0',
        orderBy: '',
        orderWay: 'desc',
        price: []
      }
      Models.Home
      .searchZoneGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          // 加载状态结束
          this.loading = false
          this.isShowGoodList = true
          this.rmdPage = Number(this.rmdPage) + 1;
          this.rmdList = this.rmdList.concat(res.data.info.list)
          this.rmdTotal = Math.ceil(Number(res.data.info.total) / Number(this.rmdSize))
        }
      })
    },
    // 为你推荐上拉加载数据
    homeInfinite() {
        this.rmdInit();
        // 数据全部加载完成
        if (this.rmdPage >= this.rmdTotal) {
          this.finished = true;
        }
    },
  },
  computed: {

  },
  created() {
    this.rmdInit()
  },
  activated() {
    this.getShoppingCart();
  },
  mounted() {

  },
  components: {
    'v-footer': Footer,
    GoodsList
  },
};
</script>

<style scoped lang="less">
.shoppingCart {
  width:100%;

  .editShoppingCart {
    width: 100%;
    height: 37px;
    line-height:37px;
    text-align: right;
    padding: 0 15px;
    font-size: 0;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 9;
    background-color:#f5f5f5 ;

    span {
      color:#333333;
      font-size: 15px;
    }
  }

  .shoppingCartList {
    padding: 0 15px;
    width: 100%;

    .anyTheOrder {
      width: 100%;
      height: auto;
      margin-bottom: 15px;
      padding-top: 16px;
      background-color:#ffffff;

      border-radius:8px;

      .theOrder {
        width: 100%;
        height: auto;
        display: flex;
        display:-webkit-flex;

        overflow: hidden;

        :last-child {
          margin-bottom: 0;
        }

        .optionBtn {
          flex-shrink:0;
          padding-top: 28px;
          flex-basis:52px;
          font-size: 0;
          text-align: center;
        }

        .goodCentent {
          width: 100%;
          height: auto;

          .goodInformation {
            width: 100%;
            height: auto;
            margin-bottom: 5px;

            &>a {
              width: 100%;
              height: auto;
              display: flex;
              display:-webkit-flex;

              .goodImg {
                flex-shrink:0;
                flex-basis:80px;
                height: 80px;

                img {
                  width: 80px;
                  height: 80px;
                }
              }

              .goodText {
                width: 100%;
                height:auto;
                padding:0 16px;

                .goodName {
                  color:#333333;
                  font-size: 12px;
                  overflow: hidden;
                  height:32px;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp:2;
                  -webkit-box-orient: vertical;
                  margin-bottom: 11px;
                }

                .goodSpecification {
                  width: 100%;
                  color:#999999;
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp:2;
                  margin-bottom: 11px;
                  -webkit-box-orient: vertical;
                }

                .anyTheOrderTitle {
                  width: 100%;
                  color:#EA3323;
                  font-size:12px;
                  font-weight: bold;
                }
              }
            }
          }

          .goodPriceAndQuantity {
            width: 100%;
            height: auto;
            display: flex;
            margin-bottom: 12px;
            display:-webkit-flex;

            .goodPrice {
              flex-shrink:0;
              flex-basis:144px;
              height: 30px;
              line-height: 30px;
              text-align: right;
              color:#EA3323;
              font-size: 15px;
            }

            .goodQuantity {
              width: 100%;
              height: 30px;
              padding-right: 14px;
              text-align: right;
            }
          }

          .goodOther {
            margin-bottom: 15px;
            width: 100%;

            .goodOther-box {
              width: 100%;
              display: flex;
              color:#333333;
              font-size: 12px;
              padding-right: 16px;
              display:-webkit-flex;
            }

            .otherName {
              flex-shrink:0;
              flex-basis:144px;
              text-align: left;
            }

            .otherPrice {
              width: 100%;
              height: auto;
              text-align: right;
            }
          }
        }
      }
    }
  }

  .noShoppingCartList {
    padding: 34px 0 24px 0;
    width: 100%;
    background-color: #fff;

    .no-img {
      margin: auto;
      width: 232px;
      height: 136px;
    }

    .go-stroll {
      margin-top: 21px;
      width: 100%;
      text-align: center;

      > a {
        display: inline-block;
        padding: 7px 24px;
        width: 100px;
        font-size: 14px;
        color: #EA3323;
        border: 1px solid #EA3323;
        border-radius: 18px;
      }
    }
  }

  .recommend {
    padding-bottom: 100px;
    width: 100%;

    .recommend-title {
      padding: 17px 0 10px 0;
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #333;

      > span {
        position: relative;

        &::before {
          content: ' ';
          position: absolute;
          top: 50%;
          left: -24px;
          width: 15px;
          height: 2px;
          background-color: #333;
        }

        &::after {
          content: ' ';
          position: absolute;
          top: 50%;
          right: -24px;
          width: 15px;
          height: 2px;
          background-color: #333;
        }
      }
    }
  }

  .shoppingCartFooter {
    width: 100%;
    height: 50px;
    display:flex;
    display: -webkit-flex;

    .selectAllAndTotalPrice {
      width: 100%;
      height: 50px;
      display:flex;
      padding:0 15px;
      display: -webkit-flex;

      .selectAll {
        flex-shrink:0;
        flex-basis:85px;
        height: 50px;
        padding-top: 8px;
        display:flex;
        display: -webkit-flex;
        align-items: center;

        span {
          color:#666666;
          font-size: 15px;
          margin-left: 10px;
          height:20px;
          display: inline-block;
          vertical-align: middle;
        }
      }

      .totalPrice {
        width: 100%;
        height: 50px;
        text-align: right;
        line-height:50px;

        span:first-child {
          color: #333333;
          font-size: 12px;
        }

        span:nth-child(2) {
          color: #EA3323;
          font-size: 15px;
        }

        span:nth-child(3) {
          color: #EA3323;
          font-size: 18px;
        }
      }
    }

    .postBtn {
      flex-shrink:0;
      flex-basis:100px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 15px;
      color:#ffffff;
      background: -webkit-linear-gradient(left,  #EA3323 , #EA2369 ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #EA3323 , #EA2369 ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #EA3323 , #EA2369 ); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #EA3323 , #EA2369 ) ; /* 标准的语法 */
    }
  }
};
</style>
