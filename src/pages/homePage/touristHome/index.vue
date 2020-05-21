<template>
  <div class="touristHome">
    <div class="touristHomeWindow">
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
          <div class="touristHometitleImg">
            <img src="@/assets/touristHome.png" alt="">
          </div>
          <div class="touristHomeMain" v-if="isShowGoodList">
            <ul class="list">
              <li class="item" v-for="(item, index) in list" :key="index">
                <router-link :to="{ name: 'goodsDetails', query: { goodId: item.goodId } }">
                  <div class="img">
                    <img v-lazy="item.headPic" alt="">
                  </div>
                  <div class="info">
                    <div class="shop-title">{{ item.title }}</div>
                    <div class="money">
                      <div class="skp-money">价格:<s>{{item.marketPrice}}</s></div>
                      <div class="skp-earn">￥{{item.price}}</div>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="touristHomeBody">
      <div class="footer">
        <ul class="list">
          <li class="item" @click="goHome">
            <div style="color:red;">
              <img class="yesicon" id="indexLogo" src="@/assets/footer/homelogo_icon.png" alt="">
            </div>
          </li>
          <li class="item" @click="goLogin(2)">
            <div>
              <img src="@/assets/footer/hot_noicon.png" alt="">
              <span>企惠Boos</span>
            </div>
          </li>
          <li class="item" @click="goLogin(3)">
            <div>
              <img src="@/assets/footer/shoping_noicon.png" alt="">
              <span>购物车</span>
            </div>
          </li>
          <li class="item" @click="goLogin(4)">
            <div>
              <img src="@/assets/footer/personal_noicon.png" alt="">
              <span>我的</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="goRegistered" v-show="goRegistered">
      <div class="goRegisteredWindow">
        <div class="offShareImg" @click="close">
          <van-icon name="clear" size="24px"/>
        </div>
        <div class="goRegisteredTitle">无权限访问，请先登录</div>
        <div class="goRegisteredBtn" @click="register">登录/注册 ( {{ codeMsg }} )</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Dialog ,Icon, PullRefresh, List, Lazyload } from 'vant';
import { setTimeout } from 'timers';
  Vue.use(Dialog).use(Icon).use(PullRefresh).use(List).use(Lazyload);
  export default {
    name: "touristHome",
    data () {
      return {
        list:[],
        page: 1,
        size: 10,
        total: '',
        goRegistered:false,
         // 倒计时秒数
        countdown: 3,
        // 按钮上的文字
        codeMsg: '3s',
        // 定时器
        timer: null,

        isShowGoodList: false,
        loading: false,
        finished: false,
        isLoading: false,
        jump: '',
      }
    },
    methods:{
      pointList () {
        this.loading = true
        this.finished = false
        let data = {
          zoneCode:"specZone",
          categoryId:0,
          brandId:0,
          shopId:0,
          price:[],
          orderBy:"sale",
          orderWay:"desc",
          page:this.page,
          size:this.size,
          countdown: 3,
          codeMsg:"3s",
        };
        Models.Home
        .searchZoneGoods(data)
        .then( res => {
          if ( res.data.code === '0' ) {
            this.isLoading = false
            // 加载状态结束
            setTimeout(() => {
              this.loading = false
            }, 1000);
            this.isShowGoodList = true;
            this.list = this.list.concat(res.data.info.list);
            this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
            this.page = Number(this.page) + 1;
          }
        })
      },
      goHome() {
        if(localStorage.sessionId !== undefined) {
          this.$router.push({name: 'home'})
        }
      },
      //没有权限跳登录注册
      goLogin(index) {
        if(index == 2 && localStorage.sessionId !== undefined) {
          this.$router.push({
            name: 'upgradeQHBoss',
            query: {
              zoneCode: 'BossMemberUpZone',
              flage: true
            }
          })
        }else if(index == 3 && localStorage.sessionId !== undefined) {
          this.$router.push({name: 'shoppingCart'})
        }else if(index == 4 && localStorage.sessionId !== undefined) {
          this.$router.push({name: 'personalCenter'})
        }else {
          this.goRegistered = true;
          if(!this.timer) {
            this.time();
          }
        }
      },
      register() {
        clearInterval(this.timer);
        this.timer = null;
        this.$router.push({
          name: 'login',
        })
        // localStorage.setItem('loginStateNormal', '0');
        this.close()
      },
      close() {
        clearInterval(this.timer);
        this.countdown = 3;
        this.codeMsg = '3s';
        this.timer = null;
        this.goRegistered = false;
      },
      time(){
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 3) {
            this.countdown--;
            if (this.countdown !== 0) {
              this.codeMsg =  `${this.countdown}s`;
            } else {
              clearInterval(this.timer);
              this.countdown = 3;
              this.timer = null;
              this.$router.push({
                name: 'login'
              })
              // localStorage.setItem('loginStateNormal', '0');
            }
          }
        }, 1000)
      },
      /**
       * 下拉刷新
       */
      onRefresh() {
        setTimeout(() => {
          if(this.list.length == 0) {
            this.isLoading = false
            this.loading = false
          }else {
            this.isShowGoodList = false;
            this.loading = true
            this.finished = false
            let data = {
              zoneCode:"specZone",
              categoryId: '0',
              brandId: '0',
              shopId: '0',
              price:[],
              orderBy:"sale",
              orderWay:"desc",
              page: 1,
              size: 10,
              countdown: 3,
              codeMsg:"3s",
            };
            Models.Home
            .searchZoneGoods(data)
            .then( res => {
              if ( res.data.code === '0' ) {
                this.isLoading = false
                // 加载状态结束
                setTimeout(() => {
                  this.loading = false
                }, 1000);
                this.list = []
                this.isShowGoodList = true;
                this.list = res.data.info.list;
                this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
                this.page = Number(this.page) + 1;
              }
            })
          }
        },1000)
      },
      //跳转
      jumpTo () {
        if (this.jump === '1') {
          this.$router.go(-1)
        }else {
          this.$router.replace({
            name: 'home'
          })
        }
      },
      /**
       * 上拉获取
       */
      onLoad() {
        this.pointList();
        // 数据全部加载完成
        if (this.page >= this.total) {
          this.finished = true;
        }
    },
    },
    created() {
      // 如果用户已经登录直接推回去
      let agrs = this.$common.getRequest(window.location.href);
      this.jump = agrs.jump;
      if(localStorage.sessionId != undefined){
        this.jumpTo();
      }
      // this.pointList();
      // if(sessionStorage.getItem('agrsInfo') != null) {
      //   let agrsData = JSON.parse(sessionStorage.getItem('agrsInfo'))
      //   this.headPic = agrsData.headPic
      //   this.nickName = agrsData.nickName
      //   this.ucode = agrsData.ucode
      //   this.action = agrsData.action
      // }
      // if(window.location.href.indexOf('subscribe') >= 0) {
      //   this.subscribe = this.$route.query.subscribe
      // }
    },
    activated() {
      this.pointList();
      // if(window.location.href.indexOf('subscribe') >= 0) {
      //   this.subscribe = this.$route.query.subscribe
      // }
    }
  }
</script>

<style lang="less">
.touristHome {
  width:100%;
  min-height: 100vh;
  background:#C20205 ;

  .van-list__finished-text {
    color:#ffffff;
  }

  .touristHomeWindow {
    padding-bottom: 52px;
    width: 100%;
    height:100%;
    position: relative;

    .touristHometitleImg {
      width:100%;
      height:auto;
      font-size: 0;
    }

    .touristHomeMain {
        width: 100%;
        height: 100%;

      .list {
        padding: 0 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-flow: wrap;

        .item {
          width: 174px;
          margin-bottom: 8px;
          border-radius: 4px;
          overflow: hidden;

          &:nth-child(2n) {
            margin-right: 0;
          }

          > a {
            display: block;

            .img {
              width: 100%;
              height: 175px;
              background-color: #fff;
              border-radius: 4px 4px 0 0;
              overflow: hidden;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 4px 4px 0 0;
              }
            }

            .info {
              padding: 10px 12px;
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
                display: inline-block;
                height: 22px;

                > span {
                  display: inline-block;
                  padding: 2px 8px;
                  font-size: 10px;
                  border: 1px solid #EA3323;
                  color: #EA3323;
                  border-radius: 2px;
                }
              }

              .money {
                width: 100%;

                .skp-money {
                  margin-top: 4px;
                  font-size: 12px;
                  color:#999;
                }

                .skp-earn {
                  margin-top: 2px;
                  font-size: 15px;
                  font-weight: bold;
                  color:#EA3323;
                }
              }
            }
          }
        }
      }
    }
  }

  .touristHomeBody {
    width: 100%;
    height:auto;
    bottom:0;
    left:0;
    background: #FFFFFF;
    position: fixed;

    .footer {
      border-top:1px solid #eaeaea;
      width: 100%;

      .list {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .item {
          flex: 1;
          display: flex;
          align-items: center;

          &:nth-child(2) {
            > div > img {
              width: 72px;
            }
          }

          > div {
            padding: 5px 0;
            width: 100%;
            color: #333;

            > img {
              width:24px;
              height:24px;
              margin: 0 auto;
              vertical-align: middle;
            }

            > span {
              display: block;
              font-size: 12px;
              text-align: center;

              &:first-child {
                margin-bottom: 2px;
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }

  #indexLogo {
    width: 40px;
    height:40px;
    margin: 0 auto;
    vertical-align: middle;
  }

  .goRegistered {
    width: 100%;
    height:100%;
    position: fixed;
    display: flex;
    align-items: center;
    display: -webkit-flex;
    top: 0;
    background:rgba(0,0,0,0.5);

    .goRegisteredWindow {
      width: 240px;
      height:117px;
      background:#ffffff;
      margin: 0 auto;
      position: relative;
      border-radius: 8px;

      .offShareImg {
        position: absolute;
        z-index: 9;
        right: 0;
        top: 0;
        font-size: 0;
        background: #fff;
        border-radius: 50%;
      }

      .goRegisteredTitle {
        width: 100%;
        color:#333333;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        font-weight: bold;
        font-size: 15px;
        text-align: center;
        line-height: 68px;
        height:69px;
        border:1px solid #EAEAEA;
      }

      .goRegisteredBtn {
        width: 100%;
        height:47px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        font-size: 15px;
        line-height:47px;
        color:#EA3323;
        text-align: center;
      }
    }
  }
}
</style>
