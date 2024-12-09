
export const PhoneRules = [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
]

export const PwdRules = [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'change' },
    { pattern: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,30}$/, message: '必须由字母、数字、特殊字符，任意2种组成', trigger: 'change' }
]

