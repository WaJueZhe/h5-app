<template>
  <div class="businessCode-page">
    <div class="businessCode">
      <div class="img-box">
        <img :src="imngUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Models from '@/models'
export default {
  name: 'businessCode',
  data() {
    return {
      imngUrl: ''
    };
  },
  watch: {

  },
  methods: {
    init() {
      let data = {
        goodId: '',
        type: 'depoint',
        cat: 'all'
      }
      Models.User
      .getQRcode(data)
      .then(res => {
        if(res.data.code == '0') {
          this.imngUrl = res.data.info.codePicList[0]
        }
      })
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.businessCode-page {
  width: 100%;

  .businessCode {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #424242;
    display: flex;
    align-items: center;

    .img-box {
      margin: auto;
      width: 312px;
      height: 407px;
      background-color: #fff;
      border-radius: 6px;
    }
  }
};
</style>
