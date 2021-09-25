import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: '主页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/objectManage',
    component: Layout,
    name: 'ObjectManage',
    meta: { title: '目标管理', icon: 'el-icon-date' },
    children: [
      {
        path: 'month-plan-target',
        name: 'MonthPlanTarget',
        component: () => import('@/views/table/index'),
        meta: { title: '月计划目标', icon: 'el-icon-postcard' }
      },
      {
        path: 'week-plan-target',
        name: 'WeekPlanTarget',
        component: () => import('@/views/table/index'),
        meta: { title: '周计划目标', icon: 'el-icon-postcard' }
      },
      {
        path: 'time-diary',
        name: 'TimeDiary',
        component: () => import('@/views/diary/index'),
        meta: { title: '时间日记', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'prize-list',
        name: 'PrizeList',
        component: () => import('@/views/tree/index'),
        meta: { title: '奖品列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/permissionManage',
    component: Layout,
    name: 'PermissionManage',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [
      {
        path: 'user-add',
        name: 'userAdd',
        component: () => import('@/views/permission/userAdd'),
        meta: { title: '用户添加', icon: 'el-icon-key' }
      },
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('@/views/permission/userList'),
        meta: { title: '用户列表', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/gitRepository',
    component: Layout,
    children: [
      {
        path: 'https://git.yingzhongtong.com/lette.xiao/ftp-vue-admin',
        meta: { title: 'Git 代码仓库', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
