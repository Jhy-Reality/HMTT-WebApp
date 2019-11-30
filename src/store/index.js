import Vue from 'vue'
import Vuex from 'vuex'

// 引入封装好的本地数据的操作
import * as userLogin from '@/utils/userLogin'

Vue.use(Vuex)

export default new Vuex.Store({
  // 设置数据
  state: {
    // 设置state数据为获取到的本地用户登录信息
    user: userLogin.getUser()
  },
  // 修改数据
  mutations: {
    updateuser (state, shuju) {
      // 修改state数据
      state.user = shuju
      // 修改本地数据 如不修改会出现页面刷新以后vuex获取的是旧数据 因为是用户登录信息如不退出重新登陆一直都是旧数据
      userLogin.addUser(shuju)
    },
    deluser (state) {
      // 将state中的数据清空
      state.user = {}
      // 调用移除方法移除登录信息
      userLogin.removeUser()
    }
  },
  // 获取数据
  actions: {

  }
  /* // 将数据分模块化管理
  modules: {
  } */
})
