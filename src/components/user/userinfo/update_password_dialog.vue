<template>
    <el-dialog
        title="更改密码"
        :visible.sync="dialogFormVisible"
        append-to-body
        :close-on-click-modal="false"
        @open="init()"
    >
        <el-form ref="Form" :model="form" label-width="80px">
            <el-form-item
                label="手机号"
                prop="phone"
            >
                <el-input v-model="form.phone" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="新密码"
                prop="pwd"
                :rules="PwdRules"
            >
                <el-input v-model="form.pwd" show-password placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item
                label="确认密码"
                prop="confirmPwd"
                :rules="[
                    ...CannotEmpty,
                    { validator: confirmPwdValidate, trigger: 'change' },
                ]"
            >
                <el-input v-model="form.confirmPwd" show-password placeholder="请输入确认密码"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="update">更 新</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { PwdRules,  } from '../validate';
import { FormValidate, FormResetValidate, CannotEmpty, } from '@/utils/validate';
import { updateUserInfoPwd, } from '@/api/user';
export default {
    name: 'userinfo-update-pwd',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            form: {
                phone: '',
                pwd: '',
                confirmPwd: '',
            },
            buttonLoading: false,
            file_list: [],

            PwdRules,
            CannotEmpty,
        }
    },
    computed: {
        dialogFormVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        },
    },
    methods: {
        async init() {
            await this.$nextTick()
            await FormResetValidate(this.$refs.Form)
            this.form.phone = this.phone
        },
        async update() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await updateUserInfoPwd(this.phone, this.form).then(async res => {
                    this.$message.success('更新成功')
                    this.$emit('success', res.data)
                    this.dialogFormVisible = false
                }).catch(err => {
                    console.error(err)
                    this.$message.error(err.data.detail)
                })
            }
            this.buttonLoading = false
        },
        confirmPwdValidate(rule, value, callback) {
            if (value == this.form.pwd) {
                callback();
            } else {
                callback(new Error('两次输入的密码不一致！'));
            }
        },
    },
}
</script>

<style lang="less" scoped>
.el-form-item.device_num {
    /deep/ .el-form-item__label {
        line-height: 20px;
    }
}
</style>
