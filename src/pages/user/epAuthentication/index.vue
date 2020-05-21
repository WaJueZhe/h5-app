<template>
  <div class="epAuthentication-page">
    <div class="addCorpIdentify">
      <div class="corpInput">
          <div class="anyoneCorpInput">
            <div class="inputTitle">
              <span class="required">*</span>
              <span>公司名称</span>
            </div>
            <div class="inputContent">
              <input type="text" v-model="editCorpIdentifyData.name" placeholder="请输入公司名称">
            </div>
          </div>
          <div class="anyoneCorpInput">
            <div class="inputTitle">
              <span class="required">*</span>
              <span>公司电话</span>
            </div>
            <div class="inputContent">
              <input type="text" v-model="editCorpIdentifyData.phone" placeholder="如：座机号xxx-xxxxxxxx">
            </div>
          </div>
          <div class="anyoneCorpInput">
            <div class="inputTitle">
              <span class="required">*</span>
              <span>公司地址</span>
            </div>
            <div class="inputContent">
              <input type="text" v-model="editCorpIdentifyData.address" placeholder="请输入公司地址">
            </div>
          </div>
      </div>
      <div class="corpImage">
        <div class="corpImageContent">
          <div class="corpImageUpLoad">
            <van-uploader :after-read="onRead" name="licenceImage">
              <div class="upLoad">
                <div class="upLoadImg">
                  <div class="upLoadBorderLeftTop"></div>
                  <div class="upLoadBorderRightTop"></div>
                  <div class="upLoadBorderLeftBottom"></div>
                  <div class="upLoadBorderRightBottom"></div>
                  <div class="seeImg">
                    <img :src="licenceImage" alt="">
                  </div>
                </div>
                <div class="upLoadTitle">
                  <span style="color:#333333;">点击上传</span>
                  <span style="color:#EA3323;">营业执照</span>
                </div>
              </div>
            </van-uploader>
            <van-uploader :after-read="onRead" name="authorizeImage">
              <div class="upLoad">
                <div class="upLoadImg">
                  <div class="upLoadBorderLeftTop"></div>
                  <div class="upLoadBorderRightTop"></div>
                  <div class="upLoadBorderLeftBottom"></div>
                  <div class="upLoadBorderRightBottom"></div>
                  <div class="seeImg">
                    <img :src="authorizeImage" alt="">
                  </div>
                </div>
                <div class="upLoadTitle">
                  <span style="color:#333333;">点击上传</span><br/>
                  <span style="color:#EA3323;">经办人授权书</span><span class="small-text">(法人可不传)</span>
                </div>
              </div>
            </van-uploader>
          </div>
        </div>
      </div>
    </div>
    <div class="verifiedFooter">
      <div class="btnTwo" @click="goIdentify()">提交审核</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Icon , Uploader, Toast } from 'vant';
Vue.use(Icon).use(Uploader).use(Toast);
export default {
  name: 'epAuthentication',
  data() {
    return {
      grades: true,
      editCorp: false,
      licenceImage: require(`@/assets/verified/yinyezhizhao.png`),
      authorizeImage: require(`@/assets/verified/shouquanshuzhao.png`),
      editCorpIdentifyData: {
        licenceImage:"",  //营业执照
        authorizeImage:"",//授权书
        name:"",          //公司名字
        phone:"",         //公司电话
        address:"",       //公司地址
      },
    };
  },
  watch: {

  },
  methods: {
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
          }else if ( id === "licenceImage" ) {
            this.licenceImage = res.data.info.url;
            this.editCorpIdentifyData.licenceImage = res.data.info.imageId;
          }else if ( id === "authorizeImage" ) {
            this.authorizeImage = res.data.info.url;
            this.editCorpIdentifyData.authorizeImage = res.data.info.imageId;
          }
          this.bus.$emit('getLoading', {loading: false});
        }
      })
    },
    //企业认证
    editCorpIdentify () {
      Models.User
      .addCorpIdentify(this.editCorpIdentifyData)
      .then( res => {
        if (res.data.code == '0') {
          this.$router.replace({
            name: 'authenticationStatus',
            query: {
              atnType: 'corp',
              isVerify: '1'
            }
          });
        }else {
          Toast(res.data.msg);
        }
      })
    },
    //提交审核
    goIdentify () {
      //必须填写企业信息
      if(this.checkCorpIdentify()) {
        this.editCorpIdentify();
      }
    },
    //获取企业认证信息
    corpIdentify () {
      Models.User
      .getCorpIdentify()
      .then(res => {
        if (res.data.code == '0') {
          this.editCorpIdentifyData = {
            licenceImage: res.data.info.licenceImageId,     //营业执照
            authorizeImage: res.data.info.authorizeImageId,   //授权书
            name: res.data.info.corpName,          //公司名称
            phone: res.data.info.corpPhone,        //公司电话
            address: res.data.info.corpAddress         //公司地址
          };
          this.licenceImage = res.data.info.licenceImage
          this.authorizeImage = res.data.info.authorizeImage
        }
      })
    },
    //检验企业信息是否完善
    checkCorpIdentify() {
      var reg = 11 && /^((11|12|13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      let zuoji = /^(0[0-9]{2,3}\-)([0-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
      if ( this.editCorpIdentifyData.name.length === 0 ) {
        Toast("请填写公司名字");
        return false;
      }else if ( this.editCorpIdentifyData.phone.length === 0 ) {
        Toast("请填写公司电话号码");
        return false;
      }else if (!reg.test(this.editCorpIdentifyData.phone) && !zuoji.test(this.editCorpIdentifyData.phone)) {
          Toast("请输入正确的电话号码");
          return false;
      }else if ( this.editCorpIdentifyData.address.length === 0 ) {
        Toast("请填写公司地址");
        return false;
      }else if ( this.editCorpIdentifyData.licenceImage.length === 0 ) {
        Toast("请上传营业执照");
        return false;
      }else {
        return true;
      }
    },
  },
  computed: {

  },
  created() {
    this.corpIdentify();
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.epAuthentication-page {
  width: 100%;

  .addCorpIdentify {
    width: 100%;
    height:auto;
    background-color: #ffffff;

    .corpInput {
      width: 100%;
      height: auto;
      padding: 0 15px;
      border-bottom:1px solid #EAEAEA;

      .anyoneCorpInput {
        width: 100%;
        height: 44px;
        display: flex;
        border-bottom: 1px solid #EAEAEA;
        overflow: hidden;

        &:last-child {
          border-bottom: none;
        }

        .inputTitle {
          flex-shrink: 0;
          flex-basis:90px;
          height: 44px;
          line-height:44px;
          font-size: 15px;
        }

        .inputContent {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;

          input {
            width: 100%;
            font-size: 14px;
          }
        }
      }
    }

    .corpImage {
      width: 100%;
      padding: 20px 0 17px;

      .corpImageContent {
        width: 100%;
        height: auto;
        padding:0 15px;

        .corpImageUpLoad {
          width: 100%;
          display: -webkit-flex;
          display: flex;
          justify-content: space-between;

          .van-uploader {
            flex: 1;

            &:first-child {
              margin-right: 10px;
              .upLoad {
                .upLoadImg {
                  margin-bottom: 24px;
                }
              }
            }

            .upLoad {
              padding: 10px 0;
              width: 100%;
              box-shadow:0px 2px 5px 0px rgba(225, 225, 225, 0.35);
              border-radius:8px;

              .upLoadImg {
                position: relative;
                margin: auto;
                width: 112px;
                height: 73px;
                margin-bottom: 6px;
                padding: 5px;
                overflow: hidden;

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
                  height: 100%;

                  > img {
                    margin: auto;
                    height: 100%;
                  }
                }
              }

              .upLoadTitle {
                width: 100%;
                text-align: center;
                font-size: 14px;

                .small-text {
                  font-size: 10px;
                }
              }
            }
          }
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
};
</style>
