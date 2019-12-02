// 封装axios请求，导出请求接口
/*
 * 1.处理json-bigint大数据处理机制
 * 2.头部必须携带token
 * 3.剥离无用的代码（res.data.data我们需要的只是最后一个data）
 * 4.token失效刷线token
 * */
// 引入axios请求
import axios from 'axios'
// 引入大数据处理模块
import jsonbigint from 'json-bigint'
// 引入vuex数据实例
import store from '@/store'
// 引入路由实例
import router from '@/router'

// 处理大数据机制
// 配置请求公共地址不能使用默认axios请求 防止项目接口会有两个后端提供数据
// 而一个axios请求的配置不能访问两个后端数据 因此需要创建一个新的axios请求
// 创建一个新的axios实例用来配置请求条件 axios.create({配置条件})
const instance = axios.create({
  // 配置公共根地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 设置响应配置  一个函数就是一个处理，如果要对数据做多重处理就需要多个函数
  // data是原始的响应数据( json格式字符串 或者 null )
  transformResponse: [(data) => {
    // 有些请求返回data时为空而为空时不能进行jsonbigint转换否则会报错
    // 利用try  catch防止错误产生
    try {
      // 如果返回数据将数据不为空转换为jsonbigint格式
      return jsonbigint.parse(data)
    } catch (e) {
      // 当data响应回来的是空时，不用转换将其直接返回即可
      return data
    }
  }]
})
// 设置请求携带请求token
instance.interceptors.request.use(config => {
  // 成功拦截 修改配置
  // 判断是否获取到token数据
  if (store.state.user.token) {
    // 配置请求头 使其携带token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // 将修改好的配置返回
  return config
}, error => {
  // 当请求错误后一定要返回一个错误的promise对象
  return Promise.reject(error)
})

// 剥离无用的代码
// 设置一个响应拦截器 获得响应的数据
instance.interceptors.response.use(response => {
  // 为了避免响应数据出错 使用try（容易出错的代码） catch(异常处理)
  try {
    // console.log(response)
    // 我们需要使用的数据就是第二个data数据所以直接返回即可不需要返回整个response数据
    return response.data.data
  } catch (e) {
    // 有的响应数据不带data.data 当无法获取data数据时直接返回整个数据response即可
    return response
  }
  // 当token失效后发送的请求会响应失败 所以在响应出错时设置刷新token
}, async error => {
  // 配置跳转路由,利用query的传参方式可以在地址栏中获取到当前页面的地址
  // 我们需要的是当前路由的地址而在组件中可以使用$route.path获取当前地址
  // 但是我们现在在模块中 可以通过路由实例的属性 router.currentRoute === $route
  const loginConfig = {
    path: '/login',
    query: {
      redirectUrl: router.currentRoute.path
    }
  }
  // 利用try防止刷新失败报错的问题
  try {
    // 响应失败后会有错误的响应信息还可能会有其他信息
    // 当token失效时会返回状态码401判断状态码是否是401
    if (error.response && error.response.status === 401) {
      // 状态码是401的情况还有一个是未登录判断响应失败的数据中是token失效还是未登录
      // 利用引入的vuex的用户信息获取token
      const {
        user
      } = store.state
      // 判断用户信息是否存在token不存在是未登录 并且 是否存在refresh_token未存在无法刷新
      if (!user.token || !user.refresh_token) {
        // 如果未登录 或者 无法刷新token的时候使其跳转到登录页面
        router.push(loginConfig)
        // 注意此时就不再向下执行代码了要返回一个error的promise对象阻止向下执行
        return Promise.reject(error)
      }

      // 如果不满足以上条件证明有token并且有refresh_token可刷新token
      // 发送axios 的 refresh_token请求 利用 async 与 await 获取请求响应的新的token
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 获取新token后更新vuex数据与本地数据
      /* 注意点
      因为是js模块而不是vue组件所以无法使用mapMuctions更新state数据
      只能使用vuex实例.commit的方法触发muctions方法去更新vuex数据
      */
      // 更新时需要传入两个值token与refresh_token只传一个会丢失一个
      store.commit('undateuser', {
        // 更新token为新获取的token
        token: res.data.data.token,
        // 响应中只返回了一个token所以更新refresh_token是使用原来的即可
        refresh_token: user.refresh_token
      })
    }
  } catch (e) { // exception异常的意思
    // 如果刷新失败使其跳转到登录页面
    router.push(loginConfig)
    return Promise.reject(e)
  }
  // 响应出错时必须返回一个错误的promise对象
  return Promise.reject(error)
})

// 导出请求接口
// 传入请求地址url 请求方式method 请求参数data
export default (url, method, data) => {
  // 使用配置好的axios来帮助发送axios请求，得到数据（promise对象）
  // axios调用方式：快捷调用axios.get() axios.post 等  完整调用：axios({请求配置})
  // 配置选项：url地址，method请求方式，params get传参，data 除get外的其他传参，headers 头部传参
  return instance({
    url,
    method,
    // 请求方式不同所以传入请求参数方式也不同
    /*
    get方式是params传参
    其他方式是data传参
    网对象中动态的插入属性obj.name = 10 当属性不确定时 obj[变量或者表达式] = 10
    */
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
