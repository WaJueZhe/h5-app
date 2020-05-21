<template>
  <div class="userInvitation-page">
    <div class="user-box">
      <div class="user-info">
        <div class="user-img">
          <img v-if="headPic == undefined || headPic == ''" src="@/assets/homePage/avatar.png" alt="">
          <img v-else :src="headPic" alt="">
        </div>
        <div class="name">{{ nickName }}</div>
        <div class="desc">邀请你进入企惠壹号</div>
      </div>
      <div class="user-btn">
        <div class="confirm" @click="confirm">确定</div>
        <div class="cancel" @click="goback">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from "@/models";
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'userInvitation',
  data() {
    return {
      ucode: '',
      headPic: '',
      nickName: '',
    };
  },
  watch: {

  },
  methods: {
    confirm() {
      let data = {
        id: this.ucode
      };
      Models.User
      .bindMyInvitor(data)
      .then(res => {
        if(res.data.code == '0') {
          this.$router.push({
            name: 'home',
            params: {
              nickName: this.nickName
            }
          })
        }else {
          Toast(res.data.msg)
        }
      })
    },
    goback() {
      this.$router.go(-1)
    }
  },
  computed: {

  },
  created() {
    let url = window.location.href;
    let agrs = this.$common.getRequest(url);
    this.ucode = agrs.ucode
    this.headPic = agrs.headPic
    this.nickName = agrs.nickName
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.userInvitation-page {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .user-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .user-info {

      .user-img {
        margin: auto;
        width: 60px;
        height: 60px;
        border-radius: 50%;

        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .name {
        margin-top: 14px;
        font-size: 15px;
        text-align: center;
        color: #333;
      }

      .desc {
        margin-top: 8px;
        font-size: 13px;
        text-align: center;
        color: #333;
      }
    }

    .user-btn {
      margin-top: 108px;

      .confirm {
        padding: 12px 0;
        width: 175px;
        font-size: 15px;
        text-align: center;
        background-color: #EA3323;
        color: #fff;
        border-radius: 24px;
      }

      .cancel {
        padding: 12px 0;
        margin-top: 20px;
        width: 175px;
        font-size: 15px;
        text-align: center;
        color: #333;
        border-radius: 24px;
      }
    }
  }
};
</style>
