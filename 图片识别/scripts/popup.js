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

const select = document.getElementById("select-source");
let setting = {
    source: 1
}

chrome.storage.local.get( {app_setting: null}, function(o) {
    if(!o.app_setting) {
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

select.onchange = function() {
    setting.source = select.value;
}

$('#save').click(() => {
    // sendMessageToContentScript({cmd: 'app-setting', setting});
    chrome.storage.local.set({app_setting: setting}, function() {})
    let options = select.getElementsByName('opiton');
});