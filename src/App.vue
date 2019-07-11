<template>
  <div class="container">
    <h2>轮播图</h2>
    <banner-change mode="card"
                   :autoPlay="0"
                   :isPage="false"
                   @change="getIndex"
                   v-if="imgList.length">
      <div class="fly-banner-slider"
           v-for="(item,index) in imgList"
           :key="index">
        <!--<a :href="item.link" target="_blank">-->
        <img :src="item.url" alt="">
        <!--</a>-->
      </div>
      <!--<div class="fly-banner-extend" slot="extend">扩展内容：{{imgList[index].label}}</div>-->
    </banner-change>
  </div>
</template>

<script>
  import bannerChange from "./bannerChange/index";
  // import bannerChange from "../dist/bannerChange.umd";

  export default {
    name: 'app',
    components: {bannerChange},
    data() {
      return {
        index: 0,
        getList: [
          {
            label: '百度',
            url: 'assets/show1.png'
          },
          {
            label: '腾讯',
            url: 'assets/show2.png'
          },
          {
            label: '阿里',
            url: 'assets/show3.png'
          },
          {
            label: '百度',
            url: 'assets/show4.png'
          },
          // {
          //   label: '腾讯',
          //   url: 'assets/show5.png'
          // },
          // {
          //   label: '阿里',
          //   url: 'assets/show6.png'
          // },
          // {
          //   label: 'AcFun',
          //   url: 'assets/show7.png'
          // }
        ],
        imgList: []
      };
    },
    mounted() {
      //默认值
      let arr = [
        {
          label: '百度',
          link: 'https://www.baidu.com/',
          url: 'assets/1.png'
        },
        {
          label: '腾讯',
          link: 'https://www.qq.com/',
          url: 'assets/2.png'
        },
        {
          label: 'AcFun',
          link: 'https://www.acfun.cn/',
          url: 'assets/3.png'
        }];
      setTimeout(() => {
        this.imgList = this.getList.length ? this.getList : arr;
      })
    },
    methods: {
      /**
       * 获取轮播图下标
       * @index {Number} 当前轮播图下标
       * @oldIndex {Number} 原轮播图下标
       * */
      getIndex(index, oldIndex) {
        // this.index = index;
        console.log(index, oldIndex);
      }
    }
  };
</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }

  a,
  input,
  button {
    text-decoration: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  ul,
  li {
    list-style: none;
  }

  // 容器
  .container {
    width: 90%;
    min-width: 200px;
    margin: 0 auto;
  }

  h2 {
    padding: 20px 0;
    text-align: center;
    font-size: 16px;
    color: #333;
  }

  .content-box {
    box-sizing: border-box;
    width: 100%;
    li {
      padding: 20px;
      margin-bottom: 12px;
      background: #fff;
      border-radius: 3px;
      box-shadow: inset 0 0 16px 0 #d1dde6;
    }
    h3 {
      padding-bottom: 10px;
      font-weight: normal;
      line-height: 1.2;
      font-size: 16px;
      color: #0a85e0;
    }
  }

  .fly-banner-container {
    margin: auto;
    width: 570px; /*容器宽度*/
    height: 465px;
    .fly-banner-slider {
      width: 285px; /*单张轮播图宽度*/
    }
  }
</style>
