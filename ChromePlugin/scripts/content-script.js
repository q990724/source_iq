console.log("注入js完成");
// 打开页面后自动获取一次当前设置
chrome.storage.local.get( {app_setting: null}, function(o) {
    window.localStorage.setItem('app-setting', JSON.stringify(o.app_setting));
});

// 打开页面后自动获取一次Chrome缓存图片
chrome.storage.local.get( {'upload-file': null}, function(o) {
    if(o['upload-file']) {
        chrome.storage.local.set({'upload-file': null}, function () {
            window.localStorage.setItem('upload-file', o['upload-file']);
        })
    }
});

$(document.body).append(`
    <div id="source_iq_app">
        <div class="cover-image">
            <img src="#" alt="" id="ele" width="100%">
            <div class="mark"></div>
            <div class="confirm">
                <span>确定</span>
                <i>关闭</i>
            </div>
        </div>
    </div>
`);

function coverImage(e) {
    return new Promise((resolve, reject) => {
        let path = $("#ele").attr("src");
        $("#ele").attr("src", "#");
        let img = new Image();
        let canvas = document.createElement("canvas");
        let cxt = canvas.getContext("2d");
        img.src = path;
        img.onload = function() {
            canvas.width = e.w;
            canvas.height = e.h;
            cxt.drawImage(img, e.x, e.y, e.w, e.h, 0, 0, e.w, e.h);
            let coverAfterBase64 = canvas.toDataURL('image/png');
            resolve(coverAfterBase64);
        }
    })

}

$(function() {
    $('.confirm').hide();

    $('#ele').Jcrop({
        bgColor: '#000',
        bgOpticy: '0.4',
        onSelect: (e) => {
            console.log("onSelect");
            $('.confirm').show();
            $(".confirm").css('top', e.y + e.h + 10 + 'px');
            $(".confirm").css('left', e.x + 'px');
            coverImage(e).then(res=>{
                chrome.runtime.sendMessage({
                    action: 'uploadImage',
                    value: {
                        base64: res
                    }
                });
            })
        },
        onChange: () => {
            $('.confirm').hide();
        },
        onRelease: () => {
            $('.confirm').hide();
        }
    }, function () {
        window.$crop = this;
    });

    $('.confirm > i').click(function() {
        $('#source_iq_app').hide();
    });

    $('.confirm > span').click(function() {
        $('#source_iq_app').hide();

    });

    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function updateUrl( key, value){
        var newurl = updateQueryStringParameter(key, value)
        //向当前url添加参数，没有历史记录
        window.history.replaceState({
            path: newurl
        }, '', newurl);
    }

    function updateQueryStringParameter(key, value) {
        var uri = window.location.href
        if(!value) {
            return uri;
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }
    let refreshUploadFile = getQueryVariable('refreshUploadFile');
    if(refreshUploadFile === 'true') {
        // 从chrome缓存中获取最新的base64
        chrome.storage.local.get({'upload-file': null}, function (o) {
            // 存储到window缓存中
            window.localStorage.setItem('upload-file', o['upload-file']);
            updateUrl('refreshUploadFile', 'false');
            window.location.reload();
        });
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd === 'cover-image') {
        $("#source_iq_app").show();
        $("#source_iq_app").append(`
            <script id="setImagePath">
                window.$crop.setImage('${request.value}');
                $('#ele').attr('src', '${request.value}');
                $(document).keyup(function (e) {
                    // esc键
                    if(e.keyCode === 27) {
                        $('#source_iq_app').hide();
                    }
                });
            </script>
        `);
        $("#setImagePath").remove();
    }else if(request.cmd == 'parse-title') {
        sendResponse($('.s-matching-dir').html())
    }else if(request.cmd == 'setting-change') {
        // 收到插件设置改变消息
        // 将新的设置写入到window缓存中
        window.localStorage.setItem('app-setting', JSON.stringify(request.value.appSetting));
        // 如果当前window的title=SourceIQ，则刷新页面
        if(window.document.title === 'SourceIQ') {
            window.location.reload();
        }
    }else if(request.cmd == 'image-file') {
        // 收到base64更新的消息
        // 从chrome缓存中获取最新的base64
        chrome.storage.local.get({'upload-file': null}, function (o) {
            chrome.storage.local.set({'upload-file': null}, function () {
                // 存储到window缓存中
                window.localStorage.setItem('upload-file', o['upload-file']);
                // 如果当前window的title=SourceIQ，则刷新页面
                if(window.document.title === 'SourceIQ') {
                    window.location.reload();
                }
            })
        });
    }else if(request.cmd == 'update-cookie') {
        window.localStorage.setItem(`cookie-${request.value.source}`, request.value.cookie);
    }
    return true;
});