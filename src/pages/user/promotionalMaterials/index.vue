<template>
  <div class="promotionalMaterials-page">
    <div class="banner">
      <img src="@/assets/user/promotional.png" alt="">
    </div>
    <div class="tab-nav">
      <van-tabs v-model="active" @click="tabActive">
        <van-tab title="营销素材"></van-tab>
        <van-tab title="官方海报"></van-tab>
        <van-tab title="官方视频"></van-tab>
      </van-tabs>
    </div>
    <div class="time-box">
      <div class="time">每日早上9点-10点  中午12点-1点 下午17点-19点推效果更好</div>
    </div>
    <!-- 营销素材 -->
    <van-pull-refresh v-model="isLoading"
      @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="我也是有底线的~"
          @load="onLoad"
          :immediate-check="false"
          class="van-clearfix"
        >
        <div class="marketing" v-show="active == 0">
          <ul class="list">
            <li class="item" v-for="(item, index) in materiaList" :key="index">
              <div class="top">
                <div class="pic">
                  <img src="@/assets/user/logo.png" alt="">
                </div>
                <div class="title">{{ item.marketTitle }}</div>
              </div>
              <div class="content">
                <div class="text">{{ item.marketDesc }}</div>
                <div :class="`copy copyId${index}`" @click="copyText(index)" :data-clipboard-text="item.marketDesc">复制文案</div>
                <div class="img-group" v-if="item.marketPicList.length > 0">
                  <div class="img-item" v-for="(img, imgIndex) in item.marketPicList" :key="imgIndex" @click="watchPhoto(item.marketPicList, imgIndex)">
                    <img :src="img" alt="">
                  </div>
                </div>
                <div class="info">
                  <div class="forward">点击图片，长按可下载图片</div>
                  <!-- <div class="for-text">{{ item.shareNums | numberMany }}人已转发</div> -->
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 官方海报 -->
        <div class="official-poster" v-show="active == 1">
          <ul class="list">
            <li class="item" v-for="(item, index) in billList" :key="index">
              <div class="pic" @click="watchImg(item, index)">
                <img :src="item.marketPicList[0]" alt="">
              </div>
              <div class="small-title">{{ item.marketTitle }}</div>
            </li>
          </ul>
        </div>
        <!-- 官方视频 -->
        <div class="marketing" v-show="active == 2">
          <ul class="list">
            <li class="item" v-for="(video, index) in videoList" :key="index">
              <div class="top">
                <div class="pic">
                  <img src="@/assets/user/logo.png" alt="">
                </div>
                <div class="title">{{ video.marketTitle }}</div>
              </div>
              <div class="content">
                <div class="text">{{ video.marketDesc }}</div>
                <div class="video-group" @click="playVideo(video, index)">
                  <img class="video-img" :src="video.marketPicList[0]" alt="">
                  <img class="play-btn" src="@/assets/user/shipin_icon.png" alt="">
                </div>
                <!-- <div class="info">
                  <div class="forward">
                    <div class="pic-group" v-if="video.latestSharedUsers.length > 0">
                      <div class="pic" v-for="(share, sIndex) in video.latestSharedUsers" :key="sIndex">
                        <img :src="share.headPic" alt="">
                      </div>
                    </div>
                    <div class="for-text">{{ video.shareNums | numberMany }}人已转发</div>
                  </div>
                  <div class="circle" @click="downloadVideo(video)">一键发圈</div>
                </div> -->
              </div>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models';
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import Clipboard from 'clipboard'
import { Tab, Tabs, PullRefresh, List, Toast, ImagePreview } from 'vant';
Vue.use(Tab).use(Tabs).use(PullRefresh).use(List).use(ImagePreview);
export default {
  name: 'promotionalMaterials',
  data() {
    return {
      active: 0,
      materiaList: [], // 营销素材数据
      billList: [], // 海报数据
      videoList: [], // 视频数据
      page: 1,
      size: 10,
      total: '',
      loading: false,
      finished: false,
      isLoading: false,
      ImagePreviewDialog: '',
    };
  },
  watch: {

  },
  methods: {
    // 复制文案
    copyText (index) {
      var clipboard = new Clipboard(`.copyId${index}`)
        clipboard.on('success', e => {
        Toast('复制成功')
          // 释放内存
          clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        Toast('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    tabActive (index) {
      this.page = 1
      if (index === 0) {
        this.materiaList = []
        this.getSourceMateria()
      }else if (index === 1) {
        this.billList = []
        this.getBill()
      }else if (index === 2) {
        this.videoList = []
        this.getVideo()
      }
    },
    // 获取营销素材的数据
    getSourceMateria () {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size
      }
      Models.User
      .getMaterialList(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.materiaList = this.materiaList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    // 预览营销素材的图片
    watchPhoto(img, index) {
      this.ImagePreviewDialog = ImagePreview({
        images: img,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    },
    // 跳转分享海报
    watchImg(item, index) {
      this.$router.push({
        name: 'watchImage',
        query: {
          marketDocId: item.marketDocId
        }
      })
    },
    // 获取海报的数据
    getBill () {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size
      }
      Models.User
      .getPosterList(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.billList = this.billList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    // 获取视频
    getVideo () {
      this.loading = true
      this.finished = false
      let data = {
        page: this.page,
        size: this.size
      }
      Models.User
      .getVideoList(data)
      .then(res => {
        if (res.data.code == '0') {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.videoList = this.videoList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    // 播放视频
    playVideo (item, index) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = item.marketVideo
      link.setAttribute('download', 'test.mp4')
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if (this.active === 0) {
          if(this.materiaList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1;
            let data = {
              page: this.page,
              size: this.size,
            };
            Models.User
            .getMaterialList(data)
            .then( res => {
              if ( res.data.code == '0' ) {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.materiaList = []
                this.materiaList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                this.page = Number(this.page) + 1;
              }
            })
          }
        }else if (this.active === 1) {
          if(this.billList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1;
            let data = {
              page: this.page,
              size: this.size,
            };
            Models.User
            .getPosterList(data)
            .then( res => {
              if ( res.data.code == '0' ) {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.billList = []
                this.billList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                this.page = Number(this.page) + 1;
              }
            })
          }
        }else if (this.active === 2) {
          if(this.videoList.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.loading = true
            this.finished = false
            this.page = 1;
            let data = {
              page: this.page,
              size: this.size,
            };
            Models.User
            .getVideoList(data)
            .then( res => {
              if ( res.data.code == '0' ) {
                this.isLoading = false
                // 加载状态结束
                this.loading = false
                this.videoList = []
                this.videoList = res.data.info.list
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                this.page = Number(this.page) + 1;
              }
            })
          }
        }
      }, 500);
    },

    /**
     * 上拉获取
     */
    onLoad() {
      if (this.active === 0) {
        this.getSourceMateria();
      }else if (this.active === 1) {
        this.getBill()
      }else if (this.active === 2) {
        this.getVideo()
      }
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
  },
  computed: {

  },
  beforeRouteLeave(to, from, next){
    this.ImagePreviewDialog && this.ImagePreviewDialog.close()
    next()
  },
  created() {
    this.getSourceMateria()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.promotionalMaterials-page {
  width: 100%;

  .banner {
    width: 100%;

    > img {
      width: 100%;
    }
  }

  .tab-nav {
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
  }

  .time-box {
    padding: 0 22px;
    margin-top: 10px;
    width: 100%;

    .time {
      padding: 4px 14px;
      font-size: 10px;
      text-align: center;
      background-color: #FFEEEE;
      color: #EA3323;
      border-radius: 14px;
    }
  }

  .marketing {
    padding: 15px;
    width: 100%;

    .list {
      width: 100%;

      .item {
        padding-bottom: 20px;
        margin-bottom: 20px;
        width: 100%;
        border-bottom: 1px solid #EAEAEA;

        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        .top {
          width: 100%;
          display: flex;
          align-items: center;

          .pic {
            width: 40px;
            height: 40px;
            overflow: hidden;

            > img {
              width: 100%;
            }
          }

          .title {
            padding-left: 8px;
            font-size: 15px;
            font-weight: bold;
            color: #333;
          }
        }

        .content {
          padding-left: 48px;
          width: 100%;
          overflow: hidden;

          .text {
            font-size: 14px;
            line-height: 1.6;
          }

          .copy {
            float: left;
            padding: 3px 6px;
            margin-top: 4px;
            font-size: 14px;
            border: 1px solid #EAEAEA;
            border-radius: 4px;
          }

          .img-group {
            padding-top: 15px;
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .img-item {
              margin-right: 10px;
              margin-bottom: 10px;
              width: 90px;
              height: 90px;
              border-radius: 3px;
              overflow: hidden;

              &:nth-child(3n) {
                margin-right: 0;
              }

              &:last-child {
                margin-right: 0;
              }

              > img {
                width: 100%;
                border-radius: 3px;
              }
            }
          }

          .video-group {
            position: relative;
            margin-top: 15px;
            width: 100%;
            height: 127px;
            overflow: hidden;

            .video-js {
              margin: auto;
              width: 100%;
              height: 100%;
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

            .video-img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            .play-btn {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50px;
              height: 50px;
            }
          }

          .info {
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: space-between;;
            align-items: center;

            .forward {
              flex: 1;
              font-size: 14px;
              display: flex;
              overflow: hidden;

              .pic-group {
                overflow: hidden;

                .pic {
                  float: left;
                  width: 22px;
                  height: 22px;
                  border: 1px solid #EAEAEA;
                  border-radius: 50%;

                  &:nth-child(2) {
                    margin-left: -11px;
                    z-index: 10;
                  }

                  &:nth-child(3) {
                    margin-left: -11px;
                    z-index: 11;
                  }

                  > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
                }
              }

              .for-text {
                padding-left: 8px;
                float: left;
                font-size: 12px;
                line-height: 22px;
              }
            }

            .circle {
              width: 70px;
              height: 28px;
              line-height: 28px;
              font-size: 12px;
              text-align: center;
              background: -webkit-linear-gradient(left, #EA3323 , #EA2360); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(right, #EA3323, #EA2360); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(right, #EA3323, #EA2360); /* Firefox 3.6 - 15 */
              background: linear-gradient(to right, #EA3323 , #EA2360); /* 标准的语法 */
              color: #fff;
              border-radius: 14px;
            }

            .for-text {
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  .official-poster {
    padding: 15px;
    width: 100%;

    .list {
      width: 100%;
      display: flex;
      flex-flow: wrap;

      .item {
        margin-right: 7px;
        margin-bottom: 20px;
        width: 110px;

        &:nth-child(3n) {
          margin-right: 0;
        }

        .pic {
          width: 100%;
          height: 150px;
          border-radius: 4px;
          overflow: hidden;

          > img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }

        .small-title {
          margin-top: 10px;
          font-size: 12px;
          text-align: center;
          color: #333;
        }
      }
    }
  }
};
</style>
