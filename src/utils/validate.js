
export const CannotEmpty = [
    {required: true, message: '该字段不能为空', trigger: 'change'}
]

export const FormValidate = (form) => {
    return new Promise((resolve, reject) => {
        form.validate((valid) => {
            resolve(valid)
        });
    })
}

export const FormResetValidate = (form) => {
    return new Promise((resolve, reject) => {
        // form.resetFields((valid) => {
        //     resolve(valid)
        // });
        form.resetFields();
        resolve()
    })
}
