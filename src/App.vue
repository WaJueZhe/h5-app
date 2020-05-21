<template>
  <div id="app">
    <navigation>
      <router-view v-wechat-title='$route.meta.title' />
    </navigation>
    <Loading></Loading>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from "@/models";
import Loading from './components/loading'
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'App',
  data () {
    return {
      flageType: localStorage.getItem('flage')
    }
  },
  methods:{
    init(code) {
      let data = {
        id: code
      };
      Models
      .User
      .bindMyInvitor(data)
      .then(res => {
        if(res.data.code == '0') {
          localStorage.setItem('flage', false)
        }
      })
    },
    getRequest(url) {
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
          theRequest[strs[i].split("=")[0]]=(unescape(strs[i].split("=")[1]));
        }
      }
      return theRequest;
    },
  },
  updated () {

  },
  components: {
    Loading
  },
  mounted(){
    this.$nextTick(function () {
      //使用路由后置守卫监听路由改变，并把当前路由缓存到sessionStorage里面
      this.$router.afterEach((to, from) => { //to:即将前往的页面,from:从哪个页面来,next:下一步操作
        let href = window.location.href;
        sessionStorage.href = href;
        this.bus.$emit('getLoading', {
          loading: false,
        });
      });
    });
  },

  watch:{
  },
  created () {
    if(this.flageType == null) {
      let url = window.location.href
      let agrs = this.getRequest(url)
      if(agrs.code != undefined) {
        this.init(agrs.code)
      }
    }
  },
}
</script>

<style>
#app {
  /* font-family: '微软雅黑'; */
  font-family: PingFangSC-Regular, sans-serif,"Noto Sans CJK SC", "Source Han Sans CN",Heiti, Heiti SC, DroidSans, DroidSansFallback, Arial, "Microsoft YaHei";
  /* font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; */
  /* position: relative; */
  color: #333;
}

  .van-stepper__input[disabled] {
    color:#323233!important;
  }
</style>
