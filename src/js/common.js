
import Models from "@/models";
export default {
  /**
 * 获取url的参数
 * @param {url} url
 */
  getRequest(url) {
    var theRequest = new Object();
    var url = decodeURI(decodeURI(url));
    if (url.indexOf("?") != -1) {
      var str = url.split('?')[1];
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]]=(unescape(strs[i].split("=")[1]));
      }
    }
    return theRequest;
  },

  bodyScroll(event){
    event.stopPropagation();
    event.preventDefault();
  },

  /**
   * 禁止页面滚动，解决弹框出现时 IOS 上滚动穿透的问题
   */
  forbidBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', this.bodyScroll, false)
  },

  /**
   * 解除禁止滚动，解决弹框出现时 IOS 上滚动穿透的问题
   */
  allowBodyScroll() {
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', this.bodyScroll, false)
  },
}