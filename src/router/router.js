import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Login from './components/Login.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Home from './components/Home.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Welcome from './components/Welcome.vue'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users.vue')
// import Users from './components/user/Users.vue'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
// import Rights from './components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')
// import Roles from './components/power/Roles.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
// import Cate from './components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import Params from './components/goods/Params.vue'
const GoodList = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
// import GoodList from './components/goods/List.vue'
const GoodAdd = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import GoodAdd from './components/goods/Add.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/Order.vue')
// import Order from './components/order/Order.vue'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report.vue')
// import Report from './components/report/Report.vue'
const Drag = () => import(/* webpackChunkName:"drag" */ '../components/practise/Drag.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  routes: [
    { path: '/', redirect: '/Login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodList },
        { path: '/goods/add', component: GoodAdd },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
        { path: '/drag', component: Drag }
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
