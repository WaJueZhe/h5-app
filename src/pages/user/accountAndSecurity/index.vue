<template>
  <div class="accountAndSecurity">
    <div class="passWord">
      <ul class="list">
        <li class="item" @click="modifyPsd" v-if="settingPassWord != null &&settingPassWord == 'yes'">
          <div class="type">修改支付密码</div>
          <div class="s-right">
            <van-icon name="arrow" size="16px" color="#999999"/>
          </div>
        </li>
        <li class="item" @click="forgetPsd">
          <div class="type">忘记支付密码</div>
          <div class="s-right">
            <van-icon name="arrow" size="16px" color="#999999"/>
          </div>
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
  name:"accountAndSecurity",
  data () {
    return {
      settingPassWord: sessionStorage.getItem('settingPassWord')
    }
  },
  methods: {
    modifyPsd () {
      if (this.settingPassWord == 'yes') {
        this.$router.push({
          name: 'settingPassword',
          query: {
            editType: 3
          }
        })
      }
    },
    forgetPsd () {
      this.$router.push({
        name: 'phoneVerification',
        query: {
          editType: 2
        }
      })
    }
  },
  components: {
  },
  beforeDestroy () {

  },
  created() {

  }
}
</script>
<style lang="less" scoped>
.accountAndSecurity {
  width: 100%;

  .passWord {
    width: 100%;

    .list {
      width: 100%;

      .item {
        padding: 13px 16px;
        margin-bottom: 8px;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .type {
          font-size: 13px;
          color: #333;
        }

        .s-right {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  // .userBtn {
  //   width: 100%;
  //   height: 44px;
  //   font-size: 15px;
  //   color:#333333;
  //   margin-top: 8px;
  // }
}

</style>
