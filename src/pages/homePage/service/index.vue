<template>
  <div class="service-page">
    <div class="video-box">
      <van-swipe :autoplay="autoplay" @change="onChange" indicator-color="white" :show-indicators="false">
        <!-- <van-swipe-item>
          <video
          class="video-js"
          webkit-playsinline="true"
          playsinline="true"
          x-webkit-airplay="allow"
          style="object-fit:fill"
          poster="http://apk.no1qh.com/video/card.png"
          >
          </video>
        </van-swipe-item> -->
        <van-swipe-item  v-for="(item, index) in swiperList" :key="index" @click="changeSwiper(item)">
          <video
          :id="`myVideo${index}`"
          class="video-js"
          webkit-playsinline="true"
          playsinline="true"
          x-webkit-airplay="allow"
          style="object-fit:fill"
          :poster="item.pic"
          >
          <source
              :src="item.jumpVal"
              type="video/mp4"
          >
          </video>
        </van-swipe-item>
        <!-- <van-swipe-item>
          <video
          id="myVideo2"
          class="video-js"
          webkit-playsinline="true"
          playsinline="true"
          x-webkit-airplay="allow"
          style="object-fit:fill"
          poster="http://resource.no1qh.com/video/vido2.png"
          >
          <source
              src="http://resource.no1qh.com/video/Q2-2.mp4"
              type="video/mp4"
          >
          </video>
        </van-swipe-item>
        <van-swipe-item>
          <video
          id="myVideo3"
          class="video-js"
          webkit-playsinline="true"
          playsinline="true"
          x-webkit-airplay="allow"
          style="object-fit:fill"
          poster="http://resource.no1qh.com/video/vido3.png"
          >
          <source
              src="http://resource.no1qh.com/video/suten.mp4"
              type="video/mp4"
          >
          </video>
        </van-swipe-item>
        <van-swipe-item>
          <video
          id="myVideo4"
          class="video-js"
          webkit-playsinline="true"
          playsinline="true"
          x-webkit-airplay="allow"
          style="object-fit:fill"
          poster="http://resource.no1qh.com/video/vido4.png"
          >
          <source
              src="http://resource.no1qh.com/video/waterPurifier.mp4"
              type="video/mp4"
          >
          </video>
        </van-swipe-item> -->
      </van-swipe>
    </div>
    <div class="banner-text">
      <span v-for="(nav, idx) in swiperList" :key="idx" :class="{ selectActived: selectIndex == idx }"></span>
      <!-- <span :class="{ selectActived: selectIndex == 0 }"></span>
      <span :class="{ selectActived: selectIndex == 1 }"></span>
      <span :class="{ selectActived: selectIndex == 2 }"></span>
      <span :class="{ selectActived: selectIndex == 3 }"></span>
      <span :class="{ selectActived: selectIndex == 4 }"></span> -->
    </div>
    <div class="idealist">
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="noDataText"
          @load="onLoad"
        >
          <div class="area">
            <div class="noOrder" v-show="noOrder">
              <img src="@/assets/homePage/defaultpage_icon.png" alt="">
            </div>
            <GoodsList :goodsList="service"></GoodsList>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import GoodsList from '@/components/goodsList'
import { Tab, Tabs, PullRefresh, List, Swipe, SwipeItem, } from 'vant';
Vue.use(Tab).use(Tabs).use(PullRefresh).use(List).use(Swipe).use(SwipeItem);
export default {
  name: 'service',
  data() {
    return {
      parentId: '0',
      page: '1',
      size: '10',
      total: '',
      service: [],
      zoneCode: '',//(1-新品区,2-特价区,3-礼品区,4-热卖区,5-智能区)
      categoryId: '0',//分类id
      brandId: '0',
      shopId: '0',
      price: ['0', '0'],
      orderBy: '',
      orderWay: 'desc',

      loading: false,
      finished: false,
      isLoading: false,
      noDataText: '',
      noOrder:false,
      tLeft:"",

      videoIndex: 0,
      myPlayer: null,
      selectIndex: 0,

      autoplay:3000,
      swiperList: [],//轮播数据

    };
  },
  watch: {

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
          // 加载状态结束
          this.loading = false
          this.service = this.service.concat(res.data.info.list)
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.service.length === 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '没有更多了'
          }
        }else {
          this.isLoading = false
          this.loading = false
          this.finished = true
          this.noOrder = true
        }
      })
    },

    changeSwiper (item) {
      if (item.jumpType === '1') {
        this.$router.push({
          name: 'goodsDetails',
          query: {
            goodId: item.jumpVal
          }
        })
      }else if (item.jumpType === '3') {
        window.location.href = item.jumpVal
      }else if (item.jumpType === '5') {
        this.$router.push({
          name: 'classificationDetails',
          query: {
            keyword: item.jumpVal
          }
        })
      }
    },

    //获取轮播数据
    getQHserve () {
      Models.Home
      .QHServer()
      .then(res => {
        if (res.data.code === '0') {
          let slide = res.data.info.list
          for (let i = 0; i < slide.length; i++) {
            if (slide[i].ysort === '1') {
              this.swiperList.splice(0, 0, slide[i])
            }else if (slide[i].ysort === '2') {
              this.swiperList.splice(1, 0, slide[i])
            }else if (slide[i].ysort === '3') {
              this.swiperList.splice(2, 0, slide[i])
            }else if (slide[i].ysort === '4') {
              this.swiperList.splice(3, 0, slide[i])
            }else if (slide[i].ysort === '5') {
              this.swiperList.splice(4, 0, slide[i])
            }else if (slide[i].ysort === '6') {
              this.swiperList.splice(5, 0, slide[i])
            }else if (slide[i].ysort === '7') {
              this.swiperList.splice(6, 0, slide[i])
            }else if (slide[i].ysort === '8') {
              this.swiperList.splice(7, 0, slide[i])
            }
          }
          // this.swiperList = res.data.info.list
           this.$nextTick( () => {
            this.myPlayer = this.initVideo(myVideo0);
          });
        }
      })
    },

    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.service.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.noOrder = false
          this.loading = true
          this.finished = false
          let data = {
            page: '1',
            size: '10',
            zoneCode: this.zoneCode,
            categoryId: this.categoryId,
            brandId: this.brandId,
            shopId: this.shopId,
            orderBy: this.orderBy,
            orderWay: this.orderWay,
            price: this.price
          };
          Models.Home
          .searchZoneGoods(data)
          .then(res => {
            if(res.data.code === '0') {
              this.isLoading = false;
              // 加载状态结束
              this.loading = false;
              this.service = [];
              this.service = res.data.info.list;
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
              if (this.service.length === 0) {
                this.noOrder = true;
                this.noDataText = ''
              } else {
                this.noOrder = false;
                this.noDataText = '没有更多了'
              }
            }
          })
        }
      }, 500);
    },
    /**
     * 上拉获取
     */
    onLoad() {
      setTimeout(() => {
        this.page = Number(this.page) + 1;
        this.init();

        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
      }, 1500);
    },
    //手动滑动视频
    onChange (index) {
      this.selectIndex = index
      this.myPlayer.pause()
      if (index == 0) {
        this.myPlayer =  this.initVideo(myVideo0);
      }else if (index == 1) {
        this.myPlayer = this.initVideo(myVideo1);
      }else if (index == 2) {
        this.myPlayer = this.initVideo(myVideo2);
      }else if (index == 3) {
        this.myPlayer = this.initVideo(myVideo3);
      }else if (index == 4) {
        this.myPlayer = this.initVideo(myVideo4);
      }
    },
    initVideo(claseNameId) {
      let that = this
      if (claseNameId === undefined) {
        claseNameId = myVideo0
      }
      //初始化视频方法
      var player = Video(claseNameId, {
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          autoplay: false,
          //是否静音
          muted: false,
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          // preload: "",
          //设置视频播放器的显示宽度（以像素为单位）
          // width: "375px",
          //设置视频播放器的显示高度（以像素为单位）
          // height: "240px"
      },function onPlayerReady() {
        // 结束
        this.on('ended', function() {
          that.autoplay = 3000;
        });
        // 播放
        this.on('play', function() {
          that.autoplay = 300000000;//时间设置不能超过10个0
        });
        // 暂停
        this.on('pause', function() {
          that.autoplay = 3000;
        });

      });
      // var options = {
      //   controls: true,
      //   autoplay: false,
      //   muted: false,
      //   preload: "",
      // };

      // var player = videojs(claseNameId, options, function onPlayerReady() {
      //   videojs.log('Your player is ready!');

      //   // In this context, `this` is the player that was created by Video.js.
      //   this.play();

      //   // How about an event listener?
      //   this.on('ended', function() {
      //     videojs.log('Awww...over so soon?!');
      //   });
      // });
      return player
    }

  },
  computed: {

  },
  deactivated () {

  },
  created() {
    this.zoneCode = this.$route.query.zoneCode;
    this.shopId = this.$route.query.shopId;
    this.init();
    this.getQHserve();
  },
  mounted() {
    // this.$nextTick( () => {
    //   this.myPlayer = this.initVideo(myVideo0);
    // });
  },
  components: {
    GoodsList,
  },
};
</script>

<style lang="less">
.service-page {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;

  .video-box {
    width: 100%;
    background-color: #000;

    .video-js {
      margin: auto;
      width: 100%;
      height: 240px;
      .vjs-big-play-button {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .vjs-control-bar {
        .vjs-control {
          .vjs-icon-placeholder {
            &::before {
              top: 2px;
            }
          }
        }
      }
    }

    // .van-swipe {
    //   .van-swipe__indicators {
    //     bottom: 6px;
    //     .van-swipe__indicator {
    //       width: 10px;
    //       height: 10px;
    //     }
    //   }
    // }
  }

  .banner-text {
    width: 100%;
    height: 50px;
    line-height: 49px;
    font-size: 18px;
    text-align: center;
    background-color: #000;

    > span {
      display: inline-block;
      margin-right: 4px;
      width: 10px;
      height: 10px;
      background-color: #666;
      border-radius: 50%;

      &.selectActived {
        background-color: #fff;
      }
    }
  }

  .area {
    width: 100%;
    height: 100%;

    .noOrder {
      position: relative;
      width: 100%;
      height: calc(100vh - 60px);

      > img {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 227px;
      }
    }
  }

};
</style>
