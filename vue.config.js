module.exports = {
  // 设置要更改的样式
  css: {
    // 设置vue的加载器配置
    loaderOptions: {
      // 更改less加载器的配置
      less: {
        modifyVars: {
          // 键值对形势  key : value
          'blue': '#3296fa'
        }
      }
    }
  }
}
