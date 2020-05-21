<template>
  <div class="addressManagement">
    <div class="noAddressManagement" v-if="addressList.length === 0">
      <img src="@/assets/shippingAddress.png" alt="">
      <p>暂无收货地址</p>
    </div>
    <div class="addressManagementList" v-if="addressList.length !== 0">
      <div class="anyoneAddress" v-for="(data,index) in addressList" :key="index" @click="changeAddress(data)">
        <div class="addressCenter">
          <div class="people">
            <span class="name">{{data.name}}</span>
            <span class="phone">{{data.phone}}</span>
            <span class="label" v-show="data.ystatus === '1'">默认</span>
          </div>
          <div class="address">{{data.addressHead}}{{data.addressTail}}</div>
        </div>
        <div class="editBtn">
          <div>
            <img src="@/assets/editAddress.png" alt="" @click.stop="goEditAddress(data)">
          </div>
        </div>
      </div>
    </div>
    <div class="addressManagementBtn" @click="addAdress">
      <button>+&nbsp;&nbsp;添加收货地址</button>
    </div>
  </div>
</template>
<script>import Vue from 'vue';
import Models from '@/models';
import { Toast, Dialog } from 'vant';

Vue.use(Toast).use(Dialog)
export default {
  name:"addressManagement",
  data () {
    return {
      addressList:[],
      addFlage: false,
      orderId: '',//订单id
    }
  },
  methods:{
    getAllAddressList () {
      Models.User
      .getAddressList()
      .then(res => {
        if (res.data.code === '0' ) {
          this.addressList = res.data.info.list;
        }
      })
    },
    goEditAddress (data) {
      let tData = JSON.stringify(data);
      let statusType = this.$route.query.statusType
      if(statusType == undefined) {
        sessionStorage.setItem('editAddress', tData);
        this.$router.push({
          name: 'addMyaddress'
        });
      }else if (statusType == '2') {
        sessionStorage.setItem('editAddress', tData);
        this.$router.push({
          name: 'addMyaddress',
          query: {
            orderId: this.orderId
          }
        });
      }else {
        sessionStorage.setItem('editAddress', tData);
        this.$router.push({
          name: 'addMyaddress',
          query: {
            edit: '1'
          }
        });
      }
    },
    changeAddress(item) {
      let statusType = this.$route.query.statusType;
      if ( statusType == 2 ) {
        this.getPostRecordAddress(item.addressId);
      }else if(statusType == 1) {
        if(sessionStorage.getItem('goToHome') == 2) {
          let data = JSON.stringify(item);
          sessionStorage.setItem('address', data);
          this.$router.replace({
            name: 'goodsOrder'
          });
        }else {
          let data = JSON.stringify(item);
          sessionStorage.setItem('address', data);
          this.$router.go(-1);
        }
      }
    },
    // 添加收货地址
    addAdress() {
      let statusType = this.$route.query.statusType;
      if(statusType == undefined) {
        this.$router.push({
          name: 'addMyaddress',
          query: {
            add: '0'
          }
        })
      }else if (statusType == '2') {
        this.$router.replace({
          name: 'addMyaddress',
          query: {
            add: '0',
            statusType: statusType,
            orderId: this.orderId
          }
        })
      }else {
        this.$router.replace({
          name: 'addMyaddress',
          query: {
            add: '0',
            statusType: statusType,
            orderId: this.orderId
          }
        })
      }
    },
    //补全收货地址
    getPostRecordAddress (addressId) {
      Dialog.confirm({
        title: '标题',
        message: '确认补充此地址吗？'
      }).then(() => {
        let data = {
          orderId: this.orderId,
          addressId: addressId
        };
        Models.User
        .postRecordAddress(data)
        .then( res => {
          if ( res.data.code == '0' ) {
            localStorage.removeItem('orderId')
            this.$router.go(-1);
            Toast("补全地址成功")
          }else if(res.data.code == '8001') {
            Toast('补充地址失败')
          }
        });
      }).catch(() => {
        // on cancel
      });
    },
  },
  created () {

  },
  activated () {
    this.getAllAddressList();
    this.orderId = this.$route.query.orderId
    // let orderId = this.$route.query.orderId
    // localStorage.setItem('orderId', orderId)
    // console.log(localStorage.getItem('orderId'))
    // if (localStorage.getItem('orderId') != null) {
    //   this.orderId = localStorage.getItem('orderId')
    // }else {
    //   this.orderId = this.$route.query.orderId
    // }
  },
  components: {
  }
}
</script>
<style lang="less">
.addressManagement {
  width: 100%;
  height:100%;

  .noAddressManagement {
    width: 100%;
    height:auto;
    padding-top: 47px;

    img {
      margin: 0 auto 8px;
      width: 78px;
      height:auto;
    }

    p {
      text-align: center;
      font-size: 18px;
      color:#999999;
    }
  }

  .addressManagementList {
    padding-bottom: 72px;
    width: 100%;

    .anyoneAddress {
      position: relative;
      width: 100%;
      height:auto;
      padding: 15px;
      display: flex;
      display: -webkit-flex;

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

      .addressCenter {
        width: 100%;
        height:auto;

        .people {
          font-size: 15px;
          width: 100%;
          height: auto;
          margin-bottom: 6px;

          .name {
            color: #333333;
            display: inline-block;
            vertical-align: middle;
            margin-right: 22px;
          }

          .phone {
            color:#232323;
            margin-right: 15px;
            display: inline-block;
            vertical-align: middle;
          }

          .label {
            font-size: 12px;
            width: 40px;
            height:20px;
            border-radius:14px;
            line-height: 20px;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            background-color: #EA3323;
            color:#ffffff;
          }
        }

        .address {
          font-size:12px;
          color:#232323;
        }
      }

      .editBtn {
        flex-basis: 20px;
        flex-shrink: 0;
        height:auto;
        text-align: right;
        display: flex;
        align-items: center;
        display: -webkit-flex;

        &>div {
          width: 100%;
          height:auto;
          text-align: right;

          img {
            width: 20px;
            right:0;
            height:auto;
          }
        }
      }
    }
  }

  .addressManagementBtn {
    width: 100%;
    height:72px;
    padding: 16px 15px;
    position: fixed;
    bottom:0;

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


