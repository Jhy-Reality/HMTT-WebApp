import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入移动端Vant组件库
import Vant from 'vant'
// 引入组件库的CSS文件
import 'vant/lib/index.css'
// 注册Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
