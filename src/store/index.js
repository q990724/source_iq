import Vue from 'vue'
import Vuex from 'vuex'
import { getSource } from "@/assets/js/source_map.js";
import SourceMap from "@/assets/js/source_map.js";
import { alibaba, _1688, _1688global, aliexpress,  yiwugo, dhgate, mic, cjds, litbox } from "@/assets/js/apis"
import { getFileFromBase64 } from "@/assets/js/utils.js";
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		source_id: null, // 货源ID
		searchType: null, // 当前搜索模式，‘image’、‘text’
		// 搜索参数
        imageAddress: null,
        originImage: null, // 首次搜索时上传/接收的图片
        mainImage: null, // 当前搜索的图片(base64)
        searchText: null, // 当前搜索文字
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
		resetSearchParams(state,searchType) {
			if(searchType == 'image') {
				this.state.originImage = null;
				this.state.mainImage = null;
				this.state.imageAddress = null;
				// 如果图片搜索参数重置，那么图片上传状态也要重置
                this.commit('resetUploadState');
			} else if(searchType == 'text') {
				this.state.searchText = null;
			}
		},
		// 重置图片上传状态
		resetUploadState() {
			this.state.imageUploadState = 'none';
			this.state.imageAddress = null;
		},
		// 重置搜索状态
		resetSearchState() {
			// 清除之前一切搜索状态（等于搜索从未发生过）
			this.state.searchState = 'none';
			this.state.firstSearchState = 'none';
		},
		dumpAll(state, msg) {
			console.log(msg);
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
				//TBD: 要检查app-setting是否为NULL，并做好异步处理
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
		// 设置当前搜索图片原站返回的图片地址
		setImageAddress(state, imageAddress) {
		    state.imageAddress = imageAddress;
		},
		// 清空当前搜索图片原站返回的图片地址
		clearImageAddress(state) {
		    state.imageAddress = null;
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
            function handleCheckBoxParams({ self = payload.self, e = payload.e, o = payload.options, key, symbol = ",", joint = '' }) {
                let arr = [];
                if(self.searchTextParams[key]) {
                    arr = self.searchTextParams[key].split(symbol);
                }
                if(e) {
                    arr.push(joint + o.paramValue);
                }else if(arr.includes(joint + o.paramValue)) {
                    arr.splice(arr.indexOf(joint + o.paramValue), 1);
                }
                self.searchTextParams[key] = arr.join(symbol);
                if(arr.length <= 0) {
                    delete self.searchTextParams[key];
                }
            }
            return new Promise((resolve)=>{
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
                        handleCheckBoxParams({ key:payload.filterItem.paramName });
                        switch (payload.filterItem.title) {
                            case 'Management Certification':
                                handleCheckBoxParams({ key:'param_order', joint:'CAT-' });
                                break;
                            case 'Product Certification':
                                handleCheckBoxParams({ key:'param_order', joint:'PAT-' });
                                break;
                            case 'Supplier Country/Region':
                                handleCheckBoxParams({ key:'param_order', joint:'CNTRY-' });
                                break;
                            case 'Past Export Countries':
                                handleCheckBoxParams({ key:'param_order', joint:'EC-' });
                                break;
                            default:
                                handleCheckBoxParams({ key:'param_order', joint:'ATTR-' });
                                break;
                        }
                        break;
                    case SourceMap['1688']['id']:
                        handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                        break;
                    case SourceMap['1688overseas']['id']:
                        handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                        break;
                    case SourceMap['1688global']['id']:
                        switch (payload.filterItem.title) {
                            case '地区':
                                payload.self.location = payload.e ? payload.options.name : '';
                                break;
                            case '属性':
                                if(payload.e) {
                                    if(!Array.isArray(payload.self.tags)) payload.self.tags = [];
                                    payload.self.tags.push(payload.options.name);
                                }else {
                                    for (let i = 0; i < payload.self.tags.length; i++) {
                                        if(payload.self.tags[i] === payload.options.name) {
                                            payload.self.tags.splice(i, 1);
                                        }
                                    }
                                }
                                break;
                            default:
                                handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                                break;
                        }
                        break;
                    case SourceMap['aliexpress']['id']:
                        switch (payload.filterItem.title) {
                            case 'Brands':
                                payload.self.searchTextParams.brand_id = payload.options.paramValue;
                                break;
                            default:
                                handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                                break;
                        }

                        break;
                    case SourceMap['yiwugo']['id']:
                        handleCheckBoxParams({ key:payload.filterItem.paramName});
                        break;
                    case SourceMap['dhgate']['id']:
                        switch (payload.filterItem.title) {
                            case 'Ship from':
                                // handleCheckBoxParams(payload.self, payload.e, payload.o, 'inventoryLocation', ";");
                                payload.self.searchTextParams.inventoryLocation = payload.options.paramValue;
                                break;
                            default:
                                handleCheckBoxParams({ key:payload.filterItem.paramName});
                        }
                        break;
                    case SourceMap['mic']['id']:
                        handleCheckBoxParams({ key:payload.filterItem.paramName});
                        break;
                    case SourceMap['cjds']['id']:
                        switch (payload.filterItem.title) {
                            case 'Ship From':
                                payload.self.searchTextParams.country = payload.options.paramValue;
                                break;
                            default:
                                handleCheckBoxParams({ key:payload.filterItem.paramName});
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
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoods({ ...payload.searchTextParams, page: payload.page, sessionId: payload.sessionId}))
                        break;
                    case SourceMap['1688global']['id']:
                        resolve(await _1688global.searchGoodsKj({ ...payload.searchTextParams, page: payload.page, sessionId: payload.sessionId, requestId: payload.requestId }))
                        break;
                    case SourceMap['aliexpress']['id']:
                        resolve(await aliexpress.searchGoodsByText({ ...payload.searchTextParams,page: payload.page }))
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
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoods({ ...payload.searchTextParams, page: payload.page, sessionId: payload.sessionId}))
                        break;
                }
            })
        },

        firstSearchText(content,payload){
            return new Promise(async (resolve)=>{
                switch (this.state.source_id) {
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoodsFirst({ ...payload.searchTextParams,page: payload.page }))
                        break;
                }
                switch (this.state.source_id) {
                    case SourceMap['1688global']['id']:
                        resolve(await _1688global.searchGoodsFirstKj({ ...payload.searchTextParams,page: payload.page }))
                        break;
                }
                switch (this.state.source_id) {
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoodsFirst({ ...payload.searchTextParams,page: payload.page }))
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
                     case SourceMap['1688']['id']:
                         res = await _1688.uploadPicH5( payload )
                         result.retcode = res.retcode
                         result.message = res.message
                         result.data = {}
                         result.data.imageAddress = res.data.imageId
                         resolve(result)
                         break;
                     case SourceMap['1688global']['id']:
                         res = await _1688global.uploadPic( payload )
                         result.retcode = res.retcode
                         result.message = res.message
                         result.data = {}
                         result.data.imageAddress = res.data.imgUrl
                         resolve(result)
                         break;
                     case SourceMap['aliexpress']['id']:
                         res = await aliexpress.uploadPic( payload )
                         result.retcode = res.code
                         result.message = res.msg
                         result.data = {}
                         result.data.imageAddress = res.data.filename
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
                     case SourceMap['1688overseas']['id']:
                         res = await _1688.uploadPicH5( payload )
                         result.retcode = res.retcode
                         result.message = res.message
                         result.data = {}
                         result.data.imageAddress = res.data.imageId
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
                        res = await alibaba.searchGoodsByPic( payload.imageAddress, payload.page, payload.cid )
                        resolve(res)
                        break;
                    case SourceMap['1688']['id']:
                        res = await _1688.searchGoodsByPic({imageId:payload.imageAddress,page:payload.page, yoloRegionSelected:payload.yoloRegionSelected, yoloCropRegion:payload.yoloCropRegion, region:payload.region, pailitaoCategoryId:payload.cid, sessionId:payload.sessionId, requestId:payload.requestId, searchtype:0})
                        resolve(res)
                        break;
                    case SourceMap['1688global']['id']:
                        res = await _1688global.searchGoodsByPic( payload.imageAddress,payload.page, payload.region, payload.cid, payload.location, payload.tags )
                        resolve(res)
                        break;
                    case SourceMap['aliexpress']['id']:
                        res = await aliexpress.searchGoodsByPic( payload.imageAddress, payload.cid )
                        resolve(res)
                        break;
                    case SourceMap['yiwugo']['id']:
                        res = await yiwugo.searchGoodsByPic( payload.imageAddress, payload.page)
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
                    case SourceMap['1688overseas']['id']:
                        res = await _1688.searchGoodsByPic({imageId:payload.imageAddress,page:payload.page, yoloRegionSelected:payload.yoloRegionSelected, yoloCropRegion:payload.yoloCropRegion, region:payload.region, pailitaoCategoryId:payload.cid, sessionId:payload.sessionId, requestId:payload.requestId, searchtype:1 })
                        resolve(res)
                        break;
                }
            })
        },

        firstSearchPic(content,payload){
            return new Promise(async (resolve)=>{
                switch (this.state.source_id) {
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoodsByPicFirst( {imageId:payload.imageAddress, yoloRegionSelected:payload.yoloRegionSelected, yoloCropRegion:payload.yoloCropRegion, region:payload.region, pailitaoCategoryId:payload.cid, searchtype:0 } ))
                        break;
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoodsByPicFirst( {imageId:payload.imageAddress, yoloRegionSelected:payload.yoloRegionSelected, yoloCropRegion:payload.yoloCropRegion, region:payload.region, pailitaoCategoryId:payload.cid, searchtype:1 } ))
                        break;
                }
            })
        },
    },
    modules: {},

})
