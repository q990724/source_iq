import Vue from 'vue'
import Vuex from 'vuex'
import { getSource } from "@/assets/js/source_map.js";
import SourceMap from "@/assets/js/source_map.js";
import { alibaba, yiwugo, dhgate, mic, cjds, litbox } from "@/assets/js/apis"
import { getFileFromBase64 } from "@/assets/js/utils.js";
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
                this.commit('resetUploadState');
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
		dumpAll() {
			console.log("source_id:", this.state.source_id);
			console.log("searchType:", this.state.searchType);
			console.log("imageAddress:", this.state.imageAddress);
			console.log("originImage:", this.state.originImage);
			console.log("mainImage:", this.state.mainImage);
			console.log("searchText:", this.state.searchText);
			console.log("imageUploadState:", this.state.imageUploadState);
			console.log("searchState:", this.state.searchState);
			console.log("firstSearchState:", this.state.firstSearchState);				
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
            function handleCheckBoxParams(self, e, o, key, s = ",") {
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
                    case SourceMap['alibaba']['id']:
                        switch (payload.title) {
                            case 'Shipping':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'productTag', ";");
                                break;
                            case 'Sample Order':
                                payload.self.searchTextParams.param_order="IFS-1";
                                payload.self.searchTextParams.freeSample = payload.o.id;
                                break;
                            case 'Management Certification':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'companyAuthTag');
                                break;
                            case 'Product Certification':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'productAuthTag');
                                break;
                            case 'Supplier Country/Region':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'Country');
                                break;
                            case 'Past Export Countries':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'exportCountry');
                                break;
                            case 'Supplier Types':
                                payload.e ? payload.self.searchTextParams[payload.o.param] = payload.o.id : delete payload.self.searchTextParams[payload.o.param];
                                break;
                            default:
                                break;
                        }
                        break;
                    case SourceMap['yiwugo']['id']:
                        switch (payload.title) {
                            case '市场':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'sub_market');
                                break;
                        }
                        break;
                    case SourceMap['dhgate']['id']:
                        switch (payload.title) {
                            case 'Ship from':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'inventoryLocation', ";");
                                break;
                            default:
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'at');
                        }
                        break;
                    case SourceMap['mic']['id']:
                        switch (payload.title) {
                            case 'Location':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'location');
                                break;
                            case 'Member Type':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'memberType');
                                break;
                            case 'Color':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'color');
                                break;
                            default:
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'property');
                        }
                        break;
                    case SourceMap['cjds']['id']:
                        switch (payload.title) {
                            case 'Ship From':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'country');
                                break;
                            case 'Filter by Types':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'productType');
                                break;
                            case 'Special Services & Discount':
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'addMarkStatus');
                                break;
                            default:
                                handleCheckBoxParams(payload.self, payload.e, payload.o, 'property');
                        }
                        break;
                }
                resolve()
            })
        },

        searchText(content,payload){
            return new Promise(async(resolve)=>{
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
                        resolve(await alibaba.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                    case SourceMap['yiwugo']['id']:
                        resolve(await yiwugo.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                    case SourceMap['dhgate']['id']:
                        resolve(await dhgate.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                    case SourceMap['mic']['id']:
                        resolve(await mic.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                    case SourceMap['cjds']['id']:
                        resolve(await cjds.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                    case SourceMap['litbox']['id']:
                        resolve(await litbox.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
                        break;
                }
            })
        },

         uploadPic(content,payload){
            let res = null, result = {};
             return new Promise(async (resolve)=>{
                 switch (this.state.source_id) {
                     case SourceMap['alibaba']['id']:
                         res = await alibaba.uploadPic( payload )
                         result.retcode = res.code
                         result.message = res.msg
                         result.data = {}
                         result.data.imageAddress = res.data.imageAddress
                         resolve(result)
                         break;
                     case SourceMap['yiwugo']['id']:
                         res = await yiwugo.uploadPic( payload )
                         result.retcode = res.code
                         result.message = res.msg
                         result.data = {}
                         result.data.imageAddress = res.data.url
                         resolve(result)
                         break;
                 }
            })
        },

        searchPic(content,payload){
            console.log(payload);
            let file = null, resImg = '', is_file = true, res = null, result = {};

            let source = getSource(this.state.source_id);
            if (source.hasUpload === false) {
                //如果没有上传图片成功的状态就先将base64转图片传递，否则直接传上传成功后的返回值
                if(this.state.imageUploadState !== 'uploaded') {
                    file = getFileFromBase64(payload.imageAddress);
                }else{
                    resImg = payload.imageAddress;
                    is_file = false
                }
            }

            return new Promise(async (resolve)=>{
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
                        res = await alibaba.searchGoodsByPic( payload.imageAddress,payload.page, payload.cid )
                        resolve(res)
                        break;
                    case SourceMap['yiwugo']['id']:
                        res = await yiwugo.searchGoodsByPic( payload.imageAddress )
                        resolve(res)
                        break;
                    case SourceMap['dhgate']['id']:
                        res = await dhgate.searchGoodsByPic( is_file, file, resImg, payload.page, payload.cid )
                        res.data.searchImage.imageAddress = res.sourceResult.data.data.imgUrl
                        resolve(res)
                        break;
                    case SourceMap['mic']['id']:
                        res = await mic.searchGoodsByPic( is_file, file, resImg, payload.page , payload.cid )
                        res.data.searchImage.imageAddress = res.sourceResult.data.content.imgId
                        resolve(res)
                        break;
                    case SourceMap['cjds']['id']:
                        res = await cjds.searchGoodsByPic( file )
                        resolve(res)
                        break;
                }
            })
        },
    },
    modules: {},

})
