import axios from 'axios'
import { Message, Loading, MessageBox } from 'element-ui'
import SourceMap from "@/assets/js/source_map";
import Store from "@/store/index";
import {i18n} from "@/main";
import {clear} from "core-js/internals/task";

// 测试服务器环境
// const ConfigBaseURL = 'http://eurotransit.acuteberry.com/' //默认路径，这里也可以使用env来判断环境
// 正式服务器环境
const ConfigBaseURL = 'https://www.sourcefrom.me/' //默认路径，这里也可以使用env来判断环境
const timeout = 1000 * 60;
let loadingInstance = null //这里是loading
let loadingInstanceTimer = null;

function clearCookie() {
	// switch (source_id) {
	// 	case 2:
	// 		window.localStorage.removeItem('cookie-1688');
	// 		break;
	// 	case 3:
	// 		window.localStorage.removeItem('cookie-1688global');
	// 		break;
	// 	case 4:
	// 		window.localStorage.removeItem('cookie-aliexpress');
	// 		break;
	// }
    window.localStorage.removeItem(SourceMap[Store.state.source_id].cookieKey)
}

// 创建loading，同时开始定时器
function startLoading() {
    if(loadingInstance) loadingInstance.close();
    loadingInstance = Loading.service({
        lock: true,
        text: 'loading...'
    })
    loadingInstanceTimer = window.setTimeout(() => {
        stopLoading();
    }, timeout);
}

// 停止并销毁loading
function stopLoading() {
    window.clearTimeout(loadingInstanceTimer)
    loadingInstanceTimer = null;
    loadingInstance.close();
}

//使用create方法创建axios实例
export const Service = axios.create({
    timeout: timeout, // 请求超时时间
    baseURL: ConfigBaseURL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
})

Service.withCredentials = true;
// 添加请求拦截器
Service.interceptors.request.use(config => {
    startLoading();
    return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
    if(response.data) {
        if(response.data.retcode == 0 || response.data.retcode == 200 || response.data.code == 200) {
			//TBD：如果当前请求成功返回，并且是“上传图片”，那么就先不关闭loading
			if (response.config.url.indexOf('uploadPic') == -1) stopLoading();
            return response.data
        }else if(
            response.data.retcode == 40000 ||
            response.data.code == 40000 ||
            (response.data.data && response.data.data.error == 'require login') ||
            (response.data.ret && response.data.ret[0].indexOf('令牌过期') != -1))
        {
            stopLoading();
            // cookie过期后，清除当前站点的cookie
            clearCookie();
            // let sourceName = '',
            //     loginPageUrl = '';
            let	sourceName = SourceMap[Store.state.source_id].sourceName;
            let	loginPageUrl = SourceMap[Store.state.source_id].loginPageUrl
            // for (let key in SourceMap) {
            //     if(SourceMap[key]['id'] == Store.state.source_id) {
            //         sourceName = key;
            //         loginPageUrl = SourceMap[key]['loginPageUrl']
            //         break;
            //     }
            // }
            MessageBox.confirm(i18n.t('message.login_timeout') + sourceName, i18n.t('message.un_login'), {
                confirmButtonText: i18n.t('message.go_login'),
                cancelButtonText: i18n.t('button.cancel'),
                type: 'warning'
            }).then(_=>{
                window.open(loginPageUrl);
            }).catch(e=>{
                console.log(e);
            })
        }else {
            // if(response.data.message) {
            //     Message.error(response.data.message);
            // }
            stopLoading();
            return Promise.reject(response.data.message || response.data.msg || i18n.t('unknown_error'));
        }
    }
}, error => {
    console.log('TCL: error', error);
    const msg = error.Message !== undefined ? error.Message : ''
    Message({
        message: i18n.t('message.unknown_error') + msg,
        type: 'error',
        duration: 3 * 1000
    })
    stopLoading();
    return Promise.reject(error)
})