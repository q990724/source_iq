// 测试服务器环境
// const server_url = 'http://eurotransit.acuteberry.com/';
// 正式服务器环境
const server_url = 'https://www.sourcefrom.me/';
// const server_url = 'http://artpic.la.com/';
const client_url = 'http://127.0.0.1:8080/';
const projectName = 'Sourcefrom'

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
	//TBD：目前依赖“title”值判断是否为搜索页，而且“多选一”挑选某个搜索页；这2条规则都不够鲁棒需要改进
    // 这里因为chrome插件的当前语言是根据chrome浏览器决定的，但是Vue搜索页是自己设置的默认英文，导致这里不能用多语言去获取项目名称
    //title: chrome.i18n.getMessage('projectName'
    chrome.tabs.query({title: projectName}, tabs => {
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
                // for(let tab of tabs) {
                //     chrome.tabs.reload(tab.id);
                // }
            }else {
                // 4. 如果不存在SourceIQ的tab，则创建一个
                chrome.tabs.create({active: true, url: client_url}, function (tab) {});
            }
        });
    });
}

// 右键菜单
chrome.contextMenus.create({
    title: chrome.i18n.getMessage('contextMenusButton'),
    contexts: ['all'],
    onclick: function (info, tab) {
        if (info.mediaType && info.mediaType == 'image') {
            console.log('识别到网络图片：', info);
            getBase64(info.srcUrl).then(base64 => {
				//TBD: 需要检查图片只有获取“成功”才发起uploadImage，否则异常处理（失败=为空、残缺图等）
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
				//TBD: 需要检查图片只有获取“成功”才发起uploadImage，否则异常处理（失败=为空、残缺图等）
                sendMessageToActiveTabContentScript({
                    cmd: 'cover-image',
                    value: data
                }, function (response) {
                    console.log('来自content的回复：' + response);
                });
            });
        }
    }
});
// 发送消息给当前选中窗口的ContentScript.js
function sendMessageToActiveTabContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}
// 发送消息给项目窗口的ContentScript.js
function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({title: projectName}, function (tabs) {
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
            return true;
        })
    }
    return true;
})

// 解析不同url
function parseUrl(url) {
    for (let item of SourceMap) {
        if(item.loginDomain && url.indexOf(item.loginDomain) !== -1){
            updateCookie(item.loginDomain, item.cookieKey);
        }
    }
    // if(url.indexOf('aliexpress.com') !== -1 ) {
    //     updateCookie('aliexpress.com', 'aliexpress');
    // }else if(url.indexOf('global.1688.com') !== -1) {
    //     updateCookie('1688.com', '1688global');
    // }else if(url.indexOf('1688.com') !== -1) {
    //     updateCookie('1688.com', '1688');
    // }

    return true;
}
// 获取并更新cookie
function updateCookie(cookieDomain, cookieKey) {
    // 将对象解析为cookie
    let obj2cookie = function (obj, step) {
        if (obj.constructor == Object) {
            let cssStr = '';
            for (let key in obj) {
                cssStr += key + '=' + obj[key] + step;
            }
            return cssStr.substr(0, cssStr.length - 1);
        }
    }
    // 获取所有cookie
    chrome.cookies.getAll({domain: cookieDomain}, function(res) {
        if(res && Array.isArray(res) && res.length > 0) {
            let cookie_obj = {};
            for(let item of res) {
                if(item.name) cookie_obj[item.name] = item.value || '';
            }
            // 将获取到的对象格式cookie转为字符串
            let cookie = obj2cookie(cookie_obj, ';') || '';
            // 将字符串cookie和货源发送给content-script
            sendMessageToContentScript({cmd: 'update-cookie', value: {cookieKey: cookieKey,cookieValue: cookie}});
        }
    })
}

//TBD：如果跳转到登录页，登录页是“已经登录”状态，然后切换到搜索页，这时cookie没有重新获取更新；可以监听切换到搜索页事件更新cookie
// 监听页面变化
chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	let url = tab.url;
	// 防止cookie获取不到或不完整，在status=complete才获取
    if(info.status === 'complete') {
        parseUrl(url);
    }
})

// 当tab发生高亮事件时触发
chrome.tabs.onHighlighted.addListener(function (obj) {
    // obj返回一个数组，因为高亮一个，所以直接取0
    if(obj['tabIds'].length <= 0) return;
    let id = obj['tabIds'][0];
    chrome.tabs.get(id, function (tab) {
        let url = tab.url;
        parseUrl(url);
    })
});

//TBD：如果插件没有安装执行，直接打开搜索页，搜索页必需也独立有initSetting的逻辑，否则就会出现undefined状态
//初始化设置
function initSetting() {
    chrome.storage.local.get( {app_setting: null}, function(o) {
        if(!o.app_setting) {
            o.app_setting = {
                source: 1
            };
            chrome.storage.local.set({app_setting: o.app_setting}, function() {});
        }
    })
}

initSetting();