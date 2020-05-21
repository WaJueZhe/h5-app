<template>
  <div class="addMyaddress">
    <div class="main">
      <div class="anyoneInput">
        <div class="inputTitle">
          <span>收货人</span>
        </div>
        <div class="inputContent">
          <input type="text" :maxlength="6" v-model.trim="editUserInfo.name">
        </div>
      </div>
      <div class="anyoneInput">
        <div class="inputTitle">
          <span>联系电话</span>
        </div>
        <div class="inputContent">
          <input type="number" v-model.trim="editUserInfo.phone" >
        </div>
      </div>
      <div class="anyoneInput" @click="goSelectAddress()">
        <div class="inputTitle">
          <span>所在地址</span>
        </div>
        <div class="inputContent">
          <span>{{selectCity}}</span>
        </div>
        <div class="xuanzedizhi">
          <img src="@/assets/youjiantou.png" alt="">
        </div>
      </div>
      <div class="anyoneInput">
        <div class="inputTitle">
          <span>详细地址</span>
        </div>
        <div class="inputContent">
          <textarea v-model="editUserInfo.addressTail" placeholder="请谨慎填写详细地址"></textarea>
        </div>
      </div>
    </div>
    <div class="otherCenter">
      <div class="orDefault">
        <div class="orDefaultTitle">
          设为默认地址
        </div>
        <div class="orDefaultBtn">
          <van-switch v-model="checked" active-color="#EA3323" inactive-color="#F5F5F5" size="24px"/>
        </div>
      </div>
      <div class="deleteMyaddress" v-if="status !== 0" @click="delAddress()">删除收货地址</div>
    </div>
    <div class="addressManagementBtn">
      <button @click="addOrEditAddress()">保存</button>
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
import { Popup  , Dialog , Switch , Toast } from 'vant';
Vue.use(Popup).use(Dialog).use(Switch).use(Toast);
export default {
  name:"addMyaddress",
  data () {
    return {
      show:false,
      myInfo:{},
      checked: true,
      status:0,
      editUserInfo:{
        addressId:"0",
        name:"",
        phone:"",
        zoneId:"",
        addressTail:"",
        isDefault:1,
      },
      selectCity:"",
      statusType: ''
    }
  },
  watch:{
    checked ( ) {
      if ( this.checked ) {
        this.editUserInfo.isDefault = 1;
      }else {
        this.editUserInfo.isDefault = 0;
      }
    }
  },
   methods:{
     callBackAddress (name,id) {
       this.selectCity = name;
       this.editUserInfo.zoneId = id;
     },
     offWindow () {
       this.show = false;
     },
     goSelectAddress () {
       this.show = true;
     },

    //删除地址
    delAddress (id) {
      let address = JSON.parse(sessionStorage.getItem('address'))
      let data = {
        id: this.editUserInfo.addressId,
      };
      Dialog.alert({
        message: '是否删除地址'
      }).then(() => {
        Models.User
          .deleteAddress(data)
          .then(res => {
            if ( res.data.code === '0' ) {
              if(address != null) {
                if(address.addressId == this.editUserInfo.addressId) {
                  sessionStorage.removeItem('address')
                }
              }
              Toast('已删除地址')
              this.$router.go(-1)
            }
          })
      });
      // else {
      //   let data = {
      //     id: this.editUserInfo.addressId,
      //   };
      //   Dialog.alert({
      //     message: '是否删除地址'
      //   }).then(() => {
      //     Models.User
      //       .deleteAddress(data)
      //       .then(res => {
      //         if ( res.data.code === '0' ) {
      //           Toast('已删除地址')
      //           this.$router.replace({
      //             name: 'addressManagement',
      //             query: {
      //               statusType: this.statusType
      //             }
      //           });
      //         }
      //       })
      //   });
      // }

    },
    //修改或者新增地址
    addOrEditAddress () {
      Toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中...'
      });
      var reg = 11 && /^((11|12|13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (this.editUserInfo.name == '' ) {
        Toast('请输入名字');
      }else if ( !reg.test(this.editUserInfo.phone) ) {
        Toast('请输入正确的手机号码');
      }else if (this.editUserInfo.zoneId == '' ) {
        Toast('请选择地址');
      }else if ( this.editUserInfo.addressTail == '' ) {
        Toast('请输入详细地址');
      }else {
        Models.User
        .saveAddress(this.editUserInfo)
        .then(res => {
          if ( res.data.code === '0' ) {
            Toast.clear();
            let address = JSON.parse(sessionStorage.getItem('address'))
            if(address != null && this.$route.query.edit === '1') {
              address.name = res.data.info.name;
              address.addressTail = res.data.info.addressTail;
              address.addressHead = res.data.info.addressHead;
              address.phone = res.data.info.phone;
              address.phone = res.data.info.phone;
              address = JSON.stringify(address)
              sessionStorage.setItem('address', address)
            }
            if ( this.status === 0 ) {
              Toast('新增地址成功')
              if(this.statusType == undefined) {
                this.$router.go(-1)
              }else if (this.statusType == '2') {
                this.$router.replace({
                  name: 'addressManagement',
                  query: {
                    statusType: this.statusType,
                    orderId: this.$route.query.orderId
                  }
                });
              }else {
                this.$router.replace({
                  name: 'addressManagement',
                  query: {
                    statusType: this.statusType
                  }
                });
              }
            }else {
              Toast('修改成功')
              if (this.statusType == undefined) {
                this.$router.go(-1)
              }else {
                this.$router.replace({
                  name: 'addressManagement',
                  query: {
                    statusType: this.statusType
                  }
                });
              }
            }
          }
        })
      }
    },
  },
  mounted () {
    if ( this.$route.query.add == '0' ) {
      this.status = 0;
      this.editUserInfo.addressId = 0;
      this.statusType = this.$route.query.statusType
    }else {
      this.status = 1;
      let data = JSON.parse(sessionStorage.getItem('editAddress'));
      this.statusType = data.statusType
      let zonePath = data.zonePath.split(",");
      this.selectCity = data.addressHead;
      this.editUserInfo = {
        addressId:data.addressId,
        name:data.name,
        phone:data.phone,
        zoneId:zonePath.length === 3 ? Number(zonePath[2]) :  Number(zonePath[1]),
        addressTail:data.addressTail,
        isDefault:data.ystatus,
      };
      if (data.ystatus === '0') {
        this.checked =false;
      }else {
        this.checked =true;
      }
    }
  },
  activated () {

  },
  created () {
  },
  components: {
    addressPicker
  },
}
</script>
<style lang="less" scoped>
  .addMyaddress {
    width:100%;
    height: 100%;
    overflow-y: auto;
    background-color: #F5F5F5;

    .main {
      width: 100%;
      height: auto;
      margin-bottom: 16px;

      .anyoneInput {
        position: relative;
        width:100%;
        height:auto;
        display: flex;
        padding: 0 15px;
        display: -webkit-flex;
        background-color: #ffffff;
        overflow: hidden;

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

        .inputTitle {
          flex-shrink: 0;
          flex-basis:90px;
          height: 45px;
          color: #333333;
          line-height: 44px;
          font-size: 15px;
        }

        .myAddress {
          padding: 13px 0;
        }

        .inputContent {
          width: 100%;
          font-size: 0;
          height: auto;
          min-height: 45px;
          color: #333333;
          display: flex;
          display: -webkit-flex;
          align-items: center;

          textarea {
            width: 100%;
            height: 45px;
            font-size: 14px;
            padding-top: 12px;
            overflow: hidden;
          }

          input {
            width: 100%;
            font-size: 14px;
          }

          span {
            font-size: 15px;
            color: #333333;
          }
        }

        .xuanzedizhi {
          flex-shrink: 0;
          flex-basis:20px;
          padding-top: 13px;

          img {
            vertical-align: middle;
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .otherCenter {
      background-color: #ffffff;
      width: 100%;
      height:auto;

      .orDefault {
        position: relative;
        width:100%;
        height:46px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        padding: 0 15px;

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

        &>div {
          width: 100%;
          height:auto;
          color:#333333;
          font-size: 15px;
        }

        .orDefaultBtn {
          text-align: right;
        }
      }

      .deleteMyaddress {
        width:100%;
        height:46px;
        display: flex;
        font-size: 15px;
        color:#EA3323;
        padding: 0 15px;
        align-items: center;
        display: -webkit-flex;
      }
    }

    .addressManagementBtn {
      position: fixed;
      bottom:0;
      left: 0;
      right: 0;
      font-size: 0;
      padding: 16px 15px;
      width: 100%;
      height:72px;
      z-index: 22;

      button {
        width: 100%;
        height:40px;
        border:none;
        vertical-align: middle;
        background-color: #EA3323;
        color:#ffffff;
        font-size:15px;
      }
    }
  }
</style>


