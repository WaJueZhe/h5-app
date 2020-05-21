<template>
  <div class="upgradeShopkeeper-page">
    <div class="tab-nav">
      <ul class="t-list">
        <li class="t-item">
          <img src="@/assets/personalCenter/gift_icon-01.png" alt="">
          <div class="title">尊享礼品</div>
        </li>
        <li class="t-item">
          <img src="@/assets/personalCenter/gift_icon-02.png" alt="">
          <div class="title">IT云服务</div>
        </li>
        <li class="t-item">
          <img src="@/assets/personalCenter/gift_icon-03.png" alt="">
          <div class="title">赚收益</div>
        </li>
        <li class="t-item">
          <img src="@/assets/personalCenter/gift_icon-04.png" alt="">
          <div class="title">3000+品牌</div>
        </li>
      </ul>
    </div>
    <div class="upgrade">
      <ul class="u-list">
        <li class="u-item" @click="goUpgrade(item)" v-for="(item, index) in list" :key="index">
          <img :src="item.zonePic" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import sdk from '@/js/weixin.js';
import { RadioGroup, Radio, Toast, Popup } from 'vant';

Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);
export default {
  name: 'upgradeShopkeeper',
  data() {
    return {
      list: []
    };
  },
  watch: {

  },
  methods: {
    //获取升级套餐
    init() {
      let data = {
        yGroup: '2',
        zoneCode: '',
        zoneName: '',
        yStatus: '1',
        inGlobalSearch: '2'
      }
      Models.User
      .getzone(data)
      .then(res => {
        if(res.data.code == '0') {
          this.list = res.data.info.list
        }
      })
    },
    //选择套餐
    goUpgrade(item) {
      if (item.goodIds.length == 0) {
        Toast('该区域没有商品')
      }else if (item.goodIds.length == 1) {
        this.$router.push({
          name: 'upgradeDetail',
          query: {
            goodId: item.goodIds[0]
          }
        })
      }else {
        if (item.zoneCode == 'BossMemberUpZone') {
          this.$router.push({
            name: 'upgradeQHBoss',
            query: {
              zoneCode: item.zoneCode
            }
          })
        }else {
          this.$router.push({
            name: 'upgradeGoods',
            query: {
              zoneCode: item.zoneCode
            }
          })
        }
      }
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {

  },
  components: {
  },
};
</script>

<style lang="less">
.upgradeShopkeeper-page {
  width: 100%;

  .tab-nav {
    width: 100%;
    background-color: #DB3A3A;

    .t-list {
      padding: 18px 5px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .t-item {
        flex: 1;

        > img {
          margin: auto;
          width: 50px;
          height: 50px;
        }

        .title {
          margin-top: 10px;
          font-size: 12px;
          text-align: center;
          color: #FFCDA2;
        }
      }
    }
  }

  .upgrade {
    margin-top: -1px;
    width: 100%;
    height: calc(100vh - 1px);
    background: -webkit-linear-gradient(#DB3A3A, #BF2424); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#DB3A3A, #BF2424); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#DB3A3A, #BF2424); /* Firefox 3.6 - 15 */
    background: linear-gradient(#DB3A3A, #BF2424); /* 标准的语法 */

    .u-list {
      padding: 15px;
      width: 100%;

      .u-item {
        margin-bottom: 23px;
        width: 100%;
        height: 135px;
        border-radius: 6px;
        overflow: hidden;

        > img {
          width: 100%;
          border-radius: 6px;
        }
      }
    }
  }
};
</style>
