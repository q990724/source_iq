import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/view-alibaba'
    },
    {
        path: '/search',
        name: 'SearchResult',
        component: () => import('@/views/Search/search_result')
    },
    {
        path: '/view-alibaba',
        name: 'view-alibaba',
        component: () => import('@/views/Search/search-views/alibaba')
    },
    {
        path: '/view-yiwugo',
        name: 'view-yiwugo',
        component: () => import('@/views/Search/search-views/yiwugo')
    },
    {
        path: '/view-aliexpress',
        name: 'view-aliexpress',
        component: () => import('@/views/Search/search-views/aliexpress')
    },
    {
        path: '/view-1688',
        name: 'view-1688',
        component: () => import('@/views/Search/search-views/1688')
    }
]

const router = new VueRouter({
    routes
})

export default router