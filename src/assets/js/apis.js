import Qs from 'qs'
import {Service} from "@/assets/js/http";
import { Message, MessageBox } from 'element-ui';
import {i18n} from "@/main";
import SourceMap from "@/assets/js/source_map";
import Store from "@/store";
import { getFileFromBase64 } from "@/assets/js/utils.js";

function getCookie(source) {
	let cookie = '';
	let id = '';
	if(source === 'aliexpress') {
		id = 'cookie-aliexpress'
	}else if(source === '1688') {
		id = 'cookie-1688'
	}else if(source === '1688global') {
		id = 'cookie-1688global'
	}
	cookie = window.localStorage.getItem(id) ? window.localStorage.getItem(id) : null;
	if(!cookie) {
		let sourceName = '',
			loginPageUrl = '';
		for (let key in SourceMap) {
			if(SourceMap[key]['id'] == Store.state.source_id) {
				sourceName = key;
				loginPageUrl = SourceMap[key]['loginPageUrl']
				break;
			}
		}
		MessageBox.confirm(i18n.t('message.no_login') + sourceName, i18n.t('message.un_login'), {
			confirmButtonText: i18n.t('message.go_login'),
			cancelButtonText: i18n.t('button.cancel'),
			type: 'warning'
		}).then(_=>{
			window.open(loginPageUrl);
		}).catch(e=>{
			console.log(e);
		})
		return null;
	}
	return cookie;
}

export const alibaba = {
    // 上传图片
    uploadPic(file) {
        let formData = new FormData();
        formData.append('file', file);
        return Service.post('api/aliintersite/uploadPic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    // 图片搜索
    searchGoodsByPic({imageAddress, page = 1, categoryId = null}) {
        // beginPage = beginPage > 5 ? 5 : beginPage;
        return Service.get('api/aliintersite/searchGoodsByPic', {
            params: {
                imageAddress, beginPage:page, categoryId
            }
        })
    },
	// 文字搜索
	searchGoodsByText({
		searchText = '',
		page = 1, 
		index_area = 'product_en', 
		language = 'en_US', 
		tab = null,
		Category = null,
		supplierType = null, 
		ta = null,
		assessment_company = null,
		replyAvgTime = null,
		param_order = null,
		freeSample = null,
		productTag = null,
		moqf = null,
		moqt = null,
		pricef = null,
		pricet = null,
		Country = null,
		exportCountry = null,
		companyAuthTag = null,
		productAuthTag = null,
		refine_attr_value = null
	}) {
		page = page > 99 ? 99 : page;
		return Service.get('api/aliintersite/searchGoodsByText2', {
            params: {
                search_text:searchText, page, index_area,language,tab,
				Category,supplierType,ta,assessment_company,
				replyAvgTime,param_order,freeSample,productTag,
				moqf,moqt,pricef,pricet,Country,exportCountry,
				companyAuthTag,productAuthTag,refine_attr_value
            }
        })
	}
}

export const aliexpress = {
	uploadPic(file) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    let formData = new FormData();
	    formData.append('file', file);
	    return Service.post('api/aliexpress/uploadPic', formData, {
	        headers: {
	            'Content-Type': 'multipart/form-data',
				'token': cookie
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPic({imageAddress, category_id = null}) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/aliexpress/searchGoodsByPic', {
	        params: {
	            filename:imageAddress, category_id
	        },
			headers: {
				'token': cookie
			}
	    })
	},
	// 文字搜索
	searchGoodsByText({searchText, cat_id, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page = 1, country, language = 'en_US', currency, brand_id, pvid}) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/aliexpress/searchGoodsByText', {
	        params: {
	            search_text:searchText, cat_id, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page, country, language, currency, brand_id, pvid
	        },
			headers: {
				'token': cookie
			}
	    })
	},
}

export const _1688 = {
	uploadPicH5(file) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    let formData = new FormData();
	    formData.append('file', file);
		formData.append('cookie', cookie);
	    return Service.post('api/goods/uploadPicH5', formData, {
	        headers: {
	            'Content-Type': 'multipart/form-data',
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPic({imageAddress, page = 1, yoloRegionSelected = true, yoloCropRegion = '', region = '', pailitaoCategoryId = null, searchtype = 0, sortField = 'normal', sortType = 'asc',priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis,sessionId, requestId,}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearch', {
	        params: {
	            imageId:imageAddress, searchtype, page, yoloRegionSelected, yoloCropRegion, region, sessionId, requestId,
				cookie,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPicFirst({imageAddress, yoloRegionSelected = null, yoloCropRegion = null, region = null, pailitaoCategoryId, searchtype = 0, sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchFirst', {
	        params: {
	            imageId:imageAddress, cookie, searchtype, yoloRegionSelected, yoloCropRegion, region,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis
	        }
	    })
	},
	// 文字搜索首次
	searchGoodsFirst({searchText, page = 1, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoodsFirst', {
	        params: {
	            type: 1, cookie, keyword: searchText, page, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount
	        }
	    })
	},
	searchGoods({ searchText, page = 1, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount }) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoods', {
	        params: {
	            type: 1, cookie, keyword: searchText, page, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount
	        }
	    })
	}
}

export const _1688global = {
	uploadPic(file) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
	    let formData = new FormData();
	    formData.append('file', file);
		formData.append('cookie', cookie);
	    return Service.post('api/goods/uploadPicKj', formData, {
	        headers: {
	            'Content-Type': 'multipart/form-data',
	        }
	    })
	},
	searchGoodsByPic({imageAddress, page, region, categoryId, location, tags, keyword}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchKj', {
	        params: {
	            imgUrl:imageAddress, cookie,region,keyword,categoryId,location,tags,pageNo:page
	        }
	    })
	},
	searchGoodsFirstKj({searchText,featurePair,category}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsFirstKj', {
			params: {
				keywords:searchText, cookie,featurePair, category
			}
		})
	},
	searchGoodsKj({searchText, featurePair, sessionId, requestId, page = 1, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount,category}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsKj', {
			params: {
				keywords: searchText, cookie, page, sessionId, requestId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount,category
			}
		})
	}
}

export const yiwugo = {
	uploadPic(file) {
		let formData = new FormData();
		formData.append('file', file);
		return Service.post('api/yiwugoapp/uploadPic', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},
	// 图片搜索
	searchGoodsByPic({imageAddress, page = 1, page_size = 10, lang = 'en'}) {
		return Service.get('api/yiwugoapp/searchGoodsByPic', {
			params: {
				file_url:imageAddress, page, page_size, lang
			}
		})
	},
	// 搜索商品
	searchGoodsByText({searchText, page=1, lang='en', sort = 0, set_yiwu_market = 0, min_price = null, max_price = null, category = null, sub_market = null,}) {
		return Service.get('api/yiwugoapp/searchGoodsByText', {
			params: {
				search_text:searchText,page,lang,sort,set_yiwu_market,min_price,max_price,category,sub_market
			}
		})
	},
	// 搜索店铺
	searchShopsByText({searchText, page = 1, language = 'en', page_size = 20}) {
		return Service.get('api/yiwugoapp/searchShopsByText', {
			params: {
				search_text:searchText, page, language, page_size
			}
		})
	},
}

export const dhgate = {
	// 图片搜索
	searchGoodsByPic({imageAddress, page = 1, category = null, page_size = 10, lang = 'en', currency = 'USD'}) {
		let file = null
		file = getFileFromBase64(Store.state.searchParams.mainImage);
		if(Store.state.imageUploadState !== 'uploaded') {
			let formData = new FormData();
			formData.append('image', file);
			formData.append('page_num', page);
			formData.append('page_size', page_size);
			formData.append('lang', lang);
			formData.append('currency', currency);
			return Service.post('api/dhgateapp/searchGoodsByPic', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		}else{
			const params = Qs.stringify({
				imgUrl:imageAddress, page_num:page, page_size, lang, currency, category
			});
			return Service.post('api/dhgateapp/searchGoodsByPic',params, {
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
			})
		}

	},

	// 搜索商品
	searchGoodsByText({searchText, page=1, page_size=20, lang='en', currency='USD', sort = 1, price_sort = null, min_price = null, max_price = null, category = null, at = null, freeShipping = null, inventoryLocation = null}) {
		const params = Qs.stringify({
			search_text:searchText, page, page_size, lang, currency, sort, price_sort, min_price, max_price, category, at, freeShipping, inventoryLocation
		});
		return Service.post('api/dhgateapp/searchGoodsByText', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		})
	},
}

export const mic = {
	// 图片搜索
	searchGoodsByPic({imageAddress, page = 1,category = null, color = 0, page_size = 20}) {
		let file = null
		file = getFileFromBase64(Store.state.searchParams.mainImage);
		if(Store.state.imageUploadState !== 'uploaded') {
			let formData = new FormData();
			formData.append('image', file);
			formData.append('page_num', page);
			formData.append('page_size', page_size);
			// formData.append('category', category);
			return Service.post('api/micapp/searchGoodsByPic', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		}else{
			const params = Qs.stringify({
				imgId:imageAddress, page_num:page, page_size, category, color
			});
			return Service.post('api/micapp/searchGoodsByPic',params)
		}
	},

	// 搜索商品
	searchGoodsByText({searchText, page=1, page_size=36, lang='en', currency='USD', min_price = null, max_price = null, category = null, location = null, memberType = null, property = null}) {
		return Service.get('api/micapp/searchGoodsByText',{
			params: {
				search_text:searchText, page, page_size, lang, currency, min_price, max_price, category, location, memberType, property
			},
		})
	},
}
export const cjds = {
	// 图片搜索
	searchGoodsByPic() {
		let file = null
		file = getFileFromBase64(Store.state.searchParams.mainImage);
		let formData = new FormData();
		formData.append('image', file);
		return Service.post('api/cjdsapp/searchGoodsByPic', formData)
	},

	// 搜索商品
	searchGoodsByText({searchText, page=1, page_size=20, category = null, country = null, productType = null, addMarkStatus = null, sort = null, price_sort = null}) {
		const params = Qs.stringify({
			search_text:searchText, page, page_size, category, country, productType, addMarkStatus, sort, price_sort
		});
		return Service.post('api/cjdsapp/searchGoodsByText',params,{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		})
	},
}

export const litbox = {
	// 搜索商品
	searchGoodsByText({searchText, page=1, page_size=36, lang='en', country='CHN', country_code='CN', currency='CNY', searchType=3, category = null, brand = '0', sort = '6d', filters = []}) {
		return Service.get('api/litboxapp/searchGoodsByText',{
			params: {
				search_text:searchText, page, page_size, lang, country, country_code, currency, searchType, category, brand, sort, filters
			},
		})
	},
}

export const banggood = {
	// 搜索商品
	searchGoodsByText({searchText, page=1, lang='en', country='CN', warehouse = null, special_options, category = null, sort = '0' }) {
		return Service.get('api/banggoodapp/searchGoodsByText',{
			params: {
				search_text:searchText, page, lang, country, warehouse, special_options, category, sort
			},
		})
	},
}
export const chinabrands = {
	// 搜索商品
	searchGoodsByText({searchText, page=1, lang='en', country= null, brand_id = null, sort, canReserve = null, type = '0', sale_time = null }) {
		return Service.get('api/chinabrands/searchGoodsByText',{
			params: {
				search_text:searchText, page, lang, country, brand_id, sort, canReserve, type, sale_time
			},
		})
	},
}
export const globalres = {
	// 搜索商品
	searchGoodsByText({searchText, page=1, country= null, busType = null, directOrderFlag = null, min_price, max_price,  category = null }) {
		return Service.get('api/globalresapp/searchGoodsByText',{
			params: {
				search_text:searchText, page, country, busType, directOrderFlag, min_price, max_price, category
			},
		})
	},
}