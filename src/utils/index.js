const config = require('../../config')

export const sleep = (time) => new Promise((resolve) => {
    const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve()
    }, time)
})

export const syncDelayFuns = (time, callbacks) => {
    const promiList = []
    const isFunList = Array.isArray(callbacks)
    if (isFunList) {
        callbacks.forEach((item) => promiList.push(item()))
    } else {
        promiList.push(callbacks())
    }

    promiList.push(sleep(time))
    return new Promise((resolve, reject) => {
        Promise.all(promiList).then((resList) => {
            if (isFunList) {
                resolve(resList.slice(0, -1))
            } else {
                resolve(resList[0])
            }
        }).catch((err) => reject(err))
    })
}

export const getURL = () => {
    return Object.values(config.dev.proxyTable)[0].target
}

export const getCourseImg = (course) => {
    return getURL() + "/course/picture/" + course.phone + '/' + course.name + '/' + course.picture
}

