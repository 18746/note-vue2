

export const TypeNameRules = [
    { required: true, message: '类型名不能为空', trigger: 'change' },
    { min: 1, max: 15, message: '1 到 15 个字符', trigger: 'change' },
]

const FileNameValidate = (rule, value, callback) => {
    let reg = /^\.|[\\\\/:*?\"<>|]/img;
    if (value.startsWith('.')) {
        callback(new Error('不能以 ‘.’ 字符开头！'));
    } else if (reg.test(value)) {
        callback(new Error('不能包含 \、 / : * ? " < > | 这些字符！'));
    } else {
        callback();
    }
}

export const CourseNameRules = [
    { required: true, message: '课程名不能为空', trigger: 'change' },
    { min: 1, max: 15, message: '1 到 15 个字符', trigger: 'change' },
    { validator: FileNameValidate, trigger: 'change' }
]

export const UnitNameRules = [
    { required: true, message: '章节名不能为空', trigger: 'change' },
    { min: 1, max: 30, message: '1 到 30 个字符', trigger: 'change' },
    { validator: FileNameValidate, trigger: 'change' }
]

export const DescriptionRules = [
    { min: 0, max: 150, message: '最多 150 个字符', trigger: 'change' },
]
