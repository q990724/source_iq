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
        name: 'Index',
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
        // component: () => import('@/views/Search/search-views/alibaba')
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-aliexpress',
        name: 'view-aliexpress',
        // component: () => import('@/views/Search/search-views/aliexpress')
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-1688',
        name: 'view-1688',
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-1688global',
        name: 'view-1688global',
        component: () => import('@/views/Search/search-views/1688global')
    },
    {
        path: '/view-yiwugo',
        name: 'view-yiwugo',
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-dhgate',
        name: 'view-dhgate',
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-mic',
        name: 'view-mic',
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-cjds',
        name: 'view-cjds',
        component: () => import('@/views/Search/search-views/search_result')
    },
    {
        path: '/view-litbox',
        name: 'view-litbox',
        component: () => import('@/views/Search/search-views/search_result')
    },
]

const router = new VueRouter({
    routes
})

export default router
