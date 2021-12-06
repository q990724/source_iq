
/**
 * @description 获取浏览器地址栏的query参数
 * @param {String} variable key
 * @returns [String | Boolean]
 */
export function getQueryVariable(variable) {
	let query = window.location.search.substring(1);
	let vars = query.split("&");
	for (let i=0;i<vars.length;i++) {
	    let pair = vars[i].split("=");
	    if(pair[0] == variable){return pair[1];}
	}
	return(false);
}


/**
 * @description 获取图片的base64
 * @param {Image} img 
 * @param {Function} callback 
 */
export function getBase64 (img, callback = () =>{}) {
	return new Promise((resolve => {
		const reader = new FileReader()
		reader.addEventListener('load', () => {
			callback(reader.result)
			resolve(reader.result);
		})
		reader.readAsDataURL(img)
	}))
}

/**
 * @description 根据base64转图片
 * @param {String} base64Data 图片的base64位编码
 * @returns File
 */
export function getFileFromBase64(base64Data) {
	// base64转blob
	const base64ToBlob = function(base64Data ,fileName = 'file') {
	    let arr = base64Data.split(','),
	        fileType = arr[0].match(/:(.*?);/)[1],
			suffix = fileType.split("/")[1],
	        bstr = atob(arr[1]),
	        l = bstr.length,
	        u8Arr = new Uint8Array(l);
		
	    while (l--) {
	        u8Arr[l] = bstr.charCodeAt(l);
	    }
	    // return new Blob([u8Arr], {
	    //     type: fileType
	    // });
		suffix = (suffix === 'jpeg') ? 'jpg' : suffix;
	    return new File([u8Arr], fileName + '.' + suffix, {
	        type: fileType
	    });
	};
	// blob转file
	// const blobToFile = function(newBlob, fileName) {
	//     newBlob.lastModifiedDate = new Date();
	//     newBlob.name = fileName;
	//     return newBlob;
	// };
		
	// 调用
	const blob = base64ToBlob(base64Data);
	// const file = blobToFile(blob, 'file');
	return blob;
}

/**
 * 
 * @param {String} imagePath 原图地址
 * @param {Array} regionList 裁剪区域数组 "1,1,0,0;0,0,1,1"
 * @returns Promise -> {Array}
 */
export function getBase64FromCropImage(imagePath, regionList) {
	return new Promise((resolve, reject) => {
		try{
			let imageList = [];
			let image = new Image();
			image.src = imagePath;
			image.crossOrigin = '';
			image.onload = function(o) {
				for(let item of regionList) {
					let arr = item.split(',');
					let sx = arr[0], sy = arr[1], sw = arr[2], sh = arr[3];
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.width = sy-sx
					canvas.height = sh-sw
					ctx.drawImage(image, sx, sw, sy, sh, 0, 0, image.width, image.height);
					let base64 = canvas.toDataURL('image/jpg');
					let localItem = {
						id: new Date().getTime(),
						cover: base64,
						file: getFileFromBase64(base64),
						selected: false,
						region: item
					}
					imageList.push(localItem);
				}
				resolve(imageList)
			}
		}catch(e){
			console.log(e);
			reject(e);
		}
		
	});
}

/**
 * @description 对响应数据进行处理
 * @param {Object} response 接口搜索返回的数据
 */
export function handleResponse (response) {
	if(response && response.data && response.data.results) {
		for (let item of response.data.results) {
			// 对商品的封面图地址进行https加工
			if (item.product.media.coverImageUrl && typeof item.product.media.coverImageUrl ==
				'string') {
				if (!item.product.media.coverImageUrl.includes('https')) {
					item.product.media.coverImageUrl = 'https://' + item.product.media.coverImageUrl
				}
			}
			// 对商品的详情页地址进行https加工
			if (item.product.productUrl && typeof item.product.productUrl == 'string') {
				if (!item.product.productUrl.includes('https')) {
					item.product.productUrl = 'https://' + item.product.productUrl
				}
			}
			// 对卖家的详情页地址进行https加工
			if (item.seller && item.seller.homeUrl && typeof item.seller.homeUrl == 'string') {
				if (!item.seller.homeUrl.includes('https')) {
					item.seller.homeUrl = 'https://' + item.seller.homeUrl
				}
			}
		}
	}
}

export function findKey(obj, value, compare = (a, b) => a === b) {
	return Object.keys(obj).find(k => compare(obj[k], value))
}