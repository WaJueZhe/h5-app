import axios from 'axios';

class Home {
  // 首页数据
  async swiper(data) {
    return await axios
    .post('/face/homeIndex', data)
    .then(res => res);
  }
  // 消息中心
  async getUserMessage(data) {
    return await axios
    .post('/account/getUserMessage', data)
    .then(res => res);
  }
  //获取未读站内信数量
  async getUnreadMessage(data) {
    return await axios
    .post('/account/getUnreadMessage', data)
    .then(res => res);
  }
  //删除消息
  async delUserMessage(data) {
    return await axios
    .post('/account/delUserMessage', data)
    .then(res => res);
  }
  // 搜索发现
  async history(data) {
    return await axios
    .post('/commodity/getHotKey', data)
    .then(res => res);
  }
  // 礼品专属搜索
  async searchZoneGoods(data) {
    return await axios
    .post('/commodity/searchZoneGoods', data)
    .then(res => res);
  }
  // 商品搜索
  async searchGoods(data) {
    return await axios
    .post('/commodity/searchGoods', data)
    .then(res => res);
  }
  // 为你推荐
  async searchZoneGoods(data) {
    return await axios
    .post('/commodity/searchZoneGoods', data)
    .then(res => res);
  }
  // 商品详情
  async getDetail(data) {
    return await axios
    .post('/commodity/getDetail', data)
    .then(res => res);
  }
  // 商品详情地址接口
  async getContent(data) {
    return await axios
    .post('/commodity/getContent', data)
    .then(res => res);
  }
  // 商品评论
  async getCommentList(data) {
    return await axios
    .post('/comment/getCommentList', data)
    .then(res => res);
  }
  // 商品的sku
  async getSku(data) {
    return await axios
    .post('/commodity/getSku', data)
    .then(res => res);
  }
  // 商品的增值服务
  async getSvc(data) {
    return await axios
    .post('/commodity/getSvc', data)
    .then(res => res);
  }
  // 购买确认页面
  async shopConfirm(data) {
    return await axios
    .post('/trolley/shopConfirm', data)
    .then(res => res);
  }
  // 新品专区
  async searchZoneGoods(data) {
    return await axios
    .post('/commodity/searchZoneGoods', data)
    .then(res => res);
  }
  // 分类列表tab
  async getShopSortList(data) {
    return await axios
    .post('/shop/getShopSortList', data)
    .then(res => res);
  }
  // 添加发票
  async addInvoice(data) {
    return await axios
    .post('/order/addInvoice', data)
    .then(res => res);
  }
  // 发票详情
  async getOneInvoice(data) {
    return await axios
    .post('/order/getOneInvoice', data)
    .then(res => res);
  }
  // 获取默认地址
  async getDefault(data) {
    return await axios
    .post('/address/getDefault', data)
    .then(res => res);
  }
  // 订单询价
  async orderPreSettle(data) {
    return await axios
    .post('/order/orderPreSettle', data)
    .then(res => res);
  }
  // 提交订单
  async submit(data) {
    return await axios
    .post('/order/submit', data)
    .then(res => res);
  }
  // 直接提交订单-惠贝充值
  async submitForDirect(data) {
    return await axios
    .post('/order/submitForDirect', data)
    .then(res => res);
  }
  // 添加商品到购物车
  async add(data) {
    return await axios
    .post('/trolley/add', data)
    .then(res => res);
  }
  // 检测用户密码是否已设置
  async checkPassword(data) {
    return await axios
    .post('/security/checkPassword', data)
    .then(res => res);
  }
  // 获取用户签到列表
  async signActivity(data) {
    return await axios
    .post('/signactivity/list', data)
    .then(res => res);
  }
  // 签到
  async signIn(data) {
    return await axios
    .post('/signactivity/signin', data)
    .then(res => res);
  }
  // 获取活动规则
  async getRule(data) {
    return await axios
    .post('/activity/getrule', data)
    .then(res => res);
  }
  // 校验提货卡
  async pickCardCheck(data) {
    return await axios
    .post('/pickcard/check', data)
    .then(res => res);
  }
  // 企惠服务+
  async QHServer(data) {
    return await axios
    .post('/face/QHServer', data)
    .then(res => res);
  }
  // 获取抽奖活动
  async getLuckyActivity(data) {
    return await axios
    .post('/luckyActivity/getOne', data)
    .then(res => res);
  }
  // 中奖的商品
  async getMyLuckyDay(data) {
    return await axios
    .post('/luckyActivity/getMyLuckyDay', data)
    .then(res => res);
  }
  // 获取最近中奖用户信息
  async getLatestLuckyUser(data) {
    return await axios
    .post('/luckyActivity/getLatestLuckyUser', data)
    .then(res => res);
  }
  //抽奖活动分享链接
  async getLuckyDayShare(data) {
    return await axios
    .post('/code/getLuckyDayShare', data)
    .then( res => res )
  }
  //获取新年弹框
  async obtain(data) {
    return await axios
    .post('http://web.no1qh.com/Api/PopupWindow/obtain', data)
    .then( res => res )
  }
}

export default new Home();