import qs from "qs";

export function getPostData(paramObj,con){
  //判断是不是上传文件接口，如果是上传文件接口，那么就跳过数据封装
  let param = "";
  if (con.url === '/file/upload') {
    param = paramObj;
  }else {
    let data = getPostObj(paramObj);
    param = qs.stringify(data);
  }
  return param;
}

export function getPostObj(paramObj){
  if (paramObj == "" || paramObj == undefined || paramObj == null) {
    paramObj = {};
  }

  let sessionId = localStorage.getItem('sessionId') ? localStorage.getItem('sessionId') : sessionStorage.getItem('sessionId')
  if (sessionId == undefined) {
    sessionId = '';
  }
  let time = Date.parse(new Date());
  let info = paramObj;
  let data1 = {
    sessionId: sessionId,
    requestId: '',
    sign: '',
    info: info,
    p: '3',
    version: "2",
    time: time,
    deviceCode: "869146021682522"
  };

  let data2 = JSON.stringify(data1);
  return  {data: data2};
}
