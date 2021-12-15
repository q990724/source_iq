import axios from 'axios'
import { Message, Loading, MessageBox } from 'element-ui'
import SourceMap from "@/assets/js/source_map";
import Store from "@/store/index";
import {i18n} from "@/main";

const ConfigBaseURL = 'http://eurotransit.acuteberry.com/' //默认路径，这里也可以使用env来判断环境
let loadingInstance = null //这里是loading

function clearCookie(source_id) {
	switch (source_id) {
		case 2:
			window.localStorage.removeItem('cookie-1688');
			break;
		case 3:
			window.localStorage.removeItem('cookie-1688global');
			break;
		case 4:
			window.localStorage.removeItem('cookie-aliexpress');
			break;
	}
}

//使用create方法创建axios实例
export const Service = axios.create({
    timeout: 60000, // 请求超时时间
    baseURL: ConfigBaseURL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
})

Service.withCredentials = true;
// 添加请求拦截器
Service.interceptors.request.use(config => {
    loadingInstance = Loading.service({
        lock: true,
        text: 'loading...'
    })
    return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
    loadingInstance.close()
    if(response.data) {
        if(response.data.retcode == 0 || response.data.retcode == 200 || response.data.code == 200) {
            return response.data
        }else if(
            response.data.retcode == 40000 ||
            response.data.code == 40000 ||
            (response.data.data && response.data.data.error == 'require login') ||
            (response.data.ret && response.data.ret[0].indexOf('令牌过期') != -1))
        {
            // cookie过期后，清除当前站点的cookie
            clearCookie(Store.state.source_id);
            let sourceName = '',
                loginPageUrl = '';
            for (let key in SourceMap) {
                if(SourceMap[key]['id'] == Store.state.source_id) {
                    sourceName = key;
                    loginPageUrl = SourceMap[key]['loginPageUrl']
                    break;
                }
            }
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
            if(response.data.message) {
                Message.error(response.data.message);
            }
            return Promise.reject(response.data.message || '');
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
    loadingInstance.close()
    return Promise.reject(error)
})
