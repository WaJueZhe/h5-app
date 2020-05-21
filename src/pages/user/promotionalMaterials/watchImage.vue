<template>
  <div class="watchImage-page">
    <img :src="imgUrl" alt="">
  </div>
</template>

<script>
import Models from '@/models'
export default {
  name: 'watchImage',
  data() {
    return {
      uid: '',
      imgUrl: '',
    };
  },
  watch: {

  },
  methods: {
    init () {
      this.bus.$emit('getLoading', {
        loading: true,
        text: '加载中...'
      })
      let data = {
        uid: this.uid,
      }
      Models.User
      .getMarketcode(data)
      .then(res => {
        if (res.data.code == '0') {
          this.imgUrl = res.data.info.codePicList[0]
          this.bus.$emit('getLoading', {loading: false})
        }
      })
    }
  },
  computed: {

  },
  created() {
    this.uid = this.$route.query.marketDocId
    this.init()
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.watchImage-page {
  width: 100%;

  > img {
    width: 100%;
  }
};
</style>
