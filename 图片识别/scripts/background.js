const server_url = 'http://eurotransit.acuteberry.com/';
// const server_url = 'http://artpic.la.com/';
const client_url = 'http://10.11.30.9:8080/';

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
    let urls = {
        _1688: server_url + 'api/goods/uploadPicH5',
        _1688global: server_url + 'api/goods/uploadPicKj',
        aliexpress: server_url + 'api/aliexpress/uploadPic',
        alibaba: server_url + 'api/aliintersite/uploadPic',
        yiwugo: server_url + 'api/yiwugoapp/uploadPic',
        dhgate: server_url + 'api/dhgateapp/searchGoodsByPic'
    }

    function getCookie(sid) {
        return new Promise((resolve, reject) => {
            let key = sid == 2 ? '_1688_cookie' : sid == 3 ? '_1688global_cookie' : sid == 4 ? 'aliexpress_cookie' : '';
            chrome.storage.local.get( {[key]: null}, function(o) {
                if(o[key]) {
                    resolve(o[key]);
                }else {
                    reject()
                }
            })
        });
    }

    chrome.storage.local.get( {app_setting: null}, function(o) {
        let id = o.app_setting.source;
        let formData = new FormData();
        formData.append('file', file);
        let ajaxConfig = {
            url: '',
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success:function(res){
                console.log(res);
                handleUploadedImage(res.data, id);
            },
            headers: {}
        }
        if(id == 2 || id == 3 || id == 4) {
            getCookie(id).then(cookie=>{
                // 1688
                if(id == 2) {
                    ajaxConfig.url = urls._1688;
                    formData.append('cookie', cookie);
                }else if(id == 3) {
                    ajaxConfig.url = urls._1688global;
                    formData.append('cookie', cookie);
                }else if(id == 4) {
                    ajaxConfig.url = urls.aliexpress;
                    ajaxConfig.headers.token = cookie;
                }
                $.ajax(ajaxConfig);
            }).catch(e=>{
                console.log(id);
                let sname = '';
                if(id == 2) {
                    sname = '1688';
                }else if(id == 3) {
                    sname = '1688Global'
                }else if(id == 4) {
                    sname = 'Aliexpress'
                }
                window.alert('Please login ' + sname);
            })
        }else {
            if(id == 1) {
                ajaxConfig.url = urls.alibaba;
            }else if(5) {
                ajaxConfig.url = urls.yiwugo;
            }
            $.ajax(ajaxConfig);
        }
    })
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
                    // chrome.tabs.create({url: `http://192.168.0.113:8080/?base64=${base64}`})
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
    chrome.tabs.query({ }, function (tabs) {
        console.log(tabs);
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
        let file = getFile(base64);
        console.log(file, JSON.stringify(file));
        uploadImage(file);
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