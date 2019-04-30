<template>
  <div class="container">
    <h2>轮播图</h2>
    <banner-change :mode="0">
      <div class="fly-banner-slider" v-for="(item,index) in imgList" :key="index">
        <a :href="item.link" target="_blank">
          <img :src="item.url" alt="">
        </a>
      </div>
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
        imgList: [
          {
            link: 'https://www.baidu.com/',
            url: 'assets/1.png'
          },
          {
            link: 'https://www.qq.com/',
            url: 'assets/2.png'
          },
          {
            link: 'https://www.acfun.cn/',
            url: 'assets/3.png'
          },
        ]
      };
    },
    methods: {
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
    width: 299px;
    height: 265px;
    .fly-banner-slider {
      width: 299px;
    }
  }
</style>
