<template>
  <div class="comment-page">
      <van-pull-refresh v-model="isLoading"
      @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          class="van-clearfix"
        >
        <div class="comment">
          <ul class="list">
            <li class="item" v-for="(item, index) in commentList" :key="index">
              <div class="top-head">
                <div class="img">
                  <img v-if="item.headImagePic == null" src="@/assets/homePage/avatar.png" alt="">
                  <img v-if="item.headImagePic != null" :src="item.headImagePic" alt="">
                </div>
                <div class="text">
                  <div class="title">
                    <div class="name" v-if="item.isAnonymous == '1'">{{ item.nickname | nicknameFilter }}</div>
                    <div class="name" v-else>{{ item.nickname }}</div>
                    <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd') }}</div>
                  </div>
                  <div class="star" v-if="item.describeStar > 0">
                    <img v-for="(stars, idx) in Number(item.describeStar)" :key="idx" src="@/assets/homePage/red-star.png" alt="">
                    <img v-for="(ig, ik) in item.grayImg" :key="ik" src="@/assets/homePage/gray-star.png" alt="">
                  </div>
                </div>
              </div>
              <div class="cont" v-if="item.content">{{ item.content }}</div>
              <div class="explain" v-if="item.skuAttrs != null">
                <span v-for="(s, sIndex) in item.skuAttrs" :key="sIndex">{{ s.name }}：{{ s.value }}</span>
              </div>
              <div class="image" v-if="item.commentPicList.length > 0">
                <ul class="i-list">
                  <li class="i-item" v-for="(img, imgIndex) in item.commentPicList" :key="imgIndex" @click="preImg(item.commentPicList, imgIndex)">
                    <img :src="img" alt="">
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from "@/models";
import { ImagePreview, PullRefresh, List } from 'vant';
Vue.use(ImagePreview).use(PullRefresh).use(List);
export default {
  name: 'comment',
  data() {
    return {
      goodId: '',
      commentList: [],
      page: '1',
      size: '10',
      total: '',

      loading: false,
      finished: false,
      isLoading: false
    };
  },
  filters: {
    nicknameFilter(item) {
      let name = null;
      if (item.length >= 1 && item.length <= 2) {
        name = item.slice(0, 1) + "*";
      } else if (item.length == 3) {
        name = item.slice(0, 1) + "**";
      } else if (item.length >= 4) {
        name = item.slice(0, 1) + "**" + item.slice(3, 4);
      }
      return name;
    },
  },
  watch: {

  },
  methods: {
    init() {
      this.loading = true
      this.finished = false
      let data = {
        goodId: this.goodId,
        page: this.page,
        size: this.size,
      }
      Models.Home
      .getCommentList(data)
      .then(res => {
        if(res.data.code == '0') {
           this.isLoading = false
          // 加载状态结束
          this.loading = false;
          this.commentList = this.commentList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          this.page = Number(this.page) + 1;
          for(let i = 0; i < this.commentList.length; i++) {
            this.commentList[i].describeStar = Number(this.commentList[i].describeStar)
            this.commentList[i].grayImg = 5 - Number(this.commentList[i].describeStar)
          }
        }
      })
    },
    //预览图片
    preImg(img, index) {
      this.ImagePreviewDialog = ImagePreview({
        images: img,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.commentList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1;
          let data = {
            goodId: this.goodId,
            page: this.page,
            size: this.size,
          }
          Models.Home
          .getCommentList(data)
          .then(res => {
            if(res.data.code === '0') {
              this.isLoading = false
              this.loading = false
              this.commentList = []
              this.commentList = res.data.info.list
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
              this.page = Number(this.page) + 1;
              for(let i = 0; i < this.commentList.length; i++) {
                this.commentList[i].describeStar = Number(this.commentList[i].describeStar)
                this.commentList[i].grayImg = 5 - Number(this.commentList[i].describeStar)
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
      this.init();
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
    this.goodId = this.$route.query.goodId
    this.init()
  },
  mounted() {

  },
  components: {
  },
};
</script>

<style lang="less">
.comment-page {
  width: 100%;
  height: 100%;

  .comment {
    width: 100%;

    .list {
      width: 100%;

      .item {
        padding: 16px;
        padding-top: 24px;
        margin-bottom: 10px;
        width: 100%;
        background-color: #fff;

        &:last-child {
          margin-bottom: 0;
        }

        .top-head {
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: space-between;

          .img {
            width: 30px;
            height: 30px;
            border-radius: 50%;

            > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .text {
            flex: 1;
            // display: flex;
            // align-items: center;

            .title {
              padding-left: 6px;
              // margin-bottom: 2px;
              width: 100%;
              line-height: 17px;
              font-size: 13px;
              display: flex;
              justify-content: space-between;

              .time {
                color: #666;
              }
            }

            .star {
              padding-left: 5px;
              width: 100%;
              height: 13px;
              overflow: hidden;

              &::after {
                display: block;
                clear: both;
                content: ' ';
              }

              > img {
                float: left;
                margin-right: 4px;
                width: 13px;
                height: 12px;
              }
            }
          }
        }

        .cont {
          // padding: 8px 0;
          margin-top: 8px;
          width: 100%;
          font-size: 13px;
          line-height: 1.4em;
        }

        .explain {
          margin-top: 8px;
          font-size: 13px;
          color: #666;

          > span {
            padding-right: 10px;

            &:last-child {
              padding-right: 0;
            }
          }
        }

        .image {
          margin-top: 10px;
          width: 100%;

          .i-list {
            width: 100%;
            display: flex;

            .i-item {
              margin-right: 3px;
              width: 112px;
              height: 112px;
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
};
</style>
