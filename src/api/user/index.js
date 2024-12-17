import request from '@/utils/request'

export function login(params) {
    return request({
        method: "post",
        url: "/user/login/" + params.phone,
        data: params
    })
}

export function register(params) {
    return request({
        method: "post",
        url: "/user/register/" + params.phone,
        data: params
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