import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入移动端Vant组件库
import Vant from 'vant'

// 引入组件库的CSS文件  更改组件主题颜色需要更改样式文件为less文件 通过配置文件更改其主题颜色变量使其解析时直接更换颜色不用覆盖源码
// Vant 使用了 Less 对样式进行预处理，并内置了一些样式变量，通过替换样式变量即可定制你自己需要的主题。
import 'vant/lib/index.less'

// 引入设置rem基准值文件
import 'amfe-flexible'

// 引入全局样式文件
import '@/styles/index.css'

// import Router from 'vue-router'
// const routerPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return routerPush.call(this, location).catch(error => error)
// }

// 注册Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
