import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '@/views/layout/Index.vue'

export const routes = [
    {
        path: '/login',
        component: () => import('@/views/login/Index.vue'),
        meta: {
            title: '登录',
        }
    },
    {
        path: '/',
        component: Layout,
        children:[
            {
                path: '',
                name: 'index',
                component: () => import('@/views/index/Index.vue'),
                meta: {
                    title: '首页',
                }
            },
            {
                path: 'personal-center',
                name: 'personal-center',
                component: () => import('@/views/personalCenter/Index.vue'),
                meta: {
                    title: '个人中心',
                }
            },
        ]
    },
    {
        path: '/system',
        component: Layout,
        meta: {
            icon: '',
            title: '系统管理',
        },
        children:[
            {
                path: 'admin-user',
                name: 'admin-user',
                component: () => import('@/views/system/admin/Index.vue'),
                meta: {
                    permission: 'system-user-view',
                    title: '管理员账号管理',
                }
            },
            {
                path: 'role',
                name: 'role',
                component: () => import('@/views/system/role/Index.vue'),
                meta: {
                    permission: 'system-role-view',
                    title: '角色管理',
                }
            },
            {
                path: 'permission',
                name: 'permission',
                component: () => import('@/views/system/permission/Index.vue'),
                meta: {
                    permission: 'system-permission-view',
                    title: '权限管理',
                }
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//全局看守
router.beforeEach((to, from, next) => {
    if (to.meta.title) { // 如果设置标题，拦截后设置标题
        document.title = to.meta.title
    }
    NProgress.start()
    next();
})
router.afterEach((to, from) => {
    NProgress.done()
})

export default router