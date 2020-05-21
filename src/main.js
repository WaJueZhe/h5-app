// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import "babel-polyfill"
import App from './App'
import router from './router'
import 'amfe-flexible/index.js'
import './css/index.css'
import './models';
import './js/http';
import './js/filters'
import common from './js/common'
import validator from './js/validator'
import php from './js/php'
import VueWechatTitle from 'vue-wechat-title'
import wx from 'weixin-js-sdk';
import sdk from '@/js/weixin.js';
import { Dialog } from 'vant';
import Navigation from 'vue-navigation'
import Video from 'video.js'
import 'video.js/dist/video-js.css'


import axios            from 'axios'
import VueAxios         from 'vue-axios'

Vue.use(Navigation, {router});
Vue.use(VueWechatTitle);
Vue.use(VueAxios, axios);
Vue.use(Dialog);

router.beforeEach((to, from, next) => {
  Dialog.close()
  common.allowBodyScroll()
  if(localStorage.sessionId !== undefined) {
    next()
  }else if(
    to.path === '/touristHome' ||
    to.path === '/login' ||
    to.path === '/goodsDetails' ||
    to.path === '/upgradeDetail' ||
    to.path === '/upgradeQHBoss' ||
    to.path === '/luckDraw'
    ) {
    next()
  }else {
    let agrs = common.getRequest(window.location.href);
    if(agrs.subscribe) {
      router.push({
        name: 'touristHome',
        query: {
          subscribe: agrs.subscribe
        }
      });
    }
    next()
  }
});

Vue.config.productionTip = false;
Vue.prototype.wx = wx;
Vue.prototype.$php = php;
Vue.prototype.$common = common;
Vue.prototype.$rules = validator;
Vue.prototype.bus = new Vue;
Vue.prototype.$video = Video

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
