import axios from 'axios'
import store from '../store'
import router from "@/router";
import { Message } from 'element-ui';

import { needUpdateToken, isTokenNotExpire } from '@/utils/user.js'
//1. 创建新的axios实例，
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 3 * 60 * 1000         // 请求超时时间
})

// 2.请求拦截器
service.interceptors.request.use(async config => {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null; // 获取token
    if (token) {
        if(!isTokenNotExpire(token.update_time, token.time_limit)) {
            Message.error("登录信息已过期，请重新登录")
            store.commit('user/setInfo', null)
            store.commit('user/setToken', null)
            router.push('/login')
        } else if (needUpdateToken(token.update_time, token.time_limit)) {
            if (!config.url.includes("/login/refresh")) {
                await store.dispatch('user/refreshToken')
            }
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
    if (response.headers["not-token"] === "1") {
        Message({
            type: 'warning',
            message: '账号异地登录，请注意保存重要数据'
        })
    }
    return response
}, error => {
    console.error(error)
 
    // Message.error(error.response.data.detail)
    // console.log(error.response)
    // console.log(error.response.data)
    return Promise.reject(error.response || error)
})
//4.导入文件
export default service
