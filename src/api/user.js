// 定义用户相关API

// 引入发送请求接口
import resquilt from '@/utils/resquilt'

/**
 * 登录
 * @param {Object} loginForm - 登录用户信息（mobile,code）
 */
// 导出登录请求
export const login = (canshu) => {
  return resquilt('/app/v1_0/authorizations', 'post', canshu)
}
