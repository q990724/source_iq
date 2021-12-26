
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
	function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
		/* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
		//set up canvas for thumbnail
		var tnCanvas = document.createElement('canvas');
		var tnCanvasContext = tnCanvas.getContext('2d');
		tnCanvas.width = newWidth; tnCanvas.height = newHeight;

		/* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
		var bufferCanvas = document.createElement('canvas');
		var bufferContext = bufferCanvas.getContext('2d');
		bufferCanvas.width = imgObj.width;
		bufferCanvas.height = imgObj.height;
		bufferContext.drawImage(imgObj, 0, 0);

		/* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
		tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio, 0, 0, newWidth, newHeight);
		return tnCanvas.toDataURL();
	}
	return new Promise((resolve, reject) => {
		try{
			let imageList = [];
			let image = new Image();
			image.src = imagePath;
			image.crossOrigin = '';
			image.onload = function(o) {
				for(let item of regionList) {
					let region_arr = item.split(',');
					let x1 = region_arr[0], y1 = region_arr[2], x2 = region_arr[1], y2 = region_arr[3];
					let base64 = getImagePortion(image, x2 - x1, y2 - y1, x1, y1, 1);
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
				if (item.product.media.coverImageUrl.includes('https:https://')) {
					item.product.media.coverImageUrl = item.product.media.coverImageUrl.slice(6)
				}else if (!item.product.media.coverImageUrl.includes('http')) {
					item.product.media.coverImageUrl = 'https://' + item.product.media.coverImageUrl
				}
			}
			// 对商品的详情页地址进行https加工
			if (item.product.productUrl && typeof item.product.productUrl == 'string') {
				if (!item.product.productUrl.includes('http')) {
					item.product.productUrl = 'https://' + item.product.productUrl
				}
			}
			// 对卖家的详情页地址进行https加工
			if (item.seller && item.seller.homeUrl && typeof item.seller.homeUrl == 'string') {
				if (!item.seller.homeUrl.includes('http')) {
					item.seller.homeUrl = 'https://' + item.seller.homeUrl
				}
			}
		}
	}
}

export function findKey(obj, value, compare = (a, b) => a === b) {
	return Object.keys(obj).find(k => compare(obj[k], value))
}

//使传参的参数值扁平化
export function collapse(params){
	// Object.keys(params).forEach(key=>{
	for	(let key in params) {
		// if(key === 'searchText' || key ==='imageAddress'|| key ==='originImage'|| key ==='mainImage'||key ==='yoloCropRegion'||key ==='region' || key === 'language' || key === 'country' || key === 'currency')
		// 	continue;
		// $arr = ['searchText','imageAddress','imageAddress','imageAddress','imageAddress','imageAddress','imageAddress']

		if((key === 'searchText' || key ==='imageAddress'|| key ==='originImage'|| key ==='mainImage'||key ==='yoloCropRegion'||key ==='region' || key === 'language' || key === 'country' || key === 'currency') && typeof(params[key]) !== 'object') continue;

		// if(typeof(params[key]) == 'string' || params[key] == null) continue;

		if(params[key]){
			let arr = [];
			for (let k in params[key]) {
				arr.push(params[key][k]);
			}
			params[key] = arr.join(',')
		}
	}
	console.log('state.searchParams扁平化之后:',params);
	return params;
}


//防抖函数,在规定时间内只让最后一次生效
export function debounce(fn, delay) {
	let timer = null;
	return function() {
		clearTimeout(timer); //清除前一次的事件触发
		timer = setTimeout(() => (fn.call(this)), delay); //重新设置定时触发事件
	}
}