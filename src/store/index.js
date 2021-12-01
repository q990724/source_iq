import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        imageAddress: '',
        source_id: null, // 货源ID
        originImage: null, // 首次搜索时上传/接收的图片
        mainImage: null, // 当前搜索的图片(base64)
        searchText: '', // 当前搜索文字
        searchType: 'image', // 当前搜索模式
        searchState: 'none', // 搜索状态 none：未发起搜索/搜索结果被清空，success: 正常收到相应，error：搜索出错/接口返回错误，null: 搜索结果为空
    },
    mutations: {
        // 获取插件设置
        getAppSetting(state) {
            if(window.localStorage.getItem('app-setting')) {
                let appSetting = JSON.parse(window.localStorage.getItem('app-setting'));
                state.source_id = appSetting.source;
            }
            window.localStorage.removeItem('app-setting');
        },
        // 设置货源id
        setSourceId(state, id) {
            state.source_id = id;
        },
        // 清空window缓存中的uploadFile
        clearWindowStorageUploadFile() {
            if(window.localStorage.getItem('upload-file')) {
                window.localStorage.removeItem('upload-file');
            }
        },
        // 清除搜索图片
        clearMainImage(state) {
            state.mainImage = null;
        },
        // 设置搜索图片
        setMainImage(state, image) {
            state.searchText = '';
            state.mainImage = image;
        },
        // 清除搜索图片
        clearOriginImage(state) {
            state.originImage = null;
        },
        // 设置搜索图片
        setOriginImage(state, image) {
            this.commit('clearWindowStorageUploadFile');
            state.searchText = '';
            state.originImage = image;
        },
        // 设置图片缓存
        setWindowStorageUploadFile(state, base64) {
            window.localStorage.setItem('upload-file', base64);
        },
        // 设置搜索类型
        setSearchType(state, type) {
            state.searchType = type;
        },
        // 设置搜索文字
        setSearchText(state, text) {
            state.mainImage = null;
            state.searchText = text;
        },
        clearSearchText(state) {
            state.searchText = '';
        },
        setSearchState(state, s) {
            state.searchState = s;
        }
    },
    actions: {},
    modules: {},

})
