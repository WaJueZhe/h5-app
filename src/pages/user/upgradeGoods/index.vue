<template>
  <div class="upgradeGoods-page">
    <div class="explain">
      <div class="msg" v-if="zoneCode == 'BossMemberUpZone'">升级为企惠壹号社区BOSS，购物享受批发价，自购省钱，分享赚钱。</div>
      <div class="msg" v-if="zoneCode == 'GoldenMemberUpZone'">升级为企惠壹号金牌BOSS，购物享受出厂价，自购省钱，分享赚钱。</div>
      <div class="msg" v-if="zoneCode == 'PartnerMemberUpZone'">升级为企惠壹号合伙商，购物享受出厂价，自购省钱，分享赚钱。</div>
    </div>
    <div class="upgradeGroup">
      <div class="title" v-if="zoneCode == 'BossMemberUpZone'">- 购买严选商品 升级社区BOSS -</div>
      <div class="title" v-if="zoneCode == 'GoldenMemberUpZone'">- 购买严选商品 升级金牌BOSS -</div>
      <div class="title" v-if="zoneCode == 'PartnerMemberUpZone'">- 购买严选商品 升级合伙商 -</div>
      <div class="upgrade-box">
        <ul class="list" ref="ul1" style="float: left">
          <li class="item" v-for="(item, index) in goodsList1" :key="index">
            <router-link :to="{ name: 'upgradeDetail', query: { goodId: item.goodId } }">
              <div class="img">
                <img :src="item.headPic" alt="">
              </div>
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="price">￥{{ item.price }}</div>
                <div class="incidental" v-if="item.point > 0">
                  <div class="give">
                    <img src="@/assets/personalCenter/give_icon.png" alt="">
                  </div>
                  <div class="huibei">{{ item.point }}个惠呗</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>

        <ul class="list" ref="ul2" style="float: right">
          <li class="item" v-for="(item, index) in goodsList2" :key="index">
            <router-link :to="{ name: 'upgradeDetail', query: { goodId: item.goodId } }">
              <div class="img">
                <img :src="item.headPic" alt="">
              </div>
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="price">￥{{ item.price }}</div>
                <div class="incidental" v-if="item.point > 0">
                  <div class="give">
                    <img src="@/assets/personalCenter/give_icon.png" alt="">
                  </div>
                  <div class="huibei">{{ item.point }}个惠呗</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Models from '@/models'
export default {
  name: 'upgradeGoods',
  data() {
    return {
      zoneCode: '',
      list: [],
      goodsList1: [],
      goodsList2: [],
      index: 0
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
    init() {
      let data = {
        page: 1,
        size: 10,
        keyword: '',
        zoneCode: this.zoneCode,
        categoryId: '0',
        brandId: '0',
        shopId: '0',
        price: ['0', '0'],
        orderBy: '',
        orderWay: 'desc',
      }
       Models.Home
      .searchZoneGoods(data)
      .then(res => {
        if(res.data.code == '0') {
          this.list = res.data.info.list
        }
      })
    },
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
    }
  },
  computed: {

  },
  created() {
    this.zoneCode = this.$route.query.zoneCode
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.upgradeGoods-page {
  width: 100%;
  min-height: 100vh;
  background-color: #24231F;

  .explain {
    padding: 15px;
    width: 100%;

    .msg {
      padding: 23px 18px;
      width: 100%;
      font-size: 14px;
      color: #333;
      background-color: #D2AD78;
      border-radius: 6px;
    }
  }

  .upgradeGroup {
    padding: 0 10px;
    margin-top: 15px;
    overflow: hidden;

    .title {
      font-size: 16px;
      text-align: center;
      color: #BD9863;
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

          > a {
            display: block;
            width: 100%;

            .img {
              width: 100%;
              height: 175px;
              border-radius: 4px 4px 0 0;
              overflow: hidden;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 4px 4px 0 0;
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
                margin-top: 2px;
                font-size: 18px;
                font-weight: 500;
                color: #EA3323;
              }

              .incidental {
                float: left;
                line-height: 18px;
                background-color: #D2B080;
                border-radius: 2px;
                overflow: hidden;

                &::after {
                  display: block;
                  clear: both;
                  content: ' ';
                }

                .give {
                  float: left;
                  width: 40px;
                  border-radius: 2px 0 0 2px;

                  > img {
                    width: 40px;
                    height: 18px;
                  }
                }

                .huibei {
                  float: left;
                  padding: 0 4px 0 2px;
                  font-size: 10px;
                  color: #333;
                  border-radius: 0 2px 2px 0;
                }
              }
            }
          }
        }
      }
    }
  }
};
</style>
