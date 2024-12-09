import request from '@/utils/request'

// -----------------------------------------------------------type
export function getType() {
    // return new Promise((resolve,reject) => {
    //     request({
    //         method: "get",
    //         url: "/course_type",
    //     }).then(res => resolve(res)).catch(err => reject(err))
    // })
    return request({
        method: "get",
        url: "/type",
    })
}
export function addType(params) {
    return request({
        method: "post",
        url: "/note/type",
        data: params
    })
}
export function updateType(params) {
    return request({
        method: "put",
        url: "/note/type/" + params.type_no,
        data: params
    })
}
export function delType(params) {
    return request({
        method: "delete",
        url: "/note/type/" + params.type_no,
        // data: params
    })
}
// -------------------------------------------------------------course
export function getTypeCourse(params) {
    params.type_no = params.type_no === "0" ? "" : params.type_no
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: "/course/type?type_no=" + params.type_no,
            // data: params
        }).then(res => {
            res.data.forEach(item => {
                item.type_no = item.type_no ? item.type_no : "0"
            })
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCourse(params) { 
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: "/course/" + params.course_no,
            // data: params
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function addCourse(params) {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('type_no', params.type_no === "0" ?  "" : params.type_no);
    formData.append('picture', params.picture);
    formData.append('description', params.description);

    return new Promise((resolve, reject) => {
        request({
            method: "post",
            url: "/note/course",
            data: formData
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function updateCourse(params) {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('type_no', params.type_no === "0" ?  "" : params.type_no);
    formData.append('description', params.description);
    formData.append('picture', params.picture);

    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: "/note/course/" + params.course_no,
            data: formData
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function delCourse(params) {
    return request({
        method: "delete",
        url: "/note/course/" + params.course_no,
    })
}
// -------------------------------------------------------------unit

export function getUnit(params) {
    return request({
        method: "get",
        url: "/unit/" + params.course_no,
        // data: params
    })
}
export function addUnit(params) {
    return request({
        method: "post",
        url: "/note/unit/" + params.course_no,
        data: params
    })
}
export function updateUnit(params) {
    return request({
        method: "put",
        url: "/note/unit/" + params.course_no + "/" + params.unit_no,
        data: params
    })
}

export function delUnit(params) {
    return request({
        method: "delete",
        url: "/note/unit/" + params.course_no + "/" + params.unit_no,
        data: params
    })
}
