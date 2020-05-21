import Vue from 'vue';
import router from '@/router'
import axios from 'axios';
import { getPostData } from './handleData';
import common from './common';
import { Dialog } from 'vant';

Vue.use(Dialog);

let baseUrl = '';
if (process.env.NODE_ENV == 'development') {//开发环境
  // baseUrl = "http://192.168.10.165:17511/app";
  baseUrl = "http://120.78.184.0:17511/app";
  // baseUrl = "http://47.107.179.134:17511/app";

}else if(process.env.NODE_ENV == 'testing'){//测试环境
  baseUrl = "http://120.78.184.0:17511/app";

}


// axios.defaults.baseURL = 'http://192.168.10.165:17511/app';//开发环境
// axios.defaults.baseURL = 'http://120.78.184.0:17511/app';//测试环境
axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 100000;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers['Accept'] = 'application/x-www-form-urlencoded';

//拦截请求
axios.interceptors.request.use(
  config => {
    config.data = getPostData(config.data,config);
    return config
  },
  error => {
    return Promise.reject(error)
});

//返回拦截器
axios.interceptors.response.use((response) => {
  if(window.location.href.indexOf('/goodsDetails') >= 0 ||
    window.location.href.indexOf('/login') >= 0 ||
    window.location.href.indexOf('/upgradeDetail') >= 0 ||
    window.location.href.indexOf('/upgradeQHBoss') >= 0 ||
    window.location.href.indexOf('/luckDraw') >= 0) {
      if (response.data.code === '2') {
        let url = window.location.href
        let agrs = common.getRequest(url);
        Dialog.alert({
          title: '警告',
          message: '您还未登陆，请您先登陆'
        }).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          router.push({
            name: 'login',
            query: {
              goodId: agrs.goodId,
              headPic: agrs.headPic,
              nickName: agrs.nickName,
              ucode: agrs.ucode,
              action: agrs.action,
              subscribe: agrs.subscribe,
              gtype: agrs.gtype,
              jump: '1',
            }
          })
        }).catch(() => {
          // on cancel
        });
      }
  }else {
    if(response.data.code === '2') {
      let url = window.location.href
      let agrs = common.getRequest(url);
      Dialog.alert({
        title: '警告',
        message: '您还未登陆，请您先登陆'
      }).then(() => {
        sessionStorage.clear();
        localStorage.clear();
        document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push({
          name: 'login',
          query: {
            goodId: agrs.goodId,
            headPic: agrs.headPic,
            nickName: agrs.nickName,
            ucode: agrs.ucode,
            action: agrs.action,
            subscribe: agrs.subscribe,
            gtype: agrs.gtype,
          }
        })
      }).catch(() => {
        // on cancel
      });
    }
  }
  return response;
}, function (error) {
	// Do something with response error
	return Promise.reject(error);
});
