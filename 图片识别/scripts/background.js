//将远程图片转化为base64
function getBase64(img) {
    function getBase64Image(img, width, height) {
        //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    var image = new Image();
    image.crossOrigin = '';
    image.src = img;
    return new Promise((resolve, reject) => {
        image.onload = function () {
            resolve(getBase64Image(image)); //将base64传给done上传处理
        }
    });
}

// 把base64转file
function getFile(base64Data) {
    // base64转blob
    const base64ToBlob = function(base64Data) {
        let arr = base64Data.split(','),
            fileType = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            l = bstr.length,
            u8Arr = new Uint8Array(l);

        while (l--) {
            u8Arr[l] = bstr.charCodeAt(l);
        }
        return new Blob([u8Arr], {
            type: fileType
        });
    };
    // blob转file
    const blobToFile = function(newBlob, fileName) {
        newBlob.lastModifiedDate = new Date();
        newBlob.name = fileName;
        return newBlob;
    };

    const blob = base64ToBlob(base64Data);
    const file = blobToFile(blob, 'file');
    return file;
}

// 上传图片到服务器
function uploadImage(file) {
    let formData = new FormData();
    formData.append('file', file);
    let urls = {
        1688: '',
        gj_1688: '',
        aliexpress: 'http://eurotransit.acuteberry.com/api/aliexpress/uploadPic',
        alibaba: 'http://eurotransit.acuteberry.com/api/aliintersite/uploadPic'
    }
    $.ajax({
        url: urls.alibaba,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success:function(res){
            console.log(res);
            handleUploadedImage(res.data, 'alibaba');
        }
    })
}

// 处理服务器返回上传图片结果
function handleUploadedImage(result, type) {
    if(type === 'alibaba') {
        chrome.tabs.create({"url": `http://10.33.40.23:8080/?imageAddress=${result.imageAddress}#/`});
    }
}

// 解析相关标题
function parseTitle(domain, imgUrl, dom) {
    try {
        // 亚马逊 amazon
        if(domain.indexOf('amazon') != -1) {
            let img = $(dom).find(`img[src='${imgUrl}']`);
            console.log(img);
            if(img) return img.attr('alt');
        }
    }catch (e) {
        return '';
    }
}

// 右键菜单
chrome.contextMenus.create({
    title: "图片搜索",
    contexts: ['all'],
    onclick: function (info, tab) {
        if (info.mediaType && info.mediaType == 'image') {
            console.log(info);
            sendMessageToContentScript({
                cmd: 'parse-title',
                value: {
                    imgUrl: info.srcUrl,
                    pageUrl: info.pageUrl
                }
            }, function (response) {
                console.log('title: ' + parseTitle(info.pageUrl, info.srcUrl, response));
                //把图片转换成base64
                getBase64(info.srcUrl).then(base64 => {
                    let file = getFile(base64);
                    uploadImage(file);
                }, err => {
                    console.log(err)
                })
            });
        } else {
            chrome.tabs.captureVisibleTab(null, {
                format: "png",
                quality: 100
            }, function (data) {
                sendMessageToContentScript({
                    cmd: 'cover-image',
                    value: data
                }, function (response) {
                    console.log('来自content的回复：' + response);
                });
            });
        }
    }
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    const base64 = req.base64;
    let file = getFile(base64);
    uploadImage(file);
})

// 监听页面变化
chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	console.log('tab更新', info);
	let url = tab.url;

	let obj2cookie = function (obj, step) {
		if (obj.constructor == Object) {
			var cssStr = '';
			for (var key in obj) {
				cssStr += key + '=' + obj[key] + step;
			}
			return cssStr.substr(0, cssStr.length - 1);
		}
	}
	
	if(url.indexOf('aliexpress.com') !== -1 && info.status === 'complete') {
		chrome.cookies.getAll({domain: 'aliexpress.com'}, function(res) {
			if(res && Array.isArray(res) && res.length > 0) {
				console.log(res);
				let cookie_obj = {};
				for(let item of res) {
					if(item.name) {
						cookie_obj[item.name] = item.value || '';
					}
				}
				let cookie = obj2cookie(cookie_obj, ';') || '';
				chrome.storage.local.set({aliexpress_cookie: cookie}, function(){});
			}
		})
	}else if(url.indexOf('global.1688.com') !== -1 && info.status === 'complete') {
		chrome.cookies.getAll({domain: '1688.com'}, function(res) {
			if(res && Array.isArray(res) && res.length > 0) {
				console.log('res', res);
				let cookie_obj = {};
				for(let item of res) {
					if(item.name) {
						cookie_obj[item.name] = item.value || '';
					}
				}
				let cookie = obj2cookie(cookie_obj, '; ') || '';
				console.log(cookie);
				chrome.storage.local.set({_1688global_cookie: cookie}, function(){});
			}
		})
	}else if(url.indexOf('1688.com') !== -1 && info.status === 'complete') {
		chrome.cookies.getAll({domain: '1688.com'}, function(res) {
			if(res && Array.isArray(res) && res.length > 0) {
				console.log('res', res);
				let cookie_obj = {};
				for(let item of res) {
					if(item.name) {
						cookie_obj[item.name] = item.value || '';
					}
				}
				let cookie = obj2cookie(cookie_obj, '; ') || '';
				console.log(cookie);
				chrome.storage.local.set({_1688_cookie: cookie}, function(){});
			}
		})
	}
	
})