import request from '@/utils/request'
import { getURL } from '@/utils';
// -----------------------------------------------------------type
export function getType(phone) {
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
export function getTypeCourse(phone, type_no) {
    type_no = type_no === "0" ? "" : type_no
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/course/type/${phone}?type_no=${type_no}`,
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

export function getCourse(phone, course_no) { 
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/course/${phone}/${course_no}`,
            // data: params
        }).then(res => {
            res.data.type_no = res.data.type_no ? res.data.type_no : "0"
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

export function getUnitContent(phone, course, unit) {
    return new Promise((resolve, reject) => {
        request({
            method: "get",
            url: `/unit/${phone}/${course.course_no}/${unit.unit_no}/content`,
            // data: params
        }).then(res => {
            res.data.content = (res.data.content || '').replaceAll(`./picture.${unit.name}`, `${getURL()}/unit/picture/${phone}/${course.course_no}/${unit.unit_no}/picture.${unit.name}`)
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function updateUnitContent(phone, course, unit, content) {
    content = (content || '').replaceAll(`${getURL()}/unit/picture/${phone}/${course.course_no}/${unit.unit_no}/picture.${unit.name}`, `./picture.${unit.name}`)
    return new Promise((resolve, reject) => {
        request({
            method: "put",
            url: `/note/unit/context/${phone}/${course.course_no}/${unit.unit_no}`,
            data: content,
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            res.data = (res.data || '').replaceAll(`./picture.${unit.name}`, `${getURL()}/unit/picture/${phone}/${course.course_no}/${unit.unit_no}/picture.${unit.name}`)
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
            res.data.path = `${getURL()}/unit/picture/${phone}/${course.course_no}/${unit.unit_no}/${res.data.path}`
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
