import Vue from 'vue'
import VueRouter from 'vue-router'

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
  routes
})

export default router
