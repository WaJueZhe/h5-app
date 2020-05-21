import Vue from 'vue'

//时间格式  月-日 时：分
Vue.filter("timeStampFilter", (val, type) => {
  let time = new Date(val * 1);
  let y = time.getFullYear();
  let m = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)
  let d = time.getDate() < 10 ? '0' +  (time.getDate()) : time.getDate()
  let h = time.getHours() < 10 ? '0' +  (time.getHours()) : time.getHours()
  let mm = time.getMinutes() < 10 ? '0' + (time.getMinutes()) : time.getMinutes()
  let s = time.getSeconds() < 10 ? '0' + (time.getSeconds()) : time.getSeconds()

  if (type === 'yy-mm-dd') {
    return y + '-' + m + '-' + d  //yy-mm-dd

  }else if (type === '年-月-日') {
    return y + '年' + m + '月' + d + '日' //年-月-日

  }else if (type === '年-月-日 时：分') {
    return y + '年' + m + '月' + d + '日' + ' ' + h + ':' + mm  //年-月-日 时：分

  }else if (type === '年-月-日 时：分：秒') {
    return y + '年' + m + '月' + d + '日' + ' ' + h + ':' + mm + ':' + s //年-月-日 时：分：秒

  }else if (type === 'yy-mm-dd h：m') {
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm //yy-mm-dd h：m

  }else if (type === 'yy-mm-dd h：m：s') {
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s //yy-mm-dd h：m：s

  }else if (type === 'mm-dd h：m') {
    return m + '-' + d + ' ' + h  + ':' + mm //mm-dd h：m

  }else if (type === 'yy/mm/dd') {
    return y + '/' + m + '/' + d //yy/mm/dd
  }
})

//保留小数点两位小数
Vue.filter("moneyFloat", (val) => {
  return parseFloat(val).toFixed(2)
})

//保留小数点两位小数
Vue.filter("numberMany", (val) => {
  if (val.length > 4) {
    let num = (val / 10000).toFixed(1)
    return parseFloat(num) + '万'
  }else {
    return val || '0'
  }
})