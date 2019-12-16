import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

// const routes = [

// ]

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/Login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    }
  ]
})

// 挂载路由导航守卫

router.beforeEach((to, from, next) => {
  // to 代表要访问的路径
  // from 代表从哪个路径跳转来
  // next 是一个函数，表示放行
  //  next() 直接放行， next('/强制到哪的路径')
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('./login')
  next()
})

export default router
