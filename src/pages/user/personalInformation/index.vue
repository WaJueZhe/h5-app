<template>
  <div class="personalInformation">
    <div class="per-group">
      <ul class="pre-list">
        <li class="pre-item">
          <div class="head-img">
            <img v-if="myInfo.headImagePic == ''" src="@/assets/personalCenter/defaultAvatar.png" alt="">
            <div class="photo" v-else><img :src="myInfo.headImagePic" alt=""></div>
            <input type="file" ref="upload" id="file" name="avatar" accept="image/*" v-on:change="onRead($event,'file')">
          </div>
          <div class="pre-right">
            <div class="text">
              <span>修改头像</span>
              <van-icon name="arrow" size="16px" color="#999999"/>
            </div>
          </div>
        </li>
        <li class="pre-item" @click="toNick('nickName', editUserInfo.nickName)">
          <div class="left-text">昵称</div>
          <div class="pre-right">
            <div class="text">
              <span v-if="editUserInfo.nickName">{{ editUserInfo.nickName }}</span>
              <span v-else>未设置</span>
              <van-icon name="arrow" size="16px" color="#999999"/>
            </div>
          </div>
        </li>
        <li class="pre-item">
          <div class="left-text">手机号</div>
          <div class="pre-right">
            <div class="text">
              <span v-if="editUserInfo.phone">{{ editUserInfo.phone }}</span>
              <span v-else>未设置</span>
            </div>
          </div>
        </li>
        <li class="pre-item" @click="toNick('weixin', editUserInfo.weixin)">
          <div class="left-text">微信号</div>
          <div class="pre-right">
            <div class="text">
              <span v-if="editUserInfo.weixin">{{ editUserInfo.weixin }}</span>
              <span v-else>未设置</span>
              <van-icon name="arrow" size="16px" color="#999999"/>
            </div>
          </div>
        </li>
        <li class="pre-item" @click="show = true">
          <div class="left-text">地区</div>
          <div class="pre-right">
            <div class="text">
              <span v-if="selectCity">{{ selectCity }}</span>
              <span v-else>未设置</span>
              <van-icon name="arrow" size="16px" color="#999999"/>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 图片裁截 -->
    <div v-show="isShow" class="cropper" @touchmove.prevent>
      <div class="cropper-dialog">
        <div class="cropper-body">
          <vue-cropper
            ref='cropper'
            :responsive="true"
            :view-mode="2"
            :checkCross="true"
            :rotatable="true"
            :autoCrop="true"
            :aspectRatio="1"
            :min-container-width="100"
            :min-container-height="100"
            :min-crop-box-width="100"
            :min-crop-box-height="100"

            drag-mode="crop"
            :background="true"
            :src="imgSrc"
            :img-style="{ width: '400px', 'height': '450px' }"
            >
          </vue-cropper>
        </div>

        <div class="cropper-toolsbar">
          <a class="cancel" @click="fileClose">取消</a>
          <a class="upload" @click="upImgLoad">上传</a>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" :overlay="true">
      <addressPicker @callBackAddress="callBackAddress" @offWindow="offWindow"></addressPicker>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Models from '@/models';
  import addressPicker from "@/components/addressPicker";
  import VueCropper from 'vue-cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { Popup  , Toast , Icon, Loading  } from 'vant';
  Vue.use(Popup).use(Toast).use(Icon).use(Loading);
  export default {
    name:'personalInformation',
    data () {
      return {
        show:false,
        myInfo:{},
        editUserInfo:{
          nickName:"",
          phone:"",
          weixin:"",
          areaId:""
        },
        selectCity:"",
        //图片裁剪
        isShow:false,
        imgSrc: '',
        imgName: '',
        currentFile: ''
      }
    },
    methods:{
      callBackAddress (name,id) {
        this.selectCity = name;
        this.editUserInfo.areaId = id;
        this.editMyInfo()
      },
      offWindow () {
        this.show = false;
      },
      goSelectAddress () {
        this.show = true;
      },
      //
      confirm (value) {
        this.show = false;
        this.selectCity = value;
        this.editUserInfo.areaId = value[2].code;
      },
      //
      onChange(picker,value,index) {
        if ( value[1] === undefined ) {
          this.cityZones(value[0].code);
        }else {
          if ( value[2] === undefined ) {
            this.countyZones(value[1].code);
          }
        }
      },
      //获取我的个人信息
      getMyUser () {
        Models.User
          .getInfo()
          .then(res => {
            this.myInfo = res.data.info;
            this.editUserInfo.nickName = res.data.info.nickName;
            this.editUserInfo.phone = res.data.info.phone;
            this.editUserInfo.weixin = res.data.info.weixin;
            this.selectCity = this.myInfo.address;
          })
      },
      //修改个人信息
      editMyInfo () {
        Models.User
        .saveMyInfo(this.editUserInfo)
        .then(res => {
          if ( res.data.code === '0') {
            Toast('修改成功')
            this.getMyUser();
            this.show = false
          }else {
            Toast('修改失败')
          }
        })
      },
      toNick(data, msg) {
        this.$router.push({
          name: 'nickName',
          query: {
            paramsType: data,
            content: msg
          }
        })
      },
      //图片裁剪
      onRead(e) {
        this.isShow = true;
        this.currentFile = e;
        const file = e.target.files[0];
        this.imgName = file.name
        if (!file.type.includes('image/')) {
            Toast('请选择图像文件');
          return;
        }
        if(typeof FileReader === 'function') {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
          }
          reader.readAsDataURL(file);
        }
      },
      //取消上传
      fileClose() {
        const that = this
        that.currentFile.target.value = ''//清除上一个file
        that.isShow = false
        that.$refs.cropper.getCroppedCanvas().toBlob(function(blob) {
          const href = window.URL.createObjectURL(blob);
        　window.URL.revokeObjectURL(href);
        }, 'image/jpeg')
      },
      //上传图片
      upImgLoad () {
        let that = this
        that.bus.$emit('getLoading', {
          loading: true,
          text: '上传中...'
        });
        that.$refs.cropper.getCroppedCanvas().toBlob(function(blob) {
          let formData = new FormData();
          formData.append('file', blob, that.imgName)
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
            if ( res.data.code === '0' ) {
              that.getChangeMyHeadIcon( res.data.info.imageId);
            }else {
              Toast(res.data.msg)
            }
          })
        }, 'image/jpeg')
      },
      //修改头像接口
      getChangeMyHeadIcon(id) {
        let data = {
          id: id
        };
        Models.User
        .changeMyHeadIcon(data)
        .then( res => {
          if ( res.data.code == 0 ) {
            this.bus.$emit('getLoading', {loading: false});
            this.fileClose()
            this.getMyUser();
          }
        })
      },
    },
    components: {
      addressPicker,
      VueCropper
    },
    created () {

    },
    activated() {
      this.getMyUser();
    },
  }
</script>
<style lang="less">
.personalInformation {
  width:100%;
  height: 100vh;
  background-color: #fff;

  .per-group {
    width: 100%;

    .pre-list {
      width: 100%;

      .pre-item {
        position: relative;
        padding: 15px;
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &::after {
          content: "";
          width: 200%;
          height: 0;
          display: block;
          border-bottom: 1px solid #EAEAEA;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          transform: scale(.5);
          transform-origin: left bottom;
        }

        &:first-child {
          padding: 10px 15px;
        }

        .head-img {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;

          > img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          > input {
            position: absolute;
            top: 0;
            left: 0;
            width: 345px;
            height: 50px;
            opacity: 0;
            z-index: 3;
          }

          .photo {
            position: absolute;
            top: 0;
            left: 0;
            width: 50px;
            height: 50px;
            z-index: 2;

            > img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .left-text {
          font-size: 15px;
          color: #333;
        }

        .pre-right {
          font-size: 15px;
          color: #999;

          .text {
            display: flex;
            align-items: center;

            > span {
              padding-right: 8px;
            }
          }
        }
      }
    }
  }

  .cropper {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 2000;

    &.cropper-abs {
      position: absolute;
      top: 0;
    }

    > input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }


    > img {
      margin: 0 auto;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 50%;
    }

    .cropper-dialog {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 4200;
      margin: auto;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom,rgba(0,0,0,.75) 50%, rgba(0,0,0,1) 100%);
      background-color: transparent;

      .cropper-body {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        margin: auto;
        width: 80%;
        transform: translate(-50%, -50%);
      }

      .cropper-toolsbar {
        position: absolute;
        bottom: 15px;
        display: block;
        margin: auto;
        padding: 0 15px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        overflow: hidden;

        .cancel {
          float: left;
          color: #fff;
          cursor: pointer;
        }

        .upload {
          float: right;
          color: #129fdd;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

