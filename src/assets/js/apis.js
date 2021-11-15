import {Service} from "@/assets/js/http";
import { Message } from 'element-ui';

function getCookie(source) {
	let cookie = '';
	try{
		let id = '';
		if(source === 'aliexpress') {
			id = 'cookie-aliexpress'
		}else if(source === '1688') {
			id = 'cookie-1688'
		}else if(source === '1688global') {
			id = 'cookie-1688global'
		}
		cookie = document.getElementById(id).dataset.cookie;
	}catch(e) {
		Message.error(`请先登录${source}！`);
		return null;
	}
	if(!cookie) {
		Message.error(`请先登录${source}！`);
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
    searchGoodsByPic(file_url, page = 1, page_size = 10, lang = 'zh') {
        return Service.get('api/yiwugoapp/searchGoodsByPic', {
            params: {
                file_url, page, page_size, lang
            }
        })
    },
	// 搜索商品
	searchGoodsByText({search_text, page=1, language='zh', sort = 0, set_yiwu_market = 0, min_price = null, max_price = null, category = null, sub_market = null,}) {
		return Service.get('api/yiwugoapp/searchGoodsByText', {
            params: {
                search_text,page,language,sort,set_yiwu_market,min_price,max_price,category,sub_market
            }
        })
	},
	// 搜索店铺
	searchShopsByText({search_text, page = 1, language = 'zh', page_size = 20}) {
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
		if(!cookie) return;
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
	searchGoodsByPic(filename, categoryId = null) {
		let cookie = getCookie('aliexpress');
		if(!cookie) return;
	    return Service.get('api/aliexpress/searchGoodsByPic', {
	        params: {
	            filename, categoryId
	        },
			headers: {
				'token': cookie
			}
	    })
	}
}

export const _1688 = {
	uploadPicH5(file) {
		let cookie = getCookie('1688');
		if(!cookie) return;
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
	searchGoodsByPic({imageId, searchtype = 0, page = 2, yoloRegionSelected = true, yoloCropRegion = '', region = '', sortField = 'normal', sortType = 'asc', pailitaoCategoryId = null, }) {
		let cookie = getCookie('1688');
		if(!cookie) return;
	    return Service.get('api/goods/imgSearch', {
	        params: {
	            imageId, searchtype, page, yoloRegionSelected, yoloCropRegion, region, 
				cookie
	        }
	    })
	},
	// 图片搜索
	searchGoodsByPicFirst(imageId) {
		let cookie = getCookie('1688');
		if(!cookie) return;
	    return Service.get('api/goods/imgSearchFirst', {
	        params: {
	            imageId, cookie
	        }
	    })
	},
	// 文字搜索首次
	searchGoodsFirst({type = 1, keyword = '', page = 1}) {
		let cookie = getCookie('1688');
		if(!cookie) return;
	    return Service.get('api/goods/searchGoodsFirst', {
	        params: {
	            type, cookie, keyword, page
	        }
	    })
	},
	searchGoods({type = 1, keyword = '', page = 1, }) {
		let cookie = getCookie('1688');
		if(!cookie) return;
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
		if(!cookie) return;
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
		if(!cookie) return;
	    return Service.get('api/goods/imgSearchKj', {
	        params: {
	            imgUrl, cookie,region,keyword,categoryId,location,tags,pageNo
	        }
	    })
	}
}