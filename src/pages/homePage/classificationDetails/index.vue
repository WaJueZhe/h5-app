<template>
  <div class="classificationDetails-page">
    <div class="search-top">
      <div class="search-box">
        <img src="@/assets/homePage/srerch_icon.png" alt="">
        <form action="JavaScript:return true;">
          <input type="search" placeholder="请输入关键字" ref="search" v-model.trim="keyword" @keyup.enter="search">
        </form>
        <img class="close" v-show=" keyword != '' " src="@/assets/homePage/close-02.png" alt="" @click="keyword = ''">
      </div>
    </div>
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
        <li class="item" @click="screen" :class="{ tabActive: screenIndex == 1 }">
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
        <div class="new-products">
          <GoodsList v-if="isShowGoodList" :goodsList="goodsList"></GoodsList>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import GoodsList from '@/components/goodsList'
import RightAnimation from '@/components/rightAnimation'
import { PullRefresh, List } from 'vant';
Vue.use(PullRefresh).use(List);
export default {
  name: 'classificationDetails',
  data() {
    return {
      tabType: true,
      goodsList: [],
      keyword: '',//搜索关键字
      page: '1',//第几页
      size: '10',//每页条数
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

      isShowGoodList: false,
      loading: false,
      finished: false,
      isLoading: false,
      noDataText: '',
    };
  },
  watch: {

  },
  methods: {
    init() {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size,
        keyword: this.keyword,
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
        if(res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          setTimeout(() => {
            this.loading = false
          }, 1000);
          this.isShowGoodList = true;
          this.goodsList = this.goodsList.concat(res.data.info.list)
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if(this.goodsList.length == 0) {
            this.noDataText = '抱歉，没有搜索到相关数据'
          }else {
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    search() {
      this.isShowGoodList = false
      this.resetFrom()
      this.page = '1'
      this.init()
      this.$refs.search.blur()
      let historyList = localStorage.getItem('historyList').split(',')
      historyList.unshift(this.keyword)
      historyList = Array.from(new Set(historyList))
      localStorage.setItem('historyList', historyList)
    },
    tabToggle(index) {
      this.activeIndex = index
      if(index == 0) {
        this.orderBy = ''
        this.orderWay = 'desc'
        this.goodsList = []
      }
      if(index == 1) {
        this.orderBy = 'hot'
        if(this.topGray1 && this.botGray1) {
          this.topGray1 = false;
          this.topRed1 = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }else if(this.topRed1 && this.botGray1) {
          this.topRed1 = false;
          this.botGray1 = false;
          this.topGray1 = true;
          this.botRed1 = true;
          this.orderWay = 'desc'
          this.goodsList = []
        }else if(this.topGray1 && this.botRed1) {
          this.topGray1 = false;
          this.botRed1 = false;
          this.topRed1 = true;
          this.botGray1 = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }
      }else {
        this.topGray1 = true;
        this.botGray1 = true;
        this.topRed1 = false;
        this.botRed1 = false;
      }
      if(index == 2) {
        this.orderBy = 'price'
        if(this.topGray && this.botGray) {
          this.topGray = false;
          this.topRed = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }else if(this.topRed && this.botGray) {
          this.topRed = false;
          this.botGray = false;
          this.topGray = true;
          this.botRed = true;
          this.orderWay = 'desc'
          this.goodsList = []
        }else if(this.topGray && this.botRed) {
          this.topGray = false;
          this.botRed = false;
          this.topRed = true;
          this.botGray = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }
      }else {
        this.topGray = true;
        this.botGray = true;
        this.topRed = false;
        this.botRed = false;
      }
      if(index == 3) {
        this.orderBy = 'sale'
        if(this.topGray2 && this.botGray2) {
          this.topGray2 = false;
          this.topRed2 = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }else if(this.topRed2 && this.botGray2) {
          this.topRed2 = false;
          this.botGray2 = false;
          this.topGray2 = true;
          this.botRed2 = true;
          this.orderWay = 'desc'
          this.goodsList = []
        }else if(this.topGray2 && this.botRed2) {
          this.topGray2 = false;
          this.botRed2 = false;
          this.topRed2 = true;
          this.botGray2 = true;
          this.orderWay = 'asc'
          this.goodsList = []
        }
      }else {
        this.topGray2 = true;
        this.botGray2 = true;
        this.topRed2 = false;
        this.botRed2 = false;
      }
      this.isShowGoodList = false
      this.page = 1
      this.init()
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
      this.maskShow = false
      this.screenIndex = 1
      this.page = '1'
      this.goodsList = []
      this.init()
    },
    //重置
    reset() {
      this.lowPrice = ''
      this.highPrice = ''
      this.price = []
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      let self = this;
      setTimeout(() => {
        if(this.goodsList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1
          let data = {
            page: this.page,
            size: this.size,
            keyword: this.keyword,
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
            if(res.data.code == '0') {
              this.isLoading = false
              // 加载状态结束
              setTimeout(() => {
                this.loading = false
              }, 1000);
              this.goodsList = []
              this.goodsList = res.data.info.list
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
              if(this.goodsList.length == 0) {
                this.noDataText = '抱歉，没有搜索到相关数据'
              }else {
                this.noDataText = '没有更多了'
              }
              this.page = Number(this.page) + 1;
            }
          })
        }
      }, 500);
    },

    /**
     * 上拉获取
     */
    onLoad() {
      this.init();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    resetFrom() {
      this.isShowGoodList = false
      this.page = 1
      this.goodsList = [];
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
  },
  computed: {

  },
  created() {
    this.keyword = this.$route.query.keyword
    this.init()
  },
  mounted() {

  },

  components: {
    GoodsList,
    RightAnimation
  },
};
</script>

<style lang="less">
.classificationDetails-page {
  width: 100%;
  height: 100%;

  .search-top {
    position: fixed;
    top: 0;
    left: 0;
    padding: 0 15px;
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    background: #fff;
    overflow: hidden;

    .search-box {
      padding: 0 14px;
      width: 100%;
      height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #F2F2F2;
      border-radius: 20px;
      display: flex;
      align-items: center;

      > img {
        display: inline-block;
        width: 13px;
        height: 13px;
        vertical-align: top
      }

      >form {
        width: 100%;

        > input {
          padding: 0 6px;
          width: 100%;
          height: 30px;
          background-color: #F2F2F2;
        }
      }

      .close {
        width: 20px;
        height: 20px;
      }
    }
  }

  .tab-group {
    position: fixed;
    top: 44px;
    left: 0;
    padding: 0 15px;
    width: 100%;
    border-top: 1px solid #EAEAEA;
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

  .new-products {
    margin-top: 90px;
    width: 100%;
    background-color: #fff;

    .group {
      padding-top: 0 !important;
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
};
</style>
