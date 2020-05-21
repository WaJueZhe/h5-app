<template>
  <div class="logisticsInformation-page">
    <div class="logisticsInformation" v-if="JSON.stringify(info) != '{}'">
      <div class="top-info">
        <div class="head">
          <img :src="goodPic" alt="">
        </div>
        <div class="r-msg">
          <div class="title">
            <span class="text">物流状态</span>
            <span class="state" v-if="info.state == 0">在途</span>
            <span class="state" v-if="info.state == 1">揽收</span>
            <span class="state" v-if="info.state == 2">疑难</span>
            <span class="state" v-if="info.state == 3">签收</span>
            <span class="state" v-if="info.state == 4">退签</span>
            <span class="state" v-if="info.state == 5">派件</span>
            <span class="state" v-if="info.state == 6">退回</span>
          </div>
          <div class="desc">承运公司：{{ info.name }}</div>
          <div class="desc">运单编号：{{ info.odd }}</div>
        </div>
      </div>
      <div class="way">
        <van-steps direction="vertical" active-color="#F56155">
          <van-step  v-for="(item, index) in info.data" :key="index">
            <div class="msg" v-html="item.context"></div>
            <p>{{ item.time }}</p>
          </van-step>
        </van-steps>
      </div>
    </div>
    <div class="no-msg" v-else>
      <img src="@/assets/personalCenter/logistics_blank_icon.png" alt="">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models';
import { Step, Steps } from 'vant';
Vue.use(Step).use(Steps);
export default {
  data() {
    return {
      // active: '',
      orderId: '',
      goodPic: '',
      info: {},
    };
  },
  watch: {

  },
  methods: {
    init() {
      let data = {
        id: this.orderId
      }
      Models.User
      .getLogistics(data)
      .then(res => {
        if(res.data.code == '0') {
          this.info = res.data.info
          for(let i = 0; i < this.info.data.length; i++) {
            this.info.data[i].context = this.info.data[i].context.replace(/(1\d+)|(0[0-9\s\-]+)/g, function(phone) {
              return `<a href="tel:${phone}" style="color: #1989fa">${phone}</a>`
            })
          }
        }
      })
    }
  },
  computed: {

  },
  created() {
    this.orderId = this.$route.query.orderId
    this.goodPic = this.$route.query.goodPic
    this.init()
    // for(let i = 0; i < this.info.data.length; i++) {
    //   this.info.data[i].context = this.info.data[i].context.replace(/(1\d+)|(0[0-9\s\-]+)/g, function(phone) {
    //     return `<a href="tel:${phone}" style="color: #1989fa">${phone}</a>`
    //   })
    // }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.logisticsInformation-page {
  width: 100%;

  .logisticsInformation {
    width: 100%;

    .top-info {
      padding: 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;

      .head {
        width: 70px;
        height: 70px;
        border-radius: 4px;
        overflow: hidden;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }

      .r-msg {
        margin-left: 15px;
        flex: 1;
        overflow: hidden;

        .title {
          width: 100%;
          font-size: 15px;

          .text {
            display: inline-block;
            margin-right: 15px;
            font-weight: 500;
            color: #333;
          }

          .state {
            color: #EA3323;
          }
        }

        .desc {
          margin-top: 4px;
          font-size: 13px;
          color: #333;
        }
      }
    }

    .way {
      margin-top: 8px;
      width: 100%;

      .van-steps {
        .van-steps__items {
          .van-step--vertical {
            .van-step__title {
              .msg {
                font-size: 12px;
              }
              > p {
                margin-top: 4px;
              }
            }
            .van-step__circle-container {
              .van-step__circle {
                left: -19px;
                width: 10px;
                height: 10px;
                background-color: #969799;
              }

              .van-icon {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }

  .no-msg {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;

    > img {
      margin: auto;
      width: 197px;
    }
  }
};
</style>
