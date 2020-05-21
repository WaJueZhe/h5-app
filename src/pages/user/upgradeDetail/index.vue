<template>
  <div class="upgradeDetail-page">
    <div class="op-top">
      <div class="go" @click="goBack">
        <img src="@/assets/homePage/go-back.png" alt>
      </div>
    </div>
     <!-- 轮播图 -->
    <div class="banner" id="banner">
      <van-swipe :autoplay="5000" @change="onChange" :show-indicators="false">
        <van-swipe-item v-for="(image, index) in info.albumPicList" :key="index">
          <img v-lazy="image" @click="watchPhoto(index)">
        </van-swipe-item>
      </van-swipe>
      <div class="custom-indicator" slot="indicator">{{ current + 1 }}/{{albumLength}}</div>
    </div>
    <div class="tab-nav">
      <ul class="list">
        <li class="item">
          <div class="icon">
            <img src="@/assets/personalCenter/upgrade-01.png" alt="">
            <span>自购省钱</span>
          </div>
        </li>
        <li class="item">
          <div class="icon">
            <img src="@/assets/personalCenter/upgrade-02.png" alt="">
            <span>分享赚钱</span>
          </div>
        </li>
        <li class="item">
          <div class="icon">
            <img src="@/assets/personalCenter/upgrade-03.png" alt="">
            <span>专属服务</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="info">
      <div class="price">
        <div class="money"><span>￥</span>{{ info.price }}</div>
        <div class="give">赠送{{ info.point }}惠呗</div>
      </div>
      <div class="title">{{ info.title }}</div>
      <div class="share" v-if="info.canShare == '1'" @click="goShare">
        <div class="item-desc">
          <div class="item-box">
            <img src="@/assets/homePage/money.png" alt>
            <div class="text" v-if="info.hasProfit == '1' && !profitListFlag">
              分享成功，可赚<span>{{ info.profitList[0] + '~' + info.profitList[1] | priceFilter }}</span>服务收益
            </div>
            <div class="text" v-else>
              好东西要分享给好友
            </div>
          </div>
          <div class="go-share">
            <span>去分享</span>
            <img src="@/assets/homePage/right-02.png" alt>
          </div>
        </div>
      </div>
    </div>
    <div class="desc-img">
      <p v-for="(item, index) in descPicList" :key="index">
        <img v-lazy="item" alt="">
      </p>
    </div>
    <!-- 分享 -->
    <div class="share-box" v-if="isCanvas" @click="closeImg">
      <div class="c-img" @click.stop>
        <img v-if="canvasImage != ''" :src="canvasImage">
        <div v-if="canvasImage != ''" class="close-img" @click="closeImg"><img src="@/assets/homePage/close.png" alt=""></div>
      </div>
      <van-loading v-if="canvasImage == ''" class="canvas-loading" type="spinner" color="#fff" />
      <div class="btn" v-if="canvasImage != ''" @click.stop>
        <span>请长按图片发送给好友</span>
      </div>
    </div>
    <div class="upgrade-now">
      <div class="btn" @click="upgradeNow">立即购买</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Models from "@/models";
import sdk from '@/js/weixin.js';
import { Swipe, SwipeItem, Lazyload, Rate, ImagePreview, Sku, Button, Toast, Popup, Loading } from "vant";
Vue.use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Rate)
  .use(ImagePreview)
  .use(Sku)
  .use(Button)
  .use(Popup)
  .use(Toast)
  .use(Loading)
export default {
  name: 'upgradeDetail',
  data() {
    return {
      goodId: '',
      info: {},
      descPicList: [],
      current: 0,
      albumLength: '',
      profitListFlag: false,//判断分享的两个金额是否相同
      //分享弹框
      isCanvas: false,//分享图片
      canvasImage: '',
      //默认选择的商品属性
      skuId: '',
      shareLink: '',//分享链接
      upgradeDetail: sessionStorage.getItem('upgradeDetail'),
      subFlage: false,//从分享链接进来
      ImagePreviewDialog: '',//预览图片
    };
  },
  filters: {
    priceFilter(value) {
      let val = value.split('~')
      if((parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0) && (parseFloat(val[0]) == parseFloat(val[1]))) {
        return val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) != 0 ) {
        return val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0 ) {
        return val[0] + '~' + val[1]
      }
    }
  },
  watch: {

  },
  methods: {
    init() {
      let data = {
        id: this.goodId
      };
      Models.Home
      .getDetail(data)
      .then(res => {
        if (res.data.code === '0') {
          this.info = res.data.info.goodInfo;
          this.albumLength = this.info.albumPicList.length

          if(parseFloat(this.info.profitList[0]) == 0 && parseFloat(this.info.profitList[1]) == 0) {
            this.profitListFlag = true
          }

          this.getGoodSku()
        }else {
          Toast(res.data.msg)
          this.$router.go(-1);
        }
      })
    },
    getGoodSku() {
      let data = {
        id: this.goodId
      }
      Models.Home
      .getSku(data)
      .then(res => {
        if(res.data.code == '0') {
          let list = res.data.info.list
          for(let i = 0; i < list.length; i++) {
            if(list[i].skuDefault == '1') {
              this.skuId = list[i].skuId
            }
          }
        }
      })
    },
    getContent() {
      let data = {
        id: this.goodId
      }
      Models
      .Home
      .getContent(data)
      .then(res => {
        if (res.data.code == '0') {
          this.descPicList = res.data.info.descPicList
        }
      });
    },
    onChange(index) {
      this.current = index;
    },
    goBack() {
      if(this.upgradeDetail) {
        this.$router.push({
          name: 'home'
        })
      }else if(localStorage.sessionId != undefined && this.subFlage) {
        this.$router.push({
          name: 'home'
        })
      }else {
        this.$router.go(-1)
      }
    },
    qRlink(goodId) {
      let data = {
        type: 'good',
        goodId: goodId,
        cat: 'all'
      };
      Models.User
      .getQRcode(data)
      .then( res => {
        if (res.data.code === '0') {
          this.canvasImage = res.data.info.codePicList[0]
          this.shareLink = res.data.info.link
        }
      })
    },
    goShare() {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        this.isCanvas = true
        if(this.canvasImage == '') {
          this.qRlink(this.goodId)
        }
        this.$common.forbidBodyScroll()
      }
    },
    closeImg() {
      this.isCanvas = false;
      this.$common.allowBodyScroll()
    },
    //立即购买
    upgradeNow() {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        let fromData = {
          yfrom: 'direct',
          goods: [
            {
              cartId: '0',
              skuId: this.skuId,
              num: '1',
              svcs: []
            }
          ]
        }
        fromData = JSON.stringify(fromData)
        sessionStorage.setItem('fromData', fromData)
        this.$router.push({
          name: 'goodsOrder',
          query: {
            VIPGoods: 1,
            ytype: 'memberShip'
          }
        })
      }
    },
    //预览轮播图
    watchPhoto(index) {
      this.ImagePreviewDialog = ImagePreview({
        images: this.info.albumPicList,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    },
    //游客模式跳转
    tourist() {
      // localStorage.setItem('loginStateNormal', '1');
      let url = window.location.href
      let agrs = this.$common.getRequest(url);
      // sessionStorage.setItem('goodsDetailId', agrs.goodId)
      this.$router.push({
        name: 'login',
        query: {
          goodId: agrs.goodId,
          headPic: agrs.headPic,
          nickName: agrs.nickName,
          ucode: agrs.ucode,
          action: agrs.action,
          subscribe: agrs.subscribe,
          gtype: agrs.gtype,
          jump: '1',
        }
      })
    },
    //默认绑定关系
    alreadyFollow (ucode) {
      let data = {
        id: ucode
      };
       Models.User
      .bindMyInvitor(data)
      .then(res => {
      })
    }
  },
  computed: {

  },
  beforeRouteLeave(to, from, next){
    this.ImagePreviewDialog && this.ImagePreviewDialog.close()
    next()
  },
  created() {
    // let url = window.location.href;
    // let agrs = this.$common.getRequest(url);
    // this.goodId = this.$route.query.goodId
    // this.init()
    // this.getContent()
    // if (localStorage.sessionId != undefined) {
    //   this.qRlink(this.goodId)
    //   this.alreadyFollow(agrs.ucode)
    // }
  },
  activated() {
    let url = window.location.href;
    if(url.indexOf('?from=singlemessage') >= 0) {
      url = url.replace("?from=singlemessage","");
    }
    if(url.indexOf('&isappinstalled=0') >= 0) {
      url = url.replace("&isappinstalled=0","");
    }
    if(url.indexOf('?from=timeline') >= 0) {
      url = url.replace("?from=timeline","");
    }
    if(url.indexOf('?from=groupmessage') >= 0) {
      url = url.replace("?from=groupmessage","");
    }
    let agrs = this.$common.getRequest(url);
    this.goodId = this.$route.query.goodId
    this.init()
    this.getContent()
    if (localStorage.sessionId != undefined) {
      this.qRlink(this.goodId)
      this.alreadyFollow(agrs.ucode)
    }
    if(localStorage.sessionId != undefined && agrs.subscribe) {
      this.subFlage = true
      if(agrs.subscribe == '1') {//1是已经关注公众，但没有绑定关系
        let userId = localStorage.getItem('userId')
        this.alreadyFollow(userId)
      }else if(agrs.subscribe == '0') {//0是没关注公众号, 2放行
        let userId = localStorage.getItem('userId')
        if(agrs.goodId != '') {
          this.$router.push({
            name: 'follow',
            query: {
              goodId: agrs.goodId,
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
      }
    }
  },
  mounted() {
    setTimeout(() => {
      let url = window.location.href;
      let data = {
        title: this.info.title,
        link: this.shareLink,
        imgUrl: this.info.headPic
      };
      sdk.getJSSDK(url, data)
    }, 1000);
  },
  components: {

  },
};
</script>

<style lang="less">
.upgradeDetail-page {
  padding-bottom: 60px;
  width: 100%;

  .op-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    z-index: 999;

    .go {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      width: 35px;
      height: 100%;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .banner {
    position: relative;
    width: 100%;
    height: 375px;
    overflow: hidden;

    .van-swipe {
      width: 100%;
      height: 100%;

      .van-swipe-item {
        width: 100%;
        height: 100%;

        > img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .custom-indicator {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 2px 10px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 20px;
    }
  }

  .tab-nav {
    padding: 15px;
    width: 100%;
    background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */

    .list {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .item {
        flex: 1;
        font-size: 14px;
        color: #fff;
        display: flex;
        text-align: center;

        .icon {
          display: flex;
          align-items: center;
          margin: auto;

          > img {
            margin-right: 5px;
            width: 17px;
            height: 17px;
            vertical-align: middle;
          }

          > span {
            vertical-align: top
          }
        }
      }
    }
  }

  .info {
    padding: 10px 15px;
    width: 100%;
    background-color: #fff;

    .price {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      align-items: center;

      .money {
        font-size: 30px;
        font-weight: 600;
        color: #EA3323;

        > span {
          font-size: 18px;
        }
      }

      .give {
        padding: 1px 6px 2px;
        margin-left: 12px;
        font-size: 12px;
        background-color: #FFF100;
        color: #333;
        border-radius: 4px;
      }
    }

    .title {
      margin-top: 2px;
      font-size: 15px;
      font-weight: 500;
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

    .share {
      margin-top: 10px;
      width: 100%;

      .item-desc {
        width: 100%;
        background-color: #f2dedf;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-box {
          padding: 12px 0 12px 8px;
          width: 273px;
          display: flex;
          align-items: center;

          > img {
            width: 15px;
            height: 15px;
          }

          .text {
            padding-left: 6px;
            font-size: 13px;
            color: #333;

            > span {
              color: #ea3323;
            }
          }
        }

        .go-share {
          padding: 12px 0;
          width: 72px;
          font-size: 13px;
          color: #fff;
          background-color: #EA3323;
          text-align: center;

          > img {
            display: inline-block;
            width: 6px;
          }
        }
      }
    }
  }

  .desc-img {
    margin-top: 8px;
    width: 100%;

    > p {
      width: 100%;

      > img {
        width: 100%;
      }
    }
  }

  .buy {
    width: 100%;

    .van-sku-container {
      max-height: min-content;

      .van-sku-header {
        .van-sku-header__goods-info {
          position: relative;

          .van-sku__goods-name {
            margin-top: 4px;
          }

          .img {
            position: absolute;
            top: 10px;
            right: 20px;
            width: 22px;
            height: 22px;
            z-index: 999;

            > img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .van-sku-body {
        .van-sku-group-container {
          .van-sku-row {
            .van-sku-row__item {
              border-radius: 20px;

              &.van-sku-row__item--active {
                color: #fff;
                border-color: #f44;
                background: #f44;
              }
            }
          }
        }
      }
    }
  }

  .share-box {
    position: fixed;
    width:100%;
    height:100%;
    top: 0;
    background:rgba(0,0,0,0.8);
    z-index: 999;
    overflow: hidden;

    .canvas-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .c-img {
      position: absolute;
      z-index: 999;
      width: 80%;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);

      .close-img {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        z-index: 9999;
        border-radius: 50%;

        > img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .btn {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 12px 0;
      width: 100%;
      font-size: 15px;
      text-align: center;
      color: #fff;
      background-color: #EA3323;
      z-index: 9999;
    }
  }

  .upgrade-now {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 5px 15px;
    width: 100%;
    background-color: #fff;

    .btn {
      padding: 15px 0;
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      color: #fff;
      background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
      border-radius: 30px;
    }
  }
};
</style>
