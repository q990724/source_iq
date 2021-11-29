window.onload = function() {
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
    // 自动切换Option
    function initSelectedOption() {
        chrome.storage.local.get( {app_setting: null}, function(o) {
            setting = o.app_setting;
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
    let message = {
        cmd: 'setting-change',
        value: {
            appSetting: null
        }
    }
    const select = document.getElementById("select-source");
    let setting = null;

    select.onchange = function() {
        setting.source = Number(select.value);
    }
    $('#save').click(() => {
        chrome.storage.local.set({app_setting: setting}, function() {})
        message.value.appSetting = setting;
        sendMessageToContentScript(message);
        window.close();
    });

    $('#default').click(() => {
        setting.source = 1;
        chrome.storage.local.set({app_setting: setting}, function() {})
        message.value.appSetting = setting;
        sendMessageToContentScript(message);
        initSelectedOption();
        window.close();
    })

    initSelectedOption();
}