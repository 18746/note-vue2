import request from '@/utils/request'

const encode = (pwd) => {
    return window.btoa(pwd + "root").slice(0, 30)
}
const decode = (code) => {
    return window.atob(code).slice(0, -4)
}

export function login(params) {
    params.pwd = encode(params.pwd)
    return request({
        method: "post",
        url: "/user/login/" + params.phone,
        data: {
            pwd: params.pwd,
            time_limit: params.time_limit,
        }
    })
}

export function register(params) {
    params.pwd = encode(params.pwd)
    return request({
        method: "post",
        url: "/user/register/" + params.phone,
        data: {
            pwd: params.pwd,
        }
    })
}

export function getUserInfo(params) {
    return request({
        method: "get",
        url: "/login/info",
    })
}

export function refresh(params) {
    return request({
        method: "put",
        url: "/login/refresh",
    })
}

export function updateUserInfo(phone, params) {
    const formData = new FormData();
    formData.append('username', params.username);
    formData.append('device_num', params.device_num);
    formData.append('email', params.email);
    formData.append('picture', params.picture);

    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: `/login/info`,
            data: formData
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function updateUserInfoPwd(phone, params) {
    params.pwd = encode(params.pwd)
    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: `/login/pwd`,
            data: {
                pwd: params.pwd,
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}