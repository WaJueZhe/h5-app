<template>
  <div class="homePage-page">
    <div class="search-top">
      <!-- <div class="news">
        <router-link :to="{ name: 'messageCenter' }">
          <img src="@/assets/homePage/news.png" alt="">
        </router-link>
        <span  v-if="unread > 0"></span>
      </div> -->
      <router-link to="/searchHistory" class="search-box">
        <p>
          <img src="@/assets/homePage/srerch_icon.png" alt="">
          <span>速腾商务净水器</span>
        </p>
      </router-link>
      <div class="scan" @click="scan">
        <img src="@/assets/homePage/scan_icon.png" alt="">
      </div>
      <div class="news" @click="showShare()">
        <img src="@/assets/homePage/QRcode_icon.png" alt="">
      </div>
    </div>
    <div class="tab-nav" :class="tLeft">
      <van-tabs :azy-render="false" sticky v-model="tabActiveIndex">
        <van-tab
         v-for="(tab, tanIndex) in tabList"
         :title="tab.name"
         :key="tanIndex"
         style="flex-basis: 0;">
        </van-tab>
      </van-tabs>
    </div>
    <!-- 今日推荐 -->
    <div class="home-box" v-if="tabActiveIndex == 0">
      <div class="wrapper">
        <div class="home-group">
          <div class="banner">
            <van-swipe :autoplay="5000" :indicator-color="'#fff'">
              <van-swipe-item v-for="(image, index) in homeSlide" :key="index">
                <div @click="bannerJumpType(image.jumpType, image.jumpVal)" style="display: block;height: 100%;">
                  <img v-lazy="image.pic" />
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
          <!-- B端 -->
          <div class="top-nav">
            <ul class="list">
              <li class="item" v-if="ygrade > 3">
                <router-link :to="{ name: 'giftExclusive', query: { zoneCode: 'giftZone', shopId: '0' } }">
                  <img src="@/assets/homePage/gift_icon.png" alt="">
                  <span>礼品采购</span>
                </router-link>
              </li>
              <li class="item" v-if="ygrade == 3">
                <router-link :to="{ name: 'hotSell', query: { zoneCode: 'hotZone', shopId: '0' } }">
                  <img src="@/assets/homePage/hot02_icon.png" alt="">
                  <span>热卖专区</span>
                </router-link>
              </li>
              <li class="item">
                <router-link :to="{ name: 'newsArea', query: { zoneCode: 'newZone', shopId: '0' } }">
                  <img src="@/assets/homePage/new_icon.png" alt="">
                  <span>每日上新</span>
                </router-link>
              </li>
              <li class="item">
                <router-link :to="{ name: 'newsArea', query: { zoneCode: 'specZone', shopId: '0' } }">
                  <img src="@/assets/homePage/hot_icon.png" alt="">
                  <span>天天特价</span>
                </router-link>
              </li>
              <li class="item">
                <router-link :to="{ name: 'service', query: { zoneCode: 'serveZone', shopId: '0' } }">
                  <img src="@/assets/homePage/service_icon.png" alt="">
                  <span>企惠服务+</span>
                </router-link>
              </li>
              <li class="item">
                <router-link :to="{ name: 'luckDraw' }">
                  <img src="@/assets/homePage/choujiang_icon.png" alt="">
                  <img class="absolutely" src="@/assets/homePage/absolutely.png" alt="">
                  <span>幸运抽奖</span>
                </router-link>
              </li>
            </ul>
          </div>
          <!-- 今日优选礼品活动 -->
          <div class="activity">
            <router-link :to="{ name: 'sign' }" class="one-buy">
              <img src="@/assets/homePage/oneBuy-banner.png" alt="">
            </router-link>
            <div class="gift-group">
              <ul class="g-list">
                <li class="g-item" v-for="(item, index) in todayGift" :key="index" @click="goJumpVal(item.jumpType, item.jumpVal)">
                  <div class="img">
                    <img :src="item.pic" alt="">
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 新人专属 -->
          <div class="new-exclusive">
            <router-link :to="{ name: 'newcomerBenefits', query: { newPeople: '1', zoneCode: 'newEmployeeBenefitsZone', zoneName: '新人专属福利' } }">
              <img src="@/assets/homePage/exclusive-banner.png" alt="">
            </router-link>
          </div>

          <!-- 品牌精选 -->
          <div class="brand-selection">
            <div class="brand">
              <h3 class="b-title">品牌精选</h3>
              <div class="factory">出厂价直售</div>
            </div>
            <div class="b-group">
              <ul class="b-list">
                <li class="b-item" v-for="(item, index) in brandPromote" :key="index">
                  <router-link :to="{ name: 'classificationDetails', query: { keyword: item.brandName } }">
                    <img :src="item.pic" class="img">
                    <div class="samll-title">{{ item.brandName }}</div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <!-- 新店主专属区 -->
          <div class="new-Shopkeeper" v-if="shoperGift != null">
            <div class="skp-top">
              <img src="@/assets/homePage/exclusive.png" alt="">
            </div>
            <ul class="skp-list">
              <li class="skp-item" v-for="(item, index) in shoperGift" :key="index">
                <router-link :to="{ name: 'goodsDetails', query: { goodId: item.jumpVal } }">
                  <div class="skp-img">
                    <img v-lazy="item.pic" />
                  </div>
                  <div class="skp-content">
                    <div class="skp-title">
                      <div class="title">{{ item.title }}</div>
                      <div class="num">已抢{{ item.good.sales | numberMany }}件</div>
                    </div>
                    <div class="skp-dct" v-if="item.good.dePoint > 0">
                      <span>此商品可用惠呗￥{{ item.good.dePoint }}</span>
                    </div>
                    <div class="skp-msg">
                      <div class="msg-l">
                        <span class="skp-money">￥{{ item.good.price }}</span>
                        <span v-if="item.good.profitList.length > 0">
                          <span class="skp-earn" v-if="item.good.profitList.length > 0">{{  item.good.profitList[0] + '~' + item.good.profitList[1] | priceFilter }}</span>
                        </span>
                      </div>
                      <div class="msg-r">
                        <div class="skp-buy">
                          <router-link :to="{ name: 'goodsDetails', query: { goodId: item.jumpVal } }">立即购买</router-link>
                        </div>
                        <div class="skp-share" @click.prevent="goShare(item.jumpVal, index)">分享赚</div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
          <!-- 为你推荐 -->
          <div class="recommend" v-if="rmdList.length > 0">
            <div class="recommend-title">
              <!-- <span>为你推荐</span> -->
              <img src="@/assets/homePage/Recommended for you.png" alt="">
            </div>
            <div class="aa"></div>
            <div class="recommend-box">
            <van-list
              v-model="rmdLoading"
              :finished="rmdFinished"
              finished-text="没有更多了"
              @load="homeInfinite"
              :immediate-check="false"
              class="van-clearfix"
            >
              <GoodsList v-if="rmdIsShowGoodList" :goodsList="rmdList"></GoodsList>
            </van-list>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 其他tab选项 -->
    <div class="tab-content" v-if="tabActiveIndex != 0">
      <!-- 筛选 -->
      <div class="tab-group">
        <ul class="list">
          <li class="item" :class="{ tabActive: activeIndex == 0 }" @click="tabToggle('0')">
            <span class="text">综合</span>
          </li>
          <li class="item" :class="{ tabActive: activeIndex == 1 }" @click="tabToggle('1')">
            <span class="text">人气</span>
            <img class="top-j" v-show="topGray1" src="@/assets/homePage/top-gray.png" alt="">
            <img class="top-j" v-show="topRed1" src="@/assets/homePage/top-red.png" alt="">

            <img class="bot-j" v-show="botGray1" src="@/assets/homePage/bot-gray.png" alt="">
            <img class="bot-j" v-show="botRed1" src="@/assets/homePage/bot-red.png" alt="">
          </li>
          <li class="item" :class="{ tabActive: activeIndex == 2 }" @click="tabToggle('2')">
            <span class="text">价格</span>
            <img class="top-j" v-show="topGray" src="@/assets/homePage/top-gray.png" alt="">
            <img class="top-j" v-show="topRed" src="@/assets/homePage/top-red.png" alt="">

            <img class="bot-j" v-show="botGray" src="@/assets/homePage/bot-gray.png" alt="">
            <img class="bot-j" v-show="botRed" src="@/assets/homePage/bot-red.png" alt="">
          </li>
          <li class="item" :class="{ tabActive: activeIndex == 3 }" @click="tabToggle('3')">
            <span class="text">销量</span>
            <img class="top-j" v-show="topGray2" src="@/assets/homePage/top-gray.png" alt="">
            <img class="top-j" v-show="topRed2" src="@/assets/homePage/top-red.png" alt="">

            <img class="bot-j" v-show="botGray2" src="@/assets/homePage/bot-gray.png" alt="">
            <img class="bot-j" v-show="botRed2" src="@/assets/homePage/bot-red.png" alt="">
          </li>
          <li class="item" :class="{ tabActive: screenIndex == 1 }" @click="screen">
            <span class="text">筛选</span>
            <img class="img" v-if="screenIndex == 0" src="@/assets/homePage/screen.png" alt="">
            <img class="img" v-else src="@/assets/homePage/screen-red.png" alt="">
          </li>
        </ul>
      </div>
      <RightAnimation :maskShow="maskShow" @mask="maskShow = false">
        <div slot="content" class="content">
          <h5>价格区间</h5>
          <div class="info-box">
            <input type="text" class="price" v-model.trim="lowPrice" placeholder="最低价">
            <div class="line"></div>
            <input type="text" class="price" v-model.trim="highPrice" placeholder="最高价">
          </div>
          <div class="bottom">
            <div class="reset" @click="reset">重置</div>
            <div class="sure" @click="confirm">确定</div>
          </div>
        </div>
      </RightAnimation>
        <van-pull-refresh v-model="isLoading"
          @refresh="onRefresh">
          <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="noDataText"
              @load="onLoad"
              :immediate-check="false"
              class="van-clearfix"
            >
        <div class="all-products">
          <div class="noOrder" v-show="noOrder">
            <img src="@/assets/homePage/defaultpage_icon.png" alt="">
          </div>
          <GoodsList v-if="isShowGoodList" :goodsList="otherList"></GoodsList>
        </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 分享 -->
    <div class="share-box" v-if="isCanvas" @click="closeImg" @touchmove.prevent>
      <div class="c-img" @click.stop>
        <div class="offShareImg" @click="closeImg()" >
          <van-icon name="clear" size="24px" />
        </div>
        <img :src="canvasImage">
      </div>
      <div class="btn" @click.stop>
        <span>请长按图片发送给好友</span>
      </div>
    </div>
    <!-- 新年弹框 -->
    <div class="newYear-box" v-if="newYearBox == '1'">
      <div class="year-box">
        <div class="year-img">
          <img :src="newYearInfo.content" alt="">
        </div>
        <div class="year-close" @click="closeYearBtn">
          <van-icon name="clear" size="24px" />
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios';
import Models from '@/models'
import GoodsTop from '@/components/goodsTop'
import GoodsList from '@/components/goodsList'
import Footer from '@/components/footer'
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import RightAnimation from '@/components/rightAnimation'
import { Swipe, SwipeItem, Lazyload, Toast, Tab, Tabs , Icon, Dialog, Loading, PullRefresh, List } from 'vant';
import { constants } from 'zlib';
Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Toast).use(Tab).use(Tabs).use(Icon).use(Dialog).use(Loading).use(List).use(PullRefresh);
export default {
  name: 'home',
  data() {
    return {
      userCode: localStorage.getItem('userCode'),//自己的邀请码
      dataURL:"",
      tabList: [],//tab栏
      tabActiveIndex: 0,
      ygrade: '',// 级别
      homeSlide: [],//轮播图
      unread: '',//获取未读站内信数量
      todayGift: [],//今日优选礼品
      brandPromote: [],//品牌精选
      shoperGift: [],//新店主专区
      //为你推荐
      rmdPage: '1',
      rmdSize: '10',
      rmdTotal: '',
      rmdList: [],//为你推荐
      rmdLoading: false,
      rmdFinished: false,
      rmdIsShowGoodList: false,

      // 其他tab栏数据
      page: '1',
      size: '10',
      total: '',
      categoryId: '0',//可选参数)分类id[categoryId为空，没有分类要求]
      brandId: '0',//品牌id[brandId为空，没有品牌要求]
      shopId: '1',//店铺id(shopId 为空，搜索所有的商品，=1为平台自营产品，shopId>1为店铺内商品搜索)
      orderBy: '',//商品排序。"sale":按销量排序(默认)，"price":按价格排序，“hot”:热度
      orderWay: 'desc',//排序规则。"desc": 降序排列，"asc": 升序排列
      price: ['0', '0'],

      activeIndex: 0,
      screenIndex: 0,
      topGray: true,
      botGray: true,
      topRed: false,
      botRed: false,
      topGray1: true,
      botGray1: true,
      topRed1: false,
      botRed1: false,
      topGray2: true,
      botGray2: true,
      topRed2: false,
      botRed2: false,

      maskShow: false,//筛选遮罩层
      lowPrice: '',//最低价
      highPrice: '',//最高价
      otherList: [],
      invite1Id: '',//邀请人
      fromNickName: '',
      canvasImage: '',//分享赚的图片
      isCanvas: false,//分享图片的显示
      shareTitle: '',
      sharePrice: '',
      shareGoodId: '',
      userNickName: '',

      isShowGoodList: false,
      loading: false,
      finished: false,
      isLoading: false,
      noDataText: '',
      noOrder:false,
      tLeft:"",
      vipPrice: '',//分享vip的价格
      newYearBox: '', // 新年弹框
      newYearInfo: {},
    };
  },
  filters: {
    priceFilter(value) {
      let val = value.split('~')
      if((parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0) && (parseFloat(val[0]) == parseFloat(val[1]))) {
        return '/' + '赚' + val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) != 0 ) {
        return '/' + '赚' + val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0 ) {
        return '/' + '赚' + val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) == 0 ) {
        return ''
      }
    },
  },
  watch: {
    tabActiveIndex(newVal, oldVal) {
      this.isShowGoodList = false;
      this.loading = false;
      this.finished = false;
      this.isLoading = false;
      if(newVal != 0) {
        this.bus.$emit('getLoading', {
          loading: true,
          text: '加载中...'
        });
        for(let i = 1; i < this.tabList.length; i++) {
          if(newVal == i) {
            this.categoryId = this.tabList[i].categoryId;
            this.page = '1';
            this.resetFrom();
            this.reset()
            this.tabInit()
          }
        }
      }
    },
  },
  methods: {
    // 新年弹框
    getYearImg () {
      Models.Home
      .obtain()
      .then(res => {
        if (res.data.code == 0) {
          this.newYearInfo = res.data.info
          if (this.newYearInfo.status == '1') {
            this.newYearBox = localStorage.getItem('newYearBox') || this.newYearInfo.status
          }else {
            this.newYearBox = this.newYearInfo.status
          }
        }
      })
    },
    // 关闭新年弹框
    closeYearBtn () {
      localStorage.setItem('newYearBox', '2')
      this.newYearBox = '2'
    },
    //首页扫一扫
    getCode (qr) {
      let data = {
        id: qr
      }
      Models
      .User
      .getCodeInfo(data)
      .then(res => {
        if (res.data.code === '0') {
          let agrs = res.data.info
          if (agrs.action == 'good') {//产品分享
            if(agrs.gtype === '4') {
              window.location.href = `${ this.$php.phpUrl }/#/upgradeDetail?qhyh=${agrs.qhyh}&nickName=${agrs.nickName}&headPic=${agrs.headPic}&goodId=${agrs.goodId}&ucode=${agrs.ucode}&action=${agrs.action}&gtype=${agrs.gtype}`
            }else {
              window.location.href = `${ this.$php.phpUrl }/#/goodsDetails?goodId=${agrs.goodId}&ucode=${agrs.ucode}&action=${agrs.action}`
            }
          }else if(agrs.action == 'user') {//用户分享
            if (agrs.ucode == this.userCode) {
              Toast("不可以扫描自己的分享码哦~");
              return
            }
            if(this.invite1Id > 0) {
              Dialog.alert({
                message: '已经有邀请人',
                confirmButtonText: '知道了',
                confirmButtonColor: '#EA3323'
              }).then(() => {
                // on close
              });
            }else {
              this.$router.push({
                name: 'userInvitation',
                query: {
                  headPic: agrs.headPic,
                  nickName: agrs.nickName,
                  ucode: agrs.ucode,
                }
              })
            }
          }else if(agrs.action == 'depoint') {//线下惠呗抵扣
            if (agrs.ucode == this.userCode) {
              Toast("不可以扫描自己的惠呗商家码哦~");
              return
            }
            this.$router.push({
              name: 'huibeiDeduction',
              query: {
                action: agrs.action,
                headPic: agrs.headPic,
                nickName: agrs.nickName,
                ucode: agrs.ucode,
                gradeName: agrs.gradeName,
              }
            })
          }else if (agrs.action == 'boss') {
            window.location.href = `${ this.$php.phpUrl }/#/upgradeQHBoss?qhyh=${agrs.qhyh}&nickName=${agrs.nickName}&headPic=${agrs.headPic}&ucode=${agrs.ucode}&action=${agrs.action}&gtype=${agrs.gtype}`
          }
        }
      })
    },
    //校验提货卡
    getCheckCard (cardId) {
      let data = {
        str: 'payCar',
        payPassword: cardId
      }
      Models.Home
      .pickCardCheck(data)
      .then(res => {
        if (res.data.code === '0') {
          let goodId = res.data.info.goodId
          this.$router.push({
            name: 'goodsDetails',
            query: {
              action: 'good',
              goodId: goodId,
              cardId: cardId
            }
          })
        }else {
          Toast(res.data.msg)
        }
      })
    },
    //获取用户信息
    getUser() {
      Models
      .User
      .getInfo()
      .then(res => {
        if(res.data.code === '0') {
          this.invite1Id = res.data.info.invite1Id
          this.userNickName = res.data.info.nickName
          localStorage.setItem('ygrade', res.data.info.member.ygrade);
          localStorage.setItem('gradeName', res.data.info.member.gradeName);
          localStorage.setItem('nextGradeName', res.data.info.member.nextGradeName);
        }
      })
    },
    //扫一扫
    scan() {
      let that = this
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            var result = res.resultStr; //扫码返回的结果
            let agrs = that.$common.getRequest(result);
            if (agrs.qr !== undefined) {
              that.getCode(agrs.qr)//去查询对应的商品详情
            }else if (agrs.card !== undefined) {
              that.getCheckCard(agrs.card)//去校验提货卡
            }else {
              Toast("扫描二维码不合法");
            }
          }
        });
      })
    },
    //生成分享二维码
    showShare () {
      this.$router.push({
        name: 'shareExtensionChart'
      })
    },

    //请求二维码
    qRcode () {
      let data = {
        type: 'user',
        goodId: '',
        cat: 'all'
      };
      Models.User
      .getQRcode(data)
      .then( res => {
        if ( res.data.code === '0' ) {
          this.dataURL = res.data.info.pic
        }
      })
    },

    //轮播图跳转到分类
    bannerJumpType(jumpType, jumpVal) {
      // 类型 jumpType：  0-无连接 1-产品连接 2- 连接分类 3- 连接活动页面 4-自定义连接  5- 产品关键词搜索
      // 链接 jumpVal： 产品连接-产品ID， 连接分类-分类ID， 连接活动页面-活动Id(暂时不用)， 自定义连接-URL, 产品关键词搜索 - 产品搜索关键词
      if (jumpType === '1') {
        this.$router.push({
          name: "goodsDetails",
          query: {
            goodId: jumpVal
          }
        })
      }else if (jumpType === '2') {
        for(let i = 0; i < this.tabList.length; i++) {
          if(jumpVal == this.tabList[i].categoryId) {
            this.tabActiveIndex = i
          }
        }
      }else if (jumpType === '3' || jumpType === '4') {
        window.location.href = jumpVal
      }else if (jumpType === '5') {
        this.$router.push({
          name: "classificationDetails",
          query: {
            keyword: jumpVal
          }
        })
      }
    },
    //分别跳转
    goJumpVal (jumpType, jumpVal) {
      if (jumpType === '1') {
        this.$router.push({
          name: 'goodsDetails',
          query: {
            goodId: jumpVal
          }
        })
      }else if (jumpType === '2') {
        for(let i = 0; i < this.tabList.length; i++) {
          if(jumpType == this.tabList[i].categoryId) {
            this.tabActiveIndex = i
          }
        }
      }else if (jumpType === '3' || jumpType === '4') {
        window.location.href = jumpVal
      }else if (jumpType === '5') {
        this.$router.push({
          name: 'classificationDetails',
          query: {
            keyword: jumpVal
          }
        })
      }
    },

    //获取未读站内信数量
    getdMessage() {
      Models.Home
      .getUnreadMessage()
      .then(res => {
        if(res.data.code === '0') {
          this.unread = Number(res.data.info.activity) + Number(res.data.info.notice) + Number(res.data.info.orderFlow) + Number(res.data.info.profit)
        }
      })
    },

    //轮播图
    getSwiper() {
      Models.Home
      .swiper()
      .then(res => {
        if(res.data.code === '0') {
          // this.homeSlide = res.data.info.homeSlide;
          this.todayGift = res.data.info.todayGift;//今日优选礼品
          //品牌精选--数据处理
          this.brandPromote = res.data.info.brandPromote
          //新店主专区
          this.shoperGift = res.data.info.shoperGift

          let slide = res.data.info.homeSlide
          for (let i = 0; i < slide.length; i++) {
            if (slide[i].ysort === '1') {
              this.homeSlide.splice(0, 0, slide[i])
            }else if (slide[i].ysort === '2') {
              this.homeSlide.splice(1, 0, slide[i])
            }else if (slide[i].ysort === '3') {
              this.homeSlide.splice(2, 0, slide[i])
            }else if (slide[i].ysort === '4') {
              this.homeSlide.splice(3, 0, slide[i])
            }else if (slide[i].ysort === '5') {
              this.homeSlide.splice(4, 0, slide[i])
            }else if (slide[i].ysort === '6') {
              this.homeSlide.splice(5, 0, slide[i])
            }else if (slide[i].ysort === '7') {
              this.homeSlide.splice(6, 0, slide[i])
            }else if (slide[i].ysort === '8') {
              this.homeSlide.splice(7, 0, slide[i])
            }
          }
        }
      })
    },
    // 为你推荐数据
    rmdInit() {
      let data = {
        page: this.rmdPage,
        size: this.rmdSize,
        keyword: '',
        categoryId: '0',
        brandId: '0',
        shopId: '0',
        orderBy: '',
        orderWay: 'desc',
        price: []
      }
      Models.Home
      .searchGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          this.rmdList = this.rmdList.concat(res.data.info.list)
          // 加载状态结束
          setTimeout(() => {
            this.rmdLoading = false
          }, 1000);
          this.rmdIsShowGoodList = true
          this.rmdTotal = Math.ceil(Number(res.data.info.total) / Number(this.rmdSize))
          this.rmdPage = Number(this.rmdPage) + 1;
        }
      })
    },
    // 为你推荐上拉加载数据
    homeInfinite() {
      // 异步更新数据
      this.rmdInit();
      if (this.rmdPage >= this.rmdTotal) {
        this.rmdFinished = true;
      }
    },
    tabToggle(index) {
      this.activeIndex = index
      if(index == 0) {
        this.orderBy = ''
        this.orderWay = 'desc'
        this.otherList = []
      }
      if(index == '1') {
        this.orderBy = 'hot'
        if(this.topGray1 && this.botGray1) {
          this.topGray1 = false;
          this.topRed1 = true;
          this.orderWay = 'asc'
          this.otherList = []
        }else if(this.topRed1 && this.botGray1) {
          this.topRed1 = false;
          this.botGray1 = false;
          this.topGray1 = true;
          this.botRed1 = true;
          this.orderWay = 'desc'
          this.otherList = []
        }else if(this.topGray1 && this.botRed1) {
          this.topGray1 = false;
          this.botRed1 = false;
          this.topRed1 = true;
          this.botGray1 = true;
          this.orderWay = 'asc'
          this.otherList = []
        }
      }else {
        this.topGray1 = true;
        this.botGray1 = true;
        this.topRed1 = false;
        this.botRed1 = false;
      }
      if(index == '2') {
        this.orderBy = 'price'
        if(this.topGray && this.botGray) {
          this.topGray = false;
          this.topRed = true;
          this.orderWay = 'asc'
          this.otherList = []
        }else if(this.topRed && this.botGray) {
          this.topRed = false;
          this.botGray = false;
          this.topGray = true;
          this.botRed = true;
          this.orderWay = 'desc'
          this.otherList = []
        }else if(this.topGray && this.botRed) {
          this.topGray = false;
          this.botRed = false;
          this.topRed = true;
          this.botGray = true;
          this.orderWay = 'asc'
          this.otherList = []
        }
      }else {
        this.topGray = true;
        this.botGray = true;
        this.topRed = false;
        this.botRed = false;
      }
      if(index == '3') {
        this.orderBy = 'sale'
        if(this.topGray2 && this.botGray2) {
          this.topGray2 = false;
          this.topRed2 = true;
          this.orderWay = 'asc'
          this.otherList = []
        }else if(this.topRed2 && this.botGray2) {
          this.topRed2 = false;
          this.botGray2 = false;
          this.topGray2 = true;
          this.botRed2 = true;
          this.orderWay = 'desc'
          this.otherList = []
        }else if(this.topGray2 && this.botRed2) {
          this.topGray2 = false;
          this.botRed2 = false;
          this.topRed2 = true;
          this.botGray2 = true;
          this.orderWay = 'asc'
          this.otherList = []
        }
      }else {
        this.topGray2 = true;
        this.botGray2 = true;
        this.topRed2 = false;
        this.botRed2 = false;
      }
      this.isShowGoodList = false
      this.page = 1
      this.tabInit()
    },
    //筛选
    screen() {
      this.maskShow = true
    },
    //确定
    confirm() {
      this.isShowGoodList = false
      this.price[0] = this.lowPrice
      this.price[1] = this.highPrice
      this.page = '1'
      this.screenIndex = 1
      this.maskShow = false
      this.otherList = []
      this.tabInit()
    },
    //重置
    reset() {
      this.lowPrice = ''
      this.highPrice = ''
      this.price = []
    },
    getTabList() {
      let data = {
        shopId: '1',
        parentId: '0'
      }
      Models.Home
      .getShopSortList(data)
      .then(res => {
        if(res.data.code === '0') {
          this.tabList = res.data.info.list;
          this.tabList.unshift({
            name: '今日推荐'
          })
        }
      })
    },
    tabInit() {
      this.loading = true
      this.finished = false
      this.noOrder = false
      let data = {
        page: this.page,
        size: this.size,
        keyword: '',
        categoryId: this.categoryId,
        brandId: this.brandId,
        shopId: this.shopId,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        price: this.price
      }
      Models.Home
      .searchGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          this.isLoading = false
          this.otherList = this.otherList.concat(res.data.info.list)
          // 加载状态结束
          setTimeout(() => {
            this.loading = false
            this.bus.$emit('getLoading', {loading: false});
          }, 1000);
          this.isShowGoodList = true
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.otherList.length == 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1
        }
      })
    },
    //关闭分享赚
    closeImg() {
      this.bus.$emit('getLoading', {
        loading: false,
      });
      this.isCanvas = false;
      this.$common.allowBodyScroll()
    },
    //点击分享赚
    goShare(goodId, index) {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      });
      let data = {
        type: 'good',
        goodId: goodId,
        cat: 'all'
      };
      Models.User
      .getQRcode(data)
      .then( res => {
        if (res.data.code === '0') {
          this.bus.$emit('getLoading', {
            loading: false,
          });
          this.isCanvas = true
          this.canvasImage = res.data.info.codePicList[0]
        }else {
          Toast('图片开小差了，请稍后再试~')
          this.closeImg()
        }
      })
      this.$common.forbidBodyScroll()
    },
     /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
          if(this.otherList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.noOrder = false
            this.isShowGoodList = false
            this.loading = true
            this.finished = false
            this.page = 1
            let data = {
              page: this.page,
              size: this.size,
              keyword: '',
              categoryId: this.categoryId,
              brandId: this.brandId,
              shopId: this.shopId,
              orderBy: this.orderBy,
              orderWay: this.orderWay,
              price: this.price
            }
            Models.Home
            .searchGoods(data)
            .then(res => {
              if(res.data.code === '0') {
                this.isLoading = false
                // 加载状态结束
                setTimeout(() => {
                  this.loading = false
                }, 1000);
                this.otherList = []
                this.otherList = res.data.info.list
                this.isShowGoodList = true;
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
                if (this.otherList.length === 0) {
                  this.noOrder = true;
                  this.noDataText = ''
                } else {
                  this.noOrder = false;
                  this.noDataText = '没有更多了'
                }
                this.page = Number(this.page) + 1
              }
            })
          }
      }, 500);
    },
    /**
     * 上拉获取
     */
    onLoad() {
      this.tabInit();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    resetFrom() {
      this.otherList = []
      this.activeIndex = 0;
      this.screenIndex = 0;
      this.topGray    = true;
      this.botGray    = true;
      this.topRed     = false;
      this.botRed     = false;
      this.topGray1   = true;
      this.botGray1   = true;
      this.topRed1    = false;
      this.botRed1    = false;
      this.topGray2   = true;
      this.botGray2   = true;
      this.topRed2    = false;
      this.botRed2    = false;
      this.lowPrice   = '';
      this.highPrice  = '';
      this.price      = [];
      this.orderBy    = '';
      this.orderWay   = 'desc';
    },

    handleTouchStart (event) {
      let name = event.changedTouches[0].target.className;
      if ( name === "van-ellipsis" || name === "van-tab") {
        this.tLeft = "";
      }else {
        this.tLeft = "gunA";
      }
    },
    handleTouchEnd (event) {
      let name = event.changedTouches[0].target.className;
      if ( name === "van-ellipsis" || name === "van-tab") {
        this.tLeft = "";
      }else {
        this.tLeft = "gunA";
      }
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
  },
  computed: {

  },

  created() {
    if (localStorage.sessionId != undefined) {
      this.getYearImg();
    }
    // 使用微信扫一扫，扫描提货卡返回的状态,通过渠道商品详情,失败来到首页提示
    let agrs = this.$common.getRequest(window.location.href);
    if (agrs.cardStatus !== undefined) {
      if (agrs.cardStatus === '1') {
        Toast('提货卡已被使用，请联系客服！')
      }else if (agrs.cardStatus === '2') {
        Toast('提货卡已失效，请联系客服！')
      }else if (agrs.cardStatus === '3') {
        Toast('提货卡未激活，请联系客服！')
      }else if (agrs.cardStatus === '4') {
        Toast('提货卡信息异常！')
      }else if (agrs.cardStatus === '5') {
        Toast(' 请按照提货卡流程进行提货！')
      }
    }
    let url = window.location.href.split('#')[0]
    sdk.getJSSDK(url);
    this.ygrade = localStorage.getItem('ygrade');
    this.getUser();
    this.getSwiper();
    this.getTabList();
    this.rmdInit()

  },
  mounted() {
    window.addEventListener('touchstart', this.handleTouchStart, false);
    window.addEventListener('touchend', this.handleTouchEnd, false);
  },
  activated () {
    let url = window.location.href;
    let agrs = this.$common.getRequest(url);
    if(localStorage.sessionId != undefined && agrs.subscribe != undefined) {
      if(this.isNew == true) return
      if(agrs.subscribe == '1') {//1是已经关注公众，但没有绑定关系；
        let userId = localStorage.getItem('userId')
        this.alreadyFollow(userId)
      }else if(agrs.subscribe == '0') {//0是没关注公众号，2放行
        let userId = localStorage.getItem('userId')
        this.$router.push({
          name: 'follow',
          query: {
            goodId: '666',
            userId: userId
          }
        })
      }
    }
    this.getdMessage();
  },
  components: {
    GoodsList,
    GoodsTop,
    'v-footer': Footer,
    RightAnimation
  },
};
</script>

<style lang="less">

.bgc {
  background-color: #fff;
}

.homePage-page {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;

  .search-top {
    position: fixed;
    top: 0;
    left: 0;
    padding: 0 8px;
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bgc();
    z-index: 999;

    .scan {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;

      > img {
        margin: auto;
        width: 24px;
        height: 24px;
      }
    }

    .news {
      position: relative;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;

      > a {
        display: block;
        width: 34px;
        height: 34px;
      }

      > img {
        margin: auto;
        width: 24px;
        height: 24px;
      }

      > span {
        position: absolute;
        top: 8px;
        right: 6px;
        width: 6px;
        height: 6px;
        background-color: #EA3323;
        border-radius: 50%;
      }
    }

    .search-box {
      // width: 275px;
      width: 272px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #F2F2F2;
      border-radius: 20px;
      color: #999;
      display: flex;
      align-items: center;

      > p {
        width: 100%;
        overflow: hidden;

        > img {
          display: inline-block;
          margin-top: 3px;
          width: 13px;
          height: 13px;
          vertical-align: top
        }
      }
    }

    .news {
      width: 34px;
      height: 34px;

      > a {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #fff;

        > img {
          margin: auto;
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .tab-nav {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    height: 38px;
    z-index: 999;
    background-color: #fff;

    .van-tabs {
      .van-tabs__wrap {
        .van-tabs__nav {
          display: flex;
          .van-tab {
            flex: 1 !important;
            min-width: unset !important;
            padding: 0 10px !important;
            color: #333;
          }

          .van-tab--active {
            color: #EA3323
          }
        }
      }
    }
  }

  .gunA {
    .van-tabs__nav--line {
      overflow-x: hidden!important;
    }
  }

  .home-box {
    margin-top: 88px;
    width: 100%;
    height: 100%;

    .wrapper {
      padding-bottom: 40px;
      width: 100%;
      height: 100%;

      .home-group {
        width: 100%;
        height: 100%;

        .banner {
          width: 100%;
          height: 150px;
          background-color: #fff;

          .van-swipe {
            width: 100%;
            height: 150px;

            .van-swipe__track {
              width: 100%;

              .van-swipe-item {
                > a {
                  width: 100%;
                  height: 100%;

                  > img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }

            .van-swipe__indicators {
              > i {
                width: 8px;
                height: 8px;
              }
            }
          }
        }

        .top-nav {
          width: 100%;
          background-color: #fff;
          z-index: 99;

          .list {
            padding: 12px 16px 16px 16px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .item {
              font-size: 12px;
              text-align: center;
              color: #333;

              > a {
                position: relative;
                display: block;
                width: 100%;

                > img {
                  width: 54px;
                  height: 54px;
                }

                .absolutely {
                  position: absolute;
                  top: 0;
                  right: -10px;
                  width: 28px;
                  height: 15px;
                }
              }

              &:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .today-gift {
          padding: 15px;
          margin-top: 8px;
          width: 100%;
          .bgc();

          .samll-title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;

            > img {
              display: inline-block;
              width: 24px;
              height: 24px;
              vertical-align: middle
            }

            > span {
              vertical-align: bottom
            }
          }

          .gift-area {
            margin-top: 15px;
            width: 100%;
            height: 170px;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;

            .area-left {
              margin-right: 13px;
              width: 158px;
              height: 100%;

              > a {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 8px;

                > img {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
                }
              }
            }

            .area-right {
              flex: 1;
              height: 100%;

              .r-top {
                width: 100%;
                height: 80px;

                &:first-child {
                  margin-bottom: 10px;
                }

                > a {
                  display: block;
                  width: 100%;
                  height: 100%;

                  > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                  }
                }
              }
            }
          }
        }

        .activity {
          width: 100%;
          background-color: #fff;

          .one-buy {
            display: block;
            width: 100%;

            > img {
              width: 100%;
            }
          }

          .gift-group {
            padding: 15px;
            width: 100%;
            background-color: #FF3C42;

            .g-list {
              width: 100%;
              height: 110px;
              display: flex;
              justify-content: space-between;

              .g-item {
                position: relative;
                width: 110px;
                height: 110px;

                .img {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 110px;
                  border-radius: 3px;
                  overflow: hidden;

                  > img {
                    width: 100%;
                    height: 110px;
                  }
                }
              }
            }
          }
        }

        .new-exclusive {
          margin-top: 8px;
          width: 100%;

          > a, img {
            width: 100%;
          }
        }

        .brand-selection {
          padding: 10px 20px;
          width: 100%;
          height: 100px;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .brand {
            width: 110px;
            color: #333;

            .b-title {
              font-size: 18px;
            }

            .factory {
              font-size: 12px;
            }
          }

          .b-group {
            flex: 1;

            .b-list {
              width: 100%;
              display: flex;
              justify-content: space-between;

              .b-item {
                width: 80px;

                > a {
                  display: block;
                  width: 100%;

                  .img {
                    margin: auto;
                    width: 60px;
                    height: 60px;
                  }

                  .samll-title {
                    margin-top: 8px;
                    width: 100%;
                    font-size: 10px;
                    text-align: center;
                    color: #EA3323;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
            }
          }
        }

        .new-Shopkeeper {
          margin-top: 8px;
          width: 100%;
          overflow: hidden;

          .skp-top {
            width: 100%;
            height: 44px;
            background-color: #fff;

            > img {
              margin: auto;
              height: 44px;
              vertical-align: middle;
            }
          }

          .skp-list {
            width: 100%;

            .skp-item {
              margin-bottom: 8px;
              width: 100%;

              > a {
                display: block;
                padding-bottom: 10px;
                width: 100%;
                height: 100%;
                background-color: #fff;

                &:last-child {
                  margin-bottom: 0;
                }

                .skp-img {
                  width: 100%;
                  height: 160px;

                  > img {
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                  }
                }

                .skp-content {
                  padding: 0 16px;
                  width: 100%;

                  .skp-title {
                    padding: 8px 0;
                    display: flex;
                    justify-content: space-between;

                    .title {
                      width: 253px;
                      font-size: 14px;
                      font-weight: bold;
                      color: #333;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    }

                    .num {
                      width: 90px;
                      font-size: 12px;
                      text-align: right;
                      color: #999;
                    }
                  }

                  .skp-dct {
                    width: 100%;
                    display: flex;
                    align-items: center;

                    > span {
                      position: relative;
                      padding: 2px 6px;
                      font-size: 10px;
                      color: #EA3323;
                      border-radius: 4px;

                      &::after {
                        content: "";
                        width: 200%;
                        height: 200%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        border: 1px solid #EA3323;
                        border-radius: 4px;
                        -webkit-transform: scale(.5);
                        transform: scale(.5);
                        -webkit-transform-origin: top left;
                        transform-origin: top left;
                      }
                    }
                  }

                  .skp-msg {
                    margin-top: 4px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;

                    .msg-l {
                      width: 215px;
                      line-height: 26px;
                      overflow: hidden;

                      .skp-money {
                        font-size: 18px;
                        font-weight: bold;
                        color: #EA3323;
                      }

                      .skp-line {
                        font-size: 14px;
                        color: #EA3323;
                      }

                      .skp-earn {
                        font-size: 13px;
                        font-weight: 500;
                        color: #F19B38;
                      }
                    }

                    .msg-r {
                      width: 160px;
                      font-size: 12px;
                      display: flex;
                      justify-content: space-between;

                      .skp-buy {
                        width: 80px;

                        > a {
                          position: relative;
                          display: block;
                          padding: 6px 0;
                          width: 100%;
                          color: #EA3323;
                          text-align: center;
                          border-radius: 30px;

                          &::after {
                            content: "";
                            width: 200%;
                            height: 200%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            border: 1px solid #EA3323;
                            border-radius: 30px;
                            -webkit-transform: scale(.5);
                            transform: scale(.5);
                            -webkit-transform-origin: top left;
                            transform-origin: top left;
                          }
                        }
                      }

                      .skp-share {
                        padding: 6px 0;
                        margin-left: 10px;
                        width: 70px;
                        border: 1px solid #EA3323;
                        color: #fff;
                        background-color: #EA3323;
                        text-align: center;
                        border-radius: 15px;
                        z-index: 222;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .recommend {
          width: 100%;

          .recommend-title {
            width: 100%;
            height: 44px;
            background-color: #fff;

            > img {
              margin: auto;
              height: 44px;
            }
          }

          .recommend-box {
            .van-list {
              .goodsList-page {
                padding-top: 0;
              }
            }
          }
        }
      }
    }
  }

  .tab-content {
    padding-bottom: 51px;
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;

    .tab-group {
      position: fixed;
      top: 88px;
      left: 0;
      padding: 0 15px;
      width: 100%;
      border-bottom: 1px solid #EAEAEA;
      z-index: 99;
      background: #fff;
      overflow: hidden;

      .list {
        padding: 10px;
        display: flex;
        justify-content: space-between;

        .item {
          position: relative;
          width: 50px;
          font-size: 15px;

          .text {
            display: inline-block;
            width: 50px;
          }

          .top-j {
            position: absolute;
            top: 4px;
            right: 10px;
            width: 6px;
            height: 5px;
          }
          .bot-j {
            position: absolute;
            bottom: 4px;
            right: 10px;
            width: 6px;
            height: 5px;
          }

          .img {
            position: absolute;
            top: 50%;
            right: 4px;
            transform: translateY(-50%);
            width: 15px;
            height: 15px;
          }

          &.tabActive {
            color: #EA3323
          }
        }
      }
    }

    .content {
      padding: 20px 16px;
      width: 100%;

      .info-box {
        margin-top: 20px;
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .line {
          width: 30px;
          height: 1px;
          background-color: #000;
        }

        .price {
          width: 110px;
          height: 30px;
          font-size: 14px;
          text-align: center;
          background-color: #F2F2F2;
          border-radius: 20px;
        }
      }

      .bottom {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;

        > div {
          padding: 10px 0;
          flex: 1;
          font-size: 18px;
          text-align: center;
          border-top: 1px solid #EAEAEA;/* no */

          &:last-child {
            border-top: 1px solid #EA3323;
            color: #fff;
            background-color: #EA3323;
          }
        }
      }
    }

    .all-products {
      margin-top: 130px;
      width: 100%;

      .noOrder {
        position: relative;
        width: 100%;
        height: calc(100vh - 180px);

        > img {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 227px;
        }
      }

      .group {
        padding-top: 0 !important;
      }
    }
  }

  .share-box {
    position: fixed;
    width:100%;
    height:100%;
    top: 0;
    // padding: 0 30px;
    background:rgba(0,0,0,0.8);
    z-index: 9999;
    overflow: hidden;

    // #canvasImg {
    //   visibility: hidden;
    //   position: absolute;
    //   width: 84%;
    //   top: 48%;
    //   transform: translateY(-50%);
    // }

    .canvas-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .c-img {
      position: absolute;
      z-index: 9999;
      width: 80%;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);

      .offShareImg {
        position: absolute;
        z-index: 9;
        right: -11px;
        top: -8px;
        font-size: 0;
        background: #fff;
        border-radius: 50%;
      }

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

  .newYear-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    background-color: rgba(0,0,0,0.3);

    .year-box {
      position: relative;
      padding: 0 25px;
      width: 100%;

      .year-img {
        margin: auto;
        width: 100%;

        > img {
          width: 100%;
          border-radius: 4px;
        }
      }

      .year-close {
        position: absolute;
        z-index: 9;
        right: 11px;
        top: -20px;
        font-size: 0;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
};
</style>
