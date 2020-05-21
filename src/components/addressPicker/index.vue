<template>
  <div class="addressPicker">
    <div class="addressPickerTitle">
      <div class="addressPickerTitleName">所在地区</div>
      <div class="addressPickerOffBtn">
        <van-icon name="cross" color="#b0b0b0" size="19px" @click="offWindow"/>
      </div>
    </div>
    <div class="selectShow">
      <div class="province" @click="goSelect(0)" :class="[nowClick === 0 ? 'clickDiv' : '']">
        <span>{{nowFSelectName}}</span>
      </div>
      <div class="city" @click="goSelect(1)" :class="[nowClick === 1 ? 'clickDiv' : '']">
        <span>{{nowSSelectName}}</span>
      </div>
      <div class="area" @click="goSelect(2)" :class="[nowClick === 2 ? 'clickDiv' : '']">
        <span>{{nowRSelectName}}</span>
      </div>
    </div>
    <div class="selectList" v-show="nowClick === 0">
      <div class="selectAny" @click="nowSelectFirst(data)" v-for="(data,index) in nowShowAddress" :key="index" :class="[ nowFSelect === data.id ? 'nowSelectColor' : '']">
        <span>{{data.name}}</span><van-icon v-show="nowFSelect === data.id" name="success" color="#EA3323" size="16px"/>
      </div>
    </div>
    <div class="selectList" v-show="nowClick === 1">
      <div class="selectAny" @click="nowSelectSecond(data)" v-for="(data,index) in nowShowAddress" :key="index" :class="[ nowSSelect === data.id ? 'nowSelectColor' : '']">
        <span>{{data.name}}</span><van-icon v-show="nowSSelect === data.id" name="success" color="#EA3323" size="16px"/>
      </div>
    </div>
    <div class="selectList" v-show="nowClick === 2">
      <div class="selectAny" @click="nowSelectThird(data)" v-for="(data,index) in nowShowAddress" :key="index" :class="[ nowRSelect === data.id ? 'nowSelectColor' : '']">
        <span>{{data.name}}</span><van-icon v-show="nowRSelect === data.id" name="success" color="#EA3323" size="16px"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Models from '@/models';
  import { Icon } from 'vant';
  Vue.use(Icon);
  export default {
    name: "addressPicker",
    data () {
      return {
        nowShowAddress:[],
        province_list:[],
        city_list:[],
        county_list:[],
        nowClick:0,
        nowFSelect:"",
        nowSSelect:"",
        nowRSelect:"",
        nowFSelectName:"",
        nowSSelectName:"",
        nowRSelectName:"",
      }
    },
    props: {
      nowFSelectId: {
        type: String,
        default: '0',
      },
      nowSSelectId: {
        type: String,
        default: '0',
      },
      nowRSelectId: {
        type: String,
        default: '0',
      },
    },
    methods:{
      offWindow () {
        this.$emit('offWindow');
      },

      callBackAddress (name,id) {
        this.$emit('callBackAddress',name,id);
        this.offWindow();
      },
      goSelect (num) {
        this.nowClick = num;
        if ( num === 0 ) {
          this.nowShowAddress = this.province_list;
          this.nowSSelect ="";
          this.nowRSelect ="";
          this.nowSSelectName ="";
          this.nowRSelectName ="";
        }else if ( num === 1 ) {
          this.nowShowAddress = this.city_list;
          this.nowRSelect ="";
          this.nowRSelectName ="";
        }else if ( num === 2 ) {
          this.nowShowAddress = this.county_list;
        }
      },
      nowSelectFirst (data) {
        this.nowFSelect = data.id;
        this.nowFSelectName = data.name;
        this.cityZones(data.id);
        this.nowClick = 1;
      },
      nowSelectSecond (data) {
        this.nowSSelect = data.id;
        this.nowSSelectName = data.name;
        this.countyZones(data.id);
      },
      nowSelectThird (data) {
        this.nowRSelect = data.id;
        this.nowRSelectName = data.name;
        let name = `${this.nowFSelectName}${this.nowSSelectName}${this.nowRSelectName}`;
        this.callBackAddress(name,data.id);
      },
      //获取省级列表
      provinceZones () {
        const data = {
          id:1111111111,
        };
        Models.User
          .getZones(data)
          .then(res => {
            this.province_list = res.data.info.list;
            this.nowFSelect = res.data.info.list[0].id;
            this.nowFSelectName = res.data.info.list[0].name;
            this.nowShowAddress = this.province_list
          })
      },
      //获取城市列表(没有选择的)
      cityZones (id) {
        let data = {
          id:id
        };
        Models.User
          .getZones(data)
          .then(res => {
            this.city_list = res.data.info.list;
            this.nowShowAddress = this.city_list;
            this.nowSSelect = res.data.info.list[0].id;
            this.nowSSelectName = res.data.info.list[0].name;
          })
      },
      //获取城市的区列表
      countyZones (id) {
        let data = {
          id:id
        };
        Models.User
          .getZones(data)
          .then(res => {
            if ( res.data.info.list.length !== 0 ) {
              this.county_list = res.data.info.list;
              this.nowShowAddress = this.county_list;
              this.nowRSelect = res.data.info.list[0].id;
              this.nowRSelectName = res.data.info.list[0].name;
              this.nowClick = 2;
            }else {
              let name = `${this.nowFSelectName}${this.nowSSelectName}`;
              this.callBackAddress(name,id);
            }
          })
      },
    },
    created() {
      this.provinceZones();
    }
  }
</script>

<style scoped lang="less">
  .addressPicker {
    width: 100%;
    height:auto;

    .addressPickerTitle {
      width: 100%;
      height: 50px;
      display: flex;
      display: -webkit-flex;
      top: 0;
      line-height: 49px;
      padding: 0 10px;
      border-bottom:1px solid #EAEAEA ;
      background-color: #ffffff;

      .addressPickerTitleName {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        color:#333333;
        font-size: 15px;
      }

      .addressPickerOffBtn {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content:flex-end;
        color:#B0B0B0;
      }
    }

    .selectShow {
      width: 100%;
      height:40px;
      display: -webkit-flex;
      display: flex;
      padding: 0 10px;
      font-size: 15px;
      color:#333333;
      border-bottom: 1px solid #EAEAEA;

      &>div {
        height: 100%;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        margin-right: 28px;
        -webkit-box-flex: 1;

        &.clickDiv {
          border-bottom: 2px solid #Ea3323;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .selectList {
      width: 100%;
      height: 280px;
      overflow: auto;
      padding: 10px 0;

      .selectAny {
        width: 100%;
        height:50px;
        color:#333333;
        font-size: 15px;
        padding: 0 10px;
        line-height: 50px;

        i {
          margin-left: 10px;
          vertical-align: middle;
        }
      }

      .nowSelectColor {
        color: #EA3323;
      }
    }


  }
</style>
