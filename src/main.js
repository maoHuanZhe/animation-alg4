import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from './store'
//安装 ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//基于断点的隐藏类
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI);
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  NProgress.start();
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title + "-动画算法"
  }
  next()
})
router.afterEach(() => { NProgress.done() })
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
