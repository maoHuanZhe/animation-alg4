<template>
  <el-container id="app" ref="app">
    <el-header>
      <el-menu
          :default-active="activeMenu()"
          mode="horizontal"
          router>
        <el-menu-item @click="tools"><i class="el-icon-s-tools"></i></el-menu-item>
        <el-submenu index="/sort">
          <template slot="title">排序</template>
          <el-menu-item index="/selection">
            <span slot="title">选择排序</span>
          </el-menu-item>
          <el-menu-item index="/insertion">
            <span slot="title">插入排序</span>
          </el-menu-item>
          <el-menu-item index="/shell">
            <span slot="title">希尔排序</span>
          </el-menu-item>
          <el-menu-item index="/merge">
            <span slot="title">归并排序</span>
          </el-menu-item>
          <el-menu-item index="/mergeBU">
            <span slot="title">归并排序2</span>
          </el-menu-item>
          <el-menu-item index="/quick">
            <span slot="title">快速排序</span>
          </el-menu-item>
          <el-menu-item index="/quick3way">
            <span slot="title">三分快速排序</span>
          </el-menu-item>
          <el-menu-item index="/heap">
            <span slot="title">堆排序</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/search">
          <template slot="title">查找</template>
          <el-menu-item index="/SequentialSearch">
            <span slot="title">顺序查找</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-main ref="main">
      <transition name="slide-fade" mode="out-in">
          <router-view :key="key" />
      </transition>
    </el-main>
    <el-footer style="text-align: center;">
      <!--      csdn      -->
      <el-tooltip class="item" effect="dark" content="CSDN地址" placement="top">
        <el-link :underline="false" type="info" href="https://blog.csdn.net/qq_39016934" target="_blank"><i class="iconfont">&#xe601;</i></el-link>
      </el-tooltip>
      <!--      github      -->
      <el-tooltip class="item" effect="dark" content="GitHub地址" placement="top">
        <el-link :underline="false" type="info" href="https://github.com/maoHuanZhe/animation-alg4" target="_blank"><i class="iconfont">&#xe600;</i></el-link>
      </el-tooltip>
      <!--      qq      -->
      <el-tooltip class="item" effect="dark" content="QQ联系" placement="top">
        <el-link :underline="false" type="info" href="http://sighttp.qq.com/authd?IDKEY=5b0c5a703ad65f10c06e40a8f2169b3cd74487c67322f867" target="_blank"><i class="iconfont">&#xe631;</i></el-link>
      </el-tooltip>
      <!--      weixin      -->
      <el-link :underline="false" type="info" href="http://beian.miit.gov.cn/" target="_blank">
        <el-popover
            placement="top-start"
            width="200"
            title="加我微信"
            trigger="hover">
          <el-image
              style="width: 200px; height: 200px"
              :src="fileUrl"
              fit="fit"></el-image>
          <i slot="reference" class="iconfont">&#xe632;</i>
        </el-popover>
      </el-link><br>
      <!--      备案号      -->
      <el-tooltip class="item" effect="dark" content="备案号" placement="top">
        <el-link :underline="false" type="info" href="http://beian.miit.gov.cn/" target="_blank">皖ICP备2020015593号</el-link>
      </el-tooltip>
    </el-footer>
    <el-drawer
        :visible.sync="drawer"
        direction="ltr"
        :with-header="false"
        :size="size">
      <div class="drawer-container">
        <div>
          <h3 class="drawer-title">全局设置</h3>

          <div class="drawer-item">
            <span>交换动画</span>
            <el-switch v-model="hasAnimation" class="drawer-switch" />
          </div>

        </div>
      </div>
    </el-drawer>
  </el-container>
</template>
<script>
    export default {
      name: "home"
      ,data() {
          return {
              drawer: false,
              size:'300',
              fileUrl:require('../assets/pic/wchat.jpg')
          }
        }
      ,methods: {
        activeMenu() {
            return this.$route.path;
        },
        tools() {
            this.drawer = true
        }
      }
      ,mounted() {
        //获取浏览器高度
        const mainHeight = document.documentElement.clientHeight;
        this.$refs.main.$el.style.height = (mainHeight-120-16) +'px';
        //获取页面宽度
        const mainWidth =  this.$refs.main.$el.clientWidth;
        if (mainWidth >=1920){
            this.$store.dispatch('changeState', {key:'size',val:"xl"})
        } else if (mainWidth < 1920 && mainWidth >= 1200){
            this.$store.dispatch('changeState', {key:'size',val:"lg"})
        } else if (mainWidth < 1200 && mainWidth >= 992){
            this.$store.dispatch('changeState', {key:'size',val:"md"})
        } else if (mainWidth < 992 && mainWidth >= 768){
            this.$store.dispatch('changeState', {key:'size',val:"sm"})
        } else if (mainWidth < 768){
            this.$store.dispatch('changeState', {key:'size',val:"xs"})
        }
        //计算每行会有几个元素
        this.$store.dispatch('changeState', {key:'lineNum',val:Math.floor((mainWidth-80)/65)})
      }
      ,computed: {
        key() {
            return this.$route.path
        }
        ,hasAnimation: {
                get() {
                    return this.$store.state.hasAnimation
                },
                set(val) {
                    this.$store.dispatch('changeState', {key:'hasAnimation',val})
                }
            },
      }
    }
</script>

<style scoped>
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  @font-face {
    font-family: 'iconfont';  /* project id 2047640 */
    src: url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.eot');
    src: url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.woff') format('woff'),
    url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_2047640_aq84d5tg0s4.svg#iconfont') format('svg');
  }
  .iconfont{
    font-family:"iconfont" !important;
    font-size:25px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;}
  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
</style>
