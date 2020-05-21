import axios from 'axios';
import php from '../js/php'

class User {
  // 获取Session
  async session(data) {
    return await axios
    .post('/mn/getSession', data)
    .then(res => res);
  }
  // 获取手机验证码
  async code(data) {
    return await axios
    .post('/lr/getPhoneCode', data)
    .then(res => res);
  }
  // 登录
  async login(data) {
    return await axios
    .post('/mn/login', data)
    .then(res => res);
  }
  // 退出登录
  async logout(data) {
    return await axios
    .post('/mn/logout', data)
    .then(res => res);
  }
  // 绑定邀请关系
  async bindMyInvitor(data) {
    return await axios
    .post('/mn/bindMyInvitor', data)
    .then(res => res);
  }
  //升级店主
  async upgrade(data) {
    return await axios
    .post('/user/getMemberShipList', data)
    .then(res => res);
  }
  //提交升级订单
  async submitForMember(data) {
    return await axios
    .post('/order/submitForMember', data)
    .then(res => res);
  }
  //获取我的会员
  async getMyUser(data) {
    return await axios
    .post(`/user/searchMyUser`,data)
    .then(res => res)
  }
  //我的订单
  async myOrders(data) {
    return await axios
    .post('/order/getMyOrder', data)
    .then(res => res);
  }
  //订单详情
  async orderDetail(data) {
    return await axios
    .post(`/order/getDetail`,data)
    .then(res => res)
  }
  //校验是否设置了密码
  async checkPassword(data) {
    return await axios
    .post('/security/checkPassword', data)
    .then(res => res);
  }
  //校验手机验证码
  async checkPhoneCode(data) {
    return await axios
    .post('/lr/checkPhoneCode', data)
    .then(res => res);
  }
  //设置/重置密码
  async setPassword(data) {
    return await axios
    .post('/security/setPassword', data)
    .then(res => res);
  }
  //余额支付
  async dopay(data) {
    return await axios
    .post('/pay/doPay', data)
    .then(res => res);
  }
  //线下支付
  async offlinePay(data) {
    return await axios
    .post('/pay/offlinePay', data)
    .then(res => res);
  }
  //查询支付结果
  async getPayResult(data) {
    return await axios
    .post('/pay/getPayResult', data)
    .then(res => res);
  }
  //取消订单
  async cancelOrder(data) {
    return await axios
    .post('/order/cancelOrder',data)
    .then(res => res)
  }
  //删除订单
  async delOrder(data) {
    return await axios
    .post('/order/delOrder',data)
    .then(res => res)
  }
  //确认收货
  async confirmReceive(data) {
    return await axios
    .post(`/order/confirmReceive`,data)
    .then(res => res)
  }
  //提醒发货
  async remindShip(data) {
    return await axios
    .post(`/order/remindShip`,data)
    .then(res => res)
  }
  //添加评论
  async addComment(data) {
    return await axios
    .post(`/comment/addComment`,data)
    .then(res => res)
  }
  //上传接口
  async upLoad(data) {
    return await axios
    .post(`/file/upload`,data,{
      headers:{
        'Content-Type':"multipart/form-data"
      }
    })
    .then( res => res )
  }
  //我的购物车
  async shoppingCart(data) {
    return await axios
    .post(`/trolley/getList`,data)
    .then( res => res )
  }
  //获取售后列表
  async afterSaleList(data) {
    return await axios
    .post(`/refund/mylist`,data)
    .then( res => res )
  }
  //获取用户余额
  async getBalance(data) {
    return await axios
    .post(`/balance/getBalance`,data)
    .then(res => res)
  }
  //惠呗收益
  async getPointList(data) {
    return await axios
    .post(`/balance/getPointList`,data)
    .then( res => res )
  }
  //惠呗预收益
  async getPrePointList(data) {
    return await axios
    .post(`/balance/getPrePointList`,data)
    .then( res => res )
  }
  //奖励金收益
  async getFundList(data) {
    return await axios
    .post(`/balance/getFundList`,data)
    .then( res => res )
  }
  //奖励金预收益
  async getPreFundList(data) {
    return await axios
    .post(`/balance/getPreFundList`,data)
    .then( res => res )
  }
  //余额/惠呗/兑换套餐
  async rechargePlan(data) {
    return await axios
    .post(`/balance/getRechargePlan`,data)
    .then( res => res )
  }
  //获取惠呗充值页面信息
  async pointrecharge(data) {
    return await axios
    .post('/balance/pointrecharge', data)
    .then( res => res )
  }
  //余额和惠呗充值-预下单
  async prepareCharge(data) {
    return await axios
    .post(`/balance/prepareCharge`,data)
    .then( res => res )
  }
  //余额兑换惠呗
  async balanceToPoint(data) {
    return await axios
    .post(`/balance/balanceToPoint`,data)
    .then( res => res )
  }
  //获取国内所有地区
  async getAllZones(data) {
    return await axios
    .post(`/common/getAllZones`,data)
    .then( res => res )
  }
  //获取省市区
  async getZones(data) {
    return await axios
    .post(`/common/getZones`,data)
    .then( res => res )
  }
  //获取个人信息
  async getInfo(data) {
    return await axios
    .post(`/account/getInfo`,data)
    .then( res => res )
  }
  //修改个人信息
  async saveMyInfo(data) {
    return await axios
    .post(`/account/saveMyInfo`,data)
    .then( res => res )
  }
  //修改用户头像
  async changeMyHeadIcon(data) {
    return await axios
      .post(`/account/changeMyHeadIcon`,data)
      .then( res => res )
  }
  //获取微信JSSDK
  async getWX(data) {
    return await axios
    // .post(`http://web.no1qh.com/Home/Pay/JssdkInfo`,data)
    // .post(`http://web.test.no1qh.com/Home//Pay/JssdkInfo`, data)
    .post(`${ php.phpUrl }/Home//Pay/JssdkInfo`, data)
    .then( res => res )
  }
  //获取微信支付信息接口
  async WXPayContent(data) {
    return await axios
    // .post(`http://web.no1qh.com/Home/Pay/orderPay`,data)
    .post(`${ php.phpUrl }/Home/Pay/orderPay`,data)
    .then( res => res )
  }
  //获取微信的oppenid
  async getOpenid(data) {
    return await axios
    // .post(`http://web.no1qh.com/Home/Index/getOpenid?url=` + data)
    .post(`${ php.phpUrl }/Home/Index/getOpenid?url=${data}`)
    .then( res => res )
  }
  //我的发票列表
  async getMyInvoices(data) {
    return await axios
    .post(`/order/getMyInvoices`,data)
    .then( res => res )
  }
  //获取发票详情
  async getOneInvoice(data) {
    return await axios
    .post(`/order/getOneInvoice`,data)
    .then( res => res )
  }
  //获取所有的收货地址
  async getAddressList(data) {
    return await axios
    .post(`/address/getList`,data)
    .then( res => res )
  }
  //新增或修改地址
  async saveAddress(data) {
    return await axios
    .post(`/address/save`,data)
    .then( res => res )
  }
  //删除地址
  async deleteAddress(data) {
    return await axios
    .post(`/address/delete`,data)
    .then( res => res )
  }
  //获取我的评论列表
  async getMyComments(data) {
    return await axios
    .post(`/comment/getMyComments`,data)
    .then( res => res )
  }
  //充值/兑换记录列表
  async getMyRecharge(data) {
    return await axios
    .post(`/balance/getMyRecharge`,data)
    .then( res => res )
  }
  //查询支付结果
  async getPayResult(data) {
    return await axios
    .post(`/pay/getPayResult`,data)
    .then( res => res )
  }
  //获取用户银行卡
  async getMybank(data) {
    return await axios
    .post(`/account/getMyBank`,data)
    .then(res => res)
  }
  //添加银行卡
  async saveMyBank(data) {
    return await axios
    .post(`/account/saveMyBank`,data)
    .then(res => res)
  }
  //先获取是否绑定了银行卡
  async getMyFirstBank(data) {
    return await axios
      .post(`/account/getMyFirstBank`,data)
      .then(res => res)
  }
  //获取银行列表
  async getBankList(data) {
    return await axios
      .post(`/common/getBankList`,data)
      .then( res => res )
  }
  //获取提现列表
  async getWithdrawList(data) {
    return await axios
    .post(`/fund/withdrawList`,data)
    .then(res => res)
  }
  //提现总额
  async getTotalDrawByMonth(data) {
    return await axios
    .post(`/fund/getTotalDrawByMonth`,data)
    .then(res => res)
  }
  //获取我的会员列表
  async searchMyUser(data) {
    return await axios
    .post(`/user/searchMyUser`,data)
    .then(res => res)
  }
  //企业认证
  async addCorpIdentify(data) {
    return await axios
    .post(`/account/addCorpIdentify`,data)
    .then(res => res)
  }
  //用户认证申请
  async addUserIdentify (data) {
    return await axios
    .post(`/account/addUserIdentify`,data)
    .then(res => res)
  }
  //获取认证状态
  async getIdentifyStatus(data) {
    return await axios
    .post(`/account/getIdentifyStatus`,data)
    .then(res => res)
  }
  //获取用户认证信息
  async getUserIdentify(data) {
    return await axios
    .post(`/account/getUserIdentify`,data)
    .then(res => res)
  }
  //获取企业认证信息
  async getCorpIdentify(data) {
    return await axios
      .post(`/account/getCorpIdentify`,data)
      .then( res => res )
  }
  //修改购物车数量
  async changeNum (data) {
    return await axios
    .post(`/trolley/changeNum`,data)
    .then(res => res)
  }
  //批量删除购物车商品
  async discardMulti(data) {
    return await axios
    .post(`/trolley/discardMulti`,data)
    .then(res => res)
  }
  //赠送惠呗
  async sentPoint(data) {
    return await axios
    .post(`/balance/sentPoint`,data)
    .then(res => res)
  }
  //获取退货-退款原因
  async getReason (data) {
    return await axios
    .post(`/refund/getreason`,data)
    .then(res => res)
  }
  //添加或修改退款/退货----待删除
  async refundAdd(data) {
    return await axios
    .post(`/refund/save`,data)
    .then(res => res)
  }
  //收益和惠贝统计
  async getMyProfit(data) {
    return await axios
    .post(`/balance/getMyProfit`,data)
    .then(res => res)
  }
  //申请提现
  async addDraw(data) {
    return await axios
    .post(`/fund/addDraw`,data)
    .then(res => res)
  }
  //获取分享的二维码
  async getQRcode(data) {
    return await axios
    .post(`/code/getQRcode`,data)
    .then(res => res)
  }
  //微信提现前需要先调用的借口
  async addWeixinDraw(data) {
    return await axios
      // .post(`http://web.no1qh.com/Home/WeiXinUser/WeiXinUeser`,data)
      .post(`${ php.phpUrl }/Home/WeiXinUser/WeiXinUeser`,data)
      .then( res => res )
  }
  //补全收货地址
  async postRecordAddress(data) {
    return await axios
      .post(`/order/postRecordAddress`,data)
      .then( res => res )
  }
  //订单统计
  async statMyOrder(data) {
    return await axios
      .post(`/order/statMyOrder`,data)
      .then( res => res )
  }

  //用户统计
  async statMyUser(data) {
    return await axios
      .post(`/user/statMyUser`,data)
      .then( res => res )
  }

  //收益和惠贝聚合统计
  async statMyProfit(data) {
    return await axios
      .post(`/balance/statMyProfit`,data)
      .then( res => res )
  }

  //关注公众号
  async shopCode(data) {
    return await axios
    .post(`${ php.phpUrl }/Home/WeixinEvent/shopCode`,data)
    .then( res => res )
  }

  //已经关注的老用户静默绑定
  async binduser(data) {
    return await axios
    .post(`${ php.phpUrl }/Home/WeixinEvent/binduser`,data)
    .then( res => res )
  }

  //余额明细
  async getFundBook(data) {
    return await axios
    .post('/balance/getFundBook', data)
    .then( res => res )
  }
  //惠呗明细
  async getPointBook(data) {
    return await axios
    .post('/balance/getPointBook', data)
    .then( res => res )
  }

  //物流信息
  async getLogistics(data) {
    return await axios
    .post('/order/getLogistics', data)
    .then( res => res )
  }

  //商品分区查询
  async getzone(data) {
    return await axios
    .post('/commodity/getzone', data)
    .then( res => res )
  }

  //线下惠贝抵扣
  async offlineDepoint(data) {
    return await axios
    .post('/pay/offlineDepoint', data)
    .then( res => res )
  }

  //添加售后单
  async refundSave(data) {
    return await axios
    .post('/refund/save', data)
    .then( res => res )
  }

  //售后单详情
  async detail(data) {
    return await axios
    .post('/refund/detail', data)
    .then( res => res )
  }

  //取消售后
  async refundCancel(data) {
    return await axios
    .post('/refund/cancel', data)
    .then( res => res )
  }

  //获取售后协商列表
  async refundHistory(data) {
    return await axios
    .post('/refund/history', data)
    .then( res => res )
  }

  //编辑售后单
  async refundUpdate(data) {
    return await axios
    .post('/refund/update', data)
    .then( res => res )
  }

  //获取物流公司列表
  async kdlist(data) {
    return await axios
    .post('/common/kdlist', data)
    .then( res => res )
  }

  //设置退货物流
  async refundexpress(data) {
    return await axios
    .post('/refund/refundexpress', data)
    .then( res => res )
  }

  //支付后查询会员商品
  async laterinfo(data) {
    return await axios
    .post('/pay/laterinfo', data)
    .then( res => res )
  }

  //获取二维码信息
  async getCodeInfo(data) {
    return await axios
    .post('/code/getCodeInfo', data)
    .then( res => res )
  }

  //搜索用户
  async searchUser(data) {
    return await axios
    .post('/fund/searchUser', data)
    .then( res => res )
  }
  //赠送惠贝
  async sentPoint(data) {
    return await axios
    .post('/balance/sentPoint', data)
    .then( res => res )
  }
  //获取营销素材
  async getMaterialList(data) {
    return await axios
    .post('/market/getMaterialList', data)
    .then( res => res )
  }
  //获取海报
  async getPosterList(data) {
    return await axios
    .post('/market/getPosterList', data)
    .then( res => res )
  }
  //获取视频
  async getVideoList(data) {
    return await axios
    .post('/market/getVideoList', data)
    .then( res => res )
  }
  //提货明细
  async getGoodSaleCard(data) {
    return await axios
    .post('/goodSaleCard/getList', data)
    .then( res => res )
  }
  //我的奖品
  async getMyLuckyGift(data) {
    return await axios
    .post('/luckyActivity/getMyLuckyGift', data)
    .then( res => res )
  }
  //营销素材分享图下载
  async getMarketcode(data) {
    return await axios
    .post('/code/getMarketcode', data)
    .then( res => res )
  }
}

export default new User();
