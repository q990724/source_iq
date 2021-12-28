// import {Container as SourceMap} from "postcss-selector-parser";
// import SourceMap from "../../src/assets/js/source_map";
const projectName = 'Sourcefrom';

window.onload = function() {
    // 循环渲染选项
    var str = '';
    str += "<select class='form-control' id='select-source'>";
    SourceMap.forEach(function(item,index){
        if(index == 0){
            str += "<option value='"+ index +"' selected>" + item.sourceName + "</option>";
        } else{
            str += "<option value='"+ index +"'>" + item.sourceName + "</option>";
        }
    })
    str += '</select>';
    $('#select-source').replaceWith(str);

    // 设置多语言
    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
    })

    function sendMessageToContentScript(message, callback) {
		//TBD: 改成定向消息，避免广播给第三方页面
        chrome.tabs.query({title: projectName}, function (tabs) {
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
        setting.source = 0;
        chrome.storage.local.set({app_setting: setting}, function() {})
        message.value.appSetting = setting;
        sendMessageToContentScript(message);
        initSelectedOption();
        window.close();
    })

    initSelectedOption();
}