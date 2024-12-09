// 判断是否在需要刷新token的区间内
export const needUpdateToken = (time, min, max_min = 5) => {
    let d = new Date(time)
    d.setMinutes(d.getMinutes() + min)
    const t = d.getTime() - new Date().getTime()
    return t < max_min * 60 * 1000 && t > 0
}

export const isTokenNotExpire = (time, min) => {
    let d = new Date(time)
    d.setMinutes(d.getMinutes() + min)
    const t = d.getTime() - new Date().getTime()
    return t > 0
}