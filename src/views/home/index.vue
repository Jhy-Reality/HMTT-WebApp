<template>
  <div class="container">
    <!-- v-model="activeIndex"表示当前激活的频道索引 -->
    <van-tabs v-model="activeIndex" swipeable animated>
      <!-- van-tab是包含标签页和内容的容器 -->
      <van-tab :key="channel.id" v-for="channel in mychannels" :title="channel.name">
        <!-- 自己写的结构  放置容器内容 滚动容器列表内容在此容器内滚动 -->
        <div class="scroll-wrapper">
          <!-- 动态添加内容 -->
          <!--
            van-pull-refresh下拉刷新组件
            v-model="布尔值" true正在刷新 false结束刷新
            @refresh="事件名" 下拉刷新事件  当下拉后和下拉松手后触发
          -->
          <van-pull-refresh v-model="currentchannel.downLoading" @refresh="onRefresh" :success-text="successtext">
            <!--
              van-list 列表组件 实现上拉加载效果
              van-model="upLoading" 是设置加载中的效果的 布尔类型 true正在加载 false加载完毕
              :finished="finished" true表示所有数据加载完毕 false表示还有数据未加载
              finished-text="没有文章了" 表示加载完毕的提示文本
              @load="onLoad" 1.上拉加载触发的事件 2.拉到底部和组件初始化时触发 3.当加载屏幕高度不足一屏幕的高度自动触发去加载更多数据

            -->
            <van-list v-model="currentchannel.upLoading" :finished="currentchannel.finished" finished-text="没有更多了" @load="onLoad">
              <!-- 注意文章id是jsonbigint类型要转换为字符串类型 -->
              <van-cell v-for="item in currentchannel.articles" :key="item.art_id.toString()">
                <div class="article_item">
                  <!--van-ellipsis表示超出一行的文字内容用...代替-->
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
                <div class="article_item">
                  <!--van-ellipsis表示超出一行的文字内容用...代替-->
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type===1">
                    <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
                <div class="article_item">
                  <!--van-ellipsis表示超出一行的文字内容用...代替-->
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type===3">
                    <!--w33表示宽度33%-->
                    <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
// 引入获取频道的请求接口
import { getMychannels } from '@/api/channel'
// 引入获取文章数据接口
import { getarticles } from '@/api/articles'
export default {
  name: 'Home-index',
  data () {
    return {
      // ----列表需要的数据----
      // 上拉加载中
      upLoading: false,
      // 是否全部加载完成
      finished: false,
      // 下拉刷新效果
      downLoading: false,
      // 刷新成功的文本提示
      successtext: '',
      // 文章列表
      articles: [],
      // 我的频道列表
      mychannels: [],
      // 频道的id
      activeIndex: 0

    }
  },
  created () {
    // 获取频道列表
    this.getchannel()
  },
  computed: {
    // 当前current
    currentchannel () {
      // 在频道列表中利用当前激活频道索引获取整个当前频道信息
      return this.mychannels[this.activeIndex]
    }
  },
  methods: {
    // 获取频道列表
    async getchannel () {
      // 利用async 与 await获取请求的promise对象数据
      // 调用获取频道接口获取频道信息
      const data = await getMychannels()
      // 将频道信息赋值给data数据中的频道信息列表
      // 因为频道不同所以频道中的数据和刷新效果也不同利用map增加频道选项
      this.mychannels = data.channels.map(item => {
        return {
          // 频道id
          id: item.id,
          // 频道名字
          name: item.name,
          // 该频道的上拉效果
          upLoading: false,
          // 该频道的加载效果
          finished: false,
          // 该频道的下拉效果
          downLoading: false,
          // 该频道的文章列表
          articles: [],
          // 用于获取下一页的时间戳，因为是移动端不像pc端有页面只能依赖时间戳来获取下一页内容
          timestamp: Date.now()
        }
      })
    },
    // 上拉加载获取数据
    async onLoad () {
      /* // 模拟获取数据
      window.setTimeout(() => {
        // 模拟获取数据成功 创建一个数组作为模拟数据的容器
        // 因为数据时一屏一屏展示的假设一屏是10个数据所以是1-10,第二页11-20,所以数组应该是10个数据
        // const data = []
        // 利用for循环遍历列表数据来创建每一屏幕的数据,第一次列表长度为0循环10次第二次应该是从11开始是第二屏
        for (var i = this.articles.length; i < this.articles.length + 10; i++) {
          // 因为数据时从1开始
          data.push(i + 1)
        }
        // 将数据追加到列表数据中  利用es6中的展开运算符将data数据中的每一项添加到列表数据中
        this.articles.push(...data)
        // 结束加载效果
        this.upLoading = false
        // 考虑数据是否全部加载完毕
        if (this.articles.length >= 40) {
          // 当数据大于40表示全部加载完毕
          this.finished = true
        }
      }, 1500) */
      // 获取真实数据
      const data = await getarticles(this.currentchannel.id, this.currentchannel.timestamp)
      console.log(data)

      // 将获取的数据添加到当前频道的文章列表
      this.currentchannel.articles.push(...data.results)
      // 结束当前频道的加载效果
      this.currentchannel.upLoading = false
      // 判断是否还有数据 pre_timestamp表示最后一条数据的时间戳
      if (data.pre_timestamp) {
        // 将当前获取数据的最后一条时间戳存入频道的时间戳以便上拉获取文章
        this.currentchannel.timestamp = data.pre_timestamp
      } else {
        // 当没有时间戳是证明无数据了 将加载效果变为加载完毕
        this.currentchannel.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      /* // 模拟获取数据
      window.setTimeout(() => {
        // 模拟刷新的数据
        const data = [1, 2, 3, 4]
        // 结束刷新效果
        this.downLoading = false
        // 替换数据 先判断是否有数据
        if (data.length) {
          this.articles = data
          this.successtext = '刷新成功'
          // 防止不足一屏数据时,再加载数据
          this.onLoad()
          // 重置是否加载完毕
          // 多次刷新会造成页面提示没有更多内容这是因为加载中将加载状态更改了所以此时要重置
          this.finished = false
        } else {
          this.successtext = '刷新失败'
        }
      }, 1500) */
      // 下拉刷新是记得更时间戳变为当前时间戳
      this.currentchannel.timestamp = Date.now()
      // 获取数据
      const data = await getarticles(this.currentchannel.id, this.currentchannel.timestamp)
      // 关闭刷新
      this.currentchannel.downLoading = false
      // 替换数据
      if (data.results.length) {
        this.currentchannel.articles = data.results
        // 更改文本
        this.successtext = '刷新成功'
        // 更改时间戳为后台返回的时间戳去加载数据
        this.currentchannel.timestamp = data.pre_timestamp
        // 数据不足一屏时加载
        this.onLoad()
        // 重置加载完毕
        this.currentchannel.finished = false
      } else {
        this.successtext = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
