# 轮播图组件 V-1.2
<p align="center">
  <img alt="GitHub release" src="https://img.shields.io/badge/release-v1.0.0-orange.svg?style=for-the-badge"/>
  <img alt="vue" src="https://img.shields.io/badge/vue-2.5.11-green.svg?style=for-the-badge"/>
</p>

------

<br>

### 组件功能&演示效果
在有限空间内，循环播放同一类型的图片，文字等内容。支持无缝轮播、淡入淡出轮播、多图轮播、3D轮播
  ![](./assets/demo1.gif)
  ![](./assets/demo2.gif)
  ![](./assets/demo3.gif)
  ![](./assets/demo4.gif)
  ![](./assets/demo5.gif)
<br>

### 组件参数及事件

**参数**

| 参数                | 说明                                                         | 类型    | 默认值   |
| ------------------- | :----------------------------------------------------------- | ------- | -------- |
| mode                | 轮播模式。base为默认轮播，baseY纵向轮播（需给slider设定为图片的高度），loop无缝轮播，fade为淡入淡出轮播，card为3d轮播           | String  | base        |
| autoPlay                 | 自动轮播间隔时长(ms)，0为关闭自动轮播                          | Number  | 3000     |
| many             | 多图模式展示的图片数量（可视区展示多张轮播图，仅对base、loop模式有效）                                           | Number  | 0        |
| arrow          | 上/下一张按钮显示时机。0（不显示）， 1（悬停），2（一直显示）                           | Number  | 1       |
| showPage             | 是否显示分页器。mode为card模式时建议隐藏分页器                                             | Boolean  | true     |
| trigger             | 触发分页按钮轮播的事件，另一值为click | String  | mouseenter     |



**事件**

| 事件名             | 说明                        | 返回值
| ----------------- | :-------------------------- | ----------------------------------------
| change            | 幻灯片切换时触发               | 目前激活的幻灯片的索引，原幻灯片的索引

<br>

### 使用方法
1、使用npm 下载组件到项目中，引入后，需要给容器指定宽高（宽度为单张图片的宽度），给slider指定宽度（通常为容器的宽度）

```html
<template>
  <h2>轮播图</h2>
  <banner-change @change="getIndex">
    <!-- 注意：imgList若有默认值需要在接口请求处设置，不要在data里设置默认值 -->
    <div class="fly-banner-slider" v-for="(item,index) in imgList" :key="index">
      <a :href="item.link" target="_blank">
        <img :src="item.url" alt="">
      </a>
    </div>
    <!-- 扩展内容，可按需添加。它是具名插槽，添加时slot值需为extend -->
    <div class="fly-banner-extend" slot="extend">{{ imgList[index].label }}</div>
  </banner-change>
</template>
```

```javascript
import bannerChange from "@edu/app-banner-change"

export default {
  components: { bannerChange },
  data() {
    return {
      index: 0,// 当前图片下标
      // 图片数据
      imgList: [
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
        }
      ]
    };
  },
  methods: {
    //获取幻灯片索引
    getIndex(curIndex,oldIndex){
      this.index = curIndex;
      console.log('当前索引：' + curIndex);
      console.log('原索引：' + oldIndex);
    }
  }
};
```

```css
<style>
  .fly-banner-container {
    width: 299px; /*不论何种模式，容器宽高指定为图片宽高即可*/
    height: 265px;
    .fly-banner-slider {
      width: 299px; /*单张轮播图/轮播区域宽度*/
    }
  }
</style>
```

2、普通html中直接引入使用

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>banner-change</title>
  <script src="https://cdn.staticfile.org/vue/2.5.2/vue.min.js"></script>
  <script src="../dist/bannerChange.umd.js"></script>
</head>
<body>
  <div id="app">
    <banner-change>
      <div class="fly-banner-slider" v-for="(item,index) in imgList" :key="index">
        <a :href="item.link" target="_blank">
          <img :src="item.url" alt="">
        </a>
      </div>
    </banner-change>
  </div>
  <script>
    new Vue({
      el: '#app'
    })
  </script>
</body>
</html>
```