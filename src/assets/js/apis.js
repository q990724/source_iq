import Qs from 'qs';
import axios from "axios";
import {Service} from "@/assets/js/http";
import { Message, MessageBox } from 'element-ui';
import {i18n} from "@/main";
import SourceMap from "@/assets/js/source_map";
import Store from "@/store";
import { getFileFromBase64 } from "@/assets/js/utils.js";

function getCookie() {
	let cookie = '';
	cookie = window.localStorage.getItem(SourceMap[Store.state.source_id].cookieKey) ? window.localStorage.getItem(SourceMap[Store.state.source_id].cookieKey) : null;
	if(!cookie) {
		let	sourceName = SourceMap[Store.state.source_id].petName;
		let	loginPageUrl = SourceMap[Store.state.source_id].loginPageUrl
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

// export const alibaba = {
//     // 上传图片
//     uploadPic(file) {
//         let formData = new FormData();
//         formData.append('file', file);
//         return Service.post('api/aliintersite/uploadPic', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         })
//     },
//     // 图片搜索
//     searchGoodsByPic({imageAddress, page = 1, categoryId = null,language = 'en_US',currency = 'USD',}) {
//         // beginPage = beginPage > 5 ? 5 : beginPage;
//         return Service.get('api/aliintersite/searchGoodsByPic', {
//             params: {
//                 imageAddress, beginPage:page, categoryId,language,currency,
//             }
//         })
//     },
// 	// 文字搜索
// 	searchGoodsByText({
// 		searchText = '',
// 		page = 1,
// 		index_area = 'product_en',
// 		language = 'en_US',
// 		currency = 'USD',
// 		tab = null,
// 		Category = null,
// 		supplierType = null,
// 		ta = null,
// 		assessment_company = null,
// 		replyAvgTime = null,
// 		param_order = null,
// 		freeSample = null,
// 		productTag = null,
// 		moqf = null,
// 		moqt = null,
// 		pricef = null,
// 		pricet = null,
// 		Country = null,
// 		exportCountry = null,
// 		companyAuthTag = null,
// 		productAuthTag = null,
// 		refine_attr_value = null
// 	}) {
// 		page = page > 99 ? 99 : page;
// 		return Service.get('api/aliintersite/searchGoodsByText2', {
//             params: {
//                 search_text:searchText, page, index_area,language,currency,tab,
// 				Category,supplierType,ta,assessment_company,
// 				replyAvgTime,param_order,freeSample,productTag,
// 				moqf,moqt,pricef,pricet,Country,exportCountry,
// 				companyAuthTag,productAuthTag,refine_attr_value
//             }
//         })
// 	}
// }
//
// export const aliexpressDS = {
// 	uploadPic(file) {
// 		let cookie = null;
// 		if(SourceMap['aliexpressDS'].needCookie === true) {
// 			cookie = getCookie('aliexpress');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    let formData = new FormData();
// 	    formData.append('file', file);
// 	    return Service.post('api/aliexpress/uploadPic', formData, {
// 	        headers: {
// 	            'Content-Type': 'multipart/form-data',
// 				'token': cookie
// 	        }
// 	    })
// 	},
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, category_id = null}) {
// 		let cookie = null;
// 		if(SourceMap['aliexpressDS'].needCookie === true) {
// 			cookie = getCookie('aliexpress');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/aliexpress/searchGoodsByPic', {
// 	        params: {
// 	            filename:imageAddress, category_id
// 	        },
// 			headers: {
// 				'token': cookie
// 			}
// 	    })
// 	},
// 	// 文字搜索
// 	searchGoodsByText({searchText, cat_id, min_price, max_price, ship_from_country, isBigSale, hasCoupon, isFreeShip, isFavorite, sort_type, page = 1, country, language = 'en_US', currency, brand_id, pvid}) {
// 		let cookie = null;
// 		if(SourceMap['aliexpressDS'].needCookie === true) {
// 			cookie = getCookie('aliexpress');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/aliexpress/searchGoodsByText', {
// 	        params: {
// 	            search_text:searchText, cat_id, min_price, max_price, ship_from_country, isBigSale, hasCoupon, isFreeShip, isFavorite, sort_type, page, country, language, currency, brand_id, pvid
// 	        },
// 			headers: {
// 				'token': cookie
// 			}
// 	    })
// 	},
// }
//
// export const aliexpressZapieX = {
// 	uploadPic(file) {
// 		let formData = new FormData();
// 		formData.append('file', file);
// 		return Service.post('api/aliexpress/zapiexUploadPic', formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data',
// 			}
// 		})
// 	},
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, currency = null, lang, sort, filter}) {
// 		return Service.get('api/aliexpress/zapiexImgSearch', {
// 			params: {
// 				uploadKey:imageAddress, currency, lang, sort, filter
// 			},
// 		})
// 	},
// 	// 文字搜索
// 	searchGoodsByText({searchText, categoryId, min_price, max_price, shipFrom, shipTo, freeShippingOnly, fastShippingOnly, moreThanFourStarsOnly, sort, page = 1, language = 'en_US', currency, attr_id_value}) {
// 		return Service.get('api/aliexpress/zapiexSearchGoods', {
// 			params: {
// 				search_text:searchText, categoryId, min_price, max_price, shipFrom, shipTo, freeShippingOnly, fastShippingOnly, moreThanFourStarsOnly, sort, page, language, currency, attr_id_value
// 			},
// 		})
// 	},
// }
//
// export const _1688 = {
// 	uploadPicH5(file) {
// 		let cookie = null;
// 		if(SourceMap['1688'].needCookie === true) {
// 			cookie = getCookie('1688');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    let formData = new FormData();
// 	    formData.append('file', file);
// 		formData.append('cookie', cookie);
// 	    return Service.post('api/goods/uploadPicH5', formData, {
// 	        headers: {
// 	            'Content-Type': 'multipart/form-data',
// 	        }
// 	    })
// 	},
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, page, yoloRegionSelected = null, yoloCropRegion = '', region = '', pailitaoCategoryId = null, searchtype = 0, sortField = 'normal', sortType = 'asc',priceStart,priceEnd,quantityBegin,extendProperties, memberTags, isImgPkg, isMainShortVideo, isAuthentication, isPatent, isSrcFactoryItm, holidayTagId, isZhangqiSelect, gmtCreate,province,city,dis,sessionId, requestId,}) {
// 		let cookie = null;
// 		if(SourceMap['1688'].needCookie === true) {
// 			cookie = getCookie('1688');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/goods/imgSearch', {
// 	        params: {
// 	            imageId:imageAddress, searchtype, page, yoloRegionSelected, yoloCropRegion, region, sessionId, requestId,
// 				cookie,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin,extendProperties, memberTags, isImgPkg, isMainShortVideo, isAuthentication, isPatent, isSrcFactoryItm, holidayTagId, isZhangqiSelect, gmtCreate,province,city,dis
// 	        }
// 	    })
// 	},
// 	// 图片搜索
// 	searchGoodsByPicFirst({imageAddress, yoloRegionSelected = null, yoloCropRegion = null, region = null, pailitaoCategoryId, searchtype = 0, sortField,sortType,priceStart,priceEnd,quantityBegin,extendProperties, memberTags, isImgPkg, isMainShortVideo, isAuthentication, isPatent, isSrcFactoryItm, holidayTagId, isZhangqiSelect, gmtCreate,province,city,dis}) {
// 		let cookie = null;
// 		if(SourceMap['1688'].needCookie === true) {
// 			cookie = getCookie('1688');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/goods/imgSearchFirst', {
// 	        params: {
// 	            imageId:imageAddress, cookie, searchtype, yoloRegionSelected, yoloCropRegion, region,pailitaoCategoryId,sortField,sortType,priceStart,priceEnd,quantityBegin, extendProperties, memberTags, isImgPkg, isMainShortVideo, isAuthentication, isPatent, isSrcFactoryItm, holidayTagId, isZhangqiSelect, gmtCreate,province,city,dis
// 	        }
// 	    })
// 	},
// 	// 文字搜索首次
// 	searchGoodsFirst({searchText, page = 1, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, offerTags, filtHolidayTagId, extendProperties, memberTags, commonSort, tese, filt, factorySize, employeesCount}) {
// 		let cookie = null;
// 		if(SourceMap['1688'].needCookie === true) {
// 			cookie = getCookie('1688');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/goods/searchGoodsFirst', {
// 	        params: {
// 	            type: 1, cookie, keyword: searchText, page, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, offerTags, filtHolidayTagId, extendProperties, memberTags, commonSort, tese, filt, factorySize, employeesCount
// 	        }
// 	    })
// 	},
// 	searchGoods({ searchText, page = 1, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, offerTags, filtHolidayTagId, extendProperties, memberTags, commonSort,tese, filt, factorySize, employeesCount, startIndex = 0 }) {
// 		let cookie = null;
// 		if(SourceMap['1688'].needCookie === true) {
// 			cookie = getCookie('1688');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/goods/searchGoods', {
// 	        params: {
// 	            type: 1, cookie, keyword: searchText, page, sessionId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, offerTags, filtHolidayTagId, extendProperties, memberTags, commonSort,tese, filt, factorySize, employeesCount, startIndex
// 	        }
// 	    })
// 	}
// }
//
// export const _1688rapid = {
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, page = 1, attr_id, page_size = 20}) {
// 		let file = null
// 		file = getFileFromBase64(Store.state.searchParams.mainImage);
// 		if(Store.state.imageUploadState !== 'uploaded') {
// 			let formData = new FormData();
// 			formData.append('file', file);
// 			formData.append('page', page);
// 			formData.append('page_size', page_size);
// 			return Service.post('api/1688/rapidUploadPic', formData, {
// 				headers: {
// 					'Content-Type': 'multipart/form-data'
// 				}
// 			})
// 		}else{
// 			const params = Qs.stringify({
// 				url:imageAddress, page, page_size, attr_id
// 			});
// 			return Service.post('api/1688/rapidUploadPicUrl',params, {
// 				headers: {'Content-Type':'application/x-www-form-urlencoded'}
// 			})
// 		}
// 	},
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, page_size=20, sort = '0', min_price = null, max_price = null, attr_id}) {
// 		return Service.get('api/1688/rapidSearchGoods',{
// 			params: {
// 				search_text:searchText, page, page_size, sort, attr_id, min_price, max_price,
// 			},
// 		})
// 	},
// }
//
// export const _1688global = {
// 	uploadPic(file) {
// 		let cookie = null;
// 		if(SourceMap['1688global'].needCookie === true) {
// 			cookie = getCookie('1688global');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    let formData = new FormData();
// 	    formData.append('file', file);
// 		formData.append('cookie', cookie);
// 	    return Service.post('api/goods/uploadPicKj', formData, {
// 	        headers: {
// 	            'Content-Type': 'multipart/form-data',
// 	        }
// 	    })
// 	},
// 	searchGoodsByPic({imageAddress, page, region, categoryId, location, tags, keyword}) {
// 		let cookie = null;
// 		if(SourceMap['1688global'].needCookie === true) {
// 			cookie = getCookie('1688global');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 	    return Service.get('api/goods/imgSearchKj', {
// 	        params: {
// 	            imgUrl:imageAddress, cookie,region,keyword,categoryId,location,tags,pageNo:page
// 	        }
// 	    })
// 	},
// 	searchGoodsFirstKj({searchText,featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, extendProperties, commonSort, filtMemberTags, filtOfferTags, holidayTagId, tese, filt, factorySize, employeesCount, category}) {
// 		let cookie = null;
// 		if(SourceMap['1688global'].needCookie === true) {
// 			cookie = getCookie('1688global');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 		return Service.get('api/goods/searchGoodsFirstKj', {
// 			params: {
// 				keywords:searchText, cookie,featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, extendProperties, commonSort, filtMemberTags, filtOfferTags, holidayTagId, tese, filt, factorySize, employeesCount, category
// 			}
// 		})
// 	},
// 	searchGoodsKj({searchText, featurePair, sessionId, requestId, page = 1, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, extendProperties, commonSort, filtMemberTags, filtOfferTags, holidayTagId, tese, filt, factorySize, employeesCount,category}) {
// 		let cookie = null;
// 		if(SourceMap['1688global'].needCookie === true) {
// 			cookie = getCookie('1688global');
// 			if(!cookie) return Promise.reject('no cookie');
// 		}
// 		return Service.get('api/goods/searchGoodsKj', {
// 			params: {
// 				keywords: searchText, cookie, page, sessionId, requestId, featurePair, sortType, descendOrder, priceStart, priceEnd, quantityBegin, province, city, biztype, tagsZ, extendProperties, commonSort, filtMemberTags, filtOfferTags, holidayTagId, tese, filt, factorySize, employeesCount,category
// 			}
// 		})
// 	}
// }
//
// export const yiwugo = {
// 	uploadPic(file) {
// 		let formData = new FormData();
// 		formData.append('file', file);
// 		return Service.post('api/yiwugoapp/uploadPic', formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data'
// 			}
// 		})
// 	},
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, page = 1, page_size = 10, language = 'en'}) {
// 		return Service.get('api/yiwugoapp/searchGoodsByPic', {
// 			params: {
// 				file_url:imageAddress, page, page_size, lang:language
// 			}
// 		})
// 	},
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, language='en', sort = 0, set_yiwu_market = 0, min_price = null, max_price = null, category = null, sub_market = null,}) {
// 		return Service.get('api/yiwugoapp/searchGoodsByText', {
// 			params: {
// 				search_text:searchText,page,lang:language,sort,set_yiwu_market,min_price,max_price,category,sub_market
// 			}
// 		})
// 	},
// 	// 搜索店铺
// 	searchShopsByText({searchText, page = 1, language = 'en', page_size = 20}) {
// 		return Service.get('api/yiwugoapp/searchShopsByText', {
// 			params: {
// 				search_text:searchText, page, language, page_size
// 			}
// 		})
// 	},
// }
//
// export const dhgate = {
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, page = 1, category = null, page_size = 10, language = 'en', currency = 'USD'}) {
// 		let file = null
// 		file = getFileFromBase64(Store.state.searchParams.mainImage);
// 		if(Store.state.imageUploadState !== 'uploaded') {
// 			let formData = new FormData();
// 			formData.append('image', file);
// 			formData.append('page_num', page);
// 			formData.append('page_size', page_size);
// 			formData.append('lang', language);
// 			formData.append('currency', currency);
// 			return Service.post('api/dhgateapp/searchGoodsByPic', formData, {
// 				headers: {
// 					'Content-Type': 'multipart/form-data'
// 				}
// 			})
// 		}else{
// 			const params = Qs.stringify({
// 				imgUrl:imageAddress, page_num:page, page_size, lang:language, currency, category
// 			});
// 			return Service.post('api/dhgateapp/searchGoodsByPic',params, {
// 				headers: {'Content-Type':'application/x-www-form-urlencoded'}
// 			})
// 		}
//
// 	},
//
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, page_size=20, language='en', currency='USD', sort = 1, price_sort = null, min_price = null, max_price = null, minOrder,category = null, at = null, freeShipping = null, inventoryLocation = null}) {
// 		const params = Qs.stringify({
// 			search_text:searchText, page, page_size, lang:language, currency, sort, price_sort, min_price, max_price, minOrder, category, at, freeShipping, inventoryLocation
// 		});
// 		return Service.post('api/dhgateapp/searchGoodsByText', params, {
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded'
// 			},
// 		})
// 	},
// }
//
// export const mic = {
// 	// 图片搜索
// 	searchGoodsByPic({imageAddress, page = 1,category = null, color = 0, page_size = 20, language='en', currency='USD',}) {
// 		let file = null
// 		file = getFileFromBase64(Store.state.searchParams.mainImage);
// 		if(Store.state.imageUploadState !== 'uploaded') {
// 			let formData = new FormData();
// 			formData.append('image', file);
// 			formData.append('page_num', page);
// 			formData.append('page_size', page_size);
// 			formData.append('lang', language);
// 			formData.append('currency', currency);
// 			// formData.append('category', category);
// 			return Service.post('api/micapp/searchGoodsByPic', formData, {
// 				headers: {
// 					'Content-Type': 'multipart/form-data'
// 				}
// 			})
// 		}else{
// 			const params = Qs.stringify({
// 				imgId:imageAddress, page_num:page, page_size, category, color, currency, lang:language
// 			});
// 			return Service.post('api/micapp/searchGoodsByPic',params)
// 		}
// 	},
//
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, page_size=36, language='en', currency='USD', min_price = null, max_price = null, category = null, location = null, memberType = null, property = null}) {
// 		return Service.get('api/micapp/searchGoodsByText',{
// 			params: {
// 				search_text:searchText, page, page_size, lang:language, currency, min_price, max_price, category, location, memberType, property
// 			},
// 		})
// 	},
// }
// export const cjds = {
// 	// 图片搜索
// 	searchGoodsByPic() {
// 		let file = null
// 		file = getFileFromBase64(Store.state.searchParams.mainImage);
// 		let formData = new FormData();
// 		formData.append('image', file);
// 		return Service.post('api/cjdsapp/searchGoodsByPic', formData)
// 	},
//
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, page_size=20, language, currency, category = null, country = null, productType = null, addMarkStatus = null, sort = null, price_sort = null, min_price, max_price}) {
// 		const params = Qs.stringify({
// 			search_text:searchText, page, page_size, lang:language, currency, category, country, productType, addMarkStatus, sort, price_sort
// 			, min_price, max_price});
// 		return Service.post('api/cjdsapp/searchGoodsByText',params,{
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded'
// 			},
// 		})
// 	},
// }

// export const litbox = {
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, page_size=36, language='en', country='CHN', country_code='CN', currency='CNY', searchType=3, category = null, brand = '0', sort = '6d', fourStars, min_price, max_price}) {
// 		return Service.get('api/litboxapp/searchGoodsByText',{
// 			params: {
// 				search_text:searchText, page, page_size, lang:language, country, country_code, currency, searchType, category, brand, sort, fourStars, min_price, max_price
// 			},
// 		})
// 	},
// }
// export const banggood = {
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, language='en-GB', currency = 'USD', country='CN', warehouse = null, special_options, category = null, sort = '0', min_price, max_price }) {
// 		return Service.get('api/banggoodapp/searchGoodsByText',{
// 			params: {
// 				search_text:searchText, page, lang:language, currency, country, warehouse, special_options, category, sort, min_price, max_price
// 			},
// 		})
// 	},
// }
// export const chinabrands = {
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, language='en', country= null, brand_id = null, sort, canReserve = null, type = '0', sale_time = null, min_price, max_price, min_stock, max_stock }) {
// 		return Service.get('api/chinabrands/searchGoodsByText',{
// 			params: {
// 				search_text:searchText, page, lang:language, country, brand_id, sort, canReserve, type, sale_time, min_price, max_price, min_stock, max_stock
// 			},
// 		})
// 	},
// }
// export const globalres = {
// 	// 搜索商品
// 	searchGoodsByText({searchText, page=1, language='en', country= null, busType = null, directOrderFlag = null, min_price, max_price,  category = null, min_order }) {
// 		return Service.get('api/globalresapp/searchGoodsByText',{
// 			params: {
// 				search_text:searchText, page, lang:language, country, busType, directOrderFlag, min_price, max_price, category, min_order
// 			},
// 		})
// 	},
// }

export const publicAPI = {
	uploadFeedbackImage(filelist) {
		let formData = new FormData();
		let i = 1;
		for (let file of filelist) {
			formData.append(`file_${i}`, file.file);
			i++;
		}
		return axios.post('http://www.tripsters.cn/Publics/Index/imgUpload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		});
	},
	submitFeedback({appname = '欧洲火车', content = '', contact = null, img_path = null}) {
		return axios.post('http://www.tripsters.cn/Publics/Index/sendUserFeedback', Qs.stringify({appname, contact, content, img_path}), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		});
	},
	// 多国家、多语言、 多货币
	getCountryLangCurrency(path, params) {
		return Service.get(path, {
			params: params
		})
	},

	// 上传图片
	uploadPic(file){
		let cookie = null;
		if(SourceMap[Store.state.source_id].needCookie === true) {
			cookie = getCookie();
			if(!cookie) return Promise.reject('no cookie');
		}

		let formData = new FormData();
		formData.append('file', file);
		if(Store.state.source_id == 6){ // 速卖通需要传token、cookie
			return Service.post(SourceMap[Store.state.source_id].uploadPic, formData, {
				// params: param,
				headers: {'token': cookie}
			})
		}else {
			formData.append('cookie', cookie);
			return Service.post(SourceMap[Store.state.source_id].uploadPic, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		}
	},

	//图片首次搜索
	searchGoodsByPicFirst(params){
		let param = {},cookie = null;
		if(SourceMap[Store.state.source_id].needCookie === true) {
			cookie = getCookie();
			if(!cookie) return Promise.reject('no cookie');
		}
		let searchtype = (Store.state.source_id == 2) ? 0 : 1;
		param = {
			imageId: params.imageAddress, yoloRegionSelected: params.yoloRegionSelected ?? null, yoloCropRegion: params.yoloCropRegion ?? null, region: params.region ?? null, cookie: cookie, searchtype: searchtype, pailitaoCategoryId: params.pailitaoCategoryId ?? null, sortField: params.sortField ?? 'normal', sortType: params.sortType ?? 'asc', priceStart: params.priceStart ?? null, priceEnd: params.priceEnd ?? null, quantityBegin: params.quantityBegin ?? null, extendProperties: params.extendProperties ?? null, memberTags: params.memberTags ?? null, isImgPkg: params.isImgPkg ?? null, isMainShortVideo: params.isMainShortVideo ?? null, isAuthentication: params.isAuthentication ?? null, isPatent: params.isPatent ?? null, isSrcFactoryItm: params.isSrcFactoryItm ?? null, holidayTagId: params.holidayTagId ?? null, isZhangqiSelect: params.isZhangqiSelect ?? null, gmtCreate: params.gmtCreate ?? null, province: params.province ?? null, city: params.city ?? null, dis: params.dis ?? null};
		return Service.get(SourceMap[Store.state.source_id].searchGoodsByPicFirst.path, {
			params: param
		})
	},

	//图片搜索
	searchGoodsByPic(params) {
		let param = {},cookie = null, file = null, formData = new FormData();
		if(SourceMap[Store.state.source_id].needCookie === true) {
			cookie = getCookie();
			if(!cookie) return Promise.reject('no cookie');
		}
		// 如果没有上传图片成功的状态，就base64转文件
		if( Store.state.imageUploadState !== 'uploaded') {
			file = getFileFromBase64(Store.state.searchParams.mainImage);
		}
		switch (Store.state.source_id) {
			case 1: // Alibaba
				param = {
					imageAddress: params.imageAddress, beginPage: params.page, language: params.language ?? null, currency: params.currency ?? null, categoryId: params.categoryId ?? null};
				break;
			case 2: case 5: // 1688 1688overseas
				let searchtype = (Store.state.source_id == '2') ? 0 : 1;
				param = {
					imageId: params.imageAddress, page: params.page, yoloRegionSelected: params.yoloRegionSelected ?? null, yoloCropRegion: params.yoloCropRegion ?? null, region: params.region ?? null, sessionId: params.sessionId ?? null, requestId: params.requestId ?? null, cookie: cookie, searchtype: searchtype, pailitaoCategoryId: params.pailitaoCategoryId ?? null, sortField: params.sortField ?? 'normal', sortType: params.sortType ?? 'asc', priceStart: params.priceStart ?? null, priceEnd: params.priceEnd ?? null, quantityBegin: params.quantityBegin ?? null, extendProperties: params.extendProperties ?? null, memberTags: params.memberTags ?? null, isImgPkg: params.isImgPkg ?? null, isMainShortVideo: params.isMainShortVideo ?? null, isAuthentication: params.isAuthentication ?? null, isPatent: params.isPatent ?? null, isSrcFactoryItm: params.isSrcFactoryItm ?? null, holidayTagId: params.holidayTagId ?? null, isZhangqiSelect: params.isZhangqiSelect ?? null, gmtCreate: params.gmtCreate ?? null, province: params.province ?? null, city: params.city ?? null, dis: params.dis ?? null};
				break;
			case 3: // 1688 Rapid
				// 如果没有上传图片成功的状态，就走上传文件逻辑
				if( Store.state.imageUploadState !== 'uploaded'){
					formData.append('file', file); formData.append('page', params.page);
				}else{
					param = Qs.stringify({
						url: params.imageAddress, page: params.page, page_size: params.page_size ?? null, attr_id: params.attr_id ?? null});
				}
				break;
			case 4: // 1688Global
				param = {
					imgUrl: params.imageAddress, pageNo: params.page, cookie: cookie, region: params.region ?? null, keyword: params.keyword ?? null, categoryId: params.categoryId ?? null, location: params.location ?? null, tags: params.tags ?? null};
				break;
			case 6: // Aliexpress DS
				param = {
					filename: params.imageAddress, categoryId: params.categoryId ?? null};
				break;
			case 7: // Aliexpress ZapieX
				param = {
					uploadKey: params.imageAddress, lang: params.language ?? null, currency: params.currency ?? null, sort: params.sort ?? null, filter: params.filter ?? null};
				break;
			case 8: // YiWuGo
				param = {
					file_url: params.imageAddress, page: params.page ?? null, page_size: params.page_size ?? null, lang: params.language ?? null};
				break;
			case 9: // DHgate
				if( Store.state.imageUploadState !== 'uploaded'){
					formData.append('image', file); formData.append('page_num', params.page); formData.append('lang', params.language ?? null); formData.append('currency', params.currency ?? null);
				}else{
					param = Qs.stringify({
						imgUrl: params.imageAddress, page_num: params.page, page_size: params.page_size ?? null, lang: params.language ?? null, currency: params.currency ?? null, category: params.category ?? null});
				}
				break;
			case 10: // CJdropshipping
				if( Store.state.imageUploadState !== 'uploaded'){
					formData.append('image', file);
				}
				break;
			case 11: // Made-in-China
				if( Store.state.imageUploadState !== 'uploaded'){
					formData.append('image', file); formData.append('page_num', params.page); formData.append('page_size', params.page_size ?? null); formData.append('lang', params.language ?? null); formData.append('currency', params.currency ?? null);
				}else{
					param = Qs.stringify({
						imgId: params.imageAddress, page_num: params.page, page_size: params.page_size ?? null, lang: params.language ?? null, currency: params.currency ?? null, category: params.category ?? null, color: params.color ?? null});
				}
				break;
		}
		// 如果没有上传图片，并且当前没有上传图片成功的状态，就走上传文件逻辑
		if(SourceMap[Store.state.source_id].hasUpload == false && Store.state.imageUploadState !== 'uploaded'){
			//如果当前站点为 1688rapid
			let path = (Store.state.source_id == 3) ? SourceMap[Store.state.source_id].searchGoodsByPicFirst.path : SourceMap[Store.state.source_id].searchGoodsByPic.path;
			return Service.post(path, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		}

		if(SourceMap[Store.state.source_id].searchGoodsByPic.method === 'get') {
			if(Store.state.source_id == 6){ // 速卖通需要传token、cookie
				return Service.get(SourceMap[Store.state.source_id].searchGoodsByPic.path, {
					params: param,
					headers: {'token': cookie}
				})
			}
				return Service.get(SourceMap[Store.state.source_id].searchGoodsByPic.path, {
					params: param
				})
		}
				return Service.post(SourceMap[Store.state.source_id].searchGoodsByPic.path, param, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
				})
	},

	//文字首次搜索
	searchGoodsByTextFirst(params){
		let param = {},cookie = null;
		if(SourceMap[Store.state.source_id].needCookie === true) {
			cookie = getCookie();
			if(!cookie) return Promise.reject('no cookie');
		}
		switch (Store.state.source_id) {
			case 2: case 5: // 1688 1688overseas
				param = {
					type: 1, keyword:params.searchText, cookie:cookie, featurePair:params.featurePair ?? null, sortType:params.sortType ?? null, descendOrder:params.descendOrder ?? null, priceStart:params.priceStart ?? null, priceEnd:params.priceEnd ?? null, quantityBegin:params.quantityBegin ?? null,province:params.province ?? null, city:params.city ?? null, biztype:params.biztype ?? null, tagsZ:params.tagsZ ?? null, offerTags:params.offerTags ?? null, filtHolidayTagId:params.filtHolidayTagId ?? null, extendProperties:params.extendProperties ?? null, memberTags:params.memberTags ?? null, commonSort:params.commonSort ?? null, tese:params.tese ?? null, filt:params.filt ?? null, factorySize:params.factorySize ?? null, employeesCount:params.employeesCount ?? null};
				break;
			case 4: // 1688Global
				param = {
					keywords:params.searchText, cookie:cookie ?? null, category:params.category ?? null, featurePair:params.featurePair ?? null, sortType:params.sortType ?? null, descendOrder:params.descendOrder ?? null, priceStart:params.priceStart ?? null, priceEnd:params.priceEnd ?? null, quantityBegin:params.quantityBegin ?? null,province:params.province ?? null, city:params.city ?? null, biztype:params.biztype ?? null, tagsZ:params.tagsZ ?? null, extendProperties:params.extendProperties ?? null, commonSort:params.commonSort ?? null, filtMemberTags:params.filtMemberTags ?? null, filtOfferTags:params.filtOfferTags ?? null, holidayTagId:params.holidayTagId ?? null, tese:params.tese ?? null, filt:params.filt ?? null, factorySize:params.factorySize ?? null, employeesCount:params.employeesCount ?? null};
				break;
		}

		return Service.get(SourceMap[Store.state.source_id].searchGoodsByTextFirst.path, {
			params: param
		})
	},

	// 文字搜索
	searchGoodsByText(params) {
		let param = {}, cookie = null;
		if(SourceMap[Store.state.source_id].needCookie === true) {
			cookie = getCookie();
			if(!cookie) return Promise.reject('no cookie');
		}
		switch (Store.state.source_id) {
			case 1: // Alibaba
				param = {
					search_text:params.searchText, page:params.page, index_area: params.index_area ?? 'product_en', language:params.language ?? null, currency:params.currency ?? null, Category:params.Category ?? null, supplierType:params.supplierType ?? null, ta:params.ta ?? null, assessment_company:params.assessment_company ?? null, replyAvgTime:params.replyAvgTime ?? null, param_order:params.param_order ?? null, freeSample:params.freeSample ?? null, productTag:params.productTag ?? null, moqf:params.moqf ?? null,moqt:params.moqt ?? null, pricef:params.pricef ?? null, pricet:params.pricet ?? null, Country:params.Country ?? null, exportCountry:params.exportCountry ?? null, companyAuthTag:params.companyAuthTag ?? null, productAuthTag:params.productAuthTag ?? null, refine_attr_value:params.refine_attr_value ?? null};
				break;
			case 2: case 5: // 1688 1688overseas
				param = {
					type: 1,keyword:params.searchText, page:params.page, sessionId:params.sessionId ?? null, category:params.category ?? null, featurePair:params.featurePair ?? null, sortType:params.sortType ?? null, descendOrder:params.descendOrder ?? null, priceStart:params.priceStart ?? null, priceEnd:params.priceEnd ?? null, quantityBegin:params.quantityBegin ?? null,province:params.province ?? null, city:params.city ?? null, biztype:params.biztype ?? null, tagsZ:params.tagsZ ?? null, offerTags:params.offerTags ?? null, filtHolidayTagId:params.filtHolidayTagId ?? null, extendProperties:params.extendProperties ?? null, memberTags:params.memberTags ?? null, commonSort:params.commonSort ?? null, tese:params.tese ?? null, filt:params.filt ?? null, factorySize:params.factorySize ?? null, employeesCount:params.employeesCount ?? null, startIndex:params.startIndex ?? null,};
				break;
			case 3: // 1688 Rapid
				param = {
					search_text:params.searchText, page:params.page, page_size:params.page_size ?? null, attr_id:params.attr_id ?? null, sort:params.sort ?? '0', min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 4: // 1688Global
				param = {
					keywords:params.searchText, page:params.page, cookie:cookie ?? null, sessionId:params.sessionId ?? null, requestId:params.requestId ?? null, category:params.category ?? null, featurePair:params.featurePair ?? null, sortType:params.sortType ?? null, descendOrder:params.descendOrder ?? null, priceStart:params.priceStart ?? null, priceEnd:params.priceEnd ?? null, quantityBegin:params.quantityBegin ?? null,province:params.province ?? null, city:params.city ?? null, biztype:params.biztype ?? null, tagsZ:params.tagsZ ?? null, extendProperties:params.extendProperties ?? null, commonSort:params.commonSort ?? null, filtMemberTags:params.filtMemberTags ?? null, filtOfferTags:params.filtOfferTags ?? null, holidayTagId:params.holidayTagId ?? null, tese:params.tese ?? null, filt:params.filt ?? null, factorySize:params.factorySize ?? null, employeesCount:params.employeesCount ?? null};
				break;
			case 6: // Aliexpress DS
				param = {
					search_text:params.searchText, page:params.page, language:params.language ?? null, currency:params.currency ?? null, country:params.country ?? null, cat_id:params.cat_id ?? null, brand_id:params.brand_id ?? null, pvid:params.pvid ?? null, ship_from_country:params.ship_from_country ?? null, isBigSale:params.isBigSale ?? null, hasCoupon:params.hasCoupon ?? null, isFreeShip:params.isFreeShip ?? null, isFavorite:params.isFavorite ?? null, sort_type:params.sort_type ?? null,min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 7: // Aliexpress ZapieX
				param = {
					search_text:params.searchText, page:params.page, language:params.language ?? null, currency:params.currency ?? null, categoryId:params.categoryId ?? null, attr_id_value:params.attr_id_value ?? null, shipFrom:params.shipFrom ?? null, shipTo:params.shipTo ?? null, freeShippingOnly:params.freeShippingOnly ?? null, fastShippingOnly:params.fastShippingOnly ?? null, moreThanFourStarsOnly:params.moreThanFourStarsOnly ?? null, sort:params.sort ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 8: // YiWuGo
				param = {
					search_text:params.searchText, page:params.page, lang:params.language ?? null, category:params.category ?? null, sub_market:params.sub_market ?? null, set_yiwu_market:params.set_yiwu_market ?? '0', sort:params.sort ?? '0', min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 9: // DHgate
				param = Qs.stringify({
					search_text:params.searchText, page:params.page, page_size:params.page_size ?? null, lang:params.language ?? null, currency:params.currency ?? null, category:params.category ?? null, at:params.at ?? null, freeShipping:params.freeShipping ?? null, inventoryLocation:params.inventoryLocation ?? null, sort:params.sort ?? null, price_sort:params.price_sort ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null, minOrder:params.minOrder ?? null,
				});
				break;
			case 10: // CJdropshipping
				param = Qs.stringify({
					search_text:params.searchText, page:params.page, page_size:params.page_size ?? null, lang:params.language ?? null, currency:params.currency ?? null, country:params.country ?? null, category:params.category ?? null,  productType:params.productType ?? null, addMarkStatus:params.addMarkStatus ?? null, sort:params.sort ?? null, price_sort:params.price_sort ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null});
				break;
			case 11: // Made-in-China
				param = {
					search_text:params.searchText, page:params.page, page_size:params.page_size, lang:params.language ?? null, currency:params.currency ?? null, location:params.location ?? null,category:params.category ?? null, memberType:params.memberType ?? null, property:params.property ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 12: // LightInTheBox
				param = {
					search_text:params.searchText, page:params.page, lang:params.language ?? null, currency:params.currency ?? null, country_code:params.country_code ?? null, country:params.country ?? null,category:params.category ?? null, searchType:params.searchType ?? '3', brand:params.brand ?? '0', sort:params.sort ?? '6d', fourStars:params.fourStars ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 13: // Banggood
				param = {
					search_text:params.searchText, page:params.page, lang:params.language ?? null, currency:params.currency ?? null, country:params.country ?? null,category:params.category ?? null, warehouse:params.warehouse ?? null, special_options:params.special_options ?? null, sort:params.sort ?? '0', min_price:params.min_price ?? null, max_price:params.max_price ?? null};
				break;
			case 14: // Chinabrands
				param = {
					search_text:params.searchText, page:params.page, lang:params.language ?? null, country:params.country ?? null, brand_id:params.brand_id ?? null, sort:params.sort ?? null, canReserve:params.canReserve ?? null, type:params.type ?? '0', sale_time:params.sale_time ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null, min_stock:params.min_stock ?? null, max_stock:params.max_stock ?? null,};
				break;
			case 15: // Globalres
				param = {
					search_text:params.searchText, page:params.page, lang:params.language ?? null, currency:params.currency ?? null, country:params.country ?? null, category:params.category ?? null,  busType:params.busType ?? null, directOrderFlag:params.directOrderFlag ?? null, min_price:params.min_price ?? null, max_price:params.max_price ?? null, minOrder:params.minOrder ?? null,};
				break;
		}

		if(SourceMap[Store.state.source_id].searchGoodsByText.method === 'get') {
			if(Store.state.source_id == 6){// 速卖通需要传token、cookie
				return Service.get(SourceMap[Store.state.source_id].searchGoodsByText.path, {
					params: param,
					headers: {'token': cookie}
				})
			}
			return Service.get(SourceMap[Store.state.source_id].searchGoodsByText.path, {
				params: param
			})
		}
			return Service.post(SourceMap[Store.state.source_id].searchGoodsByText.path, param, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			})

	}
}