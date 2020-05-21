
let phpUrl = '';
if (process.env.NODE_ENV == 'development') {//内网环境
  // phpUrl = "http://v21w841220.51mypc.cn";
  phpUrl = "http://web.test.no1qh.com";

}else if(process.env.NODE_ENV == 'testing'){//测试环境
  phpUrl = "http://web.test.no1qh.com";

}else if(process.env.NODE_ENV == 'production'){//正式环境
  phpUrl = "http://web.no1qh.com";
}
// const phpUrl = 'http://web.no1qh.com'//正式环境
// const phpUrl = 'http://wzbin.vicp.io'//开发环境
// const phpUrl = 'http://web.test.no1qh.com'//测试环境

// const phpUrl = 'http://v21w841220.51mypc.cn'//内网环境
export default {
  phpUrl: phpUrl
}
