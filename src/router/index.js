import Vue from 'vue'
import Router from 'vue-router'
//按需加载模块

//登录模块
const Login                               = resolve => require(['@/pages/user/login'],resolve);

//店主升级
const UpgradeShopkeeper                   = resolve => require(['@/pages/user/upgradeShopkeeper'],resolve);

//首页
const Home                                = resolve => require(['@/pages/homePage/home'],resolve);
// 历史搜索
const SearchHistory                       = resolve => require(['@/pages/homePage/searchHistory'],resolve);
//分类详情
const ClassificationDetails               = resolve => require(['@/pages/homePage/classificationDetails'],resolve);
//礼品专属分类列表
const GiftClassification                  = resolve => require(['@/pages/homePage/giftClassification'],resolve);
//游客模式
const TouristHome                         = resolve => require([`@/pages/homePage/touristHome`],resolve);
//商品详情
const GoodsDetails                        = resolve => require(['@/pages/homePage/goodsDetails'],resolve);
//商品评论
const Comment                             = resolve => require(['@/pages/homePage/comment'],resolve);
// 礼品采购
const GiftExclusive                       = resolve => require(['@/pages/homePage/giftExclusive'],resolve);
// 热卖专区
const HotSell                             = resolve => require(['@/pages/homePage/hotSell'],resolve);
// 每日上新
const NewsArea                            = resolve => require(['@/pages/homePage/newsArea'],resolve);
//企惠服务+
const Service                             = resolve => require(['@/pages/homePage/service'],resolve);
// 所有产品
const AllProduct                          = resolve => require(['@/pages/homePage/allProduct'],resolve);
// 消息详情
const SystemNews                          = resolve => require(['@/pages/homePage/systemNews'],resolve);
// 消息中心
const MessageCenter                          = resolve => require(['@/pages/homePage/messageCenter'],resolve);
//商品订单
const GoodsOrder                          = resolve => require(['@/pages/homePage/goodsOrder'],resolve);
//新人专属福利
const NewcomerBenefits                    = resolve => require(['@/pages/homePage/newcomerBenefits'],resolve);
//活动规则
const ActivityRules                       = resolve => require(['@/pages/homePage/activityRules'],resolve);
//签到
const Sign                                = resolve => require(['@/pages/homePage/sign'],resolve);
//开具发票
const OpenInvoice                         = resolve => require(['@/pages/homePage/openInvoice'],resolve);
//交易物流
const TsnLogistics                        = resolve => require(['@/pages/homePage/tsnLogistics'],resolve);
//活动消息
const ActivityMessage                     = resolve => require(['@/pages/homePage/activityMessage'],resolve);
// 抽奖
const LuckDraw                          = resolve => require([`@/pages/homePage/luckDraw`],resolve);

//用户邀请
const UserInvitation                      = resolve => require(['@/pages/user/userInvitation'],resolve);

//购物车
const ShoppingCart                        = resolve => require(['@/pages/shoppingCart/home'],resolve);

//支付成功
const PaymentSuccessful                   = resolve => require(['@/pages/paymentSuccessful'],resolve);

//订单已完成
const OrderSuccess                   = resolve => require(['@/pages/orderSuccess'],resolve);

//个人中心
const PersonalCenter                      = resolve => require(['@/pages/user/personalCenter'],resolve);

//奖励金预收益、惠呗预收益
const BonusList                           = resolve => require([`@/pages/user/bonusList`],resolve);

//个人信息
const PersonalInformation                 = resolve => require([`@/pages/user/personalInformation`],resolve);

//我的用户
const MyUser                              = resolve => require([`@/pages/user/myUser`],resolve);

//提现记录
const WithdrawalsRecord                   = resolve => require([`@/pages/user/withdrawalsRecord`],resolve);

//提现
const Withdraw                            = resolve => require([`@/pages/user/withdraw`],resolve);

//银行卡列表
const MyBankCard                          = resolve => require([`@/pages/user/myBankCard`],resolve);

//绑定银行卡
const BindingBankCard                     = resolve => require([`@/pages/user/bindingBankCard`],resolve);

//全部订单
const AllOrders                           = resolve => require([`@/pages/user/allOrders`],resolve);

//订单详情
const OrderDetails                        = resolve => require([`@/pages/user/orderDetails`],resolve);

//选择服务类型
const AfterSale                           = resolve => require([`@/pages/user/afterSale`],resolve);

//申请退款
const RequestARefund                      = resolve => require([`@/pages/user/requestARefund`],resolve);

//已申请售后列表
const AfterSaleList                       = resolve => require([`@/pages/user/afterSaleList`],resolve);

//设置密码
const SettingPassword                     = resolve => require([`@/pages/user/settingPassword`],resolve);

//手机验证
const PhoneVerification                   = resolve => require([`@/pages/user/phoneVerification`],resolve);

//账户与安全
const AccountAndSecurity                  = resolve => require([`@/pages/user/accountAndSecurity`],resolve);

//发表评论
const PostEvaluation                      = resolve => require([`@/pages/user/postEvaluation`],resolve);

//我的评论
const MyComment                           = resolve => require([`@/pages/user/myComment`],resolve);

//我的工单
const MyWorkOrder                         = resolve => require([`@/pages/user/myWorkOrder`],resolve);

//我的发票
const MyInvoice                           = resolve => require([`@/pages/user/myInvoice`],resolve);

//发票详情
const InvoiceDetail                       = resolve => require([`@/pages/user/invoiceDetail`],resolve);

//地址管理
const AddressManagement                   = resolve => require([`@/pages/user/addressManagement`],resolve);

//添加收货地址
const AddMyaddress                        = resolve => require([`@/pages/user/addMyaddress`],resolve);

//关注公众号页面
const Follow                              = resolve => require([`@/pages/user/follow`],resolve);

//订单支付
const OrderPay                            = resolve => require([`@/pages/orderPay`],resolve);

//2.1版本
const NickName                            = resolve => require([`@/pages/user/nickName`],resolve);

//设置
const SetUp                               = resolve => require([`@/pages/user/setUp`],resolve);

//实名认证资料
const RealName                            = resolve => require([`@/pages/user/realName`],resolve);

//用户认证
const UserAuthentication                  = resolve => require([`@/pages/user/userAuthentication`],resolve);

//企业认证
const EpAuthentication                    = resolve => require([`@/pages/user/epAuthentication`],resolve);

//认证提等待
const AuthenticationStatus                = resolve => require([`@/pages/user/authenticationStatus`],resolve);
//余额
const Balance                             = resolve => require([`@/pages/user/balance`],resolve);
//充值
const Recharge                            = resolve => require([`@/pages/user/recharge`],resolve);
//赠送惠呗
const GiveHuiBei                          = resolve => require([`@/pages/user/giveHuiBei`],resolve);
//明细
const Detailed                            = resolve => require([`@/pages/user/detailed`],resolve);
//物流信息
const LogisticsInformation                = resolve => require([`@/pages/user/logisticsInformation`],resolve);
//惠呗商家码
const BusinessCode                        = resolve => require([`@/pages/user/businessCode`],resolve);
//惠呗抵扣
const HuibeiDeduction                     = resolve => require([`@/pages/user/huibeiDeduction`],resolve);
//惠呗抵扣
const HuibeiWay                           = resolve => require([`@/pages/huibeiWay`],resolve);
//会员升级
const UpgradeGoods                        = resolve => require([`@/pages/user/upgradeGoods`],resolve);
//会员升级
const UpgradeDetail                       = resolve => require([`@/pages/user/upgradeDetail`],resolve);
//退款详情
const RefundDetail                        = resolve => require([`@/pages/user/refundDetail`],resolve);
//填写退货物流
const ReturnFlow                          = resolve => require([`@/pages/user/returnFlow`],resolve);
//协商历史
const ConsultHistory                      = resolve => require([`@/pages/user/consultHistory`],resolve);
//企惠BOSS
const UpgradeQHBoss                       = resolve => require([`@/pages/user/upgradeQHBoss`],resolve);
//分享推广图
const ShareExtensionChart                 = resolve => require([`@/pages/user/shareExtensionChart`],resolve);
//推广素材
const PromotionalMaterials                = resolve => require([`@/pages/user/promotionalMaterials`],resolve);
//保存图片
const WatchImage                           = resolve => require([`@/pages/user/promotionalMaterials/watchImage.vue`],resolve);
// 我的奖品
const MyPrize                             = resolve => require([`@/pages/user/myPrize`],resolve);
// 提货明细
const PickUpDesc                          = resolve => require([`@/pages/user/pickUpDesc`],resolve);

Vue.use(Router);
const router = new Router({
  routes: [
    //首页
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '企惠壹号--商品源头购物商城',
      },
    },
    //登录部分
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录/注册',
      }
    },
    //游客模式
    {
      path:"/touristHome",
      name:"touristHome",
      component:TouristHome,
      meta: {
        title: '登录',
      }
    },
    {
      path: '/upgradeShopkeeper',
      name: 'upgradeShopkeeper',
      component: UpgradeShopkeeper,
      meta: {
        title: '会员升级',
      }
    },
    {
      path: '/userInvitation',
      name: 'userInvitation',
      component: UserInvitation,
      meta: {
        title: '用户邀请',
      }
    },
    {
      path:'/paymentSuccessful',
      name:'paymentSuccessful',
      component:PaymentSuccessful,
      meta: {
        title: '支付成功',
      }
    },
    {
      path:'/orderSuccess',
      name:'orderSuccess',
      component:OrderSuccess,
      meta: {
        title: '订单已完成',
      }
    },

    //搜索历史
    {
      path: '/searchHistory',
      name: 'searchHistory',
      component: SearchHistory,
      meta: {
        title: '搜索历史',
      }
    },
    //分类详情
    {
      path: '/classificationDetails',
      name: 'classificationDetails',
      component: ClassificationDetails,
      meta: {
        title: '分类详情',
      }
    },
    //礼品专属分类详情
    {
      path: '/giftClassification',
      name: 'giftClassification',
      component: GiftClassification,
      meta: {
        title: '分类详情',
      }
    },
    //商品详情
    {
      path: '/goodsDetails',
      name: 'goodsDetails',
      component: GoodsDetails,
      meta: {
        title: '商品详情',
      }
    },
    //商品评论
    {
      path: '/comment',
      name: 'comment',
      component: Comment,
      meta: {
        title: '商品评论',
      }
    },
    //礼品采购
    {
      path: '/giftExclusive',
      name: 'giftExclusive',
      component: GiftExclusive,
      meta: {
        title: '礼品采购',
      }
    },
    //热卖专区
    {
      path: '/hotSell',
      name: 'hotSell',
      component: HotSell,
      meta: {
        title: '热卖专区',
      }
    },
    //每日上新
    {
      path: '/newsArea',
      name: 'newsArea',
      component: NewsArea,
      beforeEnter: (to, from, next) => {
        if(to.query.zoneCode === "newZone") {
          document.title = "每日上新"
        }else if(to.query.zoneCode === "specZone") {
          document.title = "天天特价"
        }
        next()
      },
    },
    //企惠服务+
    {
      path: '/service',
      name: 'service',
      component: Service,
      meta: {
        title: '企惠服务+',
      }
    },
    //所有分类
    {
      path: '/allProduct',
      name: 'allProduct',
      component: AllProduct,
      meta: {
        title: '所有分类',
      }
    },
    //消息详情
    {
      path: '/systemNews',
      name: 'systemNews',
      component: SystemNews,
      meta: {
        title: '消息详情',
      }
    },
    //消息中心
    {
      path: '/messageCenter',
      name: 'messageCenter',
      component: MessageCenter,
      meta: {
        title: '消息中心',
      }
    },
    //商品订单
    {
      path: '/goodsOrder',
      name: 'goodsOrder',
      component: GoodsOrder,
      meta: {
        title: '商品订单',
      }
    },
    //新人专属福利
    {
      path: '/newcomerBenefits',
      name: 'newcomerBenefits',
      component: NewcomerBenefits,
      beforeEnter: (to, from, next) => {
        document.title = to.query.zoneName
        next()
      }
    },
    //活动规则
    {
      path: '/activityRules',
      name: 'activityRules',
      component: ActivityRules,
      meta: {
        title: '活动规则',
      }
    },
    //签到领奖
    {
      path: '/sign',
      name: 'sign',
      component: Sign,
      meta: {
        title: '签到领奖',
      }
    },
    //开具发票
    {
      path: '/openInvoice',
      name: 'openInvoice',
      component: OpenInvoice,
      meta: {
        title: '开具发票',
      }
    },
    //交易物流,收益消息
    {
      path: '/tsnLogistics',
      name: 'tsnLogistics',
      component: TsnLogistics,
      beforeEnter: (to, from, next) => {
        if(to.query.id === "3") {
          document.title = "交易物流"
        }else if(to.query.id === "4") {
          document.title = "收益消息"
        }
        next()
      },
    },
    //活动消息
    {
      path: '/activityMessage',
      name: 'activityMessage',
      component: ActivityMessage,
      meta: {
        title: '活动消息',
      }
    },

    //购物车
    {
      path: '/shoppingCart',
      name: 'shoppingCart',
      component: ShoppingCart,
      meta: {
        title: '购物车',
      }
    },

    //个人中心
    {
      path:'/personalCenter',
      name:'personalCenter',
      component:PersonalCenter,
      meta: {
        title: '个人中心',
      }
    },
    //预估收益、惠呗预收益
    {
      path:'/bonusList',
      name:'bonusList',
      component:BonusList,
      beforeEnter: (to, from, next) => {
        if(to.query.status == '1') {
          document.title = "预估收益"
        }else if(to.query.status == '2') {
          document.title = "惠呗预收益"
        }
        next()
      },
    },

    //个人信息
    {
      path:"/personalInformation",
      name:"personalInformation",
      component:PersonalInformation,
      meta: {
        title: '个人信息',
      }
    },
    //我的用户
    {
      path:"/myUser",
      name:"myUser",
      component:MyUser,
      meta: {
        title: '我的用户',
      }
    },
    //我的评论
    {
      path:"/myComment",
      name:"myComment",
      component:MyComment,
      meta: {
        title: '我的评论',
      }
    },
    //提现记录
    {
      path: "/withdrawalsRecord",
      name: "withdrawalsRecord",
      component:WithdrawalsRecord,
      meta: {
        title: '提现记录',
      }
    },
    //提现
    {
      path:"/withdraw",
      name:"withdraw",
      component:Withdraw,
      meta: {
        title: '提现',
      }
    },
    //银行卡列表
    {
      path:'/myBankCard',
      name:'myBankCard',
      component:MyBankCard,
      meta: {
        title: '银行卡列表',
      }
    },
    //绑定银行卡
    {
      path:'/bindingBankCard',
      name:'bindingBankCard',
      component:BindingBankCard,
      meta: {
        title: '绑定银行卡',
      }
    },
    //我的工单
    {
      path:"/myWorkOrder",
      name:"myWorkOrder",
      component:MyWorkOrder,
      meta: {
        title: '我的工单',
      }
    },
    //全部订单
    {
      path:"/allOrders",
      name:'allOrders',
      component:AllOrders,
      meta: {
        title: '全部订单',
      }
    },
    //订单详情
    {
      path:"/orderDetails",
      name:'orderDetails',
      component:OrderDetails,
      meta: {
        title: '订单详情',
      }
    },
    //选择服务类型
    {
      path:"/afterSale",
      name:"afterSale",
      component:AfterSale,
      meta: {
        title: '选择服务类型',
      }
    },
    //退款/售后
    {
      path:"/afterSaleList",
      name:"afterSaleList",
      component:AfterSaleList,
      meta: {
        title: '退款/售后',
      }
    },
    //申请退款
    {
      path:"/requestARefund",
      name:"requestARefund",
      component:RequestARefund,
      meta: {
        title: '申请退款',
      }
    },
    //设置密码
    {
      path:"/settingPassword",
      name:"settingPassword",
      component:SettingPassword,
      beforeEnter: (to, from, next) => {
        if ( to.query.editType === "2" ) {
          document.title = "修改密码"
        }else {
          document.title = "设置密码"
        }
        next()
      },
    },
    //手机验证
    {
      path:"/phoneVerification",
      name:"phoneVerification",
      component:PhoneVerification,
      meta: {
        title: '手机验证',
      }
    },
    //账户与安全
    {
      path:"/accountAndSecurity",
      name:"accountAndSecurity",
      component:AccountAndSecurity,
      meta: {
        title: '账户与安全',
      }
    },
    //发表评论
    {
      path:"/postEvaluation",
      name:"postEvaluation",
      component:PostEvaluation,
      meta: {
        title: '发表评论',
      }
    },
    //我的发票
    {
      path:"/myInvoice",
      name:"myInvoice",
      component:MyInvoice,
      meta: {
        title: '我的发票',
      }
    },
    //发票详情
    {
      path:"/invoiceDetail",
      name:"invoiceDetail",
      component:InvoiceDetail,
      meta: {
        title: '发票详情',
      }
    },
    //地址管理
    {
      path:"/addressManagement",
      name:"addressManagement",
      component:AddressManagement,
      meta: {
        title: '地址管理',
      }
    },
    //添加收货地址
    {
      path:"/addMyaddress",
      name:"addMyaddress",
      component:AddMyaddress,
      meta: {
        title: '添加收货地址',
      }
    },
    //关注公众号
    {
      path:"/follow",
      name:"follow",
      component: Follow,
      meta: {
        title: '关注公众号',
      }
    },
    //订单支付
    {
      path:"/orderPay",
      name:"orderPay",
      component:OrderPay,
      meta: {
        title: '订单支付',
      },
    },
    //2.1版本开始
    {
      path:"/nickName",
      name:"nickName",
      component: NickName,
      beforeEnter: (to, from, next) => {
        if (to.query.paramsType == "nickName") {
          document.title = "昵称"
        }else if(to.query.paramsType == "weixin") {
          document.title = "微信号"
        }
        next()
      }
    },
    //设置
    {
      path:"/setUp",
      name:"setUp",
      component: SetUp,
      meta: {
        title: '设置',
      },
    },
    //实名认证资料
    {
      path:"/realName",
      name:"realName",
      component: RealName,
      meta: {
        title: '实名认证资料',
      },
    },
    //用户认证
    {
      path:"/userAuthentication",
      name:"userAuthentication",
      component: UserAuthentication,
      meta: {
        title: '用户认证',
      },
    },
    //企业认证
    {
      path:"/epAuthentication",
      name:"epAuthentication",
      component: EpAuthentication,
      meta: {
        title: '企业认证',
      },
    },
    //认证等待
    {
      path:"/authenticationStatus",
      name:"authenticationStatus",
      component: AuthenticationStatus,
      beforeEnter: (to, from, next) => {
        if (to.query.atnType == "user") {
          document.title = "用户认证"
        }else if(to.query.atnType == "corp") {
          document.title = "企业认证"
        }
        next()
      }
    },
    //余额
    {
      path:"/balance",
      name:"balance",
      component: Balance,
      beforeEnter: (to, from, next) => {
        if (to.query.chargeAct == "2") {
          document.title = "余额"
        }else if(to.query.chargeAct == "3") {
          document.title = "惠呗"
        }
        next()
      }
    },
    //充值
    {
      path:"/recharge",
      name:"recharge",
      component: Recharge,
      beforeEnter: (to, from, next) => {
        if (to.query.chargeAct == "2") {
          document.title = "余额充值"
        }else if(to.query.chargeAct == "3") {
          document.title = "惠贝充值"
        }
        next()
      }
    },
    //赠送惠呗
    {
      path:"/giveHuiBei",
      name:"giveHuiBei",
      component: GiveHuiBei,
      meta: {
        title: '赠送惠呗',
      },
    },
    //明细
    {
      path:"/detailed",
      name:"detailed",
      component: Detailed,
      beforeEnter: (to, from, next) => {
        if (to.query.chargeAct == "2") {
          document.title = "余额明细"
        }else if(to.query.chargeAct == "3") {
          document.title = "惠呗明细"
        }
        next()
      }
    },
    //物流详情
    {
      path:"/logisticsInformation",
      name:"logisticsInformation",
      component: LogisticsInformation,
      meta: {
        title: '物流详情',
      },
    },
    //惠呗商家码
    {
      path:"/businessCode",
      name:"businessCode",
      component: BusinessCode,
      meta: {
        title: '惠呗商家码',
      },
    },
    //惠呗抵扣
    {
      path:"/huibeiDeduction",
      name:"huibeiDeduction",
      component: HuibeiDeduction,
      meta: {
        title: '惠呗抵扣',
      },
    },
    //惠呗抵扣
    {
      path:"/huibeiWay",
      name:"huibeiWay",
      component: HuibeiWay,
      meta: {
        title: '惠呗抵扣',
      },
    },
    //会员升级
    {
      path:"/upgradeGoods",
      name:"upgradeGoods",
      component: UpgradeGoods,
      meta: {
        title: '会员升级',
      },
    },
    //会员升级
    {
      path:"/upgradeDetail",
      name:"upgradeDetail",
      component: UpgradeDetail,
      meta: {
        title: '会员升级',
      },
    },
    //退款详情
    {
      path:"/refundDetail",
      name:"refundDetail",
      component: RefundDetail,
      meta: {
        title: '退款详情',
      },
    },
    //填写退货物流
    {
      path:"/returnFlow",
      name:"returnFlow",
      component: ReturnFlow,
      meta: {
        title: '填写退货物流',
      },
    },
    //协商历史
    {
      path:"/consultHistory",
      name:"consultHistory",
      component: ConsultHistory,
      meta: {
        title: '协商历史',
      },
    },
    //企惠BOSS
    {
      path:"/upgradeQHBoss",
      name:"upgradeQHBoss",
      component: UpgradeQHBoss,
      meta: {
        title: '企惠BOSS',
      },
    },
    //分享推广图
    {
      path:"/shareExtensionChart",
      name:"shareExtensionChart",
      component: ShareExtensionChart,
      meta: {
        title: '分享推广图',
      },
    },
    //推广素材
    {
      path:"/promotionalMaterials",
      name:"promotionalMaterials",
      component: PromotionalMaterials,
      meta: {
        title: '推广素材',
      },
    },
    //保存图片
    {
      path:"/watchImage",
      name:"watchImage",
      component: WatchImage,
      meta: {
        title: '推广素材',
      },
    },
    //我的奖品
    {
      path:"/myPrize",
      name:"myPrize",
      component: MyPrize,
      meta: {
        title: '我的奖品',
      },
    },
    //提货明细
    {
      path:"/pickUpDesc",
      name:"pickUpDesc",
      component: PickUpDesc,
      meta: {
        title: '提货明细',
      },
    },
    //百分百中奖
    {
      path:"/luckDraw",
      name:"luckDraw",
      component: LuckDraw,
      meta: {
        title: '百分百中奖',
      },
    },
  ],

  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      let sl = savedPosition;
      return sl;
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach ((to,from,next) =>  {
  let toName = to.name;
  if (toName === "addressManagement"      ||
      toName === "myBankCard"             ||
      toName === "phoneVerification"      ||
      toName === "myUser"                 ||
      toName === "withdrawalsRecord"      ||
      toName === "userAuthentication"     ||
      toName === "authenticationStatus"   ||
      toName === "epAuthentication"       ||
      toName === "paymentSuccessful"      ||
      toName === "settingPassword"        ||
      toName === "newcomerBenefits"       ||
      toName === "activityRules"          ||
      toName === "messageCenter"          ||
      toName === "giveHuiBei"             ||
      toName === "systemNews"             ||
      toName === "promotionalMaterials"
    ) {
    document.body.style.backgroundColor = "#ffffff";
  }else {
    document.body.style.backgroundColor = "#f2f2f2";
  }
  next();
});

export default router;
