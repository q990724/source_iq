/*
*
* run_at: document_start
*
* */

// 打开页面后自动获取一次当前设置
chrome.storage.local.get({app_setting: null}, function (o) {
    console.log("content.js->app-setting", JSON.stringify(o.app_setting));
    //不清空chrome缓存的app-setting状态，只是COPY一份到window缓存
    window.localStorage.setItem('app-setting', JSON.stringify(o.app_setting));
});

//TBD：需要“自我识别”，限制只有当前页面是搜索页才可以获取upload-file。目前如果多个content运行会有“race”争抢读写问题
//TBD：当前假设当前content所在页面是被background创建或者消息唤醒；如果是用户自己打开搜索页，不应该获取upload-file发起搜索
// 打开页面后自动获取一次Chrome缓存图片
chrome.storage.local.get({'upload-file': null}, function (o) {
    console.log("content.js->up-loadfile", o['upload-file']);
    if (o['upload-file']) {
        chrome.storage.local.set({'upload-file': null}, function () {
            window.localStorage.setItem('has-upload-file', 'true');
            window.localStorage.setItem('upload-file', o['upload-file']);
            // window.location.reload();
        })
    }
});

console.log('conent_script1注入完成');