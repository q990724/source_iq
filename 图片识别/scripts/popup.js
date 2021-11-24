window.onload = function() {
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
    
    // 获取缓存，自动更新select值
    function setOption() {
        chrome.storage.local.get( {app_setting: null}, function(o) {
            if(!o.app_setting) {
                o.app_setting = setting;
                chrome.storage.local.set({app_setting: setting}, function() {});
            }
            let options = document.getElementsByTagName('option');
            for(let item of options) {
                if(item.value == o.app_setting.source) {
                    item.setAttribute('selected', 'true');
                }else {
                    item.removeAttribute('selected');
                }
            }
        })
    }
    
    const select = document.getElementById("select-source");
    let setting = {
        source: 1
    }
    
    select.onchange = function() {
        setting.source = select.value;
    }
    
    $('#save').click(() => {
        chrome.storage.local.set({app_setting: setting}, function() {})
        setOption();
    });
    
    $('#default').click(() => {
        setting.source = 1;
        chrome.storage.local.set({app_setting: setting}, function() {})
        setOption();
    })
}