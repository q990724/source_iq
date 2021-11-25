import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        imageAddress: '', 
        source_id: 1, // 货源ID
        // 继续搜索
        continueSearchParams: {
            continueSearch: false,
            continueSearchType: 'image',
            continueSearchImage: null,
            continueSearchText: null
        }
    },
    mutations: {

    },
    actions: {},
    modules: {}
})
