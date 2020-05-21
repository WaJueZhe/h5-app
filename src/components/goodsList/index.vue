<template>
  <div class="goodsList-page">
    <div class="goods-group">
      <ul class="goods-list" ref="ul1" style="float: left">
        <li class="goods-item" v-for="(item, index) in goodsList1" :key="index">
          <router-link :to="{ name: 'goodsDetails', query: { goodId: item.goodId } }">
            <div class="img">
              <img v-lazy="item.headPic" alt="">
            </div>
            <div class="info">
              <div class="shop-title">{{ item.title }}</div>
              <div class="desc" v-if="item.dePoint > 0">
                <span>可用惠呗￥{{ item.dePoint }}</span>
              </div>
              <div class="money">
                <div class="skp-money">￥{{ item.price }}</div>
                <div class="skp-earn" v-if="item.profitList.length > 0">{{ item.profitList[0] +'~'+ item.profitList[1] | priceFilter }}</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>

      <ul class="goods-list" ref="ul2" style="float: right">
        <li class="goods-item" v-for="(item, index) in goodsList2" :key="index">
          <router-link :to="{ name: 'goodsDetails', query: { goodId: item.goodId } }">
            <div class="img">
              <img v-lazy="item.headPic" alt="">
            </div>
            <div class="info">
              <div class="shop-title">{{ item.title }}</div>
              <div class="desc" v-if="item.dePoint > 0">
                <span>可用惠呗￥{{ item.dePoint }}</span>
              </div>
              <div class="money">
                <div class="skp-money">￥{{ item.price }}</div>
                <div class="skp-earn" v-if="item.profitList.length > 0">{{ item.profitList[0] +'~'+ item.profitList[1] | priceFilter }}</div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';
Vue.use(Lazyload);
export default {
  props: {
    goodsList: {
      type: Array,
      default: '',
    }
  },
  data() {
    return {
      goodsList1: [],
      goodsList2: [],
      index: 0
    };
  },
  filters: {
    priceFilter(value) {
      let val = value.split('~')
      if((parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0) && (parseFloat(val[0]) == parseFloat(val[1]))) {
        return '赚' + val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) != 0 ) {
        return '赚' + val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) != 0 && parseFloat(val[1]) != 0 ) {
        return '赚' + val[0] + '~' + val[1]
      }else if(parseFloat(val[0]) == 0 && parseFloat(val[1]) == 0 ) {
        return ''
      }
    }
  },
  watch: {
    goodsList() {
      this.setGoodPosition();
    },
    index() {
      this.setGoodPosition();
    }
  },
  methods: {
    setGoodPosition() {
        let item = this.goodsList[this.index];
        if (!item) return;

        let goodsList1Height = window.getComputedStyle(this.$refs.ul1, null).height;
        let goodsList2Height = window.getComputedStyle(this.$refs.ul2, null).height;

        if(parseInt(goodsList1Height) > parseInt(goodsList2Height)) {
          this.goodsList2.push(item)
        } else {
          this.goodsList1.push(item)
        }
        setTimeout(() => {
          if (this.index >= this.goodsList.length) return;
          this.index++;
        }, 0)
      }
  },

  computed: {

  },
  created() {
    if (this.goodsList[0]) {
      this.goodsList1.push(this.goodsList[0])
      setTimeout(() => {
        this.index++;
      }, 0)
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.goodsList-page {
  padding-top: 8px;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;

  .goods-group {
    padding: 0 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .goods-list {
      width: 174px;

      .goods-item {
        width: 174px;
        margin-bottom: 8px;
        border-radius: 3px;
        overflow: hidden;
        z-index: 2;

        &:nth-child(2n) {
          margin-right: 0;
        }

        > a {
          display: block;
          overflow: hidden;

          .img {
            width: 100%;
            height: 175px;
            background-color: #fff;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            overflow: hidden;

            > img {
              width: 100%;
              height: 100%;
              border-top-left-radius: 3px;
              border-top-right-radius: 3px;
            }
          }

          .info {
            padding: 10px 12px 6px;
            width: 100%;
            background-color: #fff;

            .shop-title {
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

            .desc {
              margin-top: 4px;
              // margin-bottom: 6px;
              width: 100%;
              display: flex;

              > span {
                position: relative;
                display: inline-block;
                padding: 0 8px;
                font-size: 10px;
                color: #EA3323;
                border-radius: 2px;

                &::after {
                  content: "";
                  width: 200%;
                  height: 200%;
                  position: absolute;
                  top: 0;
                  left: 0;
                  border: 1px solid #EA3323;
                  border-radius: 4px;
                  -webkit-transform: scale(.5);
                  transform: scale(.5);
                  -webkit-transform-origin: top left;
                  transform-origin: top left;
                }
              }
            }

            .money {
              margin-top: 6px;
              width: 100%;

              .skp-money {
                font-size: 18px;
                line-height: 1;
                font-weight: bold;
                color: #EA3323;
              }

              .skp-earn {
                margin-top: -2px;
                font-size: 13px;
                font-weight: 500;
                color: #F19B38;
              }
            }
          }
        }
      }
    }
  }
};
</style>
