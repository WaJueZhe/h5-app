<template>
  <div class="myComment">
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
        <div class="main">
          <div class="anyoneComment" v-for="(data,index) in myComments" :key="index">
            <div class="myCenter">
              <div class="avatar">
                <img :src="headPic" alt="">
              </div>
              <div class="myMain">
                <div class="nameAndTime">
                  <div class="name">{{nickName}}</div>
                  <div class="time">
                    <p>{{data.createTime | timeStampFilter('yy-mm-dd h：m')}}</p>
                  </div>
                </div>
                <div class="CommentNumAndText">
                  <img :src=" data.describeStar > gIndex ? require('@/assets/good.png') : require('@/assets/bad.png') " v-for="(gData,gIndex) in 5 " alt="" :key="gIndex">
                  <span v-if="data.describeStar == 5">非常好</span>
                  <span v-if="data.describeStar == 4">好</span>
                  <span v-if="data.describeStar == 3">一般</span>
                  <span v-if="data.describeStar == 2">较差</span>
                  <span v-if="data.describeStar == 1">差</span>
                </div>
              </div>
            </div>
            <div class="myCommentText">{{data.content}}</div>
            <div class="myCommentImg">
              <div class="img" v-for="(pic, picIndex) in data.commentPicList" :key="picIndex">
                <img :src="pic" alt="" @click="watchImg(data.commentPicList, picIndex)">
              </div>
            </div>
            <div class="myGoodsCenter">
              <img :src="data.good.goodPic" alt="">
              <div class="goodDetail">
                <div class="goodName">{{data.good.goodTitle}}</div>
                <div class="goodStyle">
                  <span v-for="(skuData,skuIndex) in data.good.skuAttrs" :key="skuIndex">{{skuData.name}}:{{skuData.value}}</span>
                </div>
                <div class="goodPriceAndNum">
                  <span class="goodPrice">￥{{data.good.goodPrice}}</span>
                  <span class="goodNum">*{{data.good.goodNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import { PullRefresh, List, ImagePreview } from 'vant';
Vue.use(PullRefresh).use(List).use(ImagePreview);
export default {
  name:"myComment",
  data () {
    return {
      commentList:2,
      myComments:[],
      nickName:"",
      headPic:"",
      page: '1',//第几页
      size: '10',//每页条数
      total: '',

      loading: false,
      finished: false,
      isLoading: false,
      noDataText: '没有更多了',
      ImagePreviewDialog: '',//预览图片
    }
  },
  methods:{
    /**
     * 下拉刷新
     */
    onRefresh() {
      setTimeout(() => {
        if(this.myComments.length == 0) {
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
          .getMyComments(data)
          .then( res => {
            if ( res.data.code == '0' ) {
              this.isLoading = false
              // 加载状态结束
              this.loading = false
              this.myComments = []
              this.myComments = res.data.info.list
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
              if (this.myComments.length === 0) {
                this.noDataText = '暂无评论'
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
      this.myComment();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    //获取我的评论列表
    myComment () {
      this.loading = true
      this.finished = false
      let data = {
        page:this.page,
        size:this.size,
      };
      Models.User
      .getMyComments(data)
      .then( res => {
        if ( res.data.code == '0' ) {
          this.isLoading = false
          // 加载状态结束
          this.loading = false
          this.myComments = this.myComments.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          if (this.myComments.length === 0) {
            this.noDataText = '暂无评论'
          } else {
            this.noDataText = '没有更多了'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    //预览图片
    watchImg(img, index) {
      this.ImagePreviewDialog = ImagePreview({
        images: img,
        startPosition: index,
        onClose() {
          // do something
        }
      });
    },
  },
  beforeRouteLeave(to, from, next){
    this.ImagePreviewDialog && this.ImagePreviewDialog.close()
    next()
  },
  mounted () {

  },
  created () {
    this.myComment();
    this.nickName = this.$route.query.nickName;
    this.headPic = this.$route.query.headPic;
  },
  components: {
  }
}
</script>
<style lang="less">
.myComment {
  width: 100%;
  height:100%;

  .main {
    width: 100%;
    height:auto;

    .anyoneComment {
      width: 100%;
      height:auto;
      background-color: #ffffff;
      margin-bottom: 8px;
      padding: 15px;

      .myCenter {
        width:100%;
        height:auto;
        display: flex;
        display: -webkit-flex;
        margin-bottom: 15px;

        .avatar {
          flex-basis: 50px;
          flex-shrink: 0;
          margin-right: 14px;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        .myMain {
          width: 100%;
          height:auto;

          .nameAndTime {
            margin-bottom:9px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .name {
              width: 174px;
              font-size: 15px;
              color:#232323;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .time {
              width: 110px;
              display: flex;
              display: -webkit-flex;
              align-items: center;
              font-size: 12px;
              color:#999999;

              p {
                width: 100%;
                height:auto;
                text-align: right;
              }
            }
          }
        }

        .CommentNumAndText {
          width: 100%;
          height:auto;
          display: flex;
          display: -webkit-flex;
          align-items: center;

          img {
            display: inline-block;
            height:19px;
            width:19px;
            margin-right: 17px;

            :last-child {
              margin-right:24px;
            }
          }

          span {
            font-size: 14px;
            color:#333333;
          }
        }
      }

      .myCommentText {
        width:100%;
        height:auto;
        color: #000000;
        font-size: 15px;
        margin-bottom: 15px;
      }

      .myCommentImg {
        margin-bottom: 15px;
        width:100%;
        display: flex;

        .img {
          width: 112px;
          height: 112px;
          margin-right: 4px;
          overflow: hidden;

          > img {
            width: 100%;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .myGoodsCenter {
        width: 100%;
        height: auto;
        background-color: #f5f5f5;
        padding: 16px;
        display: flex;
        display: -webkit-flex;
        border-radius: 8px;

        img {
          flex-basis: 80px;
          flex-shrink: 0;
          height: 80px;
          margin-right: 16px;
          border-radius: 8px;
        }

        .goodDetail {
          width: 100%;
          height:auto;

          .goodName {
            width: 100%;
            height:auto;
            font-size: 12px;
            color:#333333;
            margin-bottom: 5px;
          }

          .goodStyle {
            width: 100%;
            height:auto;
            font-size: 12px;
            color:#999999;
            margin-bottom: 5px;
          }

          .goodPriceAndNum {
            width: 100%;
            height:auto;
            font-size:15px;

            .goodPrice {
              color:#333333;
            }

            .goodNum {
              color:#999999;
            }
          }
        }
      }
    }
  }
}
</style>
