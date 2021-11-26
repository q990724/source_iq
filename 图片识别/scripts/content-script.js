console.log("注入js完成");
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
                //uploadImage(file);
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

	setInterval(() => {
		let input = document.getElementById('cookie-aliexpress');
		let input_1688 = document.getElementById('cookie-1688');
        let input_1688global = document.getElementById('cookie-1688global');
        let input_appSetting = document.getElementById('app-setting');
        // app-setting
        if(!input_appSetting) {
            input_appSetting = document.createElement('input');
            input_appSetting.setAttribute('type', 'hidden');
            input_appSetting.setAttribute('id', 'app-setting');
            chrome.storage.local.get( {app_setting: null}, function(o) {
				input_appSetting.setAttribute('value', JSON.stringify(o.app_setting));
			})
            document.body.appendChild(input_appSetting);
        }else {
            chrome.storage.local.get( {app_setting: null}, function(o) {
				input_appSetting.setAttribute('value', JSON.stringify(o.app_setting));
			})
        }
        // aliexpress
		if(input) {
			chrome.storage.local.get( {aliexpress_cookie: null}, function(o) {
				input.setAttribute('data-cookie', o.aliexpress_cookie);
			})
		}else {
			input = document.createElement('input');
			chrome.storage.local.get( {aliexpress_cookie: null}, function(o) {
				input.setAttribute('data-cookie', o.aliexpress_cookie);
			})
			input.setAttribute('id', 'cookie-aliexpress');
			input.setAttribute('type', 'hidden');
			document.body.appendChild(input);
		}
		// 1688
		if(input_1688) {
			chrome.storage.local.get( {_1688_cookie: null}, function(o) {
				input_1688.setAttribute('data-cookie', o._1688_cookie);
			})
		}else {
			input_1688 = document.createElement('input');
			chrome.storage.local.get( {_1688_cookie: null}, function(o) {
				input_1688.setAttribute('data-cookie', o._1688_cookie);
			})
			input_1688.setAttribute('id', 'cookie-1688');
			input_1688.setAttribute('type', 'hidden');
			document.body.appendChild(input_1688);
		}
        // 1688跨境
        if(input_1688global) {
            chrome.storage.local.get( {_1688global_cookie: null}, function(o) {
				input_1688global.setAttribute('data-cookie', o._1688global_cookie);
			})
        }else {
            input_1688global = document.createElement('input');
			chrome.storage.local.get( {_1688global_cookie: null}, function(o) {
				input_1688global.setAttribute('data-cookie', o._1688global_cookie);
			})
			input_1688global.setAttribute('id', 'cookie-1688global');
			input_1688global.setAttribute('type', 'hidden');
			document.body.appendChild(input_1688global);
        }
	}, 3000);
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到消息', request.cmd);
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
        // sendResponse({
        //     action: 'uploadImage',
        //     value: $('.s-matching-dir').html()
        // });
        sendResponse($('.s-matching-dir').html())
        //sendResponse($(document).html());
    }
    return true;
});

chrome.runtime.sendMessage({action: 'getSetting'}, function (response) {
    console.log('接收到消息：', response);
});