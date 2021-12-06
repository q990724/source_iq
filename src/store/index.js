import Vue from 'vue'
import Vuex from 'vuex'
import SoureMap from "@/assets/js/source_map.js";
import { dhgate } from "@/assets/js/apis"
import { mic } from "@/assets/js/apis"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		source_id: null, // 货源ID
		searchType: null, // 当前搜索模式，‘image’、‘text’
		// 搜索参数
        imageAddress: '',
        originImage: null, // 首次搜索时上传/接收的图片
        mainImage: null, // 当前搜索的图片(base64)
        searchText: '', // 当前搜索文字
		// 图片上传状态
		imageUploadState: 'none', // 图片上传状态 none: 未发起上传, uploaded: 图片上传完成, error: 图片上传失败
		//搜索状态
        searchState: 'none', // 搜索状态 none：未发起搜索/搜索结果被清空，success: 正常收到相应，error：搜索出错/接口返回错误，null: 搜索结果为空
        firstSearchState: 'none', // none：未发起首次搜索，success: 首次搜索成功，error：首次搜索失败
    },
    mutations: {
		// 重置全部，包括搜索模式、搜索参数、图片上传状态、搜索状态；“source_id"初始化责任在content和vue.mounted两处
		resetAll() {
			this.state.searchType = null;
			this.commit('resetSearchParams','image');
			this.commit('resetSearchParams','text');
			this.commit('resetUploadState');
			this.commit('resetSearchState');
		},
		// 根据搜索模式参数，重置搜索参数
		resetSearchParams(searchType) {
			if(searchType == 'image') {
				this.state.originImage = null;
				this.state.mainImage = null;
				this.state.imageAddress = '';
				// 如果图片搜索参数重置，那么图片上传状态也要重置
				imageUploadState = 'none';
			} else if(searchType == 'text') {
				this.state.searchText = '';
			}
		},
		// 重置图片上传状态
		resetUploadState() {
			this.state.imageUploadState = 'none';
		},
		// 重置搜索状态
		resetSearchState() {
			// 清除之前一切搜索状态（等于搜索从未发生过）
			this.state.searchState = 'none';
			this.state.firstSearchState = 'none';
		},
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
            state.originImage = null;
            state.searchText = text;
        },
        // 清空搜索词
        clearSearchText(state) {
            state.searchText = '';
        },
        // 设置搜索状态
        setSearchState(state, s) {
            state.searchState = s;
        },
        // 设置图片上传状态
        setImageUploadState(state, s) {
            state.imageUploadState = s;
        },
        setFirstSearchState(state, s) {
            state.firstSearchState = s;
        }
    },
    actions: {
        // 点击筛选条件发请求筛选
        filterChange(content,payload){
            function handleCheckBoxParams(self, key, s = ",", e, o) {
                let arr = [];
                if(self.searchTextParams[key]) {
                    arr = self.searchTextParams[key].split(s);
                }
                if(e) {
                    arr.push(o.id);
                }else if(arr.includes(o.id)) {
                    arr.splice(arr.indexOf(o.id), 1);
                }
                self.searchTextParams[key] = arr.join(s);
                if(arr.length <= 0) {
                    delete self.searchTextParams[key];
                }
            }
            return new Promise((resolve)=>{
                switch (this.state.source_id) {
                    case SoureMap['dhgate']['id']:
                        switch (payload.title) {
                            case 'Ship from':
                                handleCheckBoxParams(payload.self, 'inventoryLocation', ";", payload.e, payload.o);
                                break;
                            default:
                                handleCheckBoxParams(payload.self, 'at', ',', payload.e, payload.o);
                        }
                        break;
                    case SoureMap['mic']['id']:
                        switch (payload.title) {
                            case 'Location':
                                handleCheckBoxParams(payload.self, 'location', "", payload.e, payload.o);
                                break;
                            case 'Member Type':
                                handleCheckBoxParams(payload.self, 'memberType', "", payload.e, payload.o);
                                break;
                            case 'Color':
                                handleCheckBoxParams(payload.self, 'color', "", payload.e, payload.o);
                                break;
                            default:
                                handleCheckBoxParams(payload.self, 'property', ',', payload.e, payload.o);
                        }
                        break;
                }
                resolve()
            })
        },
        searchText(content,payload){
            return new Promise((resolve)=>{
                switch (this.state.source_id) {
                    case SoureMap['dhgate']['id']:
                        resolve(dhgate.searchGoodsByText({ ...payload.searchTextParams,page_num: payload.page }))
                        break;
                    case SoureMap['mic']['id']:
                        resolve(mic.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                }
            })
        },
         uploadPic(content,payload){
             return new Promise(async (resolve)=>{
                switch (this.state.source_id) {
                    case SoureMap['dhgate']['id']:
                        var res = await dhgate.uploadPic( payload )
                        resolve(res.sourceResult.data.data.imgUrl)
                        break;
                    case SoureMap['mic']['id']:
                        var res =  await mic.uploadPic( payload )
                        resolve(res.sourceResult.data.content.imgId)
                        break;
                }
            })
        },
        searchPic(content,payload){
            return new Promise((resolve)=>{
                // let file = getFileFromBase64(payload.imageAddress);
                switch (this.state.source_id) {
                    case SoureMap['dhgate']['id']:
                        resolve(dhgate.searchGoodsByPic( payload.imageAddress,payload.page, payload.cid ))
                        break;
                    case SoureMap['mic']['id']:
                        resolve(mic.searchGoodsByPic( payload.imageAddress, payload.page , payload.cid ))
                        break;
                }
            })
        },
    },
    modules: {},

})
