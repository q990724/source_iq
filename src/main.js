import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(ElementUI);

// 创建多语言，并配置语言文件
export const i18n = new VueI18n({
    locale: 'en', // 默认语言标识
    messages: {
        'zh': require('@/lang/zh'),
        'en': require('@/lang/en'),
    }
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

