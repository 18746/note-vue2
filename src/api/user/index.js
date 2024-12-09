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
