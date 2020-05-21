<template>
  <div class="activityRules-page">
    <div class="rules" v-if="activityRule !== ''">
      <h3>{{ activityTitle }}</h3>
      <div class="desc">
        <pre>{{ activityRule }}</pre>
      </div>
    </div>
    <div class="no-info" v-else>暂无活动规则</div>
  </div>
</template>

<script>
import Models from '@/models';
export default {
  name: 'activityRules',
  data() {
    return {
      activityId: '',//活动id:没有填0,优先级大于code
      zoneCode: '0',//分区code没有填0
      activityTitle: '',
      activityRule: '',
    };
   },
   watch: {

   },
   methods: {
     //获取用户签到列表
    init () {
      if (this.activityId === undefined) {
        this.activityId = '0'
      }else if (this.zoneCode === '' || this.zoneCode === undefined) {
        this.zoneCode = '0'
      }
      let data = {
        id: this.activityId,
        zoneCode: this.zoneCode,
      }
      Models.Home
      .getRule(data)
      .then(res => {
        if (res.data.code === '0') {
          this.activityTitle = res.data.info.title
          this.activityRule = res.data.info.rules
        }
      })
    },
   },
   computed: {

   },
   created() {
     this.activityId = this.$route.query.activityId
     this.zoneCode = this.$route.query.zoneCode
     this.init()
   },
   mounted() {

   },
   components: {

   },
};
</script>

<style scoped lang="less">
.activityRules-page {
  width: 100%;

  .rules {
    padding: 31px 16px;
    width: 100%;

    h3 {
      margin-bottom: 25px;
      font-size: 16px;
    }

    .desc {
      margin-bottom: 20px;
      font-size: 15px;
      color: #666;

      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.5;
      }
    }
  }

  .no-info {
    width: 100%;
    font-size: 18px;
    text-align: center;
  }
};
</style>
