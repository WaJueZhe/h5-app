<template>
  <div class="goodsDetails-page" id="text">
    <div class="banner-top" ref="bannerTop" :class="{ head:bannerTop}">
      <div class="go" @click="goBack">
        <img src="@/assets/homePage/go-back.png" alt>
      </div>
      <div class="list">
        <a
          href="javascript:;"
          :class="activeLine == '#banner' ? 'activeLine' : ''"
          @click="toTarget(1)"
        >商品</a>
        <a
          href="javascript:;"
          :class="activeLine == '#info' ? 'activeLine' : ''"
          @click="toTarget(2)"
        >评价</a>
        <a
          href="javascript:;"
          :class="activeLine == '#evaluate' ? 'activeLine' : ''"
          @click="toTarget(3)"
        >详情</a>
        <a
          href="javascript:;"
          :class="activeLine == '#afterSale' ? 'activeLine' : ''"
          @click="toTarget(4)"
        >售后</a>
      </div>
    </div>
    <div class="op-top" v-show="!bannerTop">
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
    <!-- 商品信息 -->
    <div class="info" id="info">
      <div class="activity-price">
        <div class="activity-left">
          <div class="price-box">
            <div class="p-icon">￥</div>
            <div class="miney" v-if="goodUser">{{ info.price }}</div>
            <div class="miney" v-else>{{ unifiedPrice }}</div>
            <div class="p-huibei" v-if="info.dePoint > 0">可用惠呗{{ info.dePoint }}个</div>
          </div>
          <div class="m-price">
            <span>价格
              <s>￥{{ info.marketPrice }}</s>
            </span>
          </div>
        </div>
        <div class="activity-right">
          <div class="rob">已抢{{ info.sales | numberMany }}</div>
        </div>
      </div>
      <!-- 会员升级 -->
      <div class="upgrade-level" v-if="goodUser.ygrade < '7' && goodUser.ygrade === '3'">
        <div class="upgrade-price">
          <span>社区BOSS价：</span>
          <span class="pie">￥{{ upgradeMoney }}</span>
        </div>
        <div class="go-upgrade" @click="goUpgrade(goodUser.ygrade)">
          <b>升级社区BOSS</b>
          <img src="@/assets/homePage/right-red.png" alt="">
        </div>
      </div>
      <div class="upgrade-level" v-if="goodUser.ygrade < '7' && goodUser.ygrade === '4'">
        <div class="upgrade-price">
          <span>金牌BOSS价：</span>
          <span class="pie">￥{{ upgradeMoney }}</span>
        </div>
        <div class="go-upgrade" @click="goUpgrade(goodUser.ygrade)">
          <b>升级金牌BOSS</b>
          <img src="@/assets/homePage/right-red.png" alt="">
        </div>
      </div>
      <div class="upgrade-level" v-if="goodUser.ygrade < '7' && goodUser.ygrade === '5'">
        <div class="upgrade-price">
          <span>每单赚<b>20%</b>收益分成</span>
        </div>
        <div class="go-upgrade" @click="goUpgrade(goodUser.ygrade)">
          <b>升级合伙商</b>
          <img src="@/assets/homePage/right-red.png" alt="">
        </div>
      </div>
      <!-- <div class="upgrade-level" v-if="goodUser.ygrade < '7' && goodUser.ygrade === '6'">
        <div class="upgrade-price">
          <span>发展10个合伙商，成为运营中心</span>
        </div>
        <div class="go-upgrade" @click="goUpgrade(goodUser.ygrade)">
          <b>邀请合伙商</b>
        </div>
      </div> -->
      <div class="info-box">
        <div class="goods-title">
          <div class="img" v-if="info.zones && JSON.stringify(info.zones) != '{}'">
            {{ info.zones | zoneName }}
          </div>
          <span>{{ info.title }}</span>
        </div>
        <div class="msg">
          <div class="m-item">市场价：￥{{ info.marketPrice }}</div>
          <div class="m-item">快递：{{ info.ShipTable.expressFee | fitShip }}</div>
        </div>
      </div>
      <!-- 分享 -->
      <div class="share">
        <ul class="list">
          <li class="item"  v-if="!zones.giftZone && touristHomeType == true && info.canShare === '1'" @click="goShare">
            <div class="item-desc">
              <div class="item-box">
                <img src="@/assets/homePage/money.png" alt>
                <div class="text" v-if="profitList.length > 0  && !profitListFlag">
                  分享成功，可赚<span>{{ profitList[0] + '~' + profitList[1] | priceFilter }}元</span>服务收益
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
          </li>
        </ul>
      </div>
    </div>
    <div class="welfare-box">
      <div class="welfare" v-if="info.point > 0">
        <div class="w-title">福利</div>
        <div class="w-right">赠送{{ info.point }}惠呗</div>
      </div>
      <div class="welfare">
        <div class="w-title">服务</div>
        <div class="sale-free">
          <img src="@/assets/homePage/sh_icon.png" alt="">
          <span>售后无忧</span>
        </div>
      </div>
    </div>
    <!-- 商品评价 -->
    <div id="evaluate" ref="evaluate">
      <div class="evaluate">
        <div class="e-top">
          <div class="title">商品评价({{commentListTotal}})</div>
          <div class="watch-more" @click="watchMore">
            <span>查看更多</span>
            <img src="@/assets/homePage/right-red.png" alt>
          </div>
        </div>
        <div class="e-box" v-if="commentList != null">
          <div class="e-user">
            <div class="h-user">
              <div class="photo">
                <img v-if="commentList.headImagePic == null" src="@/assets/homePage/avatar.png" alt="">
                <img v-if="commentList.headImagePic != null" :src="commentList.headImagePic" alt>
              </div>
              <div class="name" v-if="commentList.isAnonymous == 1">{{ commentList.nickname | nicknameFilter }}</div>
              <div class="name" v-else>{{ commentList.nickname }}</div>
              <div class="stars">
                <img v-for="(im, idx) in commentList.describeStar" :key="idx" src="@/assets/homePage/red-star.png" alt="">
                <img v-for="(ig, ik) in grayImg" :key="ik" src="@/assets/homePage/gray-star.png" alt="">
              </div>
            </div>
            <div class="c-user">{{ commentList.content }}</div>
            <div class="c-img" v-if="commentList.commentPicList.length > 0">
              <ul class="list">
                <li class="item" v-for="(img, imgIndex) in commentList.commentPicList" :key="imgIndex">
                  <img @click="watchComment(imgIndex)" :src="img" alt="">
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="e-box" v-else>暂无评论</div>
      </div>

    </div>
    <div class="desc-img" ref="descImg">
      <p v-for="(item, index) in descPicList" :key="index">
        <img v-lazy="item" alt="">
      </p>
    </div>
    <!-- 售后 -->
    <div class="afterSale" id="afterSale" ref="afterSale">
      <div class="mssage" id="mssage">
        <img src="@/assets/homePage/sale-service.png" alt>
      </div>
    </div>
    <!-- 底部购买 -->
    <div class="purchase">
      <div class="purchase-l">
        <div class="online-service" @click="onlineSer">
          <div class="icon">
            <img src="@/assets/personalCenter/service_icon.png" alt="">
          </div>
          <span>在线客服</span>
        </div>
        <div class="shop-car" @click="goToCat">
          <div class="icon">
            <img src="@/assets/footer/shoping_noicon.png" alt="">
          </div>
          <span>购物车</span>
        </div>
      </div>
      <div class="purchase-r">
        <div class="add-card" :class="{ gray: info.addShopping !== '1' }" @click="addCart('1')">加入购物车</div>
        <div class="add-buy" @click="addBuy('2')">立即购买</div>
      </div>
    </div>
    <!-- 立即购买 -->
    <div class="buy" >
      <van-sku
        v-model="showBase"
        stepper-title="数量"
        :sku="demoDate.sku"
        :goods="demoDate.goods_info"
        :goods-id="demoDate.goods_id"
        :quota="demoDate.quota"
        :quota-used="demoDate.quota_used"
        :reset-stepper-on-hide="resetStepperOnHide"
        :reset-selected-sku-on-hide="resetSelectedSkuOnHide"
        :close-on-click-overlay="closeOnClickOverlay"
        :disable-stepper-input="disableStepperInput"
        :message-config="messageConfig"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
        @open-preview="openPreview"
      >
        <!-- 自定义售后服务 -->
        <template slot="sku-messages">
          <div class="van-sku-group-container van-hairline--bottom">
            <div class="van-sku-row" v-for="(svc, svcIndex) in svcList" :key="svcIndex">
              <div class="van-sku-row__title">{{ svc.name }}</div>
              <span class="van-sku-row__item"
                v-for="(v, vIndex) in svc.values" :key="vIndex"
                :class="{ 'van-sku-row__item--active': v.flag == true }"
                @click="svcChang(svc.values, vIndex)"
                >
                <span class="van-sku-row__item-name">{{ v.value }} ￥{{ v.fee }}</span>
                </span>
            </div>
          </div>
        </template>
        <!-- 自定义购买按钮 -->
        <template slot="sku-actions" slot-scope="props">
          <div class="van-sku-actions">
            <div style="width:100%" v-if="addType == '1'">
              <van-button
              square
              size="large"
              type="warning"
              @click="props.skuEventBus.$emit('sku:addCart')"
            >
              加入购物车
            </van-button>
            </div>
            <div style="width:100%" v-if="addType == '2'">
              <van-button
              square
              size="large"
              type="danger"
              @click="props.skuEventBus.$emit('sku:buy')"
            >
              立即购买
            </van-button>
            </div>
          </div>
        </template>
      </van-sku>
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
    <!-- 无权限访问 -->
    <div class="goRegistered" v-if="goRegistered">
      <div class="goRegisteredWindow">
        <div class="goRegisteredTitle">无权限访问，请先登录</div>
        <div class="goRegisteredBtn" @click="register">点击登录 ( {{ codeMsg }} )</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Models from "@/models";
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import { Swipe, SwipeItem, Lazyload, Rate, ImagePreview, Sku, Button, Toast, Popup, Loading, Dialog } from "vant";
import { constants } from 'zlib';
import { connect } from 'net';
import { type } from 'os';
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
  .use(Dialog)
export default {
  name: "goodsDetails",
  data() {
    return {
      info: {}, //数据
      goodUser: {}, //数据
      unifiedPrice: '',//游客模式的价格
      current: 0,
      albumLength: "",
      goodId: "",
      profitListFlag: false,//判断分享的两个金额是否相同
      marketPrice: '',//市场价
      profitList: [],//分享
      supreme: [],//等级价格的显示
      allPriceShow: true,//所有价格一样就不显示

      // nextGradeName: localStorage.getItem('nextGradeName'),//下一个等级
      nextGradeName: '',//下一个等级
      upgradeMoney: '',
      goodRichId: "", //商品详情内容图片id
      descPicList: [],

      commentList: null, //一条评论列表
      grayImg: undefined, //灰色星星
      commentListTotal: 0,//评论条数
      //顶部
      bannerTop: false,
      activeLineIndex: 0,
      //锚点滚动双向
      activeLine: "#banner",
      attrs: [],
      // 商品属性选择部分
      showBase: false,
      resetStepperOnHide: true,//隐藏时重置选择的商品数量
      resetSelectedSkuOnHide: false,//隐藏时重置已选择的 sku
      closeOnClickOverlay: true, //是否在点击遮罩层后关闭
      disableStepperInput: false,
      messageConfig: {},
      //数据sku
      demoDate: {
        sku:{
          tree: [],//这个是渲染商品属性
          list: [],//这个是sku
          price: '0',
          stock_num: '0', // 商品总库存
          none_sku: false,  // 是否无规格商品
          hide_stock: true  // 是否隐藏剩余库存
        },
        goods_info: {
          title: '测试商品A',
          picture: ''
        },
        indexPic: '',
        goods_id: '946755',
        quota: undefined,//限购数量
      },
      sId: [],
      svcList: [],
      svcs: [],
      skuList: [],//sku数据
      //加入购物车
      addType: '',

      //分享弹框
      isCanvas: false,//分享图片
      canvasImage: '',
      ctx: '',
      zones: {},
      touristDetail: sessionStorage.getItem('touristDetail'),
      touristHomeType: true,
      goToHome: '',
      subFlage: false,//从分享链接进来
      goRegistered: false,
      // 倒计时秒数
      countdown: 3,
      // 按钮上的文字
      codeMsg: '3s',
      // 定时器
      timer: null,
      shareLink: '',//分享链接
      ImagePreviewDialog: '',//预览图片


      img1: '',
      picture: '',
      imgObj: {},
      skuImgList: [],
      cardId: '',//提货卡id
      luckyUserId: '',//提货卡id
    };
  },
  filters: {
    nicknameFilter(item) {
      let name = ''
      if (item.length >= 1 && item.length <= 2) {
        name = item.slice(0, 1) + "*";
      } else if (item.length == 3) {
        name = item.slice(0, 1) + "**";
      } else if (item.length >= 4) {
        name = item.slice(0, 1) + "**" + item.slice(3, 4);
      }
      return name
    },
    zoneName(val) {
      let zoneName = Object.values(val)[0]
      return zoneName
    },
    priceFilter(value) {
      let val = value.split('~')
      if((parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0) && (parseFloat(val[0]) == parseFloat(val[1]))) {
        return val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) != 0 ) {
        return val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0 ) {
        return val[0] + '~' + val[1]
      }
    },
    fitShip (val) {
      if (parseFloat(val) == 0) {
        return '包邮'
      }else if (parseFloat(val) < 0) {
        return '到付'
      }else {
        return val
      }
    }
  },
  watch: {},
  methods: {
    goBack() {
      if(this.touristDetail) {
        this.$router.push({
          name: 'home'
        })
      }else if(localStorage.sessionId == undefined) {
        this.$router.push({
          name: 'touristDetail',
        })
      }else if(localStorage.sessionId != undefined && this.subFlage) {
        this.$router.push({
          name: 'home'
        })
      }else {
        this.$router.go(-1);
      }
    },
    init() {
      let data = {
        id: this.goodId
      };
      Models.Home
      .getDetail(data)
      .then(res => {
        if (res.data.code === '0') {
          this.info = res.data.info.goodInfo;

          this.zones = this.info.zones
          this.goodUser = res.data.info.goodUser;

          this.albumLength = res.data.info.goodInfo.albumPicList.length;
          this.goodRichId = res.data.info.goodInfo.goodRichId;
          this.profitList = res.data.info.goodInfo.profitList;

          this.demoDate.sku.stock_num = Number(res.data.info.goodInfo.stock)
          this.demoDate.sku.price = Number(res.data.info.goodInfo.price)
          this.demoDate.goods_id = res.data.info.goodInfo.id
          this.demoDate.indexPic = res.data.info.goodInfo.headPic
          this.demoDate.goods_info.picture = res.data.info.goodInfo.headPic
          this.picture = res.data.info.goodInfo.headPic

          this.upgradeMoney = res.data.info.goodInfo.prices[Number(this.goodUser.ygrade) + 1]//升级会员的价钱

          if (res.data.info.goodInfo.restrict > 0) {
            this.demoDate.quota = Number(res.data.info.goodInfo.restrict)
          }

          if(parseFloat(this.profitList[0]) == 0 && parseFloat(this.profitList[1]) == 0) {
            this.profitListFlag = true
          }

          let arr = []
          for(let i in res.data.info.goodInfo.prices) {
            if(i == 3) {
              this.unifiedPrice = res.data.info.goodInfo.prices[i]
            }
            if(i != 0) {
              arr.push(res.data.info.goodInfo.prices[i])
            }
          }

          if((Math.max.apply(null, arr) === Math.min.apply(null, arr)) == true) {
            this.allPriceShow = false;
          }
          // sku数据组合
          this.demoDate.sku.tree = res.data.info.goodInfo.attrs
          for(let i = 0; i<this.demoDate.sku.tree.length; i++) {
            this.demoDate.sku.tree[i].k = this.demoDate.sku.tree[i].name
            delete this.demoDate.sku.tree[i].name
            this.demoDate.sku.tree[i].k_id = this.demoDate.sku.tree[i].attrId
            delete this.demoDate.sku.tree[i].attrId
            this.demoDate.sku.tree[i].v = this.demoDate.sku.tree[i].values
            delete this.demoDate.sku.tree[i].values
            this.demoDate.sku.tree[i].k_s = 's' + (i + 1)

            for(let j=0; j<this.demoDate.sku.tree[i].v.length; j++) {
              this.demoDate.sku.tree[i].v[j].id = this.demoDate.sku.tree[i].v[j].valueId
              delete this.demoDate.sku.tree[i].v[j].valueId
              this.demoDate.sku.tree[i].v[j].name = this.demoDate.sku.tree[i].v[j].value
              delete this.demoDate.sku.tree[i].v[j].value
              this.demoDate.sku.tree[i].v[j].imgUrl = this.demoDate.sku.tree[i].v[j].valuePic
              delete this.demoDate.sku.tree[i].v[j].valuePic

              let obj = {
                s: this.demoDate.sku.tree[i].v[j].id
              }
              this.sId.push(obj)
            }
          }

          this.getGoodSku();
          this.getSvc();
          // this.countPrice(Number(this.goodUser.ygrade));
        }
        else if(res.data.code == '8001') {
          Toast(res.data.msg)
        }else if(res.data.code == '2'){
          if (this.cardId === undefined) {
            this.goRegistered = true;
            this.time();
          }
        }else {
          Toast(res.data.msg)
          this.$router.go(-1);
        }
      });
    },
    //获取商品的详情图
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
    //获取商品的sku属性
    getGoodSku() {
      let data = {
        id: this.goodId
      }
      Models.Home
      .getSku(data)
      .then(res => {
        if(res.data.code == '0') {
          this.skuList = res.data.info.list
          for(let i = 0; i<res.data.info.list.length; i++) {
            res.data.info.list[i].price = Number(res.data.info.list[i].price) * 100
          }
          const list = res.data.info.list;
          for(const a of list){ //可以优化，让后端返回k_s：'s1'类似字段 注意：商品详情里面的attrs也要返回该字段一一对应
            for(const b of a.skuAttrs){
              for(const c of this.demoDate.sku.tree){
                if(c.k_id === b.attrId){
                  b.k_s = c.k_s;
                }
              }
            }
          }

          const demoList = [];
          for(const d of list){
            const item = {
              skuId: d.skuId,
              price: d.price,
              stock_num: Number(d.stock),
              goods_id: d.goodId,
            }
            for(let e = 0; e < this.demoDate.sku.tree.length; e++){
              if(d.skuAttrs[e]){
                if(d.skuAttrs[e].k_s){
                  item[d.skuAttrs[e].k_s] = d.skuAttrs[e].valueId;
                }else{
                  item[`s${e+1}`] = 0;
                }
              }
            }
            demoList.push(item)
          }
          this.demoDate.sku.list = demoList;
        }
      })
    },
    //获取增值服务数据
    getSvc() {
      let data = {
        id:this.goodId
      }
      Models.Home
      .getSvc(data)
      .then(res => {
        if(res.data.code == 0) {
          for(let i = 0; i<res.data.info.list.length; i++) {
            for(let j = 0; j<res.data.info.list[i].values.length; j++) {
              res.data.info.list[i].values[j].flag = false
            }
          }
          this.svcList = res.data.info.list;
        }
      })
    },
    svcChang(svc, vIndex) {
      svc.map((item, i) => {
        if (vIndex === i) {
          item.flag = !item.flag
        }else{
          item.flag = false
        }
      })
    },
    onChange(index) {
      this.current = index;
    },
    //获取评论
    getComment() {
      let data = {
        goodId: this.goodId,
        page: this.page,
        size: this.size
      };
      Models.Home.getCommentList(data).then(res => {
        if (res.data.code == '0') {
          this.commentListTotal = res.data.info.total;
          if(res.data.info.list.length > 0) {
            res.data.info.list[0].describeStar = Number(res.data.info.list[0].describeStar);
            this.commentList = res.data.info.list[0]
            this.commentList.describeStar = Number(this.commentList.describeStar)
            this.grayImg = 5 - this.commentList.describeStar
          }
        }
      });
    },
    // 锚点滚动
    toTarget(target) {
      let bannerTop = this.$refs.bannerTop.offsetHeight + 2;
      let evaluate = this.$refs.evaluate.offsetTop  - bannerTop ;
      let descImg = this.$refs.descImg.offsetTop - bannerTop ;
      let afterSale = this.$refs.afterSale.offsetTop  - bannerTop ;
      if ( target === 1) {
        document.querySelector("#text").scrollTop = 0;
      }else if ( target === 2 ) {
        document.querySelector("#text").scrollTop = evaluate;
      }else if ( target === 3 ) {
        document.querySelector("#text").scrollTop = descImg;
      }else if ( target === 4 ) {
        document.querySelector("#text").scrollTop = afterSale;
      }
    },
    onScroll() {
      let bannerTop = this.$refs.bannerTop.offsetHeight + 10;
      let evaluate = this.$refs.evaluate.offsetTop  - bannerTop;
      let descImg = this.$refs.descImg.offsetTop - bannerTop ;
      let afterSale = this.$refs.afterSale.offsetTop  - bannerTop ;
      let scrolled = document.querySelector("#text").scrollTop;
      if (scrolled < 10) {
        this.bannerTop = false;
      }else if ( evaluate > scrolled && scrolled > 10) {
        this.bannerTop = true;
        this.activeLine = "#banner";
      }else if ( descImg > scrolled && scrolled > evaluate ) {
        this.bannerTop = true;
        this.activeLine = "#info";
      } else if ( afterSale > scrolled && scrolled > descImg ) {
        this.bannerTop = true;
        this.activeLine = "#evaluate";
      } else if (scrolled > descImg) {
        this.bannerTop = true;
        this.activeLine = "#afterSale";
      }
    },
    //加入购物车
    addCart(type) {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        if (this.info.addShopping === '1') {
          if (this.goodUser.ygrade === '3' && this.info.zones.giftZone !== undefined) {
            Dialog.confirm({
              message: '这是礼品区商品，请先升级会员',
              confirmButtonText: '去升级',
              confirmButtonColor: '#EA3323',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push({
                name: 'upgradeShopkeeper'
              })
            }).catch(() => {
              // on cancel
            });
          }else {
            this.addType = type;
            this.showBase = true;
          }
        }else {
          Toast('该款商品不能加入购物车')
        }
      }
    },
    //立即购买
    addBuy(type) {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        if (this.info.restrict === '-1') {
          Dialog.confirm({
            message: '您的一分购次数用完了，去签到可以获得一分购的权益。',
            confirmButtonText: '去签到',
            confirmButtonColor: '#EA3323',
            cancelButtonText: '关闭'
          }).then(() => {
            this.$router.push({
              name: 'sign'
            })
          }).catch(() => {
            // on cancel
          });
        }else {
          if (this.goodUser.ygrade === '3' && this.info.zones.giftZone !== undefined) {
            Dialog.confirm({
              message: '这是礼品区商品，请先升级会员',
              confirmButtonText: '去升级',
              confirmButtonColor: '#EA3323',
              cancelButtonText: '关闭'
            }).then(() => {
              this.$router.push({
                name: 'upgradeShopkeeper'
              })
            }).catch(() => {
              // on cancel
            });
          }else {
            this.addType = type
            this.showBase = true;
          }
        }
      }
    },

    openPreview(data) {
      data.imageList = this.skuImgList
      this.ImagePreviewDialog = ImagePreview({
        images: data.imageList,
        startPosition: 0,
        onClose() {
          // do something
        }
      });
    },
    //加入购物车
    onAddCartClicked(data) {
      this.svcs = [];
      for(let i = 0; i<this.svcList.length; i++) {
        for(let j = 0; j<this.svcList[i].values.length; j++) {
          if(this.svcList[i].values[j].flag == true) {
            this.svcs.push(this.svcList[i].values[j].svcId)
          }
        }
      }
      let fromData = {
        cartId: '0',
        skuId: data.selectedSkuComb.skuId,
        num: data.selectedNum,
        svcs: this.svcs
      }
      Models.Home
      .add(fromData)
      .then(res => {
        this.showBase = false
        if(res.data.code === '0') {
          Toast('添加成功')
        }else {
          Toast(res.data.msg + '，添加失败')
        }
      })
    },
    //立即购买
    onBuyClicked(data) {
      this.svcs = [];
      for(let i = 0; i<this.svcList.length; i++) {
        for(let j = 0; j<this.svcList[i].values.length; j++) {
          if(this.svcList[i].values[j].flag == true) {
            this.svcs.push(this.svcList[i].values[j].svcId)
          }
        }
      }
      let fromData = {
        yfrom: 'direct',
        goods: [
          {
            cartId: '0',
            skuId: data.selectedSkuComb.skuId,
            num: String(data.selectedNum),
            svcs: this.svcs
          }
        ]
      }
      fromData = JSON.stringify(fromData)
      sessionStorage.setItem('fromData', fromData)
      this.$router.push({
        name: 'goodsOrder',
        query: {
          ytype: 'good',
          cardId: this.cardId,
          luckyUserId: this.luckyUserId,
        }
      })
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

    //去分享
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
    //店主升级
    goUpgrade(ygrade) {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        if (ygrade === '3') {
          this.$router.push({
            name: 'upgradeQHBoss',
            query: {
              zoneCode: 'BossMemberUpZone'
            }
          })
        }else {
          this.$router.push({
            name: 'upgradeShopkeeper'
          })
        }
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
     //预览评论图片
    watchComment(index) {
      this.ImagePreviewDialog = ImagePreview({
        images: this.commentList.commentPicList,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    },
    //查看更多评价
    watchMore() {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        this.$router.push({
          name: 'comment',
          query: {
            goodId: this.goodId
          }
        })
      }
    },
    //在线客服
    onlineSer() {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        let phone = localStorage.getItem('phone')
        window.location.href = `http://p.qiao.baidu.com/cps/chat?siteId=12820204&userId=26831413&cp=weixin2.4&cr=goodId-${this.goodId}&cw=${phone}`
      }
    },
    //加入购物车
    goToCat() {
      if(localStorage.sessionId == undefined) {
        this.tourist()
      }else {
        this.$router.push({name: 'shoppingCart'})
      }
    },
    //游客模式跳转
    tourist() {
      // localStorage.setItem('loginStateNormal', '1');
      let url = window.location.href
      let agrs = this.$common.getRequest(url);
      // sessionStorage.setItem('goodsDetailId', agrs.goodId)
      // if(this.goRegistered) {
        this.$router.push({
          name: 'login',
          query: {
            goodId: agrs.goodId,
            headPic: agrs.headPic,
            nickName: agrs.nickName,
            ucode: agrs.ucode,
            action: agrs.action,
            subscribe: agrs.subscribe,
            jump: '1',
          }
        })
      // }else {
      //   this.$router.push({
      //     name: 'login',
      //     query: {
      //       goodId: agrs.goodId,
      //       headPic: agrs.headPic,
      //       nickName: agrs.nickName,
      //       ucode: agrs.ucode,
      //       action: agrs.action,
      //       subscribe: agrs.subscribe,
      //       jump: '1',
      //     }
      //   })
      // }
    },
    register() {
      clearInterval(this.timer);
      this.tourist()
    },
    time(){
      this.timer = setInterval(() => {
        if (this.countdown > 0 && this.countdown <= 3) {
          this.countdown--;
          if (this.countdown !== 0) {
            this.codeMsg =  `${this.countdown}s`;
          } else {
            clearInterval(this.timer);
            this.countdown = 3;
            this.timer = null;
            this.tourist()
          }
        }
      }, 1000)
    },

    getOpen(url) {
      let data = encodeURIComponent(url)
      Models.User
      .getOpenid(data)
      .then(res => {
         window.location.replace = res.data
      })
    },

    wxpay(){
      var vm= this;
      if (typeof WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
        if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(), false);
        }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady());
          document.attachEvent('onWeixinJSBridgeReady',vm.onBridgeReady());
        }
      }else{
        vm.onBridgeReady();
      }
    },
    onBridgeReady(){
      WeixinJSBridge.call('hideOptionMenu');
    },

    openWxpay(){
      WeixinJSBridge.call('showOptionMenu');
    },

    //已经关注的老用户静默绑定
    alreadyFollow(userId) {
      let data = {
        userId: userId
      }
      Models.User
      .binduser(data)
      .then(res => {
      })
    },
    //已经登录状态默认去绑定关系
    readyFollow (ucode) {
      let data = {
        id: ucode
      };
       Models.User
      .bindMyInvitor(data)
      .then(res => {
      })
    },
  },
  destroyed () {
    clearTimeout(this.timer);
    // if(this.goToHome == '2') {
    //   window.removeEventListener('popstate', this.goBack, false);
    // }
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(from.path == '/touristHome') {
        vm.touristHomeType = false
      }
    })
  },
  beforeRouteLeave(to, from, next){
    this.ImagePreviewDialog && this.ImagePreviewDialog.close()
    next()
  },
  activated() {
    this.goRegistered = false
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
    if(localStorage.sessionId != undefined && agrs.subscribe !== undefined) {
      this.subFlage = true
      if(agrs.subscribe === '1') {//1是已经关注公众，但没有绑定关系
        let userId = localStorage.getItem('userId')
        this.alreadyFollow(userId)
      }else if(agrs.subscribe === '0') {//0是没关注公众号, 2放行
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
    this.goodId = this.$route.query.goodId;
    this.action = this.$route.query.action;
    this.cardId = this.$route.query.cardId;
    this.luckyUserId = this.$route.query.luckyUserId; // 抽奖提货卡id
    this.init();
    this.getComment();
    this.getContent();
    if (localStorage.sessionId != undefined) {
      if (agrs.ucode !== undefined) {
        this.readyFollow(agrs.ucode)
      }
      this.qRlink(this.goodId)
    }
  },
  created() {
    // this.goodId = this.$route.query.goodId;
    // this.action = this.$route.query.action;
    // this.init();
    // this.getComment();
    // this.getContent();
    // let url = window.location.href;
    // let agrs = this.$common.getRequest(url);
    // if(localStorage.sessionId == undefined) {
    //   let agrsData = {
    //     headPic: agrs.headPic,
    //     nickName: agrs.nickName,
    //     ucode: agrs.ucode,
    //     action: agrs.action,
    //     subscribe: agrs.subscribe
    //   }
    //   let agrsMsg = JSON.stringify(agrsData)
    //   sessionStorage.setItem('agrsInfo', agrsMsg)
    // }else {
    //   this.readyFollow(agrs.ucode)
    //   this.qRlink(this.goodId)
    // }
    // if (localStorage.sessionId != undefined) {
    //   this.readyFollow(agrs.ucode)
    //   this.qRlink(this.goodId)
    // }
  },
  mounted() {
    // this.$nextTick(function () {
    //   document.querySelector("#text").addEventListener("scroll", this.onScroll);
    // });

    setTimeout(() => {
      document.querySelector("#text").addEventListener("scroll", this.onScroll);
      if(this.info.zones.giftZone != '礼品区' && this.info.canShare === '1') {
        this.openWxpay()
        let url = window.location.href.split('#')[0]
        let data = {
          title: this.info.title,
          link: this.shareLink,
          imgUrl: this.info.headPic
        };
        sdk.getJSSDK(url, data)
      }else {
        this.wxpay()
      }
    }, 1000);
  },
  components: {}
};
</script>

<style lang="less">
.goodsDetails-page {
  padding-bottom: 50px;
  width: 100%;
  height: calc(100vh + 1px);
  overflow-y: scroll;
  -webkit-overflow-scrolling:touch;
  background-color: #f2f2f2;

  .banner-top {
    position: relative;
    padding: 16px 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: none;

    .go {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 51px;
      height: 51px;

      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 35px;
        height: 35px;
      }
    }

    .list {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 10px;
      width: 275px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > a {
        line-height: 24px;
        font-size: 14px;
        text-align: center;
        color: #333;
        border-bottom: 2px solid transparent;

        &.activeLine {
          color: #ea3323;
          border-bottom: 2px solid #ea3323;
        }
      }
    }

    &.head {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      display: block;
    }
  }

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

  .info {
    width: 100%;

    .activity-price {
      padding: 6px 16px 6px;
      width: 100%;
      background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
      display: flex;
      justify-content: space-between;

      .activity-left {
        width: 70%;

        .price-box {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;

          .p-icon {
            position: absolute;
            bottom: 2px;
            font-size: 14px;
            color: #fff;
          }

          .miney {
            padding-left: 15px;
            font-size: 25px;
            font-weight: 600;
            color: #fff;
          }

          .p-huibei {
            padding: 1px 6px 2px;
            margin-left: 10px;
            font-size: 12px;
            background-color: #FFF100;
            border-radius: 4px;
          }
        }

        .m-price {
          margin-top: -2px;
          font-size: 13px;
          color: #fff;
        }
      }

      .activity-right {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;

        .rob {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          padding: 1px 10px;
          // line-height: 21px;
          font-size: 12px;
          text-align: center;
          background-color: #FFC7CD;
          color: #EA3323;
          border-radius: 10px;
        }
      }
    }

    .upgrade-level {
      width: 100%;
      // height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .upgrade-price {
        padding: 15px 0 15px 15px;
        width: 235px;
        font-size: 15px;
        background-color: #FDE0A8;

        > span {
          > b {
            color: #EA3323;
          }
        }

        .pie {
          font-weight: bold;
          color: #EA3323;
        }
      }

      .go-upgrade {
        padding: 15px 0;
        width: 140px;
        font-size: 15px;
        text-align: center;
        background: -webkit-linear-gradient( #FECE3D , #FFB74F); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient( #FECE3D, #FFB74F); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient( #FECE3D, #FFB74F); /* Firefox 3.6 - 15 */
        background: linear-gradient( #FECE3D , #FFB74F); /* 标准的语法 */
        color: #EA3323;

        > img {
          display: inline-block;
          width: 6px;
        }
      }
    }

    .info-box {
      padding: 13px 15px 15px 15px;
      width: 100%;
      background-color: #fff;

      .goods-title {
        position: relative;
        font-size: 16px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */

        .img {
          display: inline-block;
          padding: 0px 6px;
          height: 18px;
          line-height: 19px;
          font-size: 11px;
          text-align: center;
          color: #fff;
          background-color: #EA3323;
          border-radius: 10px;
        }

        > span {
          vertical-align: middle;
        }
      }

      .msg {
        margin-top: 20px;
        width: 100%;
        font-size: 13px;
        color: #999;
        display: flex;
        justify-content: space-between;

        .m-item {
          font-size: 13px;
          color: #999;
        }
      }
    }

    .share {
      padding: 0 15px 15px 15px;
      width: 100%;
      background-color: #fff;
      overflow: hidden;

      .list {
        width: 100%;
        height: 100%;

        .item {
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
    }
  }

  .welfare-box {
    padding: 0 15px;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
    background-color: #fff;

    .welfare {
      width: 100%;
      display: flex;
      align-items: center;

      .w-title {
        margin-right: 21px;
        font-size: 15px;
        color: #333;
      }

      .w-right {
        position: relative;
        padding: 10px 0;
        flex: 1;
        font-size: 13px;
        color: #EA3323;

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

      .sale-free {
        padding: 10px 0;
        flex: 1;
        font-size: 13px;
        color: #333;

        > img {
          display: inline-block;
          width: 12px;
          vertical-align: middle;
        }

        > span {
          vertical-align: middle;
        }
      }
    }
  }

  .evaluate {
    padding: 16px;
    width: 100%;
    background-color: #fff;

    .e-top {
      width: 100%;

      &::after {
        display: block;
        clear: both;
        content: " ";
      }

      .title {
        float: left;
        font-size: 15px;
      }

      .watch-more {
        float: right;
        margin-top: 2px;
        height: 100%;
        font-size: 12px;
        color: #ea3323;

        > img {
          display: inline-block;
          margin-left: 4px;
          width: 6px;
          height: 10px;
        }
      }
    }

    .e-box {
      margin-top: 14px;
      width: 100%;
      font-size: 15px;
      color: #666;

      .e-user {
        width: 100%;

        .h-user {
          position: relative;
          width: 100%;
          height: 24px;

          .photo {
            position: absolute;
            top: 0;
            left: 0;
            width: 24px;
            height: 24px;
            border-radius: 50%;

            > img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
            }
          }

          .name {
            position: absolute;
            top: 50%;
            left: 30px;
            transform: translateY(-50%);
            font-size: 13px;
          }

          .stars {
            float: right;
            height: 20px;

            > img {
              display: inline-block;
              margin-right: 4px;
              width: 13px;

              &:last-child {
                margin-right: 0;
              }
            }

            .van-rate {
              height: 20px;
              .van-rate__item {
                height: 20px;

                > i {
                  top: 2px;
                }
              }
            }
          }
        }

        .c-user {
          margin-top: 20px;
          font-size: 13px;
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

        .c-img {
          margin-top: 10px;
          width: 100%;

          .list {
            width: 100%;
            display: flex;

            .item {
              margin-right: 4px;
              width: 110px;
              height: 110px;
              overflow: hidden;

              &:last-child {
                margin-right: 0
              }

              > img {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }

  .desc-img {
    margin-top: 10px;
    width: 100%;

    > p {
      width: 100%;

      > img {
        width: 100%;
      }
    }
  }

  .afterSale {
    width: 100%;

    .mssage {
      width: 100%;

      > img {
        width: 100%;
      }
    }
  }

  .purchase {
    position: fixed;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 999;
    display: flex;

    .purchase-l {
      width: 132px;
      height: 50px;
      font-size: 10px;
      color: #333;
      display: table;
      background-color: #fff;
      border-top: 1px solid #f2f2f2;

      .online-service {
        padding: 6px 0;
        width: 50%;
        height: 100%;
        text-align: center;
        display: table-cell;
        vertical-align: middle;

        .icon {
          margin: auto;
          width: 24px;
          height: 24px;

          > img {
            width: 100%;
            height: 100%;
          }
        }

        > span {
          font-size: 9px
        }
      }

      .shop-car {
        padding: 6px 0;
        width: 50%;
        height: 100%;
        text-align: center;
        display: table-cell;
        vertical-align: middle;

        .icon {
          margin: auto;
          width: 24px;
          height: 24px;

          > img {
            width: 100%;
            height: 100%;
          }
        }

        > span {
          font-size: 9px
        }
      }
    }

    .purchase-r {
      width: 243px;
      height: 50px;
      display: table;

      .add-card {
        width: 50%;
        height: 100%;
        font-size: 15px;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        background-color: #333;
        color: #fff;

        &.gray {
          background-color: #999;
        }
      }
      .add-buy {
        width: 50%;
        height: 100%;
        font-size: 15px;
        color: #fff;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        /*! autoprefixer: off */
        background: -webkit-linear-gradient(
          left,
          #EA3323,
          #EA2360
        ); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(
          right,
          #EA3323,
          #EA2360
        ); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(
          right,
          #EA3323,
          #EA2360
        ); /* Firefox 3.6 - 15 */
        background: linear-gradient(
          to right,
          #EA3323,
          #EA2360
        ); /* 标准的语法 */
        /* autoprefixer: on */
      }
    }
  }

  .buy {
    width: 100%;

    .van-popup--bottom.van-popup--round {
      border-radius: 0;
    }

    .van-sku-container {
      max-height: 80%;

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
              border: 1px solid transparent;

              &::before {
                background: #F2F2F2
              }

              &.van-sku-row__item--active {
                color: #EA3323;
                border-color: #EA3323;
                background: #FEF6F5;
              }

              .van-sku-row__item-name {
                padding: 7px 15px;
              }
            }
          }
        }
      }
      .van-sku-actions {
        padding: 0;

        > div, button {
          height: 50px;
          font-size: 18px;
          border-radius: 0;

          &.van-button--danger {
            background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
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

  .goRegistered {
    width: 100%;
    height:100%;
    position: fixed;
    display: flex;
    align-items: center;
    display: -webkit-flex;
    top: 0;
    background:rgba(0,0,0,0.5);
    z-index: 9999;

    .goRegisteredWindow {
      width: 240px;
      height:117px;
      background:#ffffff;
      margin: 0 auto;
      position: relative;
      border-radius: 8px;

      .offShareImg {
        position: absolute;
        z-index: 9;
        right: 0;
        top: 0;
        font-size: 0;
        background: #fff;
        border-radius: 50%;
      }

      .goRegisteredTitle {
        width: 100%;
        color:#333333;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        font-weight: bold;
        font-size: 15px;
        text-align: center;
        line-height: 68px;
        height:69px;
        border:1px solid #EAEAEA;
      }

      .goRegisteredBtn {
        width: 100%;
        height:47px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        font-size: 15px;
        line-height:47px;
        color:#EA3323;
        text-align: center;
      }
    }
  }
  .van-dialog {
    .van-dialog__content {
      .van-dialog__message {
        color: red;
      }
    }
  }
}
</style>
