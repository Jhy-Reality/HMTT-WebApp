import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入vuex用户本地数据
import store from '@/store'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: () => import('@/views/Layout.vue'),
  children: [{
    path: '/',
    name: 'home',
    component: () => import('@/views/home')
  }, {
    path: '/question',
    name: 'question',
    component: () => import('@/views/question')
  }, {
    path: '/video',
    name: 'video',
    component: () => import('@/views/video/index')
  }, {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user')
  }]
},
{
  path: '/search',
  name: 'search',
  component: () => import('@/views/search')
},
{
  path: '/user/profile',
  name: 'profile',
  component: () => import('@/views/user/profile')
},
{
  path: '/user/chat',
  name: 'chat',
  component: () => import('@/views/user/chat')
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/user/login')
},
{
  path: '/search/result',
  name: 'result',
  component: () => import('@/views/search/result')
},
{
  path: '/article',
  name: 'article',
  component: () => import('@/views/home/article')
}
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 设置路由前置守卫 在路由跳转前验证用户是否登录
// 个人中心，编辑资料，小智同学几个页面都需要登录
router.beforeEach((to, from, next) => {
  // 设置跳转的地址,且将要前往的地址信息传入地址栏中
  const loginConfig = { path: '/login', query: { redirectUrl: to.path } }
  // 获取vuex用户信息
  const { user } = store.state
  // console.log(user.data.data.token)

  // 判断登录状态 要前往的路由地址是否以/user开头  用户信息中是否存在token
  if (to.path.startsWith('/user') && !user.token) return next(loginConfig)
  // 其他情况正常放行
  next()
})

export default router
