<template>
    <account title="忘记密码">
        <el-form ref="ForgetPwdForm" label-position="left" label-width="80px" :model="form">
            <el-form-item
                label="账户"
                prop="phone"
                :rules="PhoneRules"
            >
                <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item
                label="旧密码"
                prop="old_pwd"
                :rules="PwdRules"
            >
                <el-input v-model="form.old_pwd" show-password placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item
                label="新密码"
                prop="pwd"
                :rules="PwdRules"
            >
                <el-input v-model="form.pwd" show-password placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round size="small" @click="submit" :loading="submitButLoading">修改</el-button>
            </el-form-item>
        </el-form>
        <template #button-left>
            <el-link type="primary" :underline="false" @click="toLogin">登录</el-link>
            <el-link type="primary" :underline="false" @click="toRegister">注册</el-link>
        </template>
        <template #button-right>
        </template>
    </account>
</template>

<script>
import account from './account.vue';
import { FormValidate } from '@/utils/validate';
import { PwdRules, PhoneRules } from '../validate';
import {
    // login,
    // register,
} from '@/api/user';
export default {
    name: 'forgetPwd',
    components: {
        account,
    },
    data() {
        return {
            // 忘记密码
            submitButLoading: false,
            form: {
                phone: '',
                old_pwd: '',
                pwd: '',
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
            this.form.old_pwd = ''
            this.form.pwd = ""
        },
        async submit() {
            this.submitButLoading = true
            let flag = await FormValidate(this.$refs.ForgetPwdForm);
            if (flag) {
                await forgetPwd(this.form).then(res => {
                    this.$message.success('重置密码成功')
                    this.formLogin.phone = this.form.phone
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
        toRegister() {
            this.$emit("changeTab", "register")
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