import Vue from 'vue'
import VueRouter from 'vue-router'
import SourceMap from "@/assets/js/source_map";
const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

// const routes = [
//     {
//         path: '/',
//         name: 'Index',
//         redirect: '/layout/view-alibaba'
//     },
//     {
//         path: '/layout',
//         name: 'Layout',
//         component: () => import('@/layout/layout'),
//         children: [
//             {
//                 path: 'view-alibaba',
//                 name: 'view-alibaba',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-aliexpressDS',
//                 name: 'view-aliexpressDS',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-aliexpressZapieX',
//                 name: 'view-aliexpressZapieX',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-1688',
//                 name: 'view-1688',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-1688rapid',
//                 name: 'view-1688rapid',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-1688global',
//                 name: 'view-1688global',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-yiwugo',
//                 name: 'view-yiwugo',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-dhgate',
//                 name: 'view-dhgate',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-mic',
//                 name: 'view-mic',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-cjds',
//                 name: 'view-cjds',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-litbox',
//                 name: 'view-litbox',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-1688overseas',
//                 name: 'view-1688overseas',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-banggood',
//                 name: 'view-banggood',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-chinabrands',
//                 name: 'view-chinabrands',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//             {
//                 path: 'view-globalres',
//                 name: 'view-globalres',
//                 component: () => import('@/views/Search/search-views/search_result')
//             },
//         ]
//     }
// ]

let routes = [];
let layout = {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/layout/layout'),
    children: []
}
SourceMap.forEach(e=>{
    let route = {
        path: `${e.sourceName}`,
        name: `${e.sourceName}`,
        component: () => import('@/views/Search/search-views/search_result'),
        meta: {
            absPath: `/layout/${e.sourceName}`
        }
    }
    layout.children.push(route);
})
routes[0] = {
    path: '/',
    name: 'Index',
    redirect: layout.children[0]['meta'].absPath
}
routes[1] = layout;

const router = new VueRouter({
    routes: routes
})

export default router
