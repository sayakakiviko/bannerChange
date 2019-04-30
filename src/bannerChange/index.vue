<template>
  <div class="fly-banner-container"
       ref="bannerContainer"
       @mouseenter="clearTimer"
       @mouseleave="auto">
    <div class="fly-banner-wrapper" ref="bannerWrap">
      <slot></slot>
    </div>

    <!--分页器-->
    <div class="fly-banner-pagination" v-if="page">
      <span v-for="(item,i) in length"
            :key="i"
            :class="{on:i===index}"
            @mouseenter="trigger!=='click'&&changePic(i)"
            @click="trigger==='click'&&changePic(i)"></span>
    </div>

    <!-- 上/下一张按钮 -->
    <div class="fly-banner-btn fly-banner-prev" v-if="arrow" :class="{hover:arrow===1}" @click="btnClick(false)"></div>
    <div class="fly-banner-btn fly-banner-next" v-if="arrow" :class="{hover:arrow===1}" @click="btnClick(true)"></div>
  </div>
</template>

<script>
  export default {
    props: {
      //切换模式。0为插卡式轮播，1为淡入淡出轮播，2为无缝轮播
      mode: {
        type: Number,
        default: 0
      },
      //自动轮播间隔时长(ms)，0为关闭自动轮播
      autoPlay: {
        type: Number,
        default: 3000
      },
      //是否开启多图模式，默认false（可视区展示多张轮播图，即容器宽度大于单张轮播图宽度时需要开启。容器宽度最好是倍数方式大于slider的宽度）
      multi: {
        type: Boolean,
        default: false
      },
      //上/下一张按钮显示时机。0（不显示）， 1（悬停），2（一直显示）
      arrow: {
        type: Number,
        default: 1
      },
      //是否显示分页器
      page: {
        type: Boolean,
        default: true
      },
      //触发分页按钮轮播的事件。默认mouseenter，可配置click
      trigger: {
        type: String,
        default: 'mouseenter'
      }
    },
    data() {
      return {
        parent: null,//轮播图父级
        banner: null,//轮播图
        containerWidth: 0,//容器宽度
        bannerWidth: 0,//每张轮播图占宽（含margin）
        length: 0,//轮播图个数
        showNum: 0,//展示的轮播图个数
        index: 0,//下标
        clickTime: 0,//点击时间
        timer: null,//计时器
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      /** 轮播组件初始化 */
      init() {
        //初始化一些属性
        this.parent = this.$refs.bannerWrap;
        this.banner = this.$refs.bannerWrap.children;
        this.length = this.banner.length;
        this.containerWidth = this.$refs.bannerContainer.clientWidth;
        this.bannerWidth = parseFloat(getComputedStyle(this.banner[0]).width) + parseFloat(getComputedStyle(this.banner[0]).marginLeft) + parseFloat(getComputedStyle(this.banner[0]).marginRight);//获取单张轮播图含margin的真实宽
        this.showNum = Math.ceil(this.containerWidth / this.bannerWidth);
        this.multi && this.mode === 0 && (this.length = Math.ceil(this.length / this.showNum)); //总共切换的次数。默认轮播的多图模式下才会用

        /* 轮播图的初始化 */
        switch (this.mode) {
          //默认轮播
          case 0:
            this.parent.style.cssText = 'width:' + this.length + '00%;transition:left .5s';
            break;
          //淡入淡出轮播
          case 1:
            for (let i = 0; i < this.length; i++) this.banner[i].style.cssText = 'position:absolute;opacity:0;filter:alpha(opacity=0)';//淡入淡出轮播的样式设置
            this.banner[0].style.cssText = 'opacity:1;filter:alpha(opacity=100)';
            break;
          //无缝轮播
          case 2:
            if (this.multi) { //多图无缝轮播
              let [tempArr, i] = [[]]; //临时存放要克隆的dom节点
              //首图放末尾
              for (i = 0; i < this.showNum; i++) {
                this.parent.appendChild(this.banner[i].cloneNode(true));
                tempArr.push(this.banner[this.showNum - i].cloneNode(true)); //保存所有需要克隆的节点
              }
              //末图放前面
              for (i = 0; i < this.showNum; i++) this.parent.insertBefore(tempArr[i], this.banner[0]); //倒序取出需要克隆的节点
              this.parent.style.cssText = 'width:' + (this.length + 2) + '00%;left:-' + this.containerWidth + 'px;transition:left 0s;';//此时过渡为0以保证初始化效果不让用户看到
              setTimeout(() => {
                this.parent.style.transition = 'left .5s';
              });
            } else { //普通无缝轮播
              this.parent.appendChild(this.banner[0].cloneNode(true)); //首图放末尾
              this.parent.insertBefore(this.banner[this.length - 1].cloneNode(true), this.banner[0]); //末图放到第一张
              this.parent.style.cssText = 'width:' + (this.length + 2) + '00%;left:-' + this.containerWidth + 'px;transition:left 0s;';//此时过渡为0以保证初始化效果不让用户看到
              setTimeout(() => {
                this.parent.style.transition = 'left .5s';
              });
            }
            break;
        }

        this.autoPlay && this.auto();//是否自动轮播
      },
      /** 自动轮播 */
      auto() {
        if (this.autoPlay) {
          this.timer = setInterval(() => {
            this.changePic(this.index + 1);
          }, this.autoPlay);
          return this.auto;
        }
      },
      /** 清除定时器 */
      clearTimer() {
        clearInterval(this.timer);
      },
      /** 上/下一张按钮点击事件
       * @bool {Boolean} 上一张为false，下一张为true
       * */
      btnClick(bool) {
        if (new Date() - this.clickTime > 520) { //防止点击过快出现bug
          bool ? this.changePic(this.index + 1) : this.changePic(this.index - 1);
          this.clickTime = new Date();
        }
      },
      /** 轮播图的切换
       * @key {Number} 将要显示的图片的下标
       * */
      changePic(key) {
        this.mode === 1 && this.running(this.banner[this.index], 'opacity', 0, 400); //淡入淡出
        this.index = key;

        if (this.multi && this.mode === 2) {//若是多图的无缝轮播
          if (this.index <= 0 - this.showNum) {//复位到最后一张
            this.index = this.length - this.showNum;
            this.delay(this.length);
          } else if (this.index >= this.length) {//复位到第一张
            this.index = 0;
            this.delay(this.showNum);
          }
        } else {
          if (this.index < 0) {
            this.index = this.length - 1;
            this.mode === 2 && this.delay(this.length); //无缝轮播才用。最后一张后面还有一张，所以图片应该是下标+1也就是length
          } else if (this.index >= this.length) {
            this.index = 0;
            this.mode === 2 && this.delay(1); //无缝轮播才用。下标0的图片是最后一张，下标1才是第一张
          }
        }

        //图片的切换
        switch (this.mode) {
          //默认轮播
          case 0:
            //浏览器支持transition则用transition轮播，否则用运动方法轮播
            let l = -this.index * this.containerWidth;
            this.supportCss3('transition') && (this.parent.style.left = l + 'px') || this.running(this.parent, 'left', l, '500');
            break;
          //淡入淡出轮播
          case 1:
            this.running(this.banner[this.index], 'opacity', 1, 400);
            break;
          //无缝轮播
          case 2:
            //浏览器支持transition则用transition轮播，否则用运动方法轮播
            let normal = (key + 1) * this.containerWidth,
              multi = key * this.bannerWidth + this.containerWidth;
            if (this.supportCss3('transition')) {//浏览器支持transition
              this.parent.style.left = (this.multi ? -multi : -normal) + 'px';
            } else {//不支持transition
              this.running(this.parent, 'left', this.multi ? -multi : -normal, '500');
              if (key >= this.length) {//最后一张到第一张
                setTimeout(function () {
                  this.parent.style.left = '-' + this.containerWidth + 'px';
                }, 520);
              } else if (key < -1) {//第一张到最后一张
                setTimeout(function () {
                  this.parent.style.left = '-' + multi + 'px';
                }, 520);
              }
            }
            break;
        }

        this.$emit('change', this.index, key);
      },
      /** 无缝轮播对临界图片的处理（图片复位）
       * @x {Number} 将要显示的图片的下标(首尾两张图)
       * **/
      delay(x) {
        let left = x * (this.multi && this.bannerWidth || this.containerWidth);
        //等动画完成之后再复位
        setTimeout(() => {
          this.parent.style.transition = 'left 0s';//去掉transition，以便瞬间复位
          this.parent.style.left = '-' + left + 'px';//复位到看起来的第一张，实际的第二张。因为第一张和最后一张一样
          setTimeout(() => {
            this.parent.style.transition = 'left .5s';//同时执行无法达到瞬间复位效果，所以添加transition时要延迟下
          }, 20);
        }, 520);
      },
      /** 判断浏览器是否支持css3属性
       * @style {String} 属性名称
       * @return {Boolean} true/false
       * **/
      supportCss3(style) {
        let prefix = ['webkit', 'Moz', 'ms', 'o'],
          humpString = [],
          htmlStyle = document.documentElement.style,
          _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
              return $1.toUpperCase();
            });
          },
          i;
        for (i in prefix) humpString.push(_toHumb(prefix[i] + '-' + style));
        humpString.push(_toHumb(style));
        for (i in humpString)
          if (humpString[i] in htmlStyle) return true;
        return false;
      },
      /** 运动方法
       * @obj {Object} 运动对象
       * @attr {String} 运动属性
       * @target {Number/String} 目标值
       * @time {Number} 淡入淡出过渡时间，单位ms
       * */
      running(obj, attr, target, time) {
        //兼容
        window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
          return setTimeout(fn, 1000 / 60);
        };
        window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

        target = parseFloat(target); //如果目标值带单位则去掉单位
        let cssJson = obj.currentStyle || getComputedStyle(obj), //获取该对象样式集合
          start = parseFloat(cssJson[attr]) || cssJson['filter'].replace(/[^0-9]/ig, ''), //运动属性的初始值，后面取的filter是因为ie8不兼容opacity
          allRun = target - start, //总路程
          startTime = new Date; //动画开始时间

        start > 1 && (start = start / 100); //ie8的话取的是filter，值是100，所以要除100
        (function run() {
          let currentTime = new Date - startTime, //当前时间
            prop = currentTime / time, //当前路程的时间比
            current = prop * allRun + start; //当前位置。公式为：当前时间/总时间*总距离+初始值
          prop >= 1 ? current = target : requestAnimationFrame(run); //若达到目标值

          //透明度变化和其它属性变化做区别
          if (attr === 'opacity') {
            obj.style[attr] = current;
            obj.style.filter = 'alpha(opacity=' + current * 100 + ')';
          } else {
            obj.style[attr] = current + 'px';
          }
        })();
      },
    }
  };
</script>

<style lang="less" scoped>
  img {
    border: none;
  }

  .fly-banner-container {
    overflow: hidden;
    position: relative;
  }

  .fly-banner-wrapper {
    position: relative;
    left: 0;
    height: 100%;
  }

  .fly-banner-slider {
    float: left;
  }

  .fly-banner-pagination {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    z-index: 1;
    text-align: center;
  }

  .fly-banner-pagination > span {
    display: inline-block;
    margin: 0 3px;
    width: 8px;
    height: 8px;
    background-color: #b7b5b5;
    cursor: pointer;
    border-radius: 50%;
  }

  .fly-banner-pagination > span.on, .fly-banner-pagination > span:hover {
    background-color: #4980e2;
  }

  .fly-banner-btn {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: 36px;
    height: 36px;
    background-color: rgba(31, 45, 61, .11);
    cursor: pointer;
    border-radius: 50%;
    user-select: none;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    transition: .3s;
  }

  .fly-banner-prev {
    left: 15px;
  }

  .fly-banner-next {
    right: 15px;
  }

  .fly-banner-prev.hover {
    animation: fadeOut-left .3s forwards;
  }

  .fly-banner-next.hover {
    animation: fadeOut-right .3s forwards;
  }

  .fly-banner-container:hover .hover.fly-banner-prev {
    animation: fadeIn-left .3s forwards;
  }

  .fly-banner-container:hover .hover.fly-banner-next {
    animation: fadeIn-right .3s forwards;
  }

  @keyframes fadeIn-left {
    0% {
      opacity: 0;
      left: 0;
    }
    100% {
      opacity: 1;
      left: 15px;
    }
  }

  @keyframes fadeIn-right {
    0% {
      opacity: 0;
      right: 0;
    }
    100% {
      opacity: 1;
      right: 15px;
    }
  }

  @keyframes fadeOut-left {
    0% {
      opacity: 1;
      left: 15px;
    }
    100% {
      opacity: 0;
      left: 0;
    }
  }

  @keyframes fadeOut-right {
    0% {
      opacity: 1;
      right: 15px;
    }
    100% {
      opacity: 0;
      right: 0;
    }
  }

  .fly-banner-btn:before {
    content: '';
    position: absolute;
    top: 12px;
    width: 10px;
    height: 10px;
    border: 1px solid #fff;
    transform: rotate(135deg) scaleY(1);
    transition: transform .15s ease-in .05s;
    transform-origin: center;
  }

  .fly-banner-prev:before {
    left: 14px;
    border-left: 0;
    border-top: 0;
  }

  .fly-banner-next:before {
    right: 14px;
    border-right: 0;
    border-bottom: 0;
  }

  .fly-banner-btn:hover {
    background-color: rgba(31, 45, 61, .5);
  }
</style>
