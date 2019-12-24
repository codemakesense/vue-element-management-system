// 项目发布阶段需要用到的 babel 插件
const prodProduction = []
if (process.env.NODE_ENV === 'production') {
  prodProduction.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...prodProduction,
    // 路由懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
