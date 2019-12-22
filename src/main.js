import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './plugins/element.js'
// 导入字体图标样式表
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 TreeTable 插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入axios第三方库
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置 axios 拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册 tree-table 组件
Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

// 定义日期过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 渲染Vue app 应用
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
