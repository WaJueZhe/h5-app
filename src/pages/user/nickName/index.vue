<template>
  <div class="nickName-page">
    <div class="name" v-if="paramsType == 'nickName'">
      <input type="search" :maxlength="16" v-model.trim="editUserInfo.nickName" placeholder="请输入昵称" @keyup.enter="save">
    </div>
    <div class="name" v-if="paramsType == 'weixin'">
      <input type="search" :maxlength="16" v-model.trim="editUserInfo.weixin" placeholder="请输入微信号" @keyup.enter="save">
    </div>
    <div class="btn" @click="save">保存</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from '@/models';
import { Toast } from 'vant';
Vue.use(Toast)
export default {
  name: 'nickName',
  data() {
    return {
      paramsType: '',
      content: '',
      editUserInfo:{
        nickName:"",
        phone:"",
        weixin:"",
        areaId:""
      },
    };
  },
  watch: {

  },
  methods: {
    //修改个人信息
    save () {
      if(this.editUserInfo.nickName == '') {
        Toast('昵称不能为空')
        return
      }
      Models.User
      .saveMyInfo(this.editUserInfo)
      .then(res => {
        if (res.data.code == '0') {
          Toast('修改成功')
          this.$router.go(-1)
        }else {
          Toast('修改失败')
        }
      })
    },
  },
  computed: {

  },
  created() {
    this.paramsType = this.$route.query.paramsType
    if(this.paramsType == 'nickName') {
      this.editUserInfo.nickName = this.$route.query.content
    }else if(this.paramsType == 'weixin') {
      this.editUserInfo.weixin = this.$route.query.content
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.nickName-page {
  width: 100%;

  .name {
    padding: 15px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;

    > input {
      width: 100%;
      font-size: 15px;
      color: #333;
    }
  }

  .btn {
    padding: 10px 0;
    margin: 40px auto;
    width: 80%;
    font-size: 15px;
    text-align: center;
    background-color: #EA3323;
    color: #fff;
    border-radius: 20px;
  }
};
</style>
