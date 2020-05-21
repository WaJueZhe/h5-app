<template>
  <div class="requestARefund">
    <div class="ordersList" >
      <div class="ordersContent">
        <div class="productList">
          <ul>
            <li v-for="(data,index) in good " :key="index">
              <div class="productImg">
                <img :src="data.goodPic" alt="">
              </div>
              <div class="productContent">
                <p class="productName">{{data.goodTitle}}</p>
                <p class="productStyle">
                  <span v-for="(aData,aIndex) in data.skuAttrs" :key="aIndex">{{aData.name}}:{{aData.value}}</span>
                </p>
                <p class="productMenoy">数量: {{data.goodNum}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="statusAndReason">
      <div class="status" v-if="afterSaleStatus == 1">
        <div class="title">货物状态</div>
        <div class="content" @click="goodsStatus = true;">
          <div class="content-box">
            <span v-if="goodsStatusText === '请选择货物状态'" style="color: #999">{{goodsStatusText}}</span>
            <span v-else>{{goodsStatusText}}</span>
            <div class="test-icon">
              <van-icon name="arrow" size="15px" color="#999999"/>
            </div>
          </div>
        </div>
      </div>
      <div class="reason">
        <div class="title">退款原因</div>
        <div class="content" @click="selectReson">
          <div class="content-box">
            <span v-if="refundWishText === '请选择退款原因'" style="color: #999">{{refundWishText}}</span>
            <span v-else>{{refundWishText}}</span>
            <div class="test-icon">
              <van-icon name="arrow" size="15px" color="#999999"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="amount">
      <div class="amountTitle">退款金额</div>
      <div class="amountNum">
        <div>
          <span>￥</span>
          <input type="number" v-model="amount" @blur="blurChange">
        </div>
      </div>
      <div class="maxNum">最多￥{{maxNuma}}</div>
    </div>
    <div class="description">
      <div class="descriptionTitle">退款说明</div>
      <div class="descriptioninput">
      <van-field
        v-model="refundRemark"
        type="textarea"
        placeholder="选填"
        rows="1"
        autosize/>
      </div>
    </div>
    <div class="uploaderImg">
      <div class="uploaderImgTitle">
        上传凭证
      </div>
      <div class="evaluationPhoto">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="3">
          <div class="addImgBtn" v-show="fileList.length !== 3">
            <img src="@/assets/photo.png" alt="">
            <p>{{fileList.length}} / 3</p>
          </div>
          </van-uploader>
      </div>
    </div>
    <div class="postData" @click="postData()">提交</div>
    <van-popup v-model="goodsStatus" position="bottom" :overlay="true">
      <div class="popupTitle">货物状态</div>
      <div class="radioDiv">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell title="未收到货" clickable @click="tabRadio('1')">
              <van-radio checked-color="#EA3323" name="1" />
            </van-cell>
            <van-cell title="已收到货" clickable @click="tabRadio('2')">
              <van-radio checked-color="#EA3323" name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="offPopup" @click="goodsStatus = false">关闭</div>
    </van-popup>
    <van-popup v-model="refundWish" position="bottom" :overlay="true">
      <div class="popupTitle">退款原因</div>
      <div class="radioDiv">
        <van-radio-group v-model="refundReason" >
          <van-cell-group>
            <van-cell :title="data.refundReason" clickable @click="tabReasonText(data.id, data.refundReason)" v-for="(data,index) in nowReasonList" :key="index">
              <van-radio checked-color="#EA3323" :name="data.id" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="offPopup" @click="refundWish = false">关闭</div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue';
import qs from "qs";
import Models from '@/models';
import { Uploader, Field, Icon, Popup ,Cell, CellGroup, RadioGroup, Radio, Toast, Lazyload } from 'vant';
import { resolve } from 'url';
import { join } from 'path';
Vue.use(Uploader).use(Field).use(Icon).use(Popup).use(Cell).use(Toast).use(CellGroup).use(RadioGroup).use(Radio).use(Lazyload);
export default {
  name:"requestARefund",
  data () {
    return {
      radio:"",
      goodsStatusText:"请选择货物状态",
      refundWishText:"请选择退款原因",
      goodsStatus:false,
      refundWish:false,
      postList:[],
      refundRemark:"",//退款说明
      good:[],
      maxNuma:"",
      amount:"",
      refundId:0,
      reasonList:[],
      nowReasonList:[],//退款原因数组
      refundReason:"",//退款原因
      afterSaleStatus:"",//'售后类型 1：退款  2：仅换货 3：退货退款',
      statusType: '',//售后订单.0为新单,大于0为编辑
      statusReason: '',//退款原因列表
      fileList: [],//上传凭证
    }
  },
  watch:{
    amount(newVal, oldVal) {
      if (newVal >= this.maxNuma) {
        this.amount = this.maxNuma || newVal
      }
    },
    radio (newVal, oldVal) {
      if (newVal === '1') {
        this.reason(1)
      }else if (newVal === '2') {
        this.reason(2)
      }
    }
  },
  methods:{
    blurChange () {
      if (this.amount !== '' && this.amount > 0) {
        this.amount = parseFloat(this.amount).toFixed(2)
      }
    },
    tabReasonText (num,text) {
      this.refundReason = num;
      this.refundWishText = text;
      this.refundWish = false;
    },
    tabRadio (num) {
      this.radio = num;
      this.goodsStatus = false;
      this.refundReason = "";
      this.refundWishText = "请选择退款原因";
      if ( this.radio === "1" ) {
        this.goodsStatusText = "未收到货";
      }else {
        this.goodsStatusText = "已收到货";
      }
    },
    //选择货物状态
    selectReson () {
      if (this.radio === '' && this.afterSaleStatus != 3) {
        Toast('请先选择货物状态')
        return
      }else {
        this.refundWish = true
      }
    },
    //获取售后原因列表
    reason (id) {
      let data = {
        id: id,
      }
      Models.User
      .getReason(data)
      .then(res => {
        if ( res.data.code == 0 ) {
          this.nowReasonList = res.data.info.list;
        }
      })
    },
    //点击提交
    postData () {
      let imageArr = []
      let newApplyPics = ''
      if(this.afterSaleStatus == 1 && this.goodsStatusText == '请选择货物状态') {
        Toast('请选择货物状态')
        return
      }else if(this.refundWishText == '请选择退款原因') {
        Toast('请选择退款原因')
        return
      }else if (this.amount === '') {
        Toast('请填写退款金额')
        return
      }else if (this.amount == 0 ) {
        Toast('退款金额不能等于0')
        return
      }
      this.bus.$emit('getLoading', {
        loading: true,
        text: '正在发表...'
      });
      if (this.fileList.length === 1) {
        if (this.fileList[0].imageId === undefined) {
          this.upImgLoad(this.fileList[0])
          .then(val => {
            imageArr.push(val)
            newApplyPics = imageArr.join(',')
            this.publish(newApplyPics)
          })
        }else if (this.fileList[0].imageId !== undefined) {
          imageArr.push(this.fileList[0].imageId)
          newApplyPics = imageArr.join(',')
          this.publish(newApplyPics)
        }
      }else if (this.fileList.length === 2) {
        if (this.fileList[0].imageId === undefined) {
          this.upImgLoad(this.fileList[0])
          .then(val => {
            imageArr.push(val)
            this.upImgLoad(this.fileList[1])
            .then(val => {
              imageArr.push(val)
              newApplyPics = imageArr.join(',')
              this.publish(newApplyPics)
            })
          })
        }else if (this.fileList[0].imageId !== undefined) {
          imageArr.push(this.fileList[0].imageId)
          if (this.fileList[1].imageId === undefined) {
            this.upImgLoad(this.fileList[1])
            .then(val => {
              imageArr.push(val)
              newApplyPics = imageArr.join(',')
              this.publish(newApplyPics)
            })
          }else if (this.fileList[1].imageId !== undefined) {
            imageArr.push(this.fileList[1].imageId)
            newApplyPics = imageArr.join(',')
            this.publish(newApplyPics)
          }
        }
      }else if (this.fileList.length === 3) {
        if (this.fileList[0].imageId === undefined) {
          this.upImgLoad(this.fileList[0])
          .then(val => {
            imageArr.push(val)
            this.upImgLoad(this.fileList[1])
            .then(val => {
              imageArr.push(val)
              this.upImgLoad(this.fileList[2])
              .then(val => {
                imageArr.push(val)
                newApplyPics = imageArr.join(',')
                this.publish(newApplyPics)
              })
            })
          })
        }else if (this.fileList[0].imageId !== undefined) {
          imageArr.push(this.fileList[0].imageId)
          if (this.fileList[1].imageId === undefined) {
            this.upImgLoad(this.fileList[1])
            .then(val => {
              imageArr.push(val)
              this.upImgLoad(this.fileList[2])
              .then(val => {
                imageArr.push(val)
                newApplyPics = imageArr.join(',')
                this.publish(newApplyPics)
              })
            })
          }else if (this.fileList[1].imageId !== undefined) {
            imageArr.push(this.fileList[1].imageId)
            if (this.fileList[2].imageId === undefined) {
              this.upImgLoad(this.fileList[2])
              .then(val => {
                imageArr.push(val)
                newApplyPics = imageArr.join(',')
                this.publish(newApplyPics)
              })
            }else if (this.fileList[2].imageId !== undefined) {
              imageArr.push(this.fileList[2].imageId)
              newApplyPics = imageArr.join(',')
              this.publish(newApplyPics)
            }
          }
        }
      }else {
        this.publish(newApplyPics)
      }
    },
    //提交的数据
    publish (newApplyPics) {
      if(this.afterSaleStatus == 3) {//'售后类型 1：退款  2：仅换货 3：退货退款',
        this.radio = this.afterSaleStatus
      }
      let data = {
        refundId: this.statusType == 1 ? 0 : this.$route.query.refundId,
        orderId: this.$route.query.id,
        skuId: this.good[0].skuId,
        amount: this.amount,//退款金额
        refundType: this.afterSaleStatus,//'售后类型 1：退款  2：仅换货 3：退货退款',
        refundPicListId: newApplyPics,//凭证图片
        refundReason: this.refundWishText,//退款原因
        refundRemark: this.refundRemark,//退款说明
        goodsStatus: this.radio,//货物状态   1-未收到货 2-已收到货
        refundExpressId: 0,//退款物流ID默认:0
      };
      if(this.statusType == 1) {//添加售后订单
        Models.User
        .refundSave(data)
        .then(res => {
          if ( res.data.code === '0' ) {
            this.bus.$emit('getLoading', {loading: false});
            Toast("提交成功");
            this.$router.replace({
              name: 'refundDetail',
              query: {
                refundId: res.data.info.refundId,
                status: this.$route.query.status
              }
            })
          }else {
            Toast( res.data.msg );
          }
        })
      }else {//修改售后订单
        Models.User
        .refundUpdate(data)
        .then(res => {
          if ( res.data.code === '0' ) {
            this.bus.$emit('getLoading', {loading: false});
            Toast("修改成功");
            this.$router.replace({
              name: 'refundDetail',
              query: {
                refundId: res.data.info.refundId,
                status: this.$route.query.status
              }
            })
          }else {
            Toast( res.data.msg );
          }
        })
      }
    },

    //上传图片
    upImgLoad (file) {
      return new Promise(resolve => {
        let formData = new FormData();
        let sessionId = window.localStorage.getItem('sessionId');
        let data = JSON.stringify({
          sessionId: sessionId,
          requestId: '',
          sign: '',
          info: {
            fileType:"image",
            useType:"All"
          }
        });
        formData.append("file",file.file);
        formData.append("data",data);

        Models.User
        .upLoad(formData)
        .then(res => {
          if ( res.data.code === '0' ) {
            resolve(res.data.info.imageId)
          }
        })
      })
    },
    //获取订单详情
    getOrderDetail (id) {
      let data = {
        id:this.$route.query.id,
      };
      Models.User
      .orderDetail(data)
      .then(res => {
        if ( res.data.code == 0 ) {
          this.good = res.data.info.goods;
          this.maxNuma = Number(res.data.info.refundSimpleBo.maxAccount);
          this.amount = this.maxNuma

          if (this.statusType != 1) {
            let modifyInfo = JSON.parse(sessionStorage.getItem('modifyInfo'))
            if (modifyInfo != null) {
              this.refundRemark = modifyInfo.refundRemark
              this.amount = modifyInfo.amount
              this.radio = modifyInfo.goodsStatus
              if(modifyInfo.goodsStatus === '1') {
                this.goodsStatusText = "未收到货";
              }else {
                this.goodsStatusText = "已收到货";
              }
              this.refundWishText = modifyInfo.refundReason
              for(let i = 0; i < this.nowReasonList.length; i++) {
                if(modifyInfo.refundReason == this.nowReasonList[i].refundReason) {
                  this.refundReason = this.nowReasonList[i].id
                }
              }
              let arr = []
              Object.keys(modifyInfo.refundPicListMap).forEach((key) => {
                let obj = {
                  imageId: '',
                  url: '',
                }
                obj.imageId = key,
                obj.url = modifyInfo.refundPicListMap[key]
                arr.push(obj)
              });
              this.fileList = arr
            }
          }
        }
      })
    },
    getFloat (num) {
      let str = parseFloat(num).toFixed(2);
      let arr = str.split(".");
      return Number(`${arr[0]}${arr[1]}`);
    },
  },

  created () {
    this.afterSaleStatus = this.$route.query.status;//'售后类型 1：退款  2：仅换货 3：退货退款',
    this.statusType = this.$route.query.statusType;//售后订单.0为新单,大于0为编辑
    this.getOrderDetail();
    if (this.afterSaleStatus == 3) {
      this.reason(2);
    }
  },
  activated() {

  },
  mounted () {

  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.requestARefund {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  .ordersList {
    width: 100%;
    position:relative;
    margin-bottom: 8px;

    .ordersContent {
      width: 100%;
      height: auto;
      background:rgba(255,255,255,1);

      .productList {
        width: 100%;
        height: auto;
        padding:16px 15px;

        li {
          width: 100%;
          height: auto;
          display: flex;
          margin-bottom: 28px;
          display: -webkit-flex;

          &:last-child {
            margin-bottom: 0;
          }

          div {
            -webkit-box-flex: 1;

            &.productImg {
              flex-basis: 88px;
              flex-shrink:0;
              height: 88px;
              margin-right: 16px;

              img {
                width: 88px;
                height: 88px;
              }
            }

            &.productContent {

              p.productName {
                font-size: 12px;
                color:#333333;
                margin-bottom: 6px;
              }

              p.productStyle {
                font-size: 12px;
                color:#999999;
                margin-bottom: 6px;
              }

              p.productMenoy {
                font-size: 12px;
                color: #999999;
              }
            }
          }
        }
      }

      .productNum {
        width: 100%;
        padding:0 16px 16px;
        text-align: right;
        border-bottom:1px solid #EAEAEA;
      }

      .operationButton {
        width: 100%;
        height: 64px;
        padding:14px 16px 0;
        text-align: right;

        button {
          width:80px;
          height:30px;
          border:none;
          font-size: 14px;
          vertical-align: middle;
          border-radius:30px;
          background-color: #ffffff;

          &.deleteBtn {
            color:#999999;
            border:1px solid #999999;
          }

          &.redBtn {
            color:#EA3323;
            border:1px solid #EA3323;
          }
        }
      }
    }
  }

  .statusAndReason {
    width:100%;
    height:auto;
    padding-left: 15px;
    background:#ffffff;
    margin-bottom: 8px;

    >div {
      width: 100%;
      height:44px;
      display: flex;
      display: -webkit-flex;
      font-size: 15px;


      &:first-child {
        height: 45px;
        border-bottom: 1px solid #eaeaea;
      }

      .title {
        color:#333333;
        line-height:44px;
        flex-basis: 78px;
        flex-shrink: 0;
      }

      .content {
        width: 100%;
        height: auto;
        padding-right: 15px;
        font-size: 15px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        color:#333;

        .content-box {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          display: -webkit-flex;
          align-items: center;

          > span {
            margin-right: 8px;
          }

          .test-icon {
            padding-top: 4px;
          }
        }
      }
    }
  }

  .amount {
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: flex;
    display: -webkit-flex;
    margin-bottom: 8px;
    padding: 0 15px;
    background:#ffffff;

    >div {
      -webkit-box-flex: 1;
    }

    .amountTitle {
      font-size: 15px;
      color:#333333;
      flex-basis: 78px;
      flex-shrink: 0;
    }

    .amountNum {
      flex-basis: 160px;
      flex-shrink: 0;
      color: #EA3323;
      font-size: 15px;

      &>div {
        width: 100%;
        overflow: hidden;

        &>span {
          float: left;
          width: 20px;
        }

        &>input {
          vertical-align: middle;
          line-height: 0;
          width: 100px;
          margin-top: 11px;
          height: 20px;
          float: left;
        }
      }
    }

    .maxNum {
      width: 100%;
      color:#999999;
      font-size: 13px;
      text-align: right;
    }
  }

  .description {
    width: 100%;
    height:auto;
    min-height: 44px;
    display: flex;
    display: -webkit-flex;
    margin-bottom: 8px;
    border-radius: 0!important;
    padding: 0 15px;
    background:#ffffff;

    .descriptionTitle {
      font-size: 15px;
      color:#333333;
      height:44px;
      text-align: left;
      line-height:44px;
      flex-basis: 78px;
      flex-shrink: 0;
    }

    .descriptioninput {
      width: 100%;
      height:auto;
      color:#999999;
      font-size: 15px;
      line-height:44px;

      >div {
        padding: 10px 0;
      }
    }
  }

  .uploaderImg {
    width: 100%;
    height:auto;
    padding: 15px;
    margin-bottom: 49px;
    background:#ffffff;


    .uploaderImgTitle {
      width: 100%;
      height:auto;
      color: #333333;
      font-size: 15px;
      margin-bottom: 19px;
    }

    .evaluationPhoto {
      width:100%;
      display:flex;
      display:-webkit-flex;

      .imgBox {
        width: 80px;
        height: 80px;
        margin-right: 16px;
        overflow: hidden;

        &:last-child {
          margin-right: 0;
        }

        img {
          width: 80px;
        }
      }

      .addImgBtn {
        width: 80px;
        height: 80px;
        border:1px dashed #B0B0B0;

        img {
          width: 22px;
          height: auto;
          margin: 18px auto 16px;
        }

        p {
          text-align: center;
          font-size: 12px;
          color:#999999;
        }
      }
    }
  }

  .postData {
    position: fixed;
    bottom:0;
    height: 49px;
    line-height: 49px;
    width:100%;
    text-align: center;
    font-size: 16px;
    color:#ffffff;
    background: -webkit-linear-gradient(left,  #EA3323 , #EA2360 ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323 , #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323 , #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360) ; /* 标准的语法 */
  }

  .popupTitle {
    width:100%;
    padding: 25px 0;
    text-align: center;
    font-size: 16px;
    color: #333333;
  }

  .radioDiv {
    padding-bottom: 49px;
    width:100%;
    min-height:274px;
    max-height:374px;
    overflow: auto;

    .van-radio-group {
      .van-cell-group {
        .van-cell {
          .van-cell__title {
            flex: 1;
          }
          .van-cell__value {
            flex: inherit;
            float: right;
            width: 20px;
          }
        }
      }
    }
  }

  .offPopup {
    font-size: 16px;
    position: fixed;
    width: 100%;
    height:49px;
    bottom:0;
    text-align: center;
    line-height:49px;
    color:#ffffff;
    background: -webkit-linear-gradient(left,  #EA3323 , #EA2360 ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #EA3323 , #EA2360); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #EA3323 , #EA2360); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EA3323 , #EA2360) ; /* 标准的语法 */
  }
}
</style>


