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
                    base64: res,
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

    //$(document).delegate('img', 'mouseenter', function(e){
    //    let self = $(this);
    //    if(self.width() < 100 || self.height() < 100) return;
    //    let offset = self.offset();
    //    $(document.body).append(`
    //        <div class="source_iq_image_search_icon" style="z-index: 2147483640;position: absolute; top: ${offset.top}px; left: ${offset.left}px;">
    //            <img src="data:image/png;base64,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" alt="search">
    //        </div>
    //    `)
    //    $('.source_iq_image_search_icon').click(function (e){
    //        alert(123);
    //    })
    //});
    //
    //$(document).delegate('img', 'mouseleave', function () {
    //    $('.source_iq_image_search_icon').remove();
    //})
	
	setInterval(() => {
		let input = document.getElementById('cookie-aliexpress');
		let input_1688 = document.getElementById('cookie-1688');
        let input_1688global = document.getElementById('cookie-1688global');
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
    if (request.cmd == 'cover-image') {
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
        sendResponse($('.s-matching-dir').html());
        //sendResponse($(document).html());
    }
});
