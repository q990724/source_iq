import Qs from 'qs'
import {Service} from "@/assets/js/http";
import { Message, MessageBox } from 'element-ui';
import {i18n} from "@/main";
import SourceMap from "@/assets/js/source_map";
import Store from "@/store";

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
    searchGoodsByPic(imageAddress, beginPage = 1, categoryId = null) {
        // beginPage = beginPage > 5 ? 5 : beginPage;
        return Service.get('api/aliintersite/searchGoodsByPic', {
            params: {
                imageAddress, beginPage, categoryId
            }
        })
    },
	// 文字搜索
	searchGoodsByText({
		search_text = '', 
		page = 1, 
		index_area = 'product_en', 
		language = 'en_US', 
		tab = null, 
		category = null,
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
                search_text, page, index_area,language,tab,
				Category:category,supplierType,ta,assessment_company,
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
	searchGoodsByPic(filename, category_id = null) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/aliexpress/searchGoodsByPic', {
	        params: {
	            filename, category_id
	        },
			headers: {
				'token': cookie
			}
	    })
	},
	// 文字搜索
	searchGoodsByText({search_text, category, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page = 1, country, language = 'en_US', currency, brand_id, pvid}) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/aliexpress/searchGoodsByText', {
	        params: {
	            search_text, cat_id:category, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page, country, language, currency, brand_id, pvid
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
	searchGoodsByPic({imageId, page = 1, yoloRegionSelected = true, yoloCropRegion = '', region = '', pailitaoCategoryId = null, searchtype = 0, sortField = 'normal', sortType = 'asc',priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis,sessionId, requestId,}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearch', {
	        params: {
	            imageId, searchtype, page, yoloRegionSelected, yoloCropRegion, region, sessionId, requestId,
				cookie,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPicFirst({imageId, yoloRegionSelected = null, yoloCropRegion = null, region = null, pailitaoCategoryId, searchtype = 0, sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchFirst', {
	        params: {
	            imageId, cookie, searchtype, yoloRegionSelected, yoloCropRegion, region,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin,gmtCreate,province,city,dis
	        }
	    })
	},
	// 文字搜索首次
	searchGoodsFirst({search_text, page = 1, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount}) {
		console.log(search_text)
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoodsFirst', {
	        params: {
	            type: 1, cookie, keyword: search_text, page, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount
	        }
	    })
	},
	searchGoods({ search_text, page = 1, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount }) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoods', {
	        params: {
	            type: 1, cookie, keyword: search_text, page, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount
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
	searchGoodsByPic(imgUrl, pageNo, region, categoryId, location, tags, keyword) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchKj', {
	        params: {
	            imgUrl, cookie,region,keyword,categoryId,location,tags,pageNo
	        }
	    })
	},
	searchGoodsFirstKj({search_text,featurePair,category}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsFirstKj', {
			params: {
				keywords:search_text, cookie,featurePair, category
			}
		})
	},
	searchGoodsKj({search_text, featurePair, sessionId, requestId, page = 1, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount,category}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsKj', {
			params: {
				keywords: search_text, cookie, page, sessionId, requestId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, tese, filt, factorySize, employeesCount,category
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
	searchGoodsByPic(file_url, page = 1, page_size = 10, lang = 'en') {
		return Service.get('api/yiwugoapp/searchGoodsByPic', {
			params: {
				file_url, page, page_size, lang
			}
		})
	},
	// 搜索商品
	searchGoodsByText({search_text, page=1, lang='en', sort = 0, set_yiwu_market = 0, min_price = null, max_price = null, category = null, sub_market = null,}) {
		return Service.get('api/yiwugoapp/searchGoodsByText', {
			params: {
				search_text,page,lang,sort,set_yiwu_market,min_price,max_price,category,sub_market
			}
		})
	},
	// 搜索店铺
	searchShopsByText({search_text, page = 1, language = 'en', page_size = 20}) {
		return Service.get('api/yiwugoapp/searchShopsByText', {
			params: {
				search_text, page, language, page_size
			}
		})
	},
}

export const dhgate = {
	// 图片搜索
	searchGoodsByPic(is_file, file, resImg, page_num = 1, category = null, page_size = 10, lang = 'en', currency = 'USD') {
		if(is_file === true){
			let formData = new FormData();
			formData.append('image', file);
			formData.append('page_num', page_num);
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
				imgUrl:resImg, page_num, page_size, lang, currency, category
			});
			return Service.post('api/dhgateapp/searchGoodsByPic',params, {
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
			})
		}

	},

	// 搜索商品
	searchGoodsByText({search_text, page=1, page_size=20, lang='en', currency='USD', sort = 1, price_sort = null, min_price = null, max_price = null, category = null, at = null, freeShipping = null, inventoryLocation = null}) {
		const params = Qs.stringify({
			search_text, page, page_size, lang, currency, sort, price_sort, min_price, max_price, category, at, freeShipping, inventoryLocation
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
	searchGoodsByPic(is_file, file, resImg, page_num = 1,category = '', color = 0, page_size = 20) {
		if(is_file === true) {
			let formData = new FormData();
			formData.append('image', file);
			formData.append('page_num', page_num);
			formData.append('page_size', page_size);
			// formData.append('category', category);
			return Service.post('api/micapp/searchGoodsByPic', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		}else{
			const params = Qs.stringify({
				imgId:resImg, page_num, page_size, category, color
			});
			return Service.post('api/micapp/searchGoodsByPic',params)
		}
	},

	// 搜索商品
	searchGoodsByText({search_text, page=1, page_size=36, lang='en', currency='USD', min_price = null, max_price = null, category = null, location = null, memberType = null, property = null}) {
		return Service.get('api/micapp/searchGoodsByText',{
			params: {
				search_text, page, page_size, lang, currency, min_price, max_price, category, location, memberType, property
			},
		})
	},
}
export const cjds = {
	// 图片搜索
	searchGoodsByPic(file) {
		let formData = new FormData();
		formData.append('image', file);
		return Service.post('api/cjdsapp/searchGoodsByPic', formData)
	},

	// 搜索商品
	searchGoodsByText({search_text, page=1, page_size=20, category = null, country = null, productType = null, addMarkStatus = null, sort = null, price_sort = null}) {
		const params = Qs.stringify({
			search_text, page, page_size, category, country, productType, addMarkStatus, sort, price_sort
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
	searchGoodsByText({search_text, page=1, page_size=36, lang='en', country='CHN', country_code='CN', currency='CNY', searchType=3, category = null, brand = '0', sort = '6d', filters = []}) {
		return Service.get('api/litboxapp/searchGoodsByText',{
			params: {
				search_text, page, page_size, lang, country, country_code, currency, searchType, category, brand, sort, filters
			},
		})
	},
}