// 频道文章API
// 引入发请求接口
import resquilt from '@/utils/resquilt'

/**
 * 获取文章列表
 * @param {Integer} channelId - 频道ID
 * @param {Integer} timestamp - 时间戳 相对于分页页码
 */
// 导出请求文章接口
export const getarticles = (channelId, timestamp) => {
  return resquilt('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
