<template>
  <div class="balance-page">
    <div class="balance-box" v-if="chargeAct == 2">
      <div class="balance">
        <div class="info">
          <div class="account">账户余额（元）</div>
          <div class="money">{{ balance.balance || 0 }}</div>
          <div class="account">可提现余额 {{ balance.exBalance || 0 }} 元</div>
        </div>
      </div>
      <ul class="b-list">
        <li class="b-item">
          <router-link :to="{ name: 'recharge', query: { chargeAct: '2' } }">
            <div class="s-text">余额充值</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="b-item" @click="goWithdraw">
          <a>
            <div class="s-text">余额提现</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <ul class="b-list b-top">
        <li class="b-item">
          <router-link :to="{ name: 'detailed', query: { chargeAct: '2' } }">
            <div class="s-text">余额明细</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="b-item">
          <router-link :to="{ name: 'withdrawalsRecord' }">
            <div class="s-text">提现明细</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="balance-box" v-if="chargeAct == 3">
      <div class="balance">
        <div class="info">
          <div class="account">
            <span>账户惠呗数量</span>
            <a href="http://h5.no1qh.com/view/point.html">
              <img src="@/assets/personalCenter/description.png" alt="">
            </a>
          </div>
          <div class="money">{{ balance.point || 0 }}
            <span>个</span>
          </div>
        </div>
      </div>
      <ul class="b-list">
        <li class="b-item" v-if="huibeiFlage == true">
          <router-link :to="{ name: 'recharge', query: { chargeAct: '3' } }">
            <div class="s-text">惠呗充值</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <li class="b-item" v-if="ygrade >= 5">
          <router-link :to="{ name: 'giveHuiBei' }">
            <div class="s-text">赠送惠呗</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
        <!-- <li class="b-item">
          <router-link :to="{ name: 'recharge', query: { chargeAct: '4' } }">
            <div class="s-text">兑换惠呗</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li> -->
      </ul>
      <ul class="b-list b-top">
        <li class="b-item">
          <router-link :to="{ name: 'detailed', query: { chargeAct: '3' } }">
            <div class="s-text">惠呗明细</div>
            <div class="s-right">
              <div class="text">
                <van-icon name="arrow" size="16px" color="#999999"/>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Models from '@/models';
import { Icon, Dialog } from 'vant';
Vue.use(Icon).use(Dialog);
export default {
  name: 'balance',
  data() {
    return {
      chargeAct: '',
      balance: {},
      ygrade: localStorage.getItem('ygrade'),
      huibeiFlage: false,
      userStatus: '',
      corpStatus: '',
    };
  },
  watch: {

  },
  methods: {
    getBalance() {
      Models.User
      .getBalance()
      .then(res => {
        this.balance = res.data.info;
        localStorage.setItem('point', this.balance.point)
      })
    },
    //去提现
    goWithdraw() {
      if((Number(this.ygrade)) < 5) {
        if( this.userStatus == 2 ) {
          this.$router.push({
            name: 'withdraw'
          });
        }else {
          Dialog.confirm({
            message: '您还没认证，请先去认证',
            closeOnClickOverlay:true
          }).then(() => {
            this.$router.push({
              name: 'realName'
            });
          }).catch(() => {
          });
        }
      }else {
        if( this.userStatus == 2 && this.corpStatus == 2 ) {
          this.$router.push({
            name: 'withdraw'
          });
        }else {
          Dialog.confirm({
            message: '您还没认证，请先去认证',
            closeOnClickOverlay:true
          }).then(() => {
            this.$router.push({
              name: 'realName'
            });
          }).catch(() => {
          });
        }
      }
    },
    checkIdentifyStatus (name) {
      let data = {
        str:name,
      };
      Models.User
      .getIdentifyStatus(data)
      .then( res => {
        if ( res.data.code == 0 ) {
          if ( name === "user" ) {
            this.userStatus = res.data.info.ystatus;
          }else {
            this.corpStatus = res.data.info.ystatus;
          }
        }else {
          if ( name === "user" ) {
            this.userStatus = 0;
          }else {
            this.corpStatus = 0;
          }
        }
      })
    },
  },
  computed: {

  },
  created() {

  },
  activated () {
    this.chargeAct = this.$route.query.chargeAct
    this.getBalance()
    this.checkIdentifyStatus("user");
    this.checkIdentifyStatus("corp");
    if(localStorage.getItem('ygrade') != null) {
      if(localStorage.getItem('ygrade') >= 5) {
        this.huibeiFlage = true
      }
    }
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.balance-page {
  width: 100%;

  .balance {
    width: 100%;
    height: 143px;
    background: -webkit-linear-gradient(left,  #F12F4B , #ED2E60 ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #F12F4B , #ED2E60); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #F12F4B , #ED2E60); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #F12F4B , #ED2E60) ; /* 标准的语法 */
    display: flex;
    align-items: center;

    .info {
      width: 100%;
      text-align: center;
      color:#fff;

      .account {
        font-size: 12px;

        > span {
          vertical-align: middle
        }

        > a {
          display: inline-block;
          width: 20px;
          height: 20px;
          vertical-align: middle
        }
      }

      .money {
        margin: 4px 0;
        font-size: 36px;
        font-weight: 500;

        > span {
          font-size: 15px;
          font-weight: normal;
        }
      }
    }
  }

  .b-list {
    width: 100%;
    background-color: #fff;

    &.b-top {
      margin-top: 8px;
    }

    .b-item {
      width: 100%;

      &:last-child > a {
        border-bottom: none
      }

      > a {
        position: relative;
        display: block;
        padding: 15px;
        width: 100%;
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

        .s-text {
          font-size: 15px;
          color: #333;
        }

        .s-right {
          font-size: 15px;
          color: #999;

          .text {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
};
</style>
