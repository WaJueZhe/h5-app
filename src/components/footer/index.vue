<template>
  <div class="footer-page" ><!--:style="{paddingBottom:iphoneX ? '36px' : '0'}"-->
    <slot></slot>
    <div class="footer">
      <ul class="list">
        <li class="item" v-for="( data , index ) in itemList" :key="index" >
          <router-link :to="data.link" :style="{ color : data.click ? '#ea3323' : '#333' }">
            <img class="noicon" v-show="!data.click" :src="data.noClickIcon" alt="">
            <img class="yesicon" v-show="data.click" :class="[data.name === 'home' ? 'indexLogo' : '' ]" :src="data.clickIcon" alt="">
            <span class="noicon" v-show="data.showTitle">{{data.title}}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iphoneX:false,
      itemList:[
        {
          link:{ name: 'home' },
          click:true,
          showTitle:true,
          clickIcon:require('@/assets/footer/homelogo_icon.png'),
          noClickIcon:require(`@/assets/footer/home_noicon.png`),
          name:"home",
          title:"首页"
        },{
          link:{ name: 'upgradeQHBoss', query: { zoneCode: 'BossMemberUpZone', flage: true } },
          click:true,
          showTitle:true,
          clickIcon:require('@/assets/footer/hot_icon.png'),
          noClickIcon:require(`@/assets/footer/hot_noicon.png`),
          name:"upgradeQHBoss",
          title:"企惠Boos"
        },{
          link:{ name: 'messageCenter' },
          click:true,
          showTitle:true,
          clickIcon:require('@/assets/footer/xiaoxi_icon.png'),
          noClickIcon:require(`@/assets/footer/xiaoxi_icon2.png`),
          name:"messageCenter",
          title:"消息"
        },{
          link:"/shoppingCart",
          click:true,
          showTitle:true,
          clickIcon:require('@/assets/footer/shoping_icon.png'),
          noClickIcon:require(`@/assets/footer/shoping_noicon.png`),
          name:"shoppingCart",
          title:"购物车"
        },{
          link:"/personalCenter",
          click:true,
          showTitle:true,
          clickIcon:require('@/assets/footer/personal_icon.png'),
          noClickIcon:require(`@/assets/footer/personal_noicon.png`),
          name:"personalCenter",
          title:"我的"
        }
      ]
    };
  },
  watch: {

  },
  methods: {
    tabFooter () {
      let linkName = this.$route.name;
      let itemListLength = this.itemList.length;
      for ( let g = 0 ; g < itemListLength ; g++ ) {
        if ( this.itemList[g].name === linkName ) {
          if ( linkName === "home") {
            this.itemList[g].showTitle = false;
          }
          this.itemList[g].click = true;
        }else {
          this.itemList[g].click = false;
        }
      }
    }
  },
  computed: {

  },
  created() {
    let u = navigator.userAgent;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
      if ( screen.height >= 812 && screen.width >= 375 ){
        this.iphoneX = true;
      }
    }

   this.tabFooter();
  },
  mounted() {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.footer-page {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #fff;

  .footer {
    border-top:1px solid #eaeaea;
    width: 100%;

    .list {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .item {
        flex: 1;
        display: flex;
        align-items: center;

        &:nth-child(2) {
          > a >img {
            width: 72px;
          }
        }

        > a {
          padding: 5px 0;
          width: 100%;
          color: #333;

          >img {
            width:24px;
            height:24px;
            margin: 0 auto;
            vertical-align: middle;

            &.indexLogo {
              width: 40px;
              height:40px;
              vertical-align: middle;
            }
          }

          > span {
            display: block;
            font-size: 9px;
            text-align: center;

            &:first-child {
              margin-bottom: 2px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
};
</style>
