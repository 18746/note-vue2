import request from '@/utils/request'
import { doURL, unURL } from '@/utils/index.js';
// -----------------------------------------------------------type
export function getTypePhoneList(phone) {
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/type/${phone}`,
        }).then(res => {
            res.data.unshift({
                "type_no": "0",
                "name": "默认",
                "create_time": "",
                "update_time": ""
            })
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function addType(phone, params) {
    return request({
        method: "post",
        url: `/note/type/${phone}`,
        data: params
    })
}
export function updateType(phone, type_no, params) {
    return request({
        method: "put",
        url: `/note/type/${phone}/${type_no}`,
        data: params
    })
}
export function delType(phone, type_no) {
    return request({
        method: "delete",
        url: `/note/type/${phone}/${type_no}`,
        // data: params
    })
}
// -------------------------------------------------------------course
export function getCourseByTypeList(phone, type_no) {
    type_no = type_no === "0" ? "" : type_no
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/course/type/${phone}?type_no=${type_no}`,
            // data: params
        }).then(res => {
            res.data.forEach(item => {
                item.type_no = item.type_no ? item.type_no : "0"
                item.picture = doURL(item.picture)
            })
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCourse(phone, course_no) { 
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/course/${phone}/${course_no}`,
            // data: params
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            res.data.picture = doURL(res.data.picture)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

// https://www.cnblogs.com/all-smile/p/18096224
export function exportCourse(phone, course_no) {
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/note/course/export/${phone}/${course_no}`,
            responseType: 'blob',
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function exportCourseChunks({phone, course_no, key = ""}, config = {}) { 
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/note/course/export/chunks/${phone}/${course_no}?key=${key}`,
            responseType: 'blob',
            ...config
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}


export function importCourse(phone, type_no, file) { 
    type_no = type_no !== "0" ? type_no : ""
    return new Promise((resolve, reject) => {
        request({
            method: "post",
            url: `/note/course/import/${phone}`,
            data: {
                type_no: type_no,
                file,
            },
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            res.data.picture = doURL(res.data.picture)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function importCourseChunks({phone, filename, file, hash}, config = {}) {
    return new Promise((resolve, reject) => {
        request({
            method: "post",
            url: `/note/course/import/chunks/${phone}`,
            data: {
                filename,
                file,
                hash,
            },
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            ...config,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function importCourseChunksDone({phone, type_no, filename, hash}, config = {}) { 
    type_no = type_no !== "0" ? type_no : ""
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/note/course/import/chunks_done/${phone}`,
            params: {
                type_no: type_no,
                filename,
                hash,
            },
            ...config,
        }).then(res => {
            res.data.picture = doURL(res.data.picture)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function addCourse(phone, params) {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('type_no', params.type_no === "0" ?  "" : params.type_no);
    formData.append('picture', params.picture);
    formData.append('description', params.description);

    return new Promise((resolve, reject) => {
        request({
            method: "post",
            url: `/note/course/${phone}`,
            data: formData
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            res.data.picture = doURL(res.data.picture)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function updateCourse(phone, params) {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('type_no', params.type_no === "0" ?  "" : params.type_no);
    formData.append('description', params.description);
    formData.append('picture', params.picture);

    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: `/note/course/${phone}/${params.course_no}`,
            data: formData
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
            res.data.picture = doURL(res.data.picture)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function delCourse(phone, course_no) {
    return request({
        method: "delete",
        url: `/note/course/${phone}/${course_no}`,
    })
}
// -------------------------------------------------------------unit

export function getUnitList(phone, course_no) {
    return request({
        method: "get",
        url: `/unit/${phone}/${course_no}`,
        // data: params
    })
}
export function getUnit(phone, course_no, unit_no) {
    return request({
        method: "get",
        url: `/unit/${phone}/${course_no}/${unit_no}`,
        // data: params
    })
}
export function addUnit(phone, course_no, params) {
    return request({
        method: "post",
        url: `/note/unit/${phone}/${course_no}`,
        data: params
    })
}
export function updateUnit(phone, course_no, unit_no, params) {
    return request({
        method: "put",
        url: `/note/unit/${phone}/${course_no}/${unit_no}`,
        data: params
    })
}

export function delUnit(phone, course_no, unit_no) {
    return request({
        method: "delete",
        url: `/note/unit/${phone}/${course_no}/${unit_no}`,
    })
}

const contentDoURL = (phone, content) => {
    const path = process.env.BASE_APP === "/" ? "" : `/${process.env.BASE_APP}`

    return content
        .replaceAll(`/unit/picture/${phone}/`, `${process.env.BASE_API}/unit/picture/${phone}/`)
        .replace(/\((\/note)/g, `(${location.origin}${path}/note`);
}

const contentUnURL = (phone, content) => {
    return content
        .replaceAll(`${process.env.BASE_API}/unit/picture/${phone}/`, `/unit/picture/${phone}/`)
        .replace(/\((http.*?\/note)/g, '(/note');
}

export function getUnitContent(phone, course, unit) {
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/unit/content/${phone}/${course.course_no}/${unit.unit_no}`,
        }).then(res => {
            res.data.content = contentDoURL(phone, res.data.content)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function updateUnitContent(phone, course, unit, content) {
    content = contentUnURL(phone, content)
    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: `/note/unit/context/${phone}/${course.course_no}/${unit.unit_no}`,
            data: content,
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            res.data = contentDoURL(phone, res.data)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function uploadUnitPicture(phone, course, unit, picture) {
    const formData = new FormData();
    formData.append('picture', picture);

    return new Promise((resolve, reject) => {
        request({
            method: "post",
            url: `/note/unit/picture/${phone}/${course.course_no}/${unit.unit_no}`,
            data: formData
        }).then(res => {
            res.data.picture_url = contentDoURL(phone, res.data.picture_url)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
