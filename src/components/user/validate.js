
export const PhoneRules = [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
]

export const UserNameRules = [
    { required: true, message: '用户名不能为空', trigger: 'change' },
    { min: 1, max: 15, message: '1-15 个字符', trigger: 'change' },
]

export const PwdRules = [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 8, max: 30, message: '长度在 8-30 个字符', trigger: 'change' },
    { pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,30}$/, message: '必须由字母、数字、特殊字符，任意2种组成', trigger: 'change' }
]

export const EmailRules = [
    { min: 0, max: 30, message: '长度在 0-30 个字符', trigger: 'change' },
    { pattern: /^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,8})+$/, message: '请输入正确的邮箱', trigger: 'change' }
]

export const DeviceNumRules = [
    { required: true, message: '不能为空'},
    { type: 'number', message: '必须为数字值'}, // 且不包括小数
    { pattern: /^([1-5])$/, message: '范围在 1-5', trigger: 'change'}
]


