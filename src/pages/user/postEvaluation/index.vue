<template>
  <div class="postEvaluation">
    <div class="postEvaluationList">
      <div class="anyOnePostEavluation" v-for="(data,index) in goodsList" :key="index">
        <div class="evaluationDescription">
          <div class="evaluationDescriptionImg">
            <img :src="data.goodPic" alt="">
          </div>
          <div class="evaluationDescriptionNum" style="margin-left:0;">
            <span>描述相符</span>
          </div>
          <div class="evaluationDescriptionRate">
              <van-rate
              v-model="form.describeStar"
              :size="25"
              color="#ea3323"
              void-icon="star"
              void-color="#eee"/>
          </div>
          <div class="evaluationDescriptionNum" style="margin-right:0;">
            <span>{{showText(form.describeStar)}}</span>
          </div>
        </div>
        <div class="evaluationTextAndPhoto">
          <div class="evaluationText">
            <van-field
              v-model="form.content"
              type="textarea"
              placeholder="请您对我们的商品做评价..."
              rows="1"
              autosize/>
          </div>
          <div class="evaluationPhoto">
            <!-- <div class="imgBox" v-for="(data,aIndex) in postList[index].pics" :key="aIndex">
              <img :src="photoList[index][aIndex].url" alt="">
            </div>
            <van-uploader :name="data.goodId" :after-read="onRead">
              <div class="addImgBtn" v-show="postList[index].pics.length !== 3">
                <img src="@/assets/photo.png" alt="">
                <p>{{postList[index].pics.length}} / 3</p>
              </div>
            </van-uploader> -->
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
        <div class="anonymousEvaluation">
          <div class="secletBtn" @click="selcetStatus(index)">
            <img src="@/assets/noChosen.png" alt="" v-show="form.anonymous === 'no'">
            <img src="@/assets/chosen.png" alt="" v-show="form.anonymous === 'yes'">
          </div>
          <div class="secletText">匿名评价</div>
        </div>
      </div>
    </div>
    <div class="postEvaluationBtn">
      <div class="btn" @click="PutComment()">发表</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import Models from '@/models';
import { Field , Rate , Uploader , Toast } from 'vant';
import qs from "qs";
import { resolve } from 'url';
Vue.use(Field).use(Rate).use(Uploader).use(Toast)
export default {
  name:"postEvaluation",
  data () {
    return {
      goodsList:[],
      postList:[],
      photoList:[],
      starNum:5,
      message:"",

      fileList: [],
      form: {
        goodId: '',
        skuId: '',
        describeStar: 5,
        content: '',
        anonymous: 'yes',
        pics: []
      }
    }
  },
  methods:{
    //根据星星数来显示文本
    showText (num) {
      let text = "";
      switch (num){
        case 1:text = '差';
          break ;
        case 2:text = '较差';
          break;
        case 3:text = '一般';
          break;
        case 4:text = '好';
          break;
        case 5:text = '非常好';
          break;
       }
       return text;
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
          if (res.data.code === '0') {
            this.form.pics.push(res.data.info.imageId)
            resolve(res.data.info.imageId)
          }
        })
      })
    },
    //获取订单详情
    getOrderDetail () {
      let data = {
        id:this.$route.query.id,
      };
      Models.User
      .orderDetail(data)
      .then(res => {
        if (res.data.code === '0') {
          this.goodsList = res.data.info.goods;
          for ( let i = 0; i < this.goodsList.length; i++ ) {
            this.form.goodId = this.goodsList[i].goodId
            this.form.skuId = this.goodsList[i].skuId
          }
        }
      })
    },

    //选择是不是匿名
    selcetStatus (index) {
      this.form.anonymous = this.form.anonymous === "no" ? "yes" : "no";
    },

    //发表评价
    async PutComment () {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '正在发表...'
      });
      if (this.fileList.length === 1) {
        this.upImgLoad(this.fileList[0])
        .then(val => {
          this.publish()
        })
      }else if (this.fileList.length === 2) {
        this.upImgLoad(this.fileList[0])
        .then(val => {
          this.upImgLoad(this.fileList[1])
          .then(val => {
            this.publish()
          })
        })
      }else if (this.fileList.length === 3) {
        this.upImgLoad(this.fileList[0])
        .then(val => {
          this.upImgLoad(this.fileList[1])
          .then(val => {
            this.upImgLoad(this.fileList[2])
            .then(res => {
              this.publish()
            })
          })
        })
      }else {
        this.publish()
      }
    },
    //发表
    publish () {
      let arr = []
      arr.push(this.form)
      let data = {
        orderId:this.$route.query.id,
        goods: arr,
      };
      Models.User
      .addComment(data)
      .then(res => {
        this.bus.$emit('getLoading', {loading: false});
        if(res.data.code === '0') {
          Toast('发表成功');
          this.$router.push('/allOrders');
        }else {
          Toast(res.data.msg);
        }
      })
    }
  },
  created () {
    this.getOrderDetail();
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.postEvaluation {
  width: 100%;

  .postEvaluationList {
    // margin-top: 45px;
    width:100%;

    .anyOnePostEavluation {
      width: 100%;
      height: auto;
      background-color: #fff;

      .evaluationDescription {
        width:100%;
        display:flex;
        display:-webkit-flex;
        padding:15px;
        border-bottom:1px solid #EAEAEA;

        .evaluationDescriptionImg {
          margin-right: 16px;
          width: 50px;
          height: 50px;

          img {
            width: 50px;
            height: 50px;
          }
        }

        span {
          vertical-align: text-bottom;
          color: #333333;
          font-size: 15px;
        }

        .evaluationDescriptionNum {
          height: 50px;
          line-height: 50px;
          margin: 0 10px;
        }

        .evaluationDescriptionRate {
          width:auto;
          height: 50px;
          font-size: 15px;
          padding-top: 11px;
          color:#333333;
        }
      }

      .evaluationTextAndPhoto {
        width:100%;
        height:auto;
        padding: 15px;
        border-bottom:1px solid #eaeaee;

        .evaluationText {
          width:100%;
          height:auto;
          color: #333333;
          font-size: 15px;
          min-height: 55px;
          padding-bottom: 15px;

          &>div {
            padding: 0;
          }
        }

        .evaluationPhoto {
          width:100%;
          height:auto;
          display:flex;
          display:-webkit-flex;

          .imgBox {
            width: 80px;
            height: 80px;
            margin-right: 16px;

            &:last-child {
              margin: 0;
            }

            img {
              width: 80px;
              height: 80px;
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

      .anonymousEvaluation {
        width: 100%;
        height: auto;
        padding: 15px;
        display: flex;
        display: -webkit-flex;

        .secletBtn {
          width: 22px;
          height: 22px;
        }

        .secletText {
          margin-left: 9px;
          color:#333333;
          font-size: 12px;
          height: 22px;
          line-height:22px;
        }
      }
    }
  }

  .postEvaluationBtn {
    padding: 0 15px;
    width: 100%;

    .btn {
      padding: 10px 0;
      margin-top: 20px;
      width: 100%;
      font-size: 15px;
      text-align: center;
      background-color:#EA3323;
      color: #fff;
      border-radius: 4px;
    }
  }
}
</style>
