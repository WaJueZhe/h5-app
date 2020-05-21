<template>
  <div class="newcomerBenefits-page">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading"
        :finished="finished"
        :finished-text="noDataText"
        @load="onLoad"
        :immediate-check="false"
        class="van-clearfix"
        >
        <div class="new-people">
          <div class="banner">
            <div class="img" v-if="newPeople === '1'">
              <img src="@/assets/homePage/new-banner.png" alt="">
            </div>
            <div class="rule" v-if="newPeople === '1'">
              <router-link :to="{ name: 'activityRules', query: { zoneCode: 'newEmployeeBenefitsZone' } }">规则</router-link>
            </div>
            <div class="img" v-if="newPeople !== '1'">
              <img src="@/assets/homePage/new-banner02.png" alt="">
            </div>
            <div class="tab-info">
              <div class="tab">
                <div class="tab-item" v-if="newPeople === '1'">
                  <img src="@/assets/homePage/newPeople-icon-01.png" alt="">
                  <span>优选品牌</span>
                </div>
                <div class="tab-item" v-if="newPeople !== '1'">
                  <img src="@/assets/homePage/newPeople-icon-04.png" alt="">
                  <span>签到领奖</span>
                </div>
                <div class="tab-item">
                  <img src="@/assets/homePage/newPeople-icon-02.png" alt="">
                  <span>抢到赚到</span>
                </div>
                <div class="tab-item">
                  <img src="@/assets/homePage/newPeople-icon-03.png" alt="">
                  <span>正品货源</span>
                </div>
              </div>
            </div>
          </div>
          <div class="group">
            <div class="tip" v-if="newPeople !== '1'">您有<span>{{ buyNumber || '0' }}</span>次抢购机会</div>
            <ul class="list">
              <li class="item" v-for="(item, index) in activityList" :key="index">
                <router-link :to="{ name: 'goodsDetails', query: { goodId: item.goodId } }" class="item-jump">
                  <div class="img">
                    <img :src="item.headPic" alt="">
                  </div>
                  <div class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="welfare" v-if="newPeople === '1'">
                      <span>新人专属福利</span>
                    </div>
                    <div class="money-box">
                      <div class="sale" v-if="newPeople !== '1'">{{ item.sales | numberMany }}人已抢</div>
                      <div class="money">
                        <div class="m-left">
                          <span class="price">￥{{ item.price }}</span>
                          <s class="market-price">￥{{ item.marketPrice }}</s>
                        </div>
                        <div class="btn">立即抢购</div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { PullRefresh , List } from 'vant';
import { join } from 'path';
Vue.use(PullRefresh).use(List);
export default {
  name: 'newcomerBenefits',
  data() {
    return {
      newPeople: '',//分区
      buyNumber: '',//抢购的次数
      page: 1,
      size: 10,
      total: undefined,
      zoneCode: '',//分区搜索
      categoryId: '0',//分类id
      brandId: '0',
      shopId: '0',
      price: ['0', '0'],
      orderBy: '',//商品排序。"sale":按销量排序(默认)，"price":按价格排序，“hot”:热度
      orderWay: 'desc',//排序规则。"desc": 降序排列，"asc": 升序排列
      newPeopleList: [],
      oneBuyList: [],
      activityList: [],

      //上下刷新参数
      loading: false,
      finished: false,
      isLoading: false,
      noDataText:"",
    };
  },
  watch: {

  },
  methods: {
    init () {
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
        if (res.data.code === '0') {
          this.isLoading = false
          this.activityList = this.activityList.concat(res.data.info.list)
          // 加载状态结束
          // setTimeout(() => {
          //   this.loading = false
          //   this.bus.$emit('getLoading', {loading: false});
          // }, 500);
          this.loading = false
          this.bus.$emit('getLoading', {loading: false});
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
          if (this.activityList.length === 0) {
            this.noOrder = true;
            this.noDataText = ''
          } else {
            this.noOrder = false;
            this.noDataText = '我也是有底线的~'
          }
          this.page = Number(this.page) + 1;
        }
      })
    },
    /**
     * 下拉刷新
    */
    onRefresh() {
      setTimeout(() => {
        if(this.activityList.length === 0) {
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
          };
          Models.Home
          .searchZoneGoods(data)
          .then(res => {
            if(res.data.code == '0') {
              this.isLoading = false;
              // 加载状态结束
              setTimeout(() => {
                this.loading = false
              }, 1000);
              this.activityList = [];
              this.activityList = res.data.info.list;
              this.isShowGoodList = true;
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size))
              if (this.activityList.length === 0) {
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
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
  },
  computed: {

  },
  created() {
    this.newPeople = this.$route.query.newPeople;
    this.buyNumber = this.$route.query.buyNumber;
    this.zoneCode = this.$route.query.zoneCode;
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.newcomerBenefits-page {
  width: 100%;

  .new-people, .one-buy {
    width: 100%;

    .banner {
      position: relative;
      width: 100%;
      height: 150px;

      .img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 150px;
        overflow: hidden;

        > img {
          height: 100%;
        }
      }

      .rule {
        position: absolute;
        top: 26px;
        right: 0;
        width: 42px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-size: 12px;
        background-color: rgba(0,0,0,.5);
        border-radius: 13px 0 0 13px;

        > a {
          display: block;
          color: #fff;
        }
      }

      .tab-info {
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        padding: 0 10px;
        margin-top: -20px;
        width: 100%;
        height: 40px;

        .tab {
          padding: 0 19px;
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
          z-index: 11;
          border-radius: 12px;
          box-shadow: 0 1px 3px #EAEAEA;

          .tab-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;

            > img {
              margin-right: 6px;
              width: 14px;
              height: 14px;
            }
          }
        }
      }
    }

    .group {
      margin-top: 35px;
      width: 100%;
      background-color: #fff;

      .tip {
        padding: 0 15px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #333;

        > span {
          color: #EA3323;
        }
      }

      .list {
        padding-left: 15px;
        width: 100%;

        .item {
          width: 100%;

          &:last-child {
            .item-jump {
              .info {
                &::after {
                  border-bottom: none;
                }
              }
            }
          }

          .item-jump {
            padding: 7px 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .img {
              padding: 8px 0;
              width: 130px;
              height: 146px;

              > img {
                width: 130px;
                height: 130px;
              }
            }

            .info {
              position: relative;
              flex: 1;
              padding: 10px 15px 10px 10px;

              &::after {
                content: "";
                width: 200%;
                height: 0;
                display: block;
                border-bottom: 1px solid #EAEAEA;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                transform: scale(.5);
                transform-origin: left bottom;
              }

              .title {
                width: 100%;
                font-size: 14px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
              }

              .welfare {
                margin-top: 8px;
                width: 100%;
                display: flex;

                > span {
                  position: relative;
                  display: inline-block;
                  padding: 0 5px;
                  font-size: 10px;
                  color: #EA3323;
                  background-color: #FEDADE;

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

              .money-box {
                position: absolute;
                bottom: 10px;

                .sale {
                  font-size: 12px;
                  color: #999;
                }

                .money {
                  position: relative;
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  .m-left {
                    width: 140px;

                    .price {
                      font-size: 18px;
                      font-weight: 600;
                      color: #EA3323;
                    }

                    .market-price {
                      font-size: 12px;
                      color: #999;
                    }
                  }

                  .btn {
                    padding: 3px 0 4px 0;
                    width: 65px;
                    font-size: 12px;
                    text-align: center;
                    color: #fff;
                    background: -webkit-linear-gradient(left, #FC5545 , #E93042); /* Safari 5.1 - 6.0 */
                    background: -o-linear-gradient(right, #FC5545, #E93042); /* Opera 11.1 - 12.0 */
                    background: -moz-linear-gradient(right, #FC5545, #E93042); /* Firefox 3.6 - 15 */
                    background: linear-gradient(to right, #FC5545 , #E93042); /* 标准的语法 */
                    border-radius: 30px;

                    &.gray {
                      background: #999;
                    }
                  }
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
