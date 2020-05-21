<template>
  <div class="setUp-page">
    <div class="setUp">
      <ul class="s-list">
        <li class="s-item">
          <router-link :to="{ name: 'personalInformation' }">
            <div class="s-text">个人信息</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="s-item">
          <router-link :to="{ name: 'realName' }">
            <div class="s-text">实名认证资料</div>
            <div class="s-right">
              <div class="text">
                <span v-if="ygrade <= 4 && userStatus == 2">已认证</span>
                <span v-if="ygrade > 4 && userStatus == 2 && corpStatus == 2">已认证</span>
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="s-item">
          <router-link :to="{ name: 'accountAndSecurity' }">
            <div class="s-text">账户与安全</div>
            <div class="s-right">
              <div class="text">
                <span>支付密码管理</span>
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="s-item">
          <router-link :to="{ name: 'myInvoice' }">
            <div class="s-text">我的发票</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="s-item">
          <router-link :to="{ name: 'addressManagement' }">
            <div class="s-text">我的收货地址</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="signOut" @click="signOut">退出登录</div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Icon, Dialog } from 'vant';
Vue.use(Icon).use(Dialog);
export default {
  name:"setUp",
  data() {
    return {
      ygrade: localStorage.getItem('ygrade'),
      userStatus: '',
      corpStatus: '',
    };
  },
  watch: {

  },
  methods: {
    // 退出登录
    signOut() {
      Dialog.confirm({
        message: '是否退出'
      }).then(() => {
        Models.User
        .logout()
        .then(res => {
          if(res.data.code == '0') {
            sessionStorage.clear();
            localStorage.clear();
            document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.$router.replace({
              name: 'login'
            })
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    //用户认证状态
    userAuthentication() {
      let data = {
        str: 'user'
      }
      Models.User
      .getIdentifyStatus(data)
      .then(res => {
        if(res.data.code == '0') {
          this.userStatus = res.data.info.ystatus;
        }
      })
    },
    //企业用户状态
    enterpriseAuthentication() {
      let data = {
        str: 'corp'
      }
      Models.User
      .getIdentifyStatus(data)
      .then(res => {
        if(res.data.code == '0') {
          this.corpStatus = res.data.info.ystatus;
        }
      })
    },
  },
  computed: {

  },
  created() {
    this.userAuthentication()
    this.enterpriseAuthentication()
  },
  activated () {
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.setUp-page {
  width: 100%;

  .setUp {
    width: 100%;

    .s-list {
      width: 100%;
      background-color: #fff;

      .s-item {
        width: 100%;

        &:last-child > a {
          border-bottom: none
        }

        > a {
          position: relative;
          display: block;
          padding: 15px;
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;

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

          .s-text {
            font-size: 15px;
            color: #333;
          }

          .s-right {
            font-size: 15px;
            color: #999;

            .text {
              display: flex;
              align-items: center;

              > span {
                padding-right: 8px;
              }
            }
          }
        }
      }
    }
  }

  .signOut {
    padding: 15px 0;
    margin-top: 8px;
    width: 100%;
    font-size: 15px;
    text-align: center;
    color: #EA3323;
    background-color: #fff;
  }
};
</style>
