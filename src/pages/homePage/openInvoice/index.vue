<template>
  <div class="openInvoice-page">
    <div class="bill">
      <h6 class="h6">选择发票类型</h6>
      <div class="type-box">
        <van-radio-group v-model="billRadio">
          <van-radio name="1" checked-color="#EA3323">不开发票</van-radio>
          <van-radio name="2" checked-color="#EA3323">纸质发票</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="bill no-p" v-if="billRadio == '2'">
      <h6 class="h6">选择发票类型</h6>
      <div class="type-box">
        <van-radio-group v-model="ytype">
          <van-radio name="2" checked-color="#EA3323">个人</van-radio>
          <van-radio name="1" checked-color="#EA3323">公司</van-radio>
        </van-radio-group>
      </div>
      <div class="rise" v-if="ytype == '2'">
        <span>发票抬头</span>
        <input type="text" placeholder="请输入发票抬头，如个人" v-model="invoiceTitle">
      </div>
      <div class="rise" v-if="ytype == '1'">
        <span>发票抬头</span>
        <input type="text" placeholder="请输入发票抬头" v-model="invoiceTitle">
      </div>
      <div class="rise" v-if="ytype == '1'">
        <span>税号</span>
        <input type="text" placeholder="请输入纳税人识别号" v-model="taxNumber">
      </div>
    </div>
    <div class="explain" v-if="billRadio == '2'">
      <div class="e-tit">
        <span>发票内容</span>
        <span>商品明细</span>
      </div>
      <div class="e-desc">电子发票与纸质发票具备同等法律效力，可作为用户维权、保修的有效凭证</div>
    </div>
    <div class="determine" @click="confirm">确定</div>
  </div>
</template>

<script>
import Vue from 'vue'
import Models from "@/models"
import { RadioGroup, Radio, Toast } from 'vant';
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Toast);
export default {
  name: 'openInvoice',
  data() {
    return {
      billRadio: '1',
      ytype: '1',

      invoiceId: '0',
      invoiceTitle: '',
      taxNumber: '',
      remark: '商品明细',
    };
  },
  watch: {

  },
  methods: {
    init() {
      let data = {
        id: this.invoiceId
      }
      Models.Home
      .getOneInvoice(data)
      .then(res => {
        if(res.data.code == '0') {
          this.ytype = res.data.info.ytype
          this.invoiceTitle = res.data.info.invoiceTitle
          this.taxNumber = res.data.info.taxNumber
        }
      })
    },
    confirm() {
      if(this.billRadio == '2') {
        if(this.ytype == '1') {
          if(this.invoiceTitle == '') {
            Toast('请输入发票抬头')
            return
          }else if(this.taxNumber == '') {
            Toast('请输入纳税人识别号')
            return
          }
        }
        if(this.ytype == '2') {
          if(this.invoiceTitle == '') {
            Toast('请输入发票抬头，如个人')
            return
          }
        }
        let data = {
          ytype: this.ytype,
          invoiceId: this.invoiceId,
          invoiceTitle: this.invoiceTitle,
          taxNumber: this.taxNumber,
          remark: this.remark,
        }
        Models.Home
        .addInvoice(data)
        .then(res => {
          if(res.data.code == '0') {
            sessionStorage.setItem('invoiceId', res.data.info.invoiceId)
            this.$router.go(-1)
          }
        })
      }else if(this.billRadio == '1') {
        sessionStorage.setItem('invoiceId', '0')
        this.$router.go(-1)
      }
    },
  },
  computed: {

  },
  created() {
    this.invoiceId = this.$route.query.invoiceId
    if(this.invoiceId != '0') {
      this.billRadio = '2'
    }
    sessionStorage.setItem('number', this.$route.query.number)
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style lang="less">
.openInvoice-page {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .bill {
    padding: 15px;
    margin-bottom: 10px;
    width: 100%;
    background-color: #fff;

    &.no-p {
      padding-bottom: 0;
    }

    .h6 {
      font-size: 15px;
      color: #333;
    }

    .type-box {
      margin-top: 15px;
      width: 100%;
      font-size: 15px;
      color: #666;

      .van-radio-group {
        display: flex;
        justify-content: space-between;

        .van-radio {
          margin-right: 40px;
          width: 110px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .rise {
      padding: 15px 0;
      width: 100%;
      font-size: 15px;
      color: #333;
      border-bottom: 1px solid #EAEAEA;
      display: flex;
      justify-content: space-between;

      &:last-child {
        border-bottom: none;
      }

      > input {
        padding: 0 10px;
        width: 200px;
        height: 100%;
        font-size: 14px;
        color: #333;
        text-align: right;
      }
    }
  }

  .explain {
    width: 100%;
    background-color: #fff;

    .e-tit {
      padding: 15px;
      padding-right: 25px;
      width: 100%;
      font-size: 15px;
      color: #333;
      border-bottom: 1px solid #EAEAEA;
      display: flex;
      justify-content: space-between;
    }

    .e-desc {
      padding: 15px;
      width: 100%;
      font-size: 12px;
      color: #999;
    }
  }

  .determine {
    padding: 15px 0;
    margin: 40px auto;
    width: 90%;
    font-size: 15px;
    text-align: center;
    color: #fff;
    background-color: #EA3323;
    border-radius: 4px;
  }
};
</style>
