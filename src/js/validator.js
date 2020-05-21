export default {
  // 手机号码
  phone(value) {
    let pattern = /^((11|12|13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },
  // 身份证
  identity(value) {
    // let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    let pattern = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },
}