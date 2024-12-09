<template>
    <account title="注册">
        <el-form ref="RegisterForm" label-position="left" label-width="80px" :model="form">
            <el-form-item
                label="账户"
                prop="phone"
                :rules="PhoneRules"
            >
                <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="pwd"
                :rules="PwdRules"
            >
                <el-input v-model="form.pwd" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item
                label="确认密码"
                prop="confirm_pwd"
                :rules="[
                    ...PwdRules,
                    { validator: validateConfirmPwd, trigger: 'blur' }
                ]"
            >
                <el-input v-model="form.confirm_pwd" show-password placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round size="small" @click="submit" :loading="submitButLoading">注册</el-button>
            </el-form-item>
        </el-form>
        <template #button-left>
            <el-link type="primary" :underline="false" @click="toLogin">登录</el-link>
        </template>
    </account>
</template>

<script>
import account from './account.vue';
import { FormValidate } from '@/utils/validate';
import { PwdRules, PhoneRules } from '../validate';
import {
    register,
} from '@/api/user';
export default {
    name: 'register',
    components: {
        account,
    },
    data() {
        return {
            // 注册
            submitButLoading: false,
            form: {
                phone: '',
                pwd: '',
                confirm_pwd: '',
            },

            // 表单验证
            PhoneRules,
            PwdRules,
        }
    },
    created() { },
    methods: {
        init() {
            this.form.phone = ''
            this.form.pwd = ''
            this.form.confirm_pwd = ""
        },
        validateConfirmPwd(rule, value, callback) {
            if (value !== this.form.pwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        },
        async submit() {
            this.submitButLoading = true
            let flag = await FormValidate(this.$refs.RegisterForm);
            if (flag) {
                await register(this.form).then(res => {
                    this.$message.success('注册成功')
                    this.$emit("phoneToLogin", this.form.phone)
                }).catch(err => {
                    this.$message.error(err.data.detail)
                })
            }
            this.submitButLoading = false
        },
        toLogin() {
            this.$emit("changeTab", "login")
            this.init()
        },
    }
}
</script>

<style lang="less" scoped>
.el-button {
    width: 80px;
    font-size: 15px;
}
</style>