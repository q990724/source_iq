const server_url = 'http://eurotransit.acuteberry.com/';
// const server_url = 'http://artpic.la.com/';
const client_url = 'http://192.168.0.113:8080/';

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

// 发送图片base64到content_script
function uploadImage(base64) {
    chrome.tabs.query({title: 'SourceIQ'}, tabs => {
        console.log('获取项目页面', tabs);
        // 1.将base64直接存储到chrome缓存中
        chrome.storage.local.set({'upload-file': base64}, function () {
            // 2. 检查是否存在SourceIQ的tab
            if(tabs && tabs.length > 0) {
                // 3. 如果存在tab 发送消息通知content去chrome缓存拿base64
                sendMessageToContentScript({cmd: 'image-file'});
                // 3.1. 切换到最后一个tab
                chrome.tabs.highlight({windowId: tabs[tabs.length - 1].windowId, tabs: tabs[tabs.length - 1].index}) // 切换到搜索页选项卡
                chrome.windows.update(tabs[tabs.length - 1].windowId, {focused: true}); // 窗口得到聚焦
                // 3.2. 刷新所有的SourceIQ的tab
                for(let tab of tabs) {
                    chrome.tabs.reload(tab.id);
                }
            }else {
                // 4. 如果不存在SourceIQ的tab，则创建一个，并传递一个get参数refreshUploadFile通知Vue页面base64刷新了
                chrome.tabs.create({active: true, url: client_url + '?refreshUploadFile=true'}, function (tab) {});
            }
        });
    });
}

// 处理服务器返回上传图片结果
function handleUploadedImage(result, id) {
    console.log(result);
    // alibaba
    if(id == 1) {
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.imageAddress}&imgUrl=${result.domain + result.imageAddress}#/`});
    }else if(id == 2) {
        // 1688
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.imageId}&imgUrl=${result.u}#/`});
    }else if(id == 3) {
        // 1688Global
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.imgUrl}&imgUrl=${result.imgUrl}#/`});
    }else if(id == 4) {
        // aliexpress
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.filename}&imgUrl=${result.url}#/`});
    }else if(id == 5) {
        // yiwugo
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.url}&imgUrl=${result.url}#/`});
    }else if(id == 6) {
        // dhgate
        chrome.tabs.create({"url": client_url + `?imageAddress=${result.imgUrl}&imgUrl=${result.imgUrl}#/`});
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
            console.log('识别到网络图片：', info);
            getBase64(info.srcUrl).then(base64 => {
                uploadImage(base64);
            }, err => {
                console.log(err)
            })
            // sendMessageToContentScript({
            //     cmd: 'parse-title',
            //     value: {
            //         imgUrl: info.srcUrl,
            //         pageUrl: info.pageUrl
            //     }
            // }, function (response) {
            //     // console.log('title: ' + parseTitle(info.pageUrl, info.srcUrl, response));
            //     //把图片转换成base64
            //
            // });
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
    chrome.tabs.query({ }, function (tabs) {
        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, message, function (response) {
                if (callback) callback(response);
            });
        }
    });
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    let action = req.action,
        value = req.value;
    // 图片上传
    if(action === 'uploadImage') {
        const base64 = value.base64;
        uploadImage(base64);
    }else if(action === 'getSetting') {
        // 应用获取设置
        chrome.storage.local.get( {app_setting: null}, function(o) {
            sendResponse({app_setting: o.app_setting})
        })
    }
    return true;
})

// 监听页面变化
chrome.tabs.onUpdated.addListener(function(id, info, tab) {
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
					if(item.name) cookie_obj[item.name] = item.value || '';
				}
				let cookie = obj2cookie(cookie_obj, ';') || '';
				// chrome.storage.local.set({aliexpress_cookie: cookie}, function(){});
                sendMessageToContentScript({cmd: 'update-cookie', value: {cookie: cookie, source: 'aliexpress'}});
			}
		})
	}else if(url.indexOf('global.1688.com') !== -1 && info.status === 'complete') {
		chrome.cookies.getAll({domain: '1688.com'}, function(res) {
			if(res && Array.isArray(res) && res.length > 0) {
				console.log('res', res);
				let cookie_obj = {};
				for(let item of res) {
					if(item.name) cookie_obj[item.name] = item.value || '';
				}
				let cookie = obj2cookie(cookie_obj, '; ') || '';
				// console.log(cookie);
				// chrome.storage.local.set({_1688global_cookie: cookie}, function(){});
                sendMessageToContentScript({cmd: 'update-cookie', value: {cookie: cookie, source: '1688global'}});
			}
		})
	}else if(url.indexOf('1688.com') !== -1 && info.status === 'complete') {
		chrome.cookies.getAll({domain: '1688.com'}, function(res) {
			if(res && Array.isArray(res) && res.length > 0) {
				console.log('res', res);
				let cookie_obj = {};
				for(let item of res) {
					if(item.name) cookie_obj[item.name] = item.value || '';
				}
				let cookie = obj2cookie(cookie_obj, '; ') || '';
				// console.log(cookie);
				// chrome.storage.local.set({_1688_cookie: cookie}, function(){});
                sendMessageToContentScript({cmd: 'update-cookie', value: {cookie: cookie, source: '1688'}});
			}
		})
	}
	
})