<template>
  <div class="myWorkOrder">
    <div class="searchDiv">
      <input type="text" placeholder="请输入工单号">
    </div>
      <div class="workOrderList">
        <div class="anyoneWorkOrder">
          <div class="anyoneWorkOrderRow">
            <div class="anyoneWorkOrderTitle">编号</div>
            <div class="anyoneWorkOrderContent">5524669113</div>
          </div>
          <div class="anyoneWorkOrderRow">
            <div class="anyoneWorkOrderTitle">类型</div>
            <div class="anyoneWorkOrderContent">水机安装</div>
          </div>
          <div class="anyoneWorkOrderRow">
            <div class="anyoneWorkOrderTitle">状态</div>
            <div class="anyoneWorkOrderContent">未安装</div>
          </div>
          <div class="anyoneWorkOrderRow">
            <div class="anyoneWorkOrderTitle">时间</div>
            <div class="anyoneWorkOrderContent">2018-12-12 12:12</div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import Models from '@/models';
import Vue from 'vue'
import { PullRefresh, List } from 'vant';
Vue.use(PullRefresh).use(List);
export default {
  name:"myWorkOrder",
  data () {
    return {

    }
  },
  methods:{
    /**
     * 下拉刷新
     */
    refresh (done) {

    },

    /**
     * 上拉获取
     */
    infinite (done) {

    },
  },
  components: {
  },
}
</script>

<style lang="less">
.myWorkOrder {
  width: 100%;
  height:100%;
  background-color: #F5F5F5;

  > ._v-container > ._v-content {
      padding-top: 86px;
  }

  .searchDiv {
    width: 100%;
    height:auto;
    position: relative;
    padding: 9px 15px 0;
    z-index: 99;
    background-color: #F5F5F5;

    input {
      width:100%;
      height:30px;
      padding: 0 15px;
      font-size: 14px;
      background:rgba(255,255,255,1);
      border-radius:30px;
    }
  }

  .workOrderList {
    width: 100%;
    height:auto;
    padding: 0 15px;

    .anyoneWorkOrder {
      width:100%;
      height:auto;
      background:rgba(255,255,255,1);
      box-shadow:0px 5px 21px 0px rgba(221,221,221,0.72);
      border-radius:8px;
      margin-top: 16px;
      padding: 16px;

      > .anyoneWorkOrderRow {
        display: flex;
        display: -webkit-flex;
        font-size: 15px;
        margin-bottom: 9px;

        &:last-child {
          margin-bottom: 0;
        }

        .anyoneWorkOrderTitle {
          flex-basis:88px ;
          flex-shrink: 0;
        }

        .anyoneWorkOrderContent {
          width: 100%;
          text-align: left;
        }
      }
    }
  }
}

</style>

