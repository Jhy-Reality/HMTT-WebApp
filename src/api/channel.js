// 频道API

// 导入总发送请求接口
import resquilt from '@/utils/resquilt'
// 导出频道请求接口
// 获取我的频道信息（如果没有登录，获取的是后台设置的默认频道列表）
export const getMychannels = () => {
  return resquilt('/app/v1_0/user/channels', 'get')
}
