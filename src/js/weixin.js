
import axios from 'axios';
import wx from 'weixin-js-sdk'
import php from '../js/php'

const jsApiList = [
  'checkJsApi',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareWeibo',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
]

function getJSSDK(url, dataForWeixin) {
  if(dataForWeixin == null) {
    dataForWeixin = {
      title: '',
      link: '',
      imgUrl: '',
      desc: '',
    }
  }
  let params = {
    url: url
  }
  axios.post(`${ php.phpUrl }/Home/Pay/JssdkInfo`, params)
  .then(res => {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId:res.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature,// 必填，签名
      jsApiList: jsApiList
    })
    wx.ready(function () {
      let title = dataForWeixin.title
      let link = dataForWeixin.link
      let imgUrl = dataForWeixin.imgUrl
      let desc = dataForWeixin.desc
      if(desc == undefined || desc == null) {
        desc = '我在企惠壹号发现了一个不错的东西,赶快来看看吧。'
      }
      //分享给朋友及分享到QQ
      wx.updateAppMessageShareData({
        title: title, // 分享标题
        desc: desc,   // 分享描述
        link: link,// 分享链接
        imgUrl: imgUrl,  // 分享图标
        success: function() {
          //成功的回调
        },
      })
      //分享到朋友圈及分享到QQ空间
      wx.updateTimelineShareData({
        title: title, // 分享标题
        desc: desc,   // 分享描述
        link: link,// 分享链接
        imgUrl: imgUrl,  // 分享图标
        success: function() {
          //成功的回调
        },
      })
      //分享到腾讯微博
      wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: desc,   // 分享描述
        link: link,// 分享链接
        imgUrl: imgUrl,  // 分享图标
        success: function() {
          //成功的回调
        },
      })
      // wx.onMenuShareTimeline({
      //   title: title, // 分享标题
      //   desc: '我在企惠壹号发现了一个不错的东西,赶快来看看吧。',   // 分享描述
      //   link: link,// 分享链接
      //   imgUrl: imgUrl,  // 分享图标
      //   success: function() {
      //     //成功的回调
      //   },
      // })
      // wx.onMenuShareAppMessage({
      //   title: title, // 分享标题
      //   desc: '我在企惠壹号发现了一个不错的东西,赶快来看看吧。',   // 分享描述
      //   link: link,// 分享链接
      //   imgUrl: imgUrl,  // 分享图标
      //   success: function() {
      //     //成功的回调
      //   },
      // })
    })
  })
}

export default {
  // 获取JSSDK
  getJSSDK: getJSSDK
}
