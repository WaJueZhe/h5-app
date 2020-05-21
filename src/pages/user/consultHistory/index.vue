<template>
  <div class="consultHistory-page">
    <div class="consultHistory" v-if="list.length > 0">
      <ul class="list">
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="user-info">
            <div class="user-headPic" v-if="item.indexPic !== ''">
              <img :src="item.indexPic" alt="">
            </div>
            <div class="user-headPic" v-if="item.headImagePic !== ''">
              <img :src="item.headImagePic" alt="">
            </div>
            <div class="msg">
              <div class="box">
                <div class="name">{{ item.userName }}</div>
                <div class="time">{{ item.createTime | timeStampFilter('yy-mm-dd h：m：s') }}</div>
              </div>
            </div>
          </div>
          <div class="desc">{{ item.refundContent }}</div>
        </li>
      </ul>
    </div>
    <div class="noOrder" v-show="noOrder">
      <img src="@/assets/homePage/defaultpage_icon.png" alt="">
    </div>
  </div>
</template>

<script>
import Models from '@/models';
export default {
  name: 'consultHistory',
  data() {
    return {
      refundId: '',//售后订单id
      list: [],
      noOrder: false
    };
  },
  watch: {

  },
  methods: {
    init () {
      let data = {
        id: this.refundId
      }
      Models.User
      .refundHistory(data)
      .then(res => {
        if(res.data.code === '0') {
          this.list = res.data.info.list
          if (this.list.length == 0) {
            this.noOrder = true;
          }
        }
      })
    }
  },
  computed: {

  },
  created() {
    this.refundId = this.$route.query.refundId
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.consultHistory-page {
  width: 100%;

  .consultHistory {
    width: 100%;

    .list {
      width: 100%;

      .item {
        padding: 19px 15px;
        margin-bottom: 8px;
        width: 100%;
        background-color: #fff;

        &:last-child {
          margin-bottom: 0;
        }

        .user-info {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;

          .user-headPic {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;

            > img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .msg {
            flex: 1;
            display: flex;
            align-items: center;
            overflow: hidden;

            .box {
              padding-left: 7px;
              width: 100%;

              .name {
                margin-bottom: 4px;
                font-size: 14px;
                line-height: 1;
                color: #333;
              }

              .time {
                font-size: 12px;
                line-height: 1;
                color: #999;
              }
            }
          }
        }

        .desc {
          margin-top: 10px;
          font-size: 13px;
          color: #333;
        }
      }
    }
  }

  .noOrder {
    position: fixed;
    width: 100%;
    height: 100%;

    > img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 227px;
    }
  }
};
</style>
