<template>
  <div class="userAuthentication-page">
    <div class="addUserIdentify">
        <div class="userInput">
          <div class="anyOneInput">
            <div class="inputTitle">
              <span class="required">*</span>
              <span>姓名</span>
            </div>
            <div class="inputContent">
              <input type="text" v-model="editUserIdentifyData.name" placeholder="请输入真实姓名">
            </div>
          </div>
          <div class="anyOneInput">
            <div class="inputTitle">
              <span class="required">*</span>
              <span>身份证</span>
            </div>
            <div class="inputContent">
              <input type="text" v-model="editUserIdentifyData.number" :maxlength="18" placeholder="请输入身份证号码">
            </div>
          </div>
        </div>
        <div class="userImage">
          <div class="userImageTitle">上传身份证照片</div>
          <div class="userImageContent">
            <div class="userImageUpLoad">
              <van-uploader :after-read="onRead" name="frontImage">
                <div class="upLoad">
                <div class="upLoadImg">
                  <div class="upLoadBorderLeftTop"></div>
                  <div class="upLoadBorderRightTop"></div>
                  <div class="upLoadBorderLeftBottom"></div>
                  <div class="upLoadBorderRightBottom"></div>
                  <div class="seeImg">
                    <img :src="frontImage" alt="">
                  </div>
                </div>
                <div class="upLoadTitle">
                  <span style="color:#333333;">点击上传</span>
                  <span style="color:#EA3323;">人像照</span>
                </div>
              </div>
              </van-uploader>
              <van-uploader :after-read="onRead" name="backImage">
                <div class="upLoad">
                  <div class="upLoadImg">
                    <div class="upLoadBorderLeftTop"></div>
                    <div class="upLoadBorderRightTop"></div>
                    <div class="upLoadBorderLeftBottom"></div>
                    <div class="upLoadBorderRightBottom"></div>
                    <div class="seeImg">
                      <img :src="backImage" alt="">
                    </div>
                  </div>
                  <div class="upLoadTitle">
                    <span style="color:#333333;">点击上传</span>
                    <span style="color:#EA3323;">国徽面</span>
                  </div>
                </div>
              </van-uploader>
            </div>
            <div style="text-align: center;">
              <van-uploader :after-read="onRead" name="handleImage">
                <div class="upLoad" >
                  <div class="upLoadImg">
                    <div class="upLoadBorderLeftTop"></div>
                    <div class="upLoadBorderRightTop"></div>
                    <div class="upLoadBorderLeftBottom"></div>
                    <div class="upLoadBorderRightBottom"></div>
                    <div class="seeImg">
                      <img :src="handleImage" alt="">
                    </div>
                  </div>
                  <div class="upLoadTitle">
                    <span style="color:#333333;">点击上传</span><br/>
                    <span style="color:#EA3323;">手持身份证照</span>
                  </div>
                </div>
              </van-uploader>
            </div>
          </div>
        </div>
      </div>
      <div class="verifiedFooter">
        <div class="btnTwo" @click="goIdentify">提交审核</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Icon , Uploader, Toast } from 'vant';
Vue.use(Icon).use(Uploader).use(Toast);
export default {
  name: 'userAuthentication',
  data() {
    return {
      grades:true,
      editCorp:false,
      frontImage:require(`@/assets/verified/renxiangzhao.png`),
      backImage:require(`@/assets/verified/guohuizhao.png`),
      handleImage:require(`@/assets/verified/shouchizhao.png`),
      editUserIdentifyData:{
        frontImage:"",    //身份证正面
        backImage:"",     //身份证背面照
        handleImage:"",   //手持身份证正面照
        name:"",          //名字
        number:"",        //身份证号码
      },
    };
  },
  watch: {

  },
  methods: {
    //获取用户认证信息
    userIdentify () {
      Models.User
      .getUserIdentify()
      .then(res => {
        if (res.data.code == '0') {
          this.editUserIdentifyData = {
            frontImage:res.data.info.idFrontImageId,    //身份证正面
            backImage:res.data.info.idBackImageId,     //身份证背面照
            handleImage:res.data.info.idHandleImageId,   //手持身份证正面照
            name:res.data.info.idName,          //名字
            number:res.data.info.idNumber,        //身份证号码
          };
          this.frontImage = res.data.info.idFrontImage;
          this.backImage = res.data.info.idBackImage;
          this.handleImage = res.data.info.idHandleImage;
        }
      })
    },
    //提交审核
    goIdentify() {
      if (this.checkIdentify()) {
        this.editUserIdentify();
      }
    },
    //用户认证
    editUserIdentify() {
      Models.User
      .addUserIdentify(this.editUserIdentifyData)
      .then(res => {
        if (res.data.code == '0') {
          this.$router.replace({
            name: 'authenticationStatus',
            query: {
              atnType: 'user',
              isVerify: '1'
            }
          });
        }else {
          Toast(res.data.msg);
        }
      })
    },
    //检验用户信息是否完善
    checkIdentify () {
      // let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      if ( this.editUserIdentifyData.name.length === 0 ) {
        Toast("请填写名字");
        return false;
      }else if ( this.editUserIdentifyData.number.length === 0 ) {
        Toast("请填写身份证号码");
        return false;
      }if (this.$rules.identity(this.editUserIdentifyData.number) !== true){
        Toast("请输入正确的身份证号");
        return false;
      }else if ( this.editUserIdentifyData.frontImage.length === 0 ) {
        Toast("请上传身份证正面照");
        return false;
      }else if ( this.editUserIdentifyData.backImage.length === 0 ) {
        Toast("请上传身份证背面照");
        return false;
      }else if ( this.editUserIdentifyData.handleImage.length === 0 ) {
        Toast("请上传手持身份证正面照");
        return false;
      }else {
        return true;
      }
    },
    onRead(file, detail) {
      this.upImgLoad(file,detail.name);
    },
    //上传图片
    upImgLoad (file,id) {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '上传中...'
      });
      let formData = new FormData();
      let sessionId = window.localStorage.getItem('sessionId');
      let data = JSON.stringify({
        sessionId: sessionId,
        requestId: '',
        sign: '',
        info: {
          fileType:"image",
          useType:"All"
        },
        p: '3',
        version: "2",
        time: Date.parse(new Date()),
        deviceCode: "869146021682522"
      });
      formData.append("file",file.file);
      formData.append("data",data);

      Models.User
      .upLoad(formData)
      .then(res => {
        if ( res.data.code == 0 ) {
          if ( id === "frontImage") {
            this.frontImage = res.data.info.url;
            this.editUserIdentifyData.frontImage = res.data.info.imageId;
          }else if ( id === "backImage" ) {
            this.backImage = res.data.info.url;
            this.editUserIdentifyData.backImage = res.data.info.imageId;
          }else if ( id === "handleImage" ) {
            this.handleImage = res.data.info.url;
            this.editUserIdentifyData.handleImage = res.data.info.imageId;
          }
          this.bus.$emit('getLoading', {loading: false});
        }
      })
    },
  },
  computed: {

  },
  created() {
    this.userIdentify()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.userAuthentication-page {
  width: 100%;

  .addUserIdentify {
    width: 100%;

    .userInput {
      width: 100%;
      padding-left: 15px;
      border-bottom:1px solid #EAEAEA;

      .anyOneInput {
        width: 100%;
        height: 45px;
        display: flex;
        display: -webkit-flex;
        border-bottom:1px solid #EAEAEA;
        overflow: hidden;

        &:last-child {
          border:none;
        }

        .inputTitle {
          flex-shrink: 0;
          flex-basis:90px;
          height: 44px;
          line-height:44px;
          font-size: 15px;

          .required {
            color: #EA3323;
          }
        }

        .inputContent {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;

          input {
            width: 100%;
            font-size: 14px;

            ::placeholder {
              color: #999999;
            }
          }
        }
      }
    }

    .userImage {
      width: 100%;
      padding: 20px 0 17px;

      .userImageTitle {
        width: 100%;
        height: auto;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        padding-left: 15px;
        margin-bottom: 20px;
      }

      .userImageContent {
        width: 100%;
        height: auto;
        padding:0 26px;

        .userImageUpLoad {
          width: 100%;
          height:auto;
          display: -webkit-flex;
          display: flex;
          margin-bottom: 4px;
        }
      }
    }
  }

    .verifiedFooter {
    width: 100%;
    height:45px;
    font-size: 15px;
    text-align: center;
    line-height: 45px;
    display: -webkit-flex;
    display: flex;
    bottom:0;
    position: fixed;

    .btnOne {
      width: 100%;
      height: 45px;
      color:#333333;
      background-color: #ffffff;
      border-top:1px solid #eaeaea;
    }

    .btnTwo {
      width: 100%;
      height: 45px;
      color:#ffffff;
      background-color: #EA3323;
    }
  }

  .required {
    color:#EA3323!important;
    font-size:15px;
  }

   .upLoad {
    width:158px;
    height: auto;
    margin-right: 8px;
    box-shadow:0px 2px 5px 0px rgba(225, 225, 225, 0.35);
    border-radius:8px;
    padding:18px 20px 19px ;

    .upLoadImg {
      width:100%;
      height:73px;
      margin-bottom: 16px;
      padding: 5px;
      position: relative;

      .upLoadBorderLeftTop {
        position: absolute;
        width: 8px;
        height: 8px;
        border-top:2px solid #EA3323;
        border-left:2px solid #EA3323;
        top: 0;
        left: 0;
      }

      .upLoadBorderRightTop {
        position: absolute;
        width: 8px;
        height: 8px;
        border-top:2px solid #EA3323;
        border-right:2px solid #EA3323;
        right: 0;
        top: 0;
      }

      .upLoadBorderLeftBottom {
        position: absolute;
        width: 8px;
        height: 8px;
        border-bottom:2px solid #EA3323;
        border-left:2px solid #EA3323;
        bottom: 0;
        left: 0;
      }

      .upLoadBorderRightBottom {
        position: absolute;
        width: 8px;
        height: 8px;
        border-bottom:2px solid #EA3323;
        border-right:2px solid #EA3323;
        bottom: 0;
        right: 0;
      }

      .seeImg {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        > img {
          margin: auto;
          height: 100%;
        }
      }
    }

    .upLoadTitle {
      width: 100%;
      height: auto;
      text-align: center;
      font-size: 14px;
    }

    &:last-child {
      margin-right: 0;
    }
  }
};
</style>
