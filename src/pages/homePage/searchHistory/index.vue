<template>
  <div class="searchHistory-page">
    <div class="search-top">
      <div class="search-box">
        <img src="@/assets/homePage/srerch_icon.png" alt="">
        <form action="JavaScript:return true;">
          <input type="search" v-model.trim="keyword" :placeholder="seaHistory" @keyup.enter="search">
        </form>
        <img class="close" v-show=" keyword != '' " src="@/assets/homePage/close-02.png" alt="" @click="keyword = ''">
      </div>
      <div class="news" @click="search" :class="{ newsActive: keyword != '' }">搜索</div>
    </div>
    <!-- 礼品专属的历史搜索 -->
    <div class="history-data" v-if="giftHistoryList.length > 0 && giftType">
      <div class="top">
        <h3>历史搜索</h3>
        <div class="img" @click="remove">
          <img src="@/assets/homePage/remove.png" alt="">
        </div>
      </div>
      <ul class="list">
        <li class="item" v-for="(item, index) in giftHistoryList" :key="index" @click="historySearchFind(item)">
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 历史搜索 -->
    <div class="history-data" v-if="historyList.length > 0 && !giftType">
      <div class="top">
        <h3>历史搜索</h3>
        <div class="img" @click="remove">
          <img src="@/assets/homePage/remove.png" alt="">
        </div>
      </div>
      <ul class="list">
        <li class="item" v-for="(item, index) in historyList" :key="index" @click="historySearchFind(item)">
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 搜索发现 -->
    <div class="history-data no-p" v-if="!giftType">
      <div class="top">
        <h3>搜索发现</h3>
      </div>
      <ul class="list">
        <li class="item" :class="{ historyActice: index== 0 || index == 1 }" v-for="(item, index) in searchList" :key="index" @click="searchFind(item)">
          {{ item.keyword }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models'
import { constants } from 'fs';
import { setTimeout } from 'timers';
import { Toast } from 'vant';
Vue.use(Toast)
export default {
  name: 'searchHistory',
  data() {
    return {
      searchList: [],
      keyword: '',
      seaHistory: '请输入搜索的商品',
      historyList: [],
      giftHistoryList: [],//礼品专属的历史记录
      giftType: null,//是否从礼品专属进来的
    };
  },
  watch: {

  },
  methods: {
    //获取搜索发现
    gethistory() {
      Models.Home
      .history()
      .then(res => {
        if(res.data.code == 0) {
          this.searchList = res.data.info.list;
        }
      })
    },
    //点击搜索
    search() {
      if (this.keyword === '') {
        Toast('请输入要搜索的商品')
        return false
      }
      if(!this.giftType) {
        this.$router.push({
          name: 'classificationDetails',
          query: {
            keyword: this.keyword.trim()
          }
        })
        setTimeout(() => {
          if(this.historyList.length >= 7) {
            this.historyList.pop()
          }
          this.historyList.unshift(this.keyword.trim())
          this.historyList = Array.from(new Set(this.historyList))
          localStorage.setItem('historyList', this.historyList)
        },500)
      }else {
        this.$router.push({
          name: 'giftClassification',
          query: {
            keyword: this.keyword.trim(),
            zoneCode: 'giftZone'
          }
        })
        setTimeout(() => {
          if(this.giftHistoryList.length >= 7) {
            this.giftHistoryList.pop()
          }
          this.giftHistoryList.unshift(this.keyword.trim())
          this.giftHistoryList = Array.from(new Set(this.giftHistoryList))
          localStorage.setItem('giftHistoryList', this.giftHistoryList)
        },500)
      }
    },
    //清除历史记录
    remove() {
      if(!this.giftType) {
        this.historyList = [];
        localStorage.removeItem('historyList')
      }else {
        this.giftHistoryList = [];
        localStorage.removeItem('giftHistoryList')
      }
    },
    searchFind(item) {
      this.$router.push({
        name: 'classificationDetails',
        query: {
          keyword: item.keyword.trim()
        }
      })
      setTimeout(() => {
        if(this.historyList.length >= 7) {
          this.historyList.pop()
        }
        this.historyList.unshift(item.keyword.trim())
        this.historyList = Array.from(new Set(this.historyList))
        localStorage.setItem('historyList', this.historyList)
      },500)
    },
    historySearchFind(item) {
      if(!this.giftType) {
        this.$router.push({
          name: 'classificationDetails',
          query: {
            keyword: item.trim()
          }
        })
        setTimeout(() => {
          if(this.historyList.length >= 7) {
            this.historyList.pop()
          }
          this.historyList.unshift(item)
          this.historyList = Array.from(new Set(this.historyList))
          localStorage.setItem('historyList', this.historyList)
        },500)
      }else {
        this.$router.push({
          name: 'giftClassification',
          query: {
            keyword: item.trim(),
            zoneCode: 'giftZone'
          }
        })
        setTimeout(() => {
          if(this.giftHistoryList.length >= 7) {
            this.giftHistoryList.pop()
          }
          this.giftHistoryList.unshift(item)
          this.giftHistoryList = Array.from(new Set(this.giftHistoryList))
          localStorage.setItem('giftHistoryList', this.giftHistoryList)
        },500)
      }
    },
  },
  computed: {

  },
  created() {
    this.gethistory()
  },
  activated() {
    this.giftType = this.$route.query.giftType
    if(!this.giftType) {
      this.historyList = localStorage.getItem('historyList') ? localStorage.getItem('historyList') : []
      this.historyList = this.historyList.length > 0 ? this.historyList.split(',') : []
    }else {
      this.giftHistoryList = localStorage.getItem('giftHistoryList') ? localStorage.getItem('giftHistoryList') : []
      this.giftHistoryList = this.giftHistoryList.length > 0 ? this.giftHistoryList.split(',') : []
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.searchHistory-page {
  width: 100%;
  height: 100vh;
  background-color: #fff;

  .search-top {
    padding-left: 20px;
    padding-right: 10px;
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;

    .scan {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;

      > img {
        margin: auto;
        width: 24px;
      }
    }

    .search-box {
      padding: 0 14px;
      width: 300px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #F2F2F2;
      border-radius: 20px;
      display: flex;
      align-items: center;

      > img {
        display: inline-block;
        width: 13px;
        height: 13px;
        vertical-align: top
      }

      >form {
        width: 100%;

        > input {
          padding: 0 6px;
          width: 100%;
          height: 30px;
          background-color: #F2F2F2;
          -webkit-appearance:none;
        }
      }

      .close {
        width: 20px;
        height: 20px;
      }
    }

    .news {
      padding: 0 6px;
      font-size: 14px;
      color: #666;

      &.newsActive {
        color: #EA3323
      }
    }
  }

  .history-data {
    padding: 20px;
    width: 100%;

    &.no-p {
      padding-top: 0;
    }

    .top {
      width: 100%;

      &::after {
        display: block;
        clear: both;
        content:  ' ';
      }

      h3 {
        float: left;
        font-size: 15px;
      }

      .img {
        float: right;
        padding: 0 6px;
        display: flex;
        align-items: center;

        > img {
          width: 20px
        }
      }
    }

    .list {
      width: 100%;
      display: flex;
      flex-flow: wrap;

      .item {
        padding: 6px 14px;
        margin-top: 10px;
        margin-right: 10px;
        font-size: 12px;
        background-color: #F2F2F2;
        border-radius: 30px;
        border: 1px solid transparent;

        &.historyActice {
          color: #EA3323;
          border: 1px solid #EA3323;
          background-color: #fff;
        }
      }
    }
  }
};
</style>
