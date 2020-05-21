<template>
  <div class="upgradeQHBoss-page">
    <div class="user-info" v-if="invitationUser.headPic != undefined && invitationUser.nickName != undefined">
      <div class="user">
        <div class="head-img">
          <img :src="invitationUser.headPic" alt="">
        </div>
        <div class="name">
          <p>Hi，</p>
          <p>{{ invitationUser.nickName }}</p>
        </div>
        <div class="invitation">邀请您成为企惠BOSS</div>
      </div>
    </div>
    <div class="banner">
      <img src="@/assets/user/banner.png" alt="">
    </div>
    <div class="equity">
      <div class="e-top">
        <img class="dx2" src="@/assets/user/dx2.png" alt="">
        <span>社区BOSS权益</span>
        <img class="dx1" src="@/assets/user/dx1.png" alt="">
      </div>
      <div class="e-group">
        <ul class="e-list">
          <li class="e-item">
            <img src="@/assets/user/equity-01.png" alt="">
            <div class="title">购物省钱</div>
            <div class="text">享受批发价</div>
          </li>
          <li class="e-item">
            <img src="@/assets/user/equity-02.png" alt="">
            <div class="title">分享赚钱</div>
            <div class="text">获得服务收益</div>
          </li>
          <li class="e-item">
            <img src="@/assets/user/equity-03.png" alt="">
            <div class="title">1000+品牌</div>
            <div class="text">上万款商品</div>
          </li>
          <li class="e-item">
            <img src="@/assets/user/equity-04.png" alt="">
            <div class="title">专属惠呗</div>
            <div class="text">赠送399个惠呗</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="upgradeGroup">
      <div class="title">购买优选商品，升级社区BOSS</div>
      <div class="u-top">
        <img class="zs1" src="@/assets/user/zs1.png" alt="">
        <span>赠送399个惠呗</span>
        <img class="zs2" src="@/assets/user/zs2.png" alt="">
      </div>
      <div class="upgrade-box">
        <ul class="list" ref="ul1" style="float: left">
          <li class="item" v-for="(item, index) in goodsList1" :key="index">
            <router-link :to="{ name: 'upgradeDetail', query: { goodId: item.goodId, action: invitationUser.action, ucode: invitationUser.ucode, nickName: invitationUser.nickName, headPic: invitationUser.headPic, gtype: invitationUser.gtype, subscribe: invitationUser.subscribe } }">
              <div class="img">
                <img :src="item.headPic" alt="">
              </div>
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="price">
                  <div class="money">￥{{ item.price }}</div>
                  <div class="buy">立即购买</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
        <ul class="list" ref="ul2" style="float: right">
          <li class="item" v-for="(item, index) in goodsList2" :key="index">
            <router-link :to="{ name: 'upgradeDetail', query: { goodId: item.goodId, action: invitationUser.action, ucode: invitationUser.ucode, nickName: invitationUser.nickName, headPic: invitationUser.headPic, gtype: invitationUser.gtype, subscribe: invitationUser.subscribe } }">
              <div class="img">
                <img :src="item.headPic" alt="">
              </div>
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="price">
                  <div class="money">￥{{ item.price }}</div>
                  <div class="buy">立即购买</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="brand" :style="brandBottom">
      <div class="title">- 品牌直供 正品保障 -</div>
      <div class="small">上千品牌，上万商品，一件也是批发价</div>
      <div class="img">
        <img src="@/assets/user/pp.png" alt="">
      </div>
    </div>
    <div class="invitation-btn" :style="bottom" v-if="invitationUser.headPic === undefined && invitationUser.nickName === undefined" @click="invitationFriend">邀请好友开通 得75元奖励</div>
    <div class="share-box" v-if="shareImg">
      <div class="c-img">
        <img :src="canvasImage">
        <div class="close-btn" @click="closeBtn">
          <van-icon name="clear" size="24px" />
        </div>
      </div>
    </div>
    <v-footer v-if="flageNav"></v-footer>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models'
import Footer from '@/components/footer'
import sdk from '@/js/weixin.js';
import wx from 'weixin-js-sdk'
import { Icon, Toast } from 'vant';
Vue.use(Icon).use(Toast)
export default {
  name: 'upgradeQHBoss',
  data() {
    return {
      flageNav: false,
      list: [],
      goodsList1: [],
      goodsList2: [],
      index: 0,
      shareLink: '',//分享的链接
      shareImg: false,
      canvasImage: '',
      invitationUser: {//邀请人信息
        action: undefined,
        headPic: undefined,
        nickName: undefined,
        ucode: undefined,
        gtype: undefined,
        subscribe: undefined,
      },
      bottom: 'bottom: 0.4rem',
      brandBottom: 'padding-bottom: 2.2rem',
    };
  },
  watch: {
    list() {
      this.setGoodPosition();
    },
    index() {
      this.setGoodPosition();
    }
  },
  methods: {
    // 获取列表数据
    init() {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      })
      this.$common.forbidBodyScroll()
      let data = {
        page: 1,
        size: 100,
        keyword: '',
        zoneCode: 'BossMemberUpZone',
        categoryId: '0',
        brandId: '0',
        shopId: '0',
        price: ['0', '0'],
        orderBy: 'sale',
        orderWay: 'desc',
      }
       Models.Home
      .searchZoneGoods(data)
      .then(res => {
        if(res.data.code === '0') {
          this.bus.$emit('getLoading', {
            loading: false,
          })
          this.$common.allowBodyScroll()
          this.list = res.data.info.list
        }else {
          Toast(res.data.msg)
        }
      })
    },
    // 排版瀑布流
    setGoodPosition() {
      let item = this.list[this.index];
      if (!item) return;

      let goodsList1Height = window.getComputedStyle(this.$refs.ul1, null).height;
      let goodsList2Height = window.getComputedStyle(this.$refs.ul2, null).height;

      if(parseInt(goodsList1Height) > parseInt(goodsList2Height)) {
        this.goodsList2.push(item)
      } else {
        this.goodsList1.push(item)
      }
      setTimeout(() => {
        if (this.index >= this.list.length) return;
        this.index++;
      }, 0)
    },

    invitationFriend () {
      if (localStorage.sessionId != undefined) {
        this.shareImg = true
        this.$common.forbidBodyScroll()
      }
    },
    // 邀请好友二维码
    invitationBtn () {
      let data = {
        type: 'boss',
        goodId: '',
        cat: 'all'
      };
      Models.User
      .getQRcode(data)
      .then( res => {
        if (res.data.code === '0') {
          this.canvasImage = res.data.info.codePicList[0]
          this.shareLink = res.data.info.link
        }else {
          Toast(res.data.msg)
        }
      })
    },
    //关闭二维码
    closeBtn () {
      this.shareImg = false
      this.$common.allowBodyScroll()
    },
    //默认绑定关系
    alreadyFollow (ucode) {
      let data = {
        id: ucode
      };
       Models.User
      .bindMyInvitor(data)
      .then(res => {
      })
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  activated() {
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
    if(localStorage.sessionId != undefined) {
      if (agrs.ucode) {
        this.alreadyFollow(agrs.ucode)
      }
      this.invitationBtn()
    }
    this.invitationUser = {
      action: agrs.action,
      headPic: agrs.headPic,
      nickName: agrs.nickName,
      ucode: agrs.ucode,
      gtype: '4',
      subscribe: agrs.subscribe,
    }
    if(agrs.flage !== undefined) {
      this.flageNav = agrs.flage
      this.bottom = 'bottom: 1.6rem'
      this.brandBottom = 'padding-bottom: 3.36rem'
    }
  },
  mounted() {
    setTimeout(() => {
      let url = window.location.href.split('#')[0]
      let data = {
        title: '现在加入企惠壹号 立送100个惠呗',
        link: this.shareLink,
        imgUrl: 'http://web.no1qh.com/logo.jpg',
        desc: '1800万人在企惠壹号自购省钱分享赚钱，快和我一起加入享福利吧！'
      };
      sdk.getJSSDK(url, data)
    }, 1000)
  },

  components: {
    'v-footer': Footer,
  },
};
</script>

<style lang="less">
.upgradeQHBoss-page {
  width: 100%;
  background-color: #DB3A3A;
  overflow: hidden;

  .user-info {
    padding: 0 15px;
    margin-top: 16px;
    width: 100%;

    .user {
      position: relative;
      padding: 8px 17px;
      width: 100%;
      background-color: #FFF6E7;
      border: 1px solid #BB3C43;
      border-radius: 28px;
      display: flex;
      align-items: center;

      .head-img {
        width: 37px;
        height: 37px;
        border-radius: 50%;
        overflow: hidden;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .name {
        position: absolute;
        left: 62px;
        max-width: 140px;
        font-size: 12px;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        > p:last-child {
          max-width: 140px;
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .invitation {
        position: absolute;
        right: 17px;
        width: 116px;
        font-size: 12px;
        color: #333;
        overflow: hidden;
      }
    }
  }

  .banner {
    width: 100%;

    > img {
      width: 100%;
    }
  }

  .equity {
    width: 100%;

    .e-top {
      position: relative;
      width: 100%;
      height: 32px;

      > span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        font-weight: 600;
        color: #FFCDA2;
      }

      .dx2 {
        position: absolute;
        top: 50%;
        left: 106px;
        transform: translateY(-50%);
        height: 10px;
      }

      .dx1 {
        position: absolute;
        top: 50%;
        right: 106px;
        transform: translateY(-50%);
        height: 10px;
      }
    }

    .e-group {
      padding: 20px 0 44px 0;
      width: 100%;

      .e-list {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .e-item {
          flex: 1;

          > img {
            margin: auto;
            width: 50px;
            height: 50px;
          }

          .title {
            margin-top: 6px;
            font-size: 12px;
            line-height: 1;
            text-align: center;
            color: #FFCDA2;
          }

          .text {
            margin-top: 5px;
            font-size: 10px;
            line-height: 1;
            text-align: center;
            color: #FFCDA2;
          }
        }
      }
    }
  }

  .upgradeGroup {
    padding: 0 10px;
    overflow: hidden;

    .title {
      font-size: 18px;
      text-align: center;
      font-weight: 600;
      color: #FFCDA2;
    }

    .u-top {
      position: relative;
      width: 100%;
      height: 32px;

      > span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #FFCDA2;
      }

      .zs1 {
        position: absolute;
        top: 50%;
        left: 94px;
        transform: translateY(-50%);
        height: 5px;
      }

      .zs2 {
        position: absolute;
        top: 50%;
        right: 94px;
        transform: translateY(-50%);
        height: 5px;
      }
    }

    .upgrade-box {
      width: 100%;
      height: 100%;
      overflow: hidden;

      &::after {
        display: block;
        clear: both;
        content: ' ';
      }

      .list {
        padding: 17px 0;
        width: 174px;
        height: 100%;

        .item {
          margin-bottom: 8px;
          width: 174px;

          &:last-child {
            margin-bottom: 0;
          }

          > a {
            display: block;
            width: 100%;
            background-color: #fff;
            border-radius: 4px;
            overflow: hidden;

            .img {
              width: 100%;
              height: 175px;
              overflow: hidden;

              > img {
                width: 100%;
                height: 100%;
              }
            }

            .goods-info {
              padding: 8px 10px;
              width: 100%;
              background-color: #fff;
              border-radius: 0 0 4px 4px;
              overflow: hidden;

              &::after {
                display: block;
                clear: both;
                content: ' ';
              }

              .goods-title {
                font-size: 14px;
                color: #333;
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

              .price {
                margin-top: 15px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .money {
                  font-size: 18px;
                  font-weight: 500;
                  color: #EA3323;
                }

                .buy {
                  padding: 4px 6px;
                  font-size: 12px;
                  background: -webkit-linear-gradient(left, #F12F4B , #ED2E60); /* Safari 5.1 - 6.0 */
                  background: -o-linear-gradient(right, #F12F4B, #ED2E60); /* Opera 11.1 - 12.0 */
                  background: -moz-linear-gradient(right, #F12F4B, #ED2E60); /* Firefox 3.6 - 15 */
                  background: linear-gradient(to right, #F12F4B , #ED2E60); /* 标准的语法 */
                  border-radius: 4px;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }

  .brand {
    padding: 0 11px 126px 11px;
    margin-top: 30px;
    width: 100%;
    overflow: hidden;

    .title {
      font-size: 18px;
      color: #FFCDA2;
      font-weight: 600;
      text-align: center;
    }

    .small {
      margin-top: 6px;
      font-size: 14px;
      color: #FFCDA2;
      text-align: center;
    }

    .img {
      padding: 11px 0;
      margin-top: 23px;
      width: 100%;
      background-color: #fff;
      border-radius: 14px;

      > img {
        width: 100%;
      }
    }

  }

  .invitation-btn {
    position: fixed;
    bottom: 60px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 345px;
    height: 55px;
    line-height: 52px;
    font-size: 18px;
    color: #FEEBF0;
    text-align: center;
    background: url('../../../assets/user/yq.png') no-repeat;
    background-size: contain;
    z-index: 999;
  }

  .share-box {
    position: fixed;
    top: 0;
    padding: 0 30px;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.7);
    z-index: 9999;
    display: flex;
    align-items: center;

    .c-img {
      width: 100%;
      height: auto;
      background-color: #fff;
      border-radius: 10px;
      z-index: 9999;
      position: relative;

      .close-btn {
        position: absolute;
        right: -11px;
        top: -13px;
        font-size: 0;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
};
</style>
