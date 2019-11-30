<template>
  <div class="container">
    <!-- 骨架屏相当于占位符  还可以有数据时让数据显示 在这只起占位符的作用 -->
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
</template>

<script>
export default {
  name: 'Question-index'
}
</script>

<style lang="less" scoped>
.van-skeleton{
  margin-top: 10px;
}
</style>
