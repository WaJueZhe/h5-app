<template>
  <div class="shareExtensionChart-page">
    <div class="shareImg">
      <div class="img-box">
        <img :src="imgURL" alt="">
      </div>
      <div class="nav-bottom" v-if="imgURL !== ''">
        <div class="n-tit">长按保存图片</div>
        <div class="n-group">
          <ul class="n-list">
            <li class="n-item" v-for="(item, index) in codePicList" :key="index">
              <van-radio-group v-model="userRadio">
                <van-radio :name="item.id" checked-color="#8ecdbe" @click="changeImg(index)"></van-radio>
              </van-radio-group>
              <img :src="item.url" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { RadioGroup, Radio, Loading } from 'vant';
Vue.use(RadioGroup).use(Radio).use(Loading);
export default {
  name: 'shareExtensionChart',
  data() {
    return {
      userRadio: '1',//用户分享码选择
      imgURL: '',
      codePicList: [
        {
          id: '1',
          url: require('../../../assets/user/zs.png')
        },
        {
          id: '2',
          url: require('../../../assets/user/za.png')
        },
        {
          id: '3',
          url: require('../../../assets/user/zd.png')
        },
      ],
      code: 'user_1'
    };
  },
  watch: {

  },
  methods: {
    qRcode () {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      })
      let data = {
        type: 'user',
        goodId: '',
        cat: 'all',
        code: this.code,
      };
      Models.User
        .getQRcode(data)
        .then( res => {
          if ( res.data.code === '0' ) {
            this.bus.$emit('getLoading', {loading: false})
            this.imgURL = res.data.info.codePicList[0]
          }
        })
    },
    changeImg(index) {
      index ++
      if (index == 1) {
        this.code = 'user_1'
      }else if (index == 2) {
        this.code = 'user_2'
      }else if (index == 3) {
        this.code = 'user_3'
      }
      this.qRcode()
    }
  },
  computed: {

  },
  created() {
    this.qRcode()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.shareExtensionChart-page {
  width: 100%;

  .shareImg {
    position: fixed;
    width:100%;
    height:100%;
    top:0;
    padding: 0 48px;
    background-color:#F2F2F2;
    z-index: 9999;
    overflow: hidden;

    .img-box {
      height: 84%;
      border-radius: 5px;
      display: flex;
      align-items: center;
    }

    .nav-bottom {
      position: fixed;
      left: 0;
      bottom: 0;
      padding-top: 8px;
      padding-bottom: 2px;
      width: 100%;
      background-color: #fff;

      .n-tit {
        font-size: 12px;
        color: #999;
        text-align: center;
      }

      .n-group {
        width: 100%;
        overflow-x: auto;

        .n-list {
          padding: 10px 20px 0 20px;
          width: auto;
          overflow-x: auto;
          white-space: nowrap;

          .n-item {
            position: relative;
            display: inline-block;
            margin-left: 20px;
            width: 55px;
            height: 55px;

            &:first-child {
              margin-left: 0;
            }

            .van-radio-group {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 9999;

              .van-radio {
                width: 100%;
                height: 100%;

                .van-radio__icon {
                  margin: auto;

                  > i {
                    border: none;
                  }
                }
              }
            }

            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .canvas-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
};
</style>
