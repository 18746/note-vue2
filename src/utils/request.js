import axios from 'axios'
import store from '../store'
import { Message} from 'element-ui';

import { needUpdateToken, } from '@/utils/user.js'
//1. 创建新的axios实例，
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 3 * 1000
})

// 2.请求拦截器
service.interceptors.request.use(async config => {
    console.log(store.state.user.token, process.env.BASE_API)
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null; // 获取token
    if (token) {
        if (!config.url.includes("/login/refresh") && needUpdateToken(token.update_time, token.time_limit)) {
            await store.dispatch('user/refreshToken')
        }
        config.headers['phone'] = token.phone
        config.headers['token'] = token.token
    }
    return config
}, error => {
    console.error(error)
    Promise.reject(error)
})
 
// 3.响应拦截器
service.interceptors.response.use(response => {

    return response
}, error => {
    console.error(error)
 
    // Message.error(error.response.data.detail)
    // console.log(error.response)
    // console.log(error.response.data)
    // console.log(process.env)
    return Promise.reject(error.response || error)
})
//4.导入文件
export default service
