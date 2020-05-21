<template>
  <div class="myUser">
    <div class="sreachUser">
      <div class="sreachDiv">
        <div class="searchIcon">
          <van-icon name="search" size="16px" color="#999999" />
        </div>
        <form action="JavaScript:return true;">
          <input type="search" v-model="nickName" @keyup.enter="sreach()" placeholder="请输入昵称" >
        </form>
      </div>
      <div class="selectUser" :class="[goSelectGrade ? 'colorEA3323' : 'color333333' ]" @click="goSelectGrade = !goSelectGrade"><span>{{ygradeName}}</span><van-icon name="filter-o"/></div>
    </div>
    <div class="bg" v-show="goSelectGrade" @click="goSelectGrade = false">
      <div class="userClass">
        <div class="anyClass" :class="[ygrade == 0 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(0)">
          <div class="anyClassTitle">
            全部会员({{statMyUserList.totalNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 0">
             <van-icon name="success" size="15px;"/>
          </div>
        </div>
        <div class="anyClass" :class="[ygrade == 3 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(3)">
          <div class="anyClassTitle">
            {{ gradesArr[0] }}({{statMyUserList.vipNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 3">
             <van-icon name="success" size="15px;"/>
          </div>
        </div>
        <div class="anyClass" :class="[ygrade == 4 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(4)">
          <div class="anyClassTitle">
            {{ gradesArr[1] }}({{statMyUserList.bossNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 4">
             <van-icon name="success" size="15px;"/>
          </div>
        </div>
        <div class="anyClass" :class="[ygrade == 5 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(5)">
          <div class="anyClassTitle">
            {{ gradesArr[2] }}({{statMyUserList.goldenNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 5">
             <van-icon name="success" size="15px;"/>
          </div>
        </div>
        <div class="anyClass" v-if="statMyUserList.hhNumber != 0" :class="[ygrade == 6 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(6)">
          <div class="anyClassTitle">
            {{ gradesArr[3] }}({{statMyUserList.hhNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 6">
            <van-icon name="success" size="15px;"/>
          </div>
        </div>
        <div class="anyClass" v-if="statMyUserList.yyNumber != 0" :class="[ygrade == 7 ? 'colorEA3323' : 'color333333' ]" @click="selectGrade(7)">
          <div class="anyClassTitle">
            {{ gradesArr[4] }}({{statMyUserList.yyNumber}})
          </div>
          <div class="anyClassSeclet" v-show="ygrade == 7">
            <van-icon name="success" size="15px;"/>
          </div>
        </div>
      </div>
    </div>
      <van-pull-refresh v-model="isLoading"
        @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            class="van-clearfix"
          >
        <div class="myUsersList">
          <div class="anyOneUserDiv" v-for="(data,index) in userList" :key="index" @click="seeUserCenter(data.userId)">
            <div class="userTitle">
              <img :src="data.headImagePic" alt="">
              <div class="user">
                <div class="name">{{data.phone}}</div>
                <div class="label">
                  <span>{{getyGrade(data.ygrade)}}</span>
                </div>
                <div class="zhijieyonghu">
                  <span>直接用户：</span><span>{{data.members}}</span>
                </div>
              </div>
              <div class="userBtn">
                <!-- <button @click.stop="gift(data.userId,data.invitorName)">提货明细</button> -->
                <router-link :to="{ name: 'pickUpDesc', query: { uid: data.userId } }">提货明细</router-link>
                <button @click.stop="gift(data.userId,data.invitorName)">赠送惠呗</button>
              </div>
            </div>
            <div class="userCenter" v-show="userCenterShow === data.userId">
              <!-- <div class="anyoneCenter">
                <div class="centerTitle">分享人</div>
                <div class="centerText">{{data.invitorName}}</div>
              </div> -->
              <div class="anyoneCenter">
                <div class="centerTitle">手机号</div>
                <div class="centerText">{{data.phone}}</div>
              </div>
              <!-- <div class="anyoneCenter">
                <div class="centerTitle">地址</div>
                <div class="centerText">{{data.address}}</div>
              </div> -->
              <div class="anyoneCenter">
                <div class="centerTitle">注册时间</div>
                <div class="centerText">{{data.createTime}}</div>
              </div>
              <!-- <div class="anyoneCenter" v-if="data.memberShip !== null">
                <div class="centerTitle">会员有效期</div>
                <div class="centerText">{{ data.memberShip.startTime | timeStampFilter('yy-mm-dd') }} 至 {{ data.memberShip.endTime | timeStampFilter('yy-mm-dd') }}</div>
              </div> -->
              <div class="anyoneCenter">
                <div class="centerTitle">会员有效期</div>
                <div class="centerText" v-if="data.memberShip !== null">{{ data.memberShip.startTime | timeStampFilter('yy-mm-dd') }} 至 {{ data.memberShip.endTime | timeStampFilter('yy-mm-dd') }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="mask" v-show="UserClassOption">
      <div class="giftWindow">
        <div class="giftTitle">
          给 <span>{{invitorName}}</span> 赠送惠呗
        </div>
        <div class="giftContent" v-if="point !== 0">
          <p class="giftContentTitle">惠呗数量：</p>
          <input class="giftContentInput" type="text" v-model="amount" placeholder="请输入要赠送的惠呗数量，例如：100">
          <p class="giftContentPrompt">* 您当前最大可赠送惠呗数量是{{point}}个</p>
        </div>
        <div class="noHuibei" v-if="point === 0">
          抱歉，您账号的惠呗数量不足，请先充值！
        </div>
        <div class="giftBtn">
          <div class="cancel" @click="cancelGift()">取消</div>
          <div class="gift" @click="gifthuibei()" v-if="point !== 0">立即赠送</div>
          <div class="gift" @click="goRecharge()" v-if="point === 0">立即充值</div>
        </div>
      </div>
    </div>
    <van-popup v-model="showKeyboard" position="bottom" :overlay="true">
      <PayPassword @goPay="getConfirmReceive" @offPayWindow="offShowKeyboard" :value1="value1"></PayPassword>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import PayPassword from "@/components/payPassword";
import { Popup, Icon, Toast, PullRefresh, List } from 'vant';
Vue.use(Popup).use(Icon).use(Toast).use(PullRefresh).use(List);
export default {
  name:"myUser",
  data () {
    return {
      page: '1',
      size: '10',
      total: '',
      toUserId:"",
      point:null,
      amount:null,
      ygrade:"0",
      nickName:"",
      invitorName:"",
      ygradeName:"全部会员",
      gradesArr: [],//等级的数组
      goSelectGrade:false,
      UserClassOption:false,
      userCenterShow:null,
      userList:[],
      //支付方式
      payShow: false,
      priceObj: {},
      statMyUserList:[],
      loading: false,
      finished: false,
      isLoading: false,
      showKeyboard: false,//支付密码弹框
      value1: '',//支付密码
    }
  },
  methods:{
    //获取用户统计
    getStatMyUser () {
      Models.User
      .statMyUser()
      .then( res => {
        if ( res.data.code === '0' ) {
          this.statMyUserList = res.data.info;
        }
      })
    },
    gift (id,name) {
      this.toUserId = id;
      this.invitorName = name;
      this.UserClassOption = true;
    },
    cancelGift () {
      this.UserClassOption = false;
    },
    goRecharge () {
      this.$router.push({
        name: 'recharge',
        query: {
          chargeAct: '3'
        }
      });
    },
    //校验有没有设置支付密码
    checkInit() {
      let hadPayPass = localStorage.getItem('hadPayPass')
      if(hadPayPass == 'no') {
        Dialog.confirm({
          title: '温馨提示',
          message: '请先设置支付密码'
        }).then(() => {
          this.$router.push({
            name: 'phoneVerification',
            query:{
              editType: 4
            }
          })
        }).catch(() => {
          this.showKeyboard = false;
          this.value1 = ''
        });
      }else {
        this.showKeyboard = true
      }
    },
    gifthuibei () {
      if (this.amount === undefined) {
        Toast('请输入要赠送的惠呗数量')
        return false
      }
      this.checkInit()
    },
    /**
     * 下拉刷新
    */
    onRefresh() {
      setTimeout(() => {
        if(this.userList.length == 0) {
          this.isLoading = false
          this.loading = false
        }else {
          this.loading = true
          this.finished = false
          this.page = 1;
          let data = {
            nickName: this.nickName,
            ygrade: this.ygrade,
            page: this.page,
            size: this.size,
          };
          Models.User
          .searchMyUser(data)
          .then( res => {
            if ( res.data.code === '0' ) {
              this.isLoading = false;
              // 加载状态结束
              this.loading = false;
              this.userList = []
              this.userList = res.data.info.list
              this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
              this.page = Number(this.page) + 1;
            }
          })
        }
      }, 500);
    },

    /**
     * 上拉获取
    */
    onLoad() {
      this.getMyUsers();
      // 数据全部加载完成
      if (this.page >= this.total) {
        this.finished = true;
      }
    },
    seeUserCenter (id) {
      if (this.userCenterShow === id ) {
        this.userCenterShow = null;
      }else {
        this.userCenterShow = id;
      }
    },
    //获取我的会员
    getMyUsers () {
      this.loading = true
      this.finished = false
      let data = {
        nickName:this.nickName,
        ygrade:this.ygrade,
        page: this.page,
        size: this.size,
      };
      Models.User
      .searchMyUser(data)
      .then( res => {
        if ( res.data.code === '0' ) {
          this.isLoading = false;
          // 加载状态结束
          this.loading = false;
          this.userList = this.userList.concat(res.data.info.list);
          this.total = Math.ceil(Number(res.data.info.total) / Number(this.size));
          this.page = Number(this.page) + 1;
        }
      })
    },
    sreach () {
      this.page = '1';
      this.userList = [];
      this.getMyUsers()
    },
    //选择会员等级进行搜索
    selectGrade (num) {
      this.ygrade = ""+num;
      this.goSelectGrade = false;
      this.ygradeName = this.getyGrade(this.ygrade);
      this.page = '1';
      this.userList = [];
      this.getMyUsers()
    },
    //根据返回的数据做判断会员
    getyGrade ( str ) {
      let num = Number(str);
      switch (num) {
        case 0:
          return "全部会员";
        case 1:
          return "普通会员";
        case 2:
          return "天使会员";
        case 3:
          return "VIP";
        case 4:
          return "社区BOSS";
        case 5:
          return "金牌BOSS";
        case 6:
          return "合伙商";
        case 7:
          return "运营中心";
      }
    },
    balance () {
      Models.User
      .getBalance()
      .then( res => {
        if ( res.data.code == 0 ) {
          this.point = Number(res.data.info.point);
        }
      })
    },
    offShowKeyboard () {
      this.showKeyboard = false;
      Toast('您已取消支付')
    },
    //密码输入完成
    getConfirmReceive(password) {
      let data = {
        toUserId: this.toUserId,
        point: this.amount,
        payPassword: password
      };
      this.UserClassOption = false
      this.bus.$emit('getLoading', {
        loading: true,
        text: '赠送中...'
      });
      Models.User
      .sentPoint(data)
      .then( res => {
        this.bus.$emit('getLoading', {
          loading: false
        });
        if ( res.data.code === '0' ) {
          this.amount = undefined
          this.showKeyboard = false
          Toast("惠呗赠送成功");
        }else {
          Toast(res.data.msg);
          this.value1 = ''
        }
      })
    },
  },
  components: {
    PayPassword
  },
  activated () {
    this.balance();
    this.UserClassOption = false;
  },
  created () {
    this.getStatMyUser();
    this.getMyUsers();
    let grades = JSON.parse(localStorage.getItem('grades'))
    let arr = []
    Object.keys(grades).map((key, item) => {
      arr.push(grades[key])
    })
    this.gradesArr = arr
  }
}
</script>
<style lang="less">
.myUser {
  width: 100%;
  height: 100%;

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    z-index: 90;
    top: 0;
    background-color: rgba(0,0,0,0.3);

    .giftWindow {
      width: 325px;
      background-color: #ffffff;
      border-radius: 8px;
      height:auto;
      margin: 0 auto;

      .giftTitle {
        width: 100%;
        height:55px;
        line-height: 54px;
        padding: 0 18px;
        color:#333333;
        font-size: 16px;
        border-bottom:1px solid #eaeaea;

        > span {
          font-weight: bold;
        }
      }

      .giftContent {
        width: 100%;
        height:auto;
        padding: 20px 18px 31px;

        .giftContentTitle {
          color: #333333;
          font-size: 15px;
          width: 100%;
          height:auto;
          margin-bottom: 17px;
        }

        .giftContentInput {
          width: 100%;
          height:40px;
          padding: 0 22px;
          border-radius: 40px;
          background-color:#f2f2f2;
          margin-bottom: 12px;
          font-size: 14px;
          border:none;
        }

        .giftContentPrompt{
          font-size: 12px;
          height: auto;
          width:100%;
          color:#EA3323;
        }
      }

      .noHuibei {
        width: 100%;
        height:98px;
        text-align: center;
        line-height: 98px;
        color:#333333;
        font-size: 14px;
      }

      .giftBtn {
        width: 100%;
        display: flex;
        height:55px;
        font-size: 15px;
        border-top:1px solid #eaeaea;
        line-height: 54px;
        display: -webkit-flex;

        >div {
          width: 100%;
          height:54px;
          text-align: center;
          color:#EA3323;

          &:first-child {
            color:#333333;
            border-right:1px solid #eaeaea;
          }
        }
      }
    }
  }

  .UserClassOption {
    width: 100%;
    z-index: 5;
    height:auto;
    padding-top: 8px;
    background-color: #ffffff;

    .anyoneOption {
      width:100%;
      height:46px;
      padding: 0 15px;
      display: flex;
      display: -webkit-flex;
      border-bottom:1px solid #EAEAEA;

      .optionNameAndNum {
        width: 100%;
        height: 45px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        font-size: 15px;
      }

      .selectStatus {
        flex-basis:16px;
        flex-shrink: 0;
        display: flex;
        display: -webkit-flex;
        align-items: center;

        img {
          width:16px;
          height:16px;
        }
      }
    }
  }

  .sreachUser {
    width:100%;
    height:auto;
    position: fixed;
    top: 0;
    left: 0;
    display:flex;
    padding: 8px 15px;
    z-index: 5;
    display:-webkit-flex;
    background-color: #ffffff;

    .sreachDiv {
      flex: 1;
      height:30px;
      padding: 0 14px;
      margin-right: 15px;
      border-radius:30px;
      overflow: hidden;
      background-color: #f5f5f5;
      display:flex;

      .searchIcon {
        flex-basis: 20px;
        display:flex;
        display:-webkit-flex;
        align-items: center;
        flex-shrink: 0;
        height: 100%;
      }

      form {
        width: 100%;
        height: auto;
        font-size: 0;
      }

      input {
        width: 100%;
        height:30px;
        font-size: 14px;
        background-color: #f5f5f5;
      }
    }

    .selectUser {
      height:30px;
      line-height: 30px;
      font-size: 15px;
      display:flex;
      display:-webkit-flex;
      align-self: center;

      i {
        padding-top: 7px;
        font:15px "vant-icon";
      }
    }
  }

  .myUsersList {
    margin-top: 38px;
    width:100%;

    .anyOneUserDiv {
      position: relative;
      width: 100%;

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

      .userTitle {
        width:100%;
        height:auto;
        display: flex;
        display: -webkit-flex;
        padding:16px 15px;
        align-items: center;

        img {
          width: 50px;
          height:50px;
          margin-right: 15px;
          border-radius: 50%;
        }

        .user {
          width: 160px;
          height:auto;

          .name {
            width: 100%;
            font-size: 15px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color:#232323;
          }

          .label {
            width: 100%;
            display: flex;
            align-items: center;

            > span {
              display: inline-block;
              padding: 0 4px;
              height:20px;
              line-height: 20px;
              text-align: center;
              font-size: 12px;
              background: -webkit-linear-gradient(bottom,  #F1D451 , #FAEBA9 ); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(top, #F1D451 , #FAEBA9 ); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(top, #F1D451 , #FAEBA9 ); /* Firefox 3.6 - 15 */
              background: linear-gradient(to top, #F1D451 , #FAEBA9 ) ; /* 标准的语法 */
              color: #BA220F;
              border-radius: 2px;
            }
          }

          .zhijieyonghu {
            width: 100%;
            height:auto;
            font-size: 12px;

            span {
              &:first-child {
                color:#666666;
              }

              &:last-child {
                color:#232323;
              }
            }
          }
        }

        .userBtn {
          width: 154px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          > a {
            position: relative;
            margin-right: 8px;
            width: 73px;
            height:30px;
            line-height:30px;
            text-align: center;
            font-size:12px;
            border-radius:30px;
            border:none;
            color:#EA3323;

            &::after {
              content: "";
              width: 200%;
              height: 200%;
              position: absolute;
              top: 0;
              left: 0;
              border: 1px solid #EA3323;
              border-radius: 30px;
              -webkit-transform: scale(.5);
              transform: scale(.5);
              -webkit-transform-origin: top left;
              transform-origin: top left;
            }
          }

          button {
            width: 73px;
            height:30px;
            line-height:30px;
            text-align: center;
            color:#ffffff;
            font-size:12px;
            border-radius:30px;
            border:none;
            background-color: #FB1F16;
          }
        }
      }

      .userCenter {
        width: 100%;
        height:auto;
        font-size:15px;
        padding: 0 15px 15px;

        .anyoneCenter {
          width: 100%;
          height:auto;
          display: flex;
          display: -webkit-flex;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .centerTitle {
            flex-basis: 88px;
            flex-shrink: 0;
            color:#666666;
          }

          .centerText {
            width:100%;
            color:#333333;
          }
        }
      }
    }
  }

  .bg {
    top:0;
    z-index: 2;
    width: 100%;
    height:100%;
    position: fixed;
    padding-top: 38px;
    background-color:rgba(0,0,0,0.3);

    .userClass {
      width: 100%;
      height:auto;
      padding-top: 7px;
      background-color: #ffffff;

      .anyClass {
        width:100%;
        height:47px;
        line-height: 46px;
        display: flex;
        font-size:15px;
        padding: 0 15px;
        display: -webkit-flex;
        border-bottom:1px solid #eaeaea;

        >div {
          width:100%;
          height:46px;

          &.anyClassSeclet {
            text-align: right;
          }
        }
      }
    }
  }

  .colorEA3323 {
    color:#EA3323;
  }

  .color333333 {
    color:#333333;
  }
}
</style>
