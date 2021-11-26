import axios from 'axios'
import { Message, Loading } from 'element-ui'
const ConfigBaseURL = 'http://eurotransit.acuteberry.com/' //默认路径，这里也可以使用env来判断环境
let loadingInstance = null //这里是loading
//使用create方法创建axios实例
export const Service = axios.create({
    timeout: 15000, // 请求超时时间
    baseURL: ConfigBaseURL,
    method: 'post',
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
    // if(response && response.data && response.data.)
    console.log(response.data);
    return response.data
}, error => {
    console.log('TCL: error', error);
    const msg = error.Message !== undefined ? error.Message : ''
    Message({
        message: '网络错误' + msg,
        type: 'error',
        duration: 3 * 1000
    })
    loadingInstance.close()
    return Promise.reject(error)
})
