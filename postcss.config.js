module.exports = {
  // 插件
  plugins: {
    /* // 自动加私有前缀
    'autoprefixer': {
      // 配置要适配的浏览器版本
      browsers: ['Android >= 4.0', 'iOS >= 7']
    }, */
    /*
    .browserslistrc,就是配置适配浏览器的列表
    */
    // 自动将px转换为rem单位
    'postcss-pxtorem': {
      // 设置rem基准值
      // 因为主流标准设备 iphone4，5是320 iphone6屏幕是 375 piugs 414
      rootValue: 37.5,
      // 所有属性px单位都需要换算成rem  *代表所有
      propList: ['*']
    }
  }
}
