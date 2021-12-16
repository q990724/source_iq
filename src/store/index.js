import Vue from 'vue'
import Vuex from 'vuex'
import { getSource } from "@/assets/js/source_map.js";
import SourceMap from "@/assets/js/source_map.js";
import { alibaba, _1688, _1688global, aliexpressDS, aliexpressZapieX,  yiwugo, dhgate, mic, cjds, litbox, banggood, chinabrands, globalres } from "@/assets/js/apis";
import { getFileFromBase64, collapse } from "@/assets/js/utils.js";
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		source_id: null, // 货源ID
		searchType: null, // 当前搜索模式，‘image’、‘text’
		// 搜索参数
		searchParams: {
			searchText: null, // 当前搜索文字
            imageAddress: null,
            originImage: null, // 首次搜索时上传/接收的图片
            mainImage: null, // 当前搜索的图片(base64)
            //1688或1688跨境切图所需
            yoloCropRegion: null,
            region: null,
		},
        // imageAddress: null,
        // originImage: null, // 首次搜索时上传/接收的图片
        // mainImage: null, // 当前搜索的图片(base64)
		// //1688或1688跨境切图所需
		// yoloCropRegion: null,
		// region: null,
        // searchText: null, // 当前搜索文字
		// 图片上传状态
		imageUploadState: 'none', // 图片上传状态 none: 未发起上传, uploaded: 图片上传完成, error: 图片上传失败
		//搜索状态
        searchState: 'none', // 搜索状态 none：未发起搜索/搜索结果被清空，success: 正常收到相应，error：搜索出错/接口返回错误，null: 搜索结果为空
        firstSearchState: 'none', // none：未发起首次搜索，success: 首次搜索成功，error：首次搜索失败
		//1688, 1688global, 1688overseas首次图搜和文字搜索接口调用返回，作为后续分页请求的必选参数
		session: {
			// cookie: null,
			sessionId: null,
			requestId: null,
		},
    },
    mutations: {
		// 重置全部，包括搜索模式、搜索参数、图片上传状态、搜索状态；“source_id"初始化责任在content和vue.mounted两处
		resetAll() {
			this.state.searchType = null;
			this.commit('resetSearchParams','image');
			this.commit('resetSearchParams','text');
			this.commit('clearConditions');
			this.commit('resetUploadState');
			this.commit('resetSearchState');
		},
        clearConditions(state) {
			console.log("before clearConditions->state.searchParams:", state.searchParams);

			for (let key in state.searchParams) {
				if(key === 'searchText' || key === 'imageAddress' || key === 'originImage' || key === 'mainImage' || key === 'yoloCropRegion' || key === 'region') continue;
				delete state.searchParams[key]
			}
            // (state.searchParams.cat_id != null) ? state.searchParams.categoryId : null;
            // (state.searchParams.category != null) ? state.searchParams.categoryId : null;
        },
		// 根据搜索模式参数，重置搜索参数
		resetSearchParams(state,searchType) {
			if(searchType == 'image') {
				this.state.searchParams.originImage = null;
				this.state.searchParams.mainImage = null;
				this.state.searchParams.imageAddress = null;
				this.state.searchParams.yoloCropRegion = null;
				this.state.searchParams.region = null;
				// 如果图片搜索参数重置，那么图片上传状态也要重置
                this.commit('resetUploadState');
			} else if(searchType == 'text') {
				this.state.searchParams['searchText'] = null;
			}
			// this.commit('clearConditions');
            // state.searchParams = {};
		},
		// 重置图片上传状态
		resetUploadState() {
			this.state.imageUploadState = 'none';
			this.state.searchParams.imageAddress = null;
			// 无需重置yoloCropRegion和region？
		},
		// 重置搜索状态
		resetSearchState() {
			// 清除之前一切搜索状态（等于搜索从未发生过）
			this.state.searchState = 'none';
			this.state.firstSearchState = 'none';
			this.state.session['sessionId'] = null;
			this.state.session['requestId'] = null;
			// 无需重置yoloCropRegion和region？
		},
		dumpAll(state, msg) {
			console.log(msg);
			console.log("source_id:", this.state.source_id);
			console.log("searchType:", this.state.searchType);
			console.log("searchParams:", this.state.searchParams);
			// console.log("imageAddress:", this.state.searchParams.imageAddress);
			// console.log("originImage:", this.state.searchParams.originImage);
			// console.log("mainImage:", this.state.searchParams.mainImage);
			// console.log("yoloCropRegion:", this.state.searchParams.yoloCropRegion);
			// console.log("region:", this.state.searchParams.region);
			// console.log("searchText:", this.state.searchParams.searchText);
			console.log("imageUploadState:", this.state.imageUploadState);
			console.log("searchState:", this.state.searchState);
			console.log("firstSearchState:", this.state.firstSearchState);
			console.log("session:", this.state.session);	
			// console.log("requestId:", this.state.session['requestId']);
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
		    state.searchParams.imageAddress = imageAddress;
		},
		// 清空当前搜索图片原站返回的图片地址
		clearImageAddress(state) {
		    state.searchParams.imageAddress = null;
		},
        // 清除搜索图片
        clearMainImage(state) {
            state.searchParams.mainImage = null;
        },
        // 设置搜索图片
        setMainImage(state, image) {
            state.searchParams['searchText'] = null;
            state.searchParams.mainImage = image;
        },
        // 清除搜索图片
        clearOriginImage(state) {
            state.searchParams.originImage = null;
        },
        // 设置搜索图片
        setOriginImage(state, image) {
            this.commit('clearWindowStorageUploadFile');
            state.searchParams.searchText = null;
            state.searchParams.originImage = image;
        },
        // 设置图片缓存
        setWindowStorageUploadFile(state, base64) {
            window.localStorage.setItem('upload-file', base64);
        },
        // 设置搜索类型
        setSearchType(state, type) {
            state.searchType = type;
        },
		// 如果插入的key存在，直接覆盖原有的
		addSearchParam(state, param) {
		    // let key = Object.keys(param);
		    // state.searchParams[key[0]] = param[key[0]];
		    state.searchParams[param.key] = param.val;
		},
		delSearchParam(state, key) {
		    delete state.searchParams[key];
		    // 也需要删除这个key，value对儿？
		},
        // 设置搜索文字
        setSearchText(state, text) {
            state.searchParams.mainImage = null;
            state.searchParams.originImage = null;
			state.searchParams['searchText'] = text;
        },
        // 清空搜索词
        clearSearchText(state) {
            state.searchParams['searchText'] = null;
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
        },
		setSessionId(state, s) {
		    state.session['sessionId'] = s;
		},
		setRequestId(state, s) {
		    state.session['requestId'] = s;
		},
		setYoloCropRegion(state, s) {
		    state.searchParams.yoloCropRegion = s;
		},
		setRegion(state, s) {
		    state.searchParams.region = s;
		},
        // 设置图片搜索标识，如果存在此标识，证明window.localStore中有uploadFile
        setImageSearchId() {
            window.localStorage.setItem('has-upload-file', 'true');
        },
        // 清空图片搜素标识
        clearImageSearchId() {
            window.localStorage.removeItem('has-upload-file');
        }
    },
    actions: {
        // 点击筛选条件发请求筛选
		// payload包括filterItem（选中的filter类，该类选中的option，选中的当前值e三个参数
        onFilterChange(content,payload){
            // function handleCheckBoxParams({ self = payload.self, e = payload.e, o = payload.options, selectUIType = payload.filterItem.selectUIType, key, symbol = ",", joint = '' }) {
            //     let arr = [];
            //     // if(selectUIType && self.searchTextParams[key] && selectUIType === "checkbox"){
            //     //     arr = self.searchTextParams[key].split(symbol);
            //     // }
            //     if(self.searchTextParams[key]){
            //         arr = self.searchTextParams[key].split(symbol);
            //     }
            //
            //     if(e) {
            //         arr.push(joint + o.paramValue);
            //     }else if(arr.includes(joint + o.paramValue)) {
            //         arr.splice(arr.indexOf(joint + o.paramValue), 1);
            //     }
            //
            //     self.searchTextParams[key] = arr.join(symbol);
            //     if(arr.length <= 0) {
            //         delete self.searchTextParams[key];
            //     }
            // }

            let that = this;
			// 对任意一个categoryList/filterList/exprList/sortList的filterItem，拼装传参数据
			function handleParams({filterItem, option, e, separator = ",", joint = ''}) {
				//TBD：缺乏参数的鲁棒性检查，例如：paramName/filterItem.title都不能为NULL或者‘’
				if(!filterItem.paramName) {
					//TBD: 后台接口没有针对该条件组返回paramName，是个严重错误
					//return;
				}
				if(!filterItem.title) {
					//TBD:如果该条件组没有返回title，用paramName填充，作为鲁棒性措施
					filterItem.title=filterItem.paramName;
				}
			    if(!that.state.searchParams[filterItem.paramName]) that.state.searchParams[filterItem.paramName] = {}

				// 如果filterItem是“单选”，先清除之前的参数值
				if(filterItem.selectUIType === 'radio' && that.state.searchParams[filterItem.paramName] && (filterItem.title in that.state.searchParams[filterItem.paramName])){
                        //TBD：不确定如下语法是否正确
                        delete that.state.searchParams[filterItem.paramName][filterItem.title];
				}
                let arr = [];
				// TBD: title 逻辑有问题
                if(that.state.searchParams[filterItem.paramName][filterItem.title]){
                    arr = that.state.searchParams[filterItem.paramName][filterItem.title].split(separator);
                }

                if(option.paramValue){
                    if(e) {
                        arr.push(joint + option.paramValue);
                    }else if(arr.includes(joint + option.paramValue)) {
                        arr.splice(arr.indexOf(joint + option.paramValue), 1);
                    }
                }
                that.state.searchParams[filterItem.paramName][filterItem.title] = arr.join(separator);
                // TBD：如果arr=['']，这时是否删除了《key，value》？
                if(arr.length <= 0) {
                    delete that.state.searchParams[filterItem.paramName][filterItem.title];
                }

				// 获取之前的参数值，并转化成参数值数组
                // let arr = [];
				// if(that.state.searchParams[filterItem.paramName]){
				//     arr = that.state.searchParams[filterItem.paramName].split(separator);
				// }
				// // 如果“选中”，添加参数值到参数值数组；如果"取消选中"，删除之前已经保存的参数值
				// // TBD: 如果e==false，目前的默认逻辑不是《key=‘’》，而是根本不传《key》
				// // payload.self.location = payload.e ? payload.options.name : '';
                // if(option.paramValue){
                //     if(e) {
                //         arr.push(joint + option.paramValue);
                //     }else if(arr.includes(joint + option.paramValue)) {
                //         arr.splice(arr.indexOf(joint + option.paramValue), 1);
                //     }
                // }
                //
                // that.state.searchParams[filterItem.paramName] = arr.join(separator);
				// // TBD：如果arr=['']，这时是否删除了《key，value》？
				// if(arr.length <= 0) {
				//     delete that.state.searchParams[filterItem.paramName];
				// }
			}
            return new Promise((resolve)=>{
                // switch (this.state.source_id) {
                //     case SourceMap['alibaba']['id']:
                //         handleCheckBoxParams({ key:payload.filterItem.paramName });
                //         switch (payload.filterItem.title) {
                //             case 'Management Certification':
                //                 handleCheckBoxParams({ key:'param_order', joint:'CAT-' });
                //                 break;
                //             case 'Product Certification':
                //                 handleCheckBoxParams({ key:'param_order', joint:'PAT-' });
                //                 break;
                //             case 'Supplier Country/Region':
                //                 handleCheckBoxParams({ key:'param_order', joint:'CNTRY-' });
                //                 break;
                //             case 'Past Export Countries':
                //                 handleCheckBoxParams({ key:'param_order', joint:'EC-' });
                //                 break;
                //             default:
                //                 handleCheckBoxParams({ key:'param_order', joint:'ATTR-' });
                //                 break;
                //         }
                //         break;
                //     case SourceMap['1688']['id']:
                //         handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                //         break;
                //     case SourceMap['1688overseas']['id']:
                //         handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                //         break;
                //     case SourceMap['1688global']['id']:
                //         switch (payload.filterItem.title) {
                //             case '地区':
                //                 payload.self.location = payload.e ? payload.options.name : '';
                //                 break;
                //             case '属性':
                //                 if(payload.e) {
                //                     if(!Array.isArray(payload.self.tags)) payload.self.tags = [];
                //                     payload.self.tags.push(payload.options.name);
                //                 }else {
                //                     for (let i = 0; i < payload.self.tags.length; i++) {
                //                         if(payload.self.tags[i] === payload.options.name) {
                //                             payload.self.tags.splice(i, 1);
                //                         }
                //                     }
                //                 }
                //                 break;
                //             default:
                //                 handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                //                 break;
                //         }
                //         break;
                //     case SourceMap['aliexpress']['id']:
                //         switch (payload.filterItem.title) {
                //             case 'Brands':
                //                 payload.self.searchTextParams.brand_id = payload.e ? payload.options.paramValue : '';
                //                 break;
                //             default:
                //                 handleCheckBoxParams({ key:payload.filterItem.paramName, symbol: ';' });
                //                 break;
                //         }
                //
                //         break;
                //     case SourceMap['yiwugo']['id']:
                //         handleCheckBoxParams({ key:payload.filterItem.paramName});
                //         break;
                //     case SourceMap['dhgate']['id']:
                //         switch (payload.filterItem.title) {
                //             case 'Ship from':
                //                 // handleCheckBoxParams(payload.self, payload.e, payload.o, 'inventoryLocation', ";");
                //                 // payload.self.searchTextParams.inventoryLocation = payload.e ? payload.options.paramValue : '';
                //                 content.commit('addSearchParam',{key:payload.filterItem.paramName, val: payload.option.paramValue});
                //                 break;
                //             default:
                //                 handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                //         }
                //         break;
                //     case SourceMap['mic']['id']:
                //         switch (payload.filterItem.title) {
                //             case 'Location':
                //                 payload.self.searchTextParams.location = payload.e ? payload.options.paramValue : '';
                //                 break;
                //             case 'Member Type':
                //                 payload.self.searchTextParams.memberType = payload.e ? payload.options.paramValue : '';
                //                 break;
                //             case 'Color':
                //                 payload.self.color = payload.e ? payload.options.paramValue : '';
                //                 break;
                //             default:
                //                 handleCheckBoxParams({ key:payload.filterItem.paramName});
                //         }
                //         break;
                //     case SourceMap['cjds']['id']:
                //         switch (payload.filterItem.title) {
                //             case 'Ship From':
                //                 payload.self.searchTextParams.country = payload.e ? payload.options.paramValue : '';
                //                 break;
                //             default:
                //                 handleCheckBoxParams({ key:payload.filterItem.paramName});
                //         }
                //         break;
                //     case SourceMap['banggood']['id']:
                //         payload.self.searchTextParams[payload.filterItem.paramName] = payload.e ? payload.options.paramValue : '';
                //         break;
                //     case SourceMap['chinabrands']['id']:
                //         payload.self.searchTextParams[payload.filterItem.paramName] = payload.e ? payload.options.paramValue : '';
                //         break;
                //     case SourceMap['globalres']['id']:
                //         payload.self.searchTextParams[payload.filterItem.paramName] = payload.e ? payload.options.paramValue : '';
                //         break;
                // }
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
						// 先处理所有的category，filter，expr的共性逻辑
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
						
						// 再处理所有的category，filter，expr的个性逻辑
                        // 深度复制，其实只需要paramName不需要深度复制
                        let filterItemClone = JSON.parse(JSON.stringify(payload.filterItem));
                        filterItemClone.paramName = 'param_order';
                        filterItemClone.selectUIType = 'checkbox';
                        filterItemClone.title = 'param_order';
						// TBD：按照标题进行条件处理逻辑很脆弱。标题拼写只要修改逻辑就会崩掉
                        switch (payload.filterItem.title) {
                            // case 'Related Category':
                            //     break;
                            // case 'Supplier Types':
                            //     break;
                            // case 'Product Types':
                            //     break;
                            // case 'Min. Order':	//exprList类型
                            //     break;
                            // case 'Price':
                            //     break;
                            case 'Management Certification':	//filterList类型
                                // handleCheckBoxParams({ key:'param_order', joint:'CAT-' });
                                handleParams({ filterItem:filterItemClone, option:payload.option, e:payload.e, joint: 'CAT-'});
                                break;
                            case 'Product Certification':	//filterList类型
                                handleParams({ filterItem:filterItemClone, option:payload.option, e:payload.e, joint: 'PAT-'});
                                break;
                            case 'Supplier Country/Region':	//filterList类型
                                handleParams({ filterItem:filterItemClone, option:payload.option, e:payload.e, joint: 'CNTRY-'});
                                break;
                            case 'Past Export Countries':	//filterList类型
                                handleParams({ filterItem:filterItemClone, option:payload.option, e:payload.e, joint: 'EC-'});
                                break;
                            default:	//categoryList、filterList、exprList类型
								//BUG：目前所有的category，filter，expr都会走到这里处理！
                                handleParams({ filterItem:filterItemClone, option:payload.option, e:payload.e, joint: 'ATTR-'});
                                break;
                        }
                        break;
                    case SourceMap['1688']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e, separator: ';'});
                        break;
                    case SourceMap['1688overseas']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e, separator: ';'});
                        break;
                    case SourceMap['1688global']['id']:
                        // switch (payload.filterItem.title) {
                        //     case '地区':
                        //         payload.self.location = payload.e ? payload.option.name : '';
                        //         break;
                        //     case '属性':
                                // if(payload.e) {
                                //     if(!Array.isArray(payload.self.tags)) payload.self.tags = [];
                                //     payload.self.tags.push(payload.option.name);
                                // }else {
                                //     for (let i = 0; i < payload.self.tags.length; i++) {
                                //         if(payload.self.tags[i] === payload.option.name) {
                                //             payload.self.tags.splice(i, 1);
                                //         }
                                //     }
                                // }
                                // break;
                            // default:
                                handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e, separator: ';'});
                                // break;
                        // }
                        break;
                    case SourceMap['aliexpressDS']['id']:
                        switch (payload.filterItem.title) {
                            case 'Brands':
                                handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                                break;
                            default:
								// TBD：separator分隔符和joint连接符最后应该放到后台接口入参时处理，对前端提供一个统一标准
                                handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e, separator: ';'});
                                break;
                        }

                        break;
                    case SourceMap['aliexpressZapieX']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['yiwugo']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['dhgate']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['mic']['id']:
                        // switch (payload.filterItem.title) {
                        //     case 'Color':
                        //         payload.self.color = payload.e ? payload.options.paramValue : '';
                        //         break;
                        //     default:
                                handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        // }
                        break;
                    case SourceMap['cjds']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['litbox']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['banggood']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['chinabrands']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                    case SourceMap['globalres']['id']:
                        handleParams({ filterItem:payload.filterItem, option:payload.option, e:payload.e});
                        break;
                }
                resolve()
            })
        },

        searchText(content,payload){
            let params = {};
            return new Promise(async(resolve)=>{
                params = collapse({...payload.searchTextParams});
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
                        resolve(await alibaba.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoods({ ...params, page: payload.page, sessionId: payload.sessionId}))
                        break;
                    case SourceMap['1688global']['id']:
                        resolve(await _1688global.searchGoodsKj({ ...params, page: payload.page, sessionId: payload.sessionId, requestId: payload.requestId }))
                        break;
                    case SourceMap['aliexpressDS']['id']:
                        resolve(await aliexpressDS.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['aliexpressZapieX']['id']:
                        resolve(await aliexpressZapieX.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['yiwugo']['id']:
                        resolve(await yiwugo.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['dhgate']['id']:
                        resolve(await dhgate.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['mic']['id']:
                        resolve(await mic.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['cjds']['id']:
                        resolve(await cjds.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['litbox']['id']:
                        resolve(await litbox.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoods({ ...params, page: payload.page, sessionId: payload.sessionId}))
                        break;
                    case SourceMap['banggood']['id']:
                        resolve(await banggood.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['chinabrands']['id']:
                        resolve(await chinabrands.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                    case SourceMap['globalres']['id']:
                        resolve(await globalres.searchGoodsByText({ ...params,page: payload.page }))
                        break;
                }
            })
        },

        firstSearchText(content,payload){
            let params = {};
            return new Promise(async (resolve)=>{
                params = collapse({...payload.searchTextParams});
                switch (this.state.source_id) {
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoodsFirst({ ...params,page: payload.page }))
                        break;
                }
                switch (this.state.source_id) {
                    case SourceMap['1688global']['id']:
                        resolve(await _1688global.searchGoodsFirstKj({ ...params,page: payload.page }))
                        break;
                }
                switch (this.state.source_id) {
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoodsFirst({ ...params,page: payload.page }))
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
                     case SourceMap['aliexpressDS']['id']:
                         res = await aliexpressDS.uploadPic( payload )
                         result.retcode = res.code
                         result.message = res.msg
                         result.data = {}
                         result.data.imageAddress = res.data.filename
                         resolve(result)
                         break;
                     case SourceMap['aliexpressZapieX']['id']:
                         res = await aliexpressZapieX.uploadPic( payload )
                         result.retcode = res.retcode
                         result.message = res.message
                         result.data = {}
                         result.data.imageAddress = res.data.uploadKey
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
            let res = null, params = {};
            // let file = null, resImg = '', is_file = true, res = null, result = {};

            // let source = getSource(this.state.source_id);
            // if (source.hasUpload === false) {
            //     //如果没有上传图片成功的状态就先将base64转图片传递，否则直接传上传成功后的返回值
            //     if(this.state.imageUploadState !== 'uploaded') {
            //         file = getFileFromBase64(payload.imageAddress);
            //     }else{
            //         resImg = payload.imageAddress;
            //         is_file = false
            //     }
            // }

            return new Promise(async (resolve)=>{
                params = collapse({...payload.searchPicParams});
                switch (this.state.source_id) {
                    case SourceMap['alibaba']['id']:
                        res = await alibaba.searchGoodsByPic({...params, page:payload.page} )
                        resolve(res)
                        break;
                    case SourceMap['1688']['id']:
                        res = await _1688.searchGoodsByPic({...params,sessionId:payload.sessionId, requestId:payload.requestId, searchtype:0})
                        resolve(res)
                        break;
					case SourceMap['1688overseas']['id']:	// 图搜接口与1688一样，只是searchtype参数不同（所有货源，跨境货源）
						res = await _1688.searchGoodsByPic({...params,page:payload.page, sessionId:payload.sessionId, requestId:payload.requestId, searchtype:1 })
						resolve(res)
						break;
                    case SourceMap['1688global']['id']:
                        res = await _1688global.searchGoodsByPic({...params,page:payload.page})
                        resolve(res)
                        break;
                    case SourceMap['aliexpressDS']['id']:
                        res = await aliexpressDS.searchGoodsByPic({...params})
                        resolve(res)
                        break;
                    case SourceMap['aliexpressZapieX']['id']:
                        res = await aliexpressZapieX.searchGoodsByPic({...params})
                        resolve(res)
                        break;
                    case SourceMap['yiwugo']['id']:
                        res = await yiwugo.searchGoodsByPic({...params, page:payload.page})
                        resolve(res)
                        break;
                    case SourceMap['dhgate']['id']:
                        res = await dhgate.searchGoodsByPic({...params, page:payload.page})
                        res.data.searchImage.imageAddress = res.sourceResult.data.data.imgUrl
                        resolve(res)
                        break;
                    case SourceMap['mic']['id']:
                        res = await mic.searchGoodsByPic({...params, page:payload.page})
						// 没有单独的上传图片接口，所以需要处理下返回的imageAddress
                        res.data.searchImage.imageAddress = res.sourceResult.data.content.imgId
                        resolve(res)
                        break;
                    case SourceMap['cjds']['id']:
                        res = await cjds.searchGoodsByPic()
						//TBD： CJ目前没有返回上传图片的imageAddress，也没有分页功能，如果切换到网页版会崩
						res.data.searchImage.imageAddress = null
                        resolve(res)
                        break;
                }
            })
        },

        firstSearchPic(content,payload){
            console.log(payload.searchPicParams)
            let params = {};
            return new Promise(async (resolve)=>{
                params = collapse({...payload.searchPicParams});
                switch (this.state.source_id) {
                    case SourceMap['1688']['id']:
                        resolve(await _1688.searchGoodsByPicFirst( {...params, searchtype:0 } ))
                        break;
                    case SourceMap['1688overseas']['id']:
                        resolve(await _1688.searchGoodsByPicFirst( {...params, searchtype:1 } ))
                        break;
					// 1688global没有首次搜索接口
                }
            })
        },
    },
    modules: {},

})
