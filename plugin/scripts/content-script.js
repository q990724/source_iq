const projectName = 'Sourcefrom';

function coverImage(e) {
    return new Promise((resolve, reject) => {
        let path = $("#ele").attr("src");
        $("#ele").attr("src", "#");
        let img = new Image();
        let canvas = document.createElement("canvas");
        let cxt = canvas.getContext("2d");
        img.src = path;
        img.onload = function () {
            canvas.width = e.w;
            canvas.height = e.h;
            cxt.drawImage(img, e.x, e.y, e.w, e.h, 0, 0, e.w, e.h);
            let coverAfterBase64 = canvas.toDataURL('image/png');
            resolve(coverAfterBase64);
        }
    })

}

$(document.body).append(`
        <div id="source_iq_app">
            <div class="cover-image">
                <img src="#" alt="" id="ele" width="100%">
                <div class="mark"></div>
                <div class="confirm">
                    <span>${chrome.i18n.getMessage('ok')}</span>
                    <i>${chrome.i18n.getMessage('cancel')}</i>
                </div>
            </div>
        </div>
    `);

$(function () {

    $('.confirm').hide();
    let coverImageRes = '';
    $('#ele').Jcrop({
        bgColor: '#000',
        bgOpticy: '0.4',
        boxWidth: window.innerWidth,
        boxHeight: window.innerHeight,
        onSelect: (e) => {
            console.log("onSelect");
            $('.confirm').show();
            $(".confirm").css('top', (e.y + e.h + 10) / window.devicePixelRatio + 'px');
            $(".confirm").css('left', (e.x) / window.devicePixelRatio + 'px');
            coverImage(e).then(res => {
                //TBD：需要检查截图是否成功，成功再uploadImage，失败做异常处理
                coverImageRes = {
                    action: 'uploadImage',
                    value: {
                        base64: res
                    }
                };
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

    $('.confirm > i').click(function () {
        //TBD：需要检查截图是否成功，成功再uploadImage，失败做异常处理
        $('#source_iq_app').hide();
    });

    $('.confirm > span').click(function () {
        $('#source_iq_app').hide();
        //TBD：需要检查截图是否成功，成功再uploadImage，失败做异常处理
        chrome.runtime.sendMessage(coverImageRes);

    });

    function getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    function updateUrl(key, value) {
        var newurl = updateQueryStringParameter(key, value)
        //向当前url添加参数，没有历史记录
        window.history.replaceState({
            path: newurl
        }, '', newurl);
    }

    function updateQueryStringParameter(key, value) {
        var uri = window.location.href
        if (!value) {
            return uri;
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    }

    let refreshUploadFile = getQueryVariable('refreshUploadFile');
    if (refreshUploadFile === 'true') {
        // 从chrome缓存中获取最新的base64
        chrome.storage.local.get({'upload-file': null}, function (o) {
            // 存储到window缓存中
            window.localStorage.setItem('upload-file', o['upload-file']);
            updateUrl('refreshUploadFile', 'false');
            window.location.reload();
        });
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
    } else if (request.cmd == 'parse-title') {
        // sendResponse($('.s-matching-dir').html())
    } else if (request.cmd == 'setting-change') {
        console.log("content收到setting-change，马上reload");
        // 收到插件设置改变消息
        // 将新的设置写入到window缓存中
        window.localStorage.setItem('app-setting', JSON.stringify(request.value.appSetting));
        // 如果当前window的title=SourceIQ，则刷新页面
        if (window.document.title === projectName) {
            window.location.reload();
        }
    } else if (request.cmd == 'image-file') {
        // 收到base64更新的消息
        // 从chrome缓存中获取最新的base64
        chrome.storage.local.get({'upload-file': null}, function (o) {
            window.localStorage.setItem('has-upload-file', 'true');
            //TBD：需要“自我识别”，限制只有当前页面是搜索页才可以获取upload-file。目前如果多个content运行会有“race”争抢读写问题
            //TBD：当前假设当前content所在页面是被background创建或者消息唤醒；如果是用户自己打开搜索页，不应该获取upload-file发起搜索
            chrome.storage.local.set({'upload-file': null}, function () {
                // 存储到window缓存中
                window.localStorage.setItem('upload-file', o['upload-file']);
                // 如果当前window的title=SourceIQ，则刷新页面
                console.log(window.document.title);
                if (window.document.title === projectName) {
                    console.log("content收到upload-file，马上reload");
                    window.location.reload();
                }
            })
        });
    } else if (request.cmd == 'update-cookie') {
        console.log('update-cookie', request.value.cookieValue);
        window.localStorage.setItem(request.value.cookieKey, request.value.cookieValue);
    }
    sendResponse({msg: 'get messsage'});
    return true;
});

console.log("content.js加载完成");