<template>
  <div class="hotSell-page">
    <div class="tab" v-show="isShow">
      <div class="t-left" :class="tLeft">
        <van-tabs :azy-render="false" sticky v-model="tabActiveIndex">
          <van-tab
          v-for="(tab, tanIndex) in tabList"
          :title="tab.name"
          :key="tanIndex"
          style="flex-basis: 0%;">
          </van-tab>
        </van-tabs>
      </div>
      <div class="drop-down" @click="isShow = false"><img src="@/assets/homePage/down-icon.png" alt=""></div>
    </div>
    <div class="mask" v-show="!isShow" @click="isShow = true">
      <div class="t-group">
        <div class="t-head">
          <span>选择分类</span>
          <div class="img" @click="isShow = true"><img src="@/assets/homePage/down-icon.png" alt=""></div>
        </div>
        <ul class="g-list">
          <li class="g-item"
           v-for="(g, tanIndex) in tabList"
          :key="tanIndex"
          @click="tabToItem(tanIndex, g)"
          >
          <span :class="{ tabActive: tabActiveIndex == tanIndex }">{{ g.name }}</span>
          </li>
        </ul>
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

        <div class="area">
          <div class="noOrder" v-show="noOrder">
            <img src="@/assets/homePage/defaultpage_icon.png" alt="">
          </div>
          <GoodsList v-if="isShowGoodList" :goodsList="newsArea"></GoodsList>
        </div>

      </van-list>
    </van-pull-refresh>
    <v-footer></v-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Footer from '@/components/footer'
import Models from '@/models'
import RightAnimation from '@/components/rightAnimation'
import GoodsList from '@/components/goodsList'
import { Tab, Tabs, PullRefresh, List } from 'vant';
Vue.use(Tab).use(Tabs).use(PullRefresh).use(List);
export default {
  data() {
    return {
      isShow: true,
      parentId: '0',
      tabList: [],
      tabActiveIndex: 0,
      page: '1',
      size: '10',
      total: '',
      newsArea: [],
      zoneCode: 'hotZone',//newZone-新品区,hotZone-热卖区,specZone-特价专区,smartZone-智能专区,giftZone-礼品区
      categoryId: '0',//分类id
      brandId: '0',//品牌id
      shopId: '0',
      price: ['0', '0'],
      orderBy: 'sale',//商品排序。"sale":按销量排序(默认)，"price":按价格排序，“hot”:热度
      orderWay: 'desc',//排序规则。"desc": 降序排列，"asc": 升序排列

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
      noOrder:false,
      tLeft:"",
    };
  },
  watch: {
    tabActiveIndex(newVal, oldVal) {
      this.isShowGoodList = false;
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      });
      if(newVal == 0) {
        this.categoryId = '0'
        this.page = '1';
        this.newsArea = [];
        this.init()
      }else {
        for(let i = 0; i < this.tabList.length; i++) {
          if(newVal == i) {
            this.categoryId = this.tabList[i].categoryId
            this.page = 1;
            this.resetFrom()
            this.reset()
            this.init()
          }
        }
      }
    },
  },
  methods: {
    init() {
      this.noOrder = false
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size,
        zoneCode: this.zoneCode,
        categoryId: this.categoryId,
        brandId: this.brandId,
        shopId: this.shopId,
        orderBy: this.orderBy,
        orderWay: this.orderWay,
        price: this.price
      }
      Models.Home
      .searchZoneGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          this.isLoading = false
          this.newsArea = this.newsArea.concat(res.data.info.list)
          // 加载状态结束
          setTimeout(() => {
            this.loading = false
            this.bus.$emit('getLoading', {loading: false});
          }, 1000);
          this.isShowGoodList = true;
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.newsArea.length == 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    getTabList() {
      let data = {
        shopId: '1',
        parentId: this.parentId
      }
      Models.Home
      .getShopSortList(data)
      .then(res => {
        if(res.data.code == '0') {
          this.tabList = res.data.info.list;
          this.tabList.unshift({
            name: '全部'
          })
        }
      })
    },
    tabToItem(index, item) {
      this.categoryId = item.categoryId
      this.tabActiveIndex = index
      this.isShow = true
    },

    tabToggle(index) {
      this.activeIndex = index
      if(index == 0) {
        this.orderBy = ''
        this.orderWay = 'desc'
        this.newsArea = []
      }
      if(index == 1) {
        this.orderBy = 'hot'
        if(this.topGray1 && this.botGray1) {
          this.topGray1 = false;
          this.topRed1 = true;
          this.orderWay = 'asc'
          this.newsArea = []
        }else if(this.topRed1 && this.botGray1) {
          this.topRed1 = false;
          this.botGray1 = false;
          this.topGray1 = true;
          this.botRed1 = true;
          this.orderWay = 'desc'
          this.newsArea = []
        }else if(this.topGray1 && this.botRed1) {
          this.topGray1 = false;
          this.botRed1 = false;
          this.topRed1 = true;
          this.botGray1 = true;
          this.orderWay = 'asc'
          this.newsArea = []
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
          this.newsArea = []
        }else if(this.topRed && this.botGray) {
          this.topRed = false;
          this.botGray = false;
          this.topGray = true;
          this.botRed = true;
          this.orderWay = 'desc'
          this.newsArea = []
        }else if(this.topGray && this.botRed) {
          this.topGray = false;
          this.botRed = false;
          this.topRed = true;
          this.botGray = true;
          this.orderWay = 'asc'
          this.newsArea = []
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
          this.newsArea = []
        }else if(this.topRed2 && this.botGray2) {
          this.topRed2 = false;
          this.botGray2 = false;
          this.topGray2 = true;
          this.botRed2 = true;
          this.orderWay = 'desc'
          this.newsArea = []
        }else if(this.topGray2 && this.botRed2) {
          this.topGray2 = false;
          this.botRed2 = false;
          this.topRed2 = true;
          this.botGray2 = true;
          this.orderWay = 'asc'
          this.newsArea = []
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

    //确定
    confirm() {
      this.isShowGoodList = false
      this.price[0] = this.lowPrice
      this.price[1] = this.highPrice
      this.page = '1'
      this.screenIndex = 1
      this.maskShow = false
      this.newsArea = []
      this.init()
    },
    //重置
    reset() {
      this.lowPrice = ''
      this.highPrice = ''
      this.price = []
    },

    //筛选
    screen() {
      this.maskShow = true
    },

    /**
     * 下拉刷新
     */
     onRefresh() {
      setTimeout(() => {
        if(this.newsArea.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.noOrder = false
          this.isShowGoodList = false;
          this.loading = true
          this.finished = false
          this.page = 1
          let data = {
            page: this.page,
            size: this.size,
            zoneCode: this.zoneCode,
            categoryId: this.categoryId,
            brandId: this.brandId,
            shopId: this.shopId,
            orderBy: this.orderBy,
            orderWay: this.orderWay,
            price: this.price
          }
          Models.Home
          .searchZoneGoods(data)
          .then(res => {
            if(res.data.code === '0') {
              this.isLoading = false
              // 加载状态结束
              setTimeout(() => {
                this.loading = false
              }, 1000);
              this.newsArea = []
              this.newsArea = res.data.info.list
              this.isShowGoodList = true;
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
              if (this.newsArea.length === 0) {
                this.noOrder = true;
                this.noDataText = ''
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
      //数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    resetFrom() {
      this.newsArea = []
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
  },
  computed: {

  },
  created() {
    this.zoneCode = this.$route.query.zoneCode;
    this.shopId = this.$route.query.shopId
    this.getTabList();

  },
  activated () {

  },
  mounted() {
    this.init()
    window.addEventListener('touchstart', this.handleTouchStart, false);
    window.addEventListener('touchend', this.handleTouchEnd, false)
  },
  components: {
    'v-footer': Footer,
    GoodsList,
    RightAnimation
  },
};
</script>

<style lang="less">
.hotSell-page {
  padding-bottom: 51px;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;

  .tab {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background-color: #fff;
    border-bottom: 1px solid #F2F2F2;
    z-index: 999;

    .t-left {
      position: absolute;
      top: 0;
      left: 0;
      width: 90%;

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
          }
        }
      }
    }

    .gunA {
      .van-tabs__nav--line {
        overflow-x: hidden!important;
      }
    }

    .drop-down {
      position: absolute;
      top: 0;
      right: 0;
      width: 45px;
      height: 44px;
      background-color: #fff;
      z-index: 999;

      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 15px;
        height: 15px;
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0,.5);
    z-index: 9999;

    .t-group {
      width: 100%;
      background-color: #fff;

      .t-head {
        padding-left: 12px;
        width: 100%;
        height: 44px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F2F2F2;
        overflow: hidden;

        .img {
          width: 45px;
          height: 45px;
          background-color: #fff;
          display: flex;
          align-items: center;

          > img {
            margin: auto;
            width: 15px;
            height: 15px;
            transform: rotate(180deg)
          }
        }
      }

      .g-list {
        padding-bottom: 24px;
        width: 100%;
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;

        .g-item {
          margin-top: 24px;
          margin-right: 5px;
          width: 90px;
          font-size: 14px;
          text-align: center;

          > span {
            padding-bottom: 4px;

            &.tabActive {
              color: #EA3323;
            }
          }

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }

  .tab-group {
    position: fixed;
    top: 44px;
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

  .area {
    margin-top: 90px;
    width: 100%;
    height: 100%;

    .noOrder {
      position: relative;
      width: 100%;
      height: calc(100vh - 150px);

      > img {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 227px;
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
};
</style>
