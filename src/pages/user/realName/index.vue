<template>
  <div class="realName-page">
    <div class="realName">
      <ul class="r-list">
        <li class="r-item" @click.stop="goUserAuthentication">
          <router-link to="">
            <div class="s-text">用户认证</div>
            <div class="s-right">
              <div class="text">
                <span v-if="userStatus == 0">未认证</span>
                <span v-if="userStatus == 1">审核中</span>
                <span v-if="userStatus == 2">已认证</span>
                <span v-if="userStatus == 3">认证失败</span>
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="r-item" @click.stop="goEpAuthentication" v-if="ygrade > 4">
          <router-link to="">
            <div class="s-text">企业认证</div>
            <div class="s-right">
              <div class="text">
                <span v-if="corpStatus == 0">未认证</span>
                <span v-if="corpStatus == 1">审核中</span>
                <span v-if="corpStatus == 2">已认证</span>
                <span v-if="corpStatus == 3">认证失败</span>
                <van-icon name="arrow" size="16px" color="#999999"/>
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
import Models from '@/models';
import { Icon } from 'vant';
Vue.use(Icon);
export default {
  name: 'realName',
  data() {
    return {
      ygrade: localStorage.getItem('ygrade'),
      userStatus: null,
      corpStatus: null,
    };
  },
  watch: {

  },
  methods: {
    // 点击用户认证
    goUserAuthentication() {
      if(this.userStatus == 0) {
        this.$router.push({
          name: 'userAuthentication',
        })
      }else {
        this.$router.push({
          name: 'authenticationStatus',
          query: {
            atnType: 'user',
            isVerify: this.userStatus
          }
        })
      }
    },
    // 点击企业认证
    goEpAuthentication() {
      if(this.corpStatus == 0) {
        this.$router.push({
          name: 'epAuthentication',
        })
      }else {
        this.$router.push({
          name: 'authenticationStatus',
          query: {
            atnType: 'corp',
            isVerify: this.corpStatus
          }
        })
      }
    },
    //用户认证状态
    UserAuthentication() {
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

  },
  activated () {
    this.UserAuthentication()
    this.enterpriseAuthentication()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.realName-page {
  width: 100%;

  .realName {
    width: 100%;

    .r-list {
      width: 100%;
      background-color: #fff;

      .r-item {
        width: 100%;

        &:last-child > a {
          border-bottom: none
        }

        > a {
          display: block;
          padding: 15px;
          width: 100%;
          border-bottom:1px solid #EAEAEA;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;

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
};
</style>
