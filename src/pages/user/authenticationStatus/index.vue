<template>
  <div class="authenticationStatus-page">
    <div class="waitFor" v-if="isVerify == 1">
      <img class="img" src="@/assets/personalCenter/success_icon.png" alt="">
      <p class="text">您的认证已提交，</p>
      <p class="text">请耐心等待审核！</p>
    </div>
    <div class="success" v-if="isVerify == 2">
      <img class="img" src="@/assets/personalCenter/success_icon.png" alt="">
      <p class="text">您的认证已通过！</p>
      <div class="user" v-if="atnType == 'user'">
        <p>姓名：{{ idName | filterName }}</p>
        <p class="u-top">身份证：{{ idNumber | filterNumber }}</p>
      </div>
      <div class="user" v-else>
        <p class="u-top">公司名称：{{ corpName | filtercorpName }}</p>
      </div>
    </div>
    <div class="fail" v-if="isVerify == 3">
      <img class="img" src="@/assets/personalCenter/fail_icon.png" alt="">
      <p class="text">您的认证审核未通过！</p>
      <p class="fail-msg">反馈原因：{{ failReason }}</p>
    </div>
    <div class="btn">
      <div class="go-back" v-if="isVerify == 3" @click="again">重新认证</div>
      <router-link :to="{ name: 'home' }" class="go-back" v-if="isVerify != 3">回到首页</router-link>
      <router-link :to="{ name: 'personalCenter' }" class="go-core">个人中心</router-link>
    </div>
  </div>
</template>

<script>
import Models from '@/models';
export default {
  name: 'authenticationStatus',
  data() {
    return {
      atnType: '',
      isVerify: null,
      idName: '',//姓名
      idNumber: '',//身份证
      corpName: '',//公司名称
      failReason: '',//认证失败的原因
    };
  },
  filters: {
    filterName(val) {
      if(val.length == 1) {
        return val + '*'
      }else if(val.length == 2) {
        return val[0] + '*' + val[1]
      }else if(val.length >= 3) {
        return val[0] + '*' + val.charAt(val.length - 1, 1)
      }
    },
    filterNumber(val) {
      return val.slice(0, 4) + '********' + val.slice(-4)
    },
    filtercorpName(val) {
      return val.slice(0, 2) + '********' + val.slice(-2)
    },
  },
  watch: {

  },
  methods: {
    //获取用户认证信息
    userIdentify() {
      Models.User
      .getUserIdentify()
      .then(res => {
        if (res.data.code == '0') {
          this.idName = res.data.info.idName
          this.idNumber = res.data.info.idNumber
          this.failReason = res.data.info.failReason
        }
      })
    },
    //获取企业认证信息
    corpIdentify() {
      Models.User
      .getCorpIdentify()
      .then(res => {
        if (res.data.code == '0') {
          this.corpName = res.data.info.corpName
          this.failReason = res.data.info.failReason
        }
      })
    },
    again() {
      if(this.atnType == 'user') {
        this.$router.push({
          name: 'userAuthentication'
        })
      }else {
        this.$router.push({
          name: 'epAuthentication'
        })
      }
    }
  },
  computed: {

  },
  created() {
    this.atnType = this.$route.query.atnType
    this.isVerify = this.$route.query.isVerify
    if(this.atnType == 'user') {
      this.userIdentify()
    }else {
      this.corpIdentify()
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.authenticationStatus-page {
  width: 100%;

  .waitFor {
    margin-bottom: 44px;
    width: 100%;

    .img {
      margin: 92px auto 22px;
      width: 84px;
      height: 84px;
    }

    .text {
      padding-left: 12px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #333;
    }
  }

  .success {
    margin-bottom: 25px;
    width: 100%;

    .img {
      margin: 92px auto 22px;
      width: 84px;
      height: 84px;
    }

    .text {
      padding-left: 10px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #333;
    }

    .user {
      margin-top: 27px;
      font-size: 14px;
      text-align: center;
      color: #333;

      .u-top {
        margin-top: 10px
      }
    }
  }

  .fail {
    width: 100%;

    .img {
      margin: 92px auto 22px;
      width: 84px;
      height: 84px;
    }

    .text {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: #333;
    }

    .fail-msg {
      margin-top: 30px;
      margin-bottom: 25px;
      font-size: 14px;
      text-align: center;
      color: #EA3323;
    }
  }

  .btn {
    padding: 0 68px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    > a, div {
      padding: 6px 0;
      flex: 1;
      font-size: 15px;
      text-align: center;
      border: 1px solid #EA3323;
      border-radius: 20px;
    }

    .go-back {
      margin-right: 40px;
      color: #EA3323;
    }

    .go-core {
      background-color: #EA3323;
      color: #fff;
    }
  }
};
</style>
