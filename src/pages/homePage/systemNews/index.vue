<template>
  <div class="systemNews-page" >
    <div class="systemNews" v-if="noticeDesc !== null">
      <h3>{{ noticeDesc.msgTitle }}</h3>
      <div class="time">{{ noticeDesc.createTime | timeStampFilter('yy/mm/dd') }}</div>
      <!-- <div class="title">{{ noticeDesc.msgDesc }}</div> -->
      <div class="content">{{ noticeDesc.msgContent }}</div>
      <div class="img">
        <img :src="noticeDesc.messagePic" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'systemNews',
  data() {
    return {
      noticeDesc: JSON.parse(sessionStorage.getItem('noticeDesc'))
    };
  },
  watch: {

  },

  methods: {

  },

  computed: {

  },
  created() {

  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.systemNews-page {
  width: 100%;

  .systemNews {
    padding: 25px 15px;
    width: 100%;

    h3 {
      font-size: 21px;
      font-weight: bold;
      text-align: center;
      color: #333;
    }

    .time {
      margin-top: 10px;
      font-size: 14px;
      text-align: center;
      color: #999;
    }

    .title {
      margin-top: 15px;
      font-size: 15px;
      font-weight: bold;
    }

    .content {
      margin-top: 10px;
      font-size: 12px;
      color: #666;
    }

    .img {
      margin-top: 15px;
      width: 100%;

      > img {
        width: 100%;
      }
    }
  }
}
</style>
