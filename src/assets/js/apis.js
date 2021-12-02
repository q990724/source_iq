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
        beginPage = beginPage > 5 ? 5 : beginPage;
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
                search_text, page, index_area,language,tab,
				Category,supplierType,ta,assessment_company,
				replyAvgTime,param_order,freeSample,productTag,
				moqf,moqt,pricef,pricet,Country,exportCountry,
				companyAuthTag,productAuthTag,refine_attr_value
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
	searchGoodsByText({search_text, page=1, language='en', sort = 0, set_yiwu_market = 0, min_price = null, max_price = null, category = null, sub_market = null,}) {
		return Service.get('api/yiwugoapp/searchGoodsByText', {
            params: {
                search_text,page,language,sort,set_yiwu_market,min_price,max_price,category,sub_market
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
	searchGoodsByText({search_text, cat_id, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page = 1, country, language = 'en_US', currency, brand_id}) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/aliexpress/searchGoodsByText', {
	        params: {
	            search_text, cat_id, min_price, max_price, ship_from_country, sale, spend_save, free_shipping, is_favorite, sort_type, page, country, language, currency, brand_id
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
	searchGoodsByPic({imageId, searchtype = 0, page = 2, yoloRegionSelected = true, yoloCropRegion = '', region = '', sortField = 'normal', sortType = 'asc', pailitaoCategoryId = null}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearch', {
	        params: {
	            imageId, searchtype, page, yoloRegionSelected, yoloCropRegion, region, 
				cookie,pailitaoCategoryId
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPicFirst({imageId, yoloRegionSelected = null, yoloCropRegion = null, region = null}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchFirst', {
	        params: {
	            imageId, cookie, yoloRegionSelected, yoloCropRegion, region
	        }
	    })
	},
	// 文字搜索首次
	searchGoodsFirst({type = 1, keyword = '', page = 1}) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoodsFirst', {
	        params: {
	            type, cookie, keyword, page
	        }
	    })
	},
	searchGoods({type = 1, keyword = '', page = 1, }) {
		let cookie = getCookie('1688');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/searchGoods', {
	        params: {
	            type, cookie, keyword, page
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
	searchGoodsByPic({imgUrl, region, keyword, categoryId, location, tags, pageNo}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
	    return Service.get('api/goods/imgSearchKj', {
	        params: {
	            imgUrl, cookie,region,keyword,categoryId,location,tags,pageNo
	        }
	    })
	},
	searchGoodsFirstKj(keywords) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsFirstKj', {
			params: {
				keywords, cookie
			}
		})
	},
	searchGoodsKj({keywords, sessionId, beginPage = 2}) {
		let cookie = getCookie('1688global');
		if(!cookie) return Promise.reject('no cookie');
		return Service.get('api/goods/searchGoodsKj', {
			params: {
				keywords, cookie, sessionId, beginPage
			}
		})
	}
}

export const dhgate = {
	// 图片搜索
	uploadPic(file, page_num = 1, page_size = 10, lang = 'en', currency = 'USD') {
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
	},
	// 图片搜索2
	searchGoodsByPic(imgUrl,page_num = 1, category = null, page_size = 10, lang = 'en', currency = 'USD') {
		const params = Qs.stringify({
			imgUrl, page_num, page_size, lang, currency, category
		});
		return Service.post('api/dhgateapp/searchGoodsByPic',params, {
			headers: {'Content-Type':'application/x-www-form-urlencoded'}
		})
	},
	// 搜索商品
	searchGoodsByText({search_text, page=1, page_size=20, lang='en', currency='USD', sort = 1, price_sort = null, min_price = null, max_price = null, category = null, at = null, freeShipping = null, inventoryLocation = null}) {
		const params = Qs.stringify({
			search_text, page, page_size, lang, currency, sort, price_sort, min_price, max_price, category, at, freeShipping, inventoryLocation
		});
		console.log(params);
		return Service.post('api/dhgateapp/searchGoodsByText', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		})
	},
}

export const mic = {
	// 图片搜索
	uploadPic(file, page_num = 1, page_size = 10) {
		let formData = new FormData();
		formData.append('image', file);
		formData.append('page_num', page_num);
		formData.append('page_size', page_size);
		return Service.post('api/micapp/searchGoodsByPic', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},
	// 图片搜索2
	searchGoodsByPic(imgId,page_num = 1, category = null, color = null, page_size = 20) {
		const params = Qs.stringify({
			imgId, page_num, page_size, category, color
		});
		return Service.post('api/micapp/searchGoodsByPic',params)
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