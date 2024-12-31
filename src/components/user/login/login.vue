<template>
    <account title="登录">
        <el-form ref="LoginForm" label-position="left" label-width="80px" :model="formLogin">
            <el-form-item
                label="账户"
                prop="phone"
                :rules="PhoneRules"
            >
                <el-input v-model="formLogin.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="pwd"
                :rules="PwdRules"
            >
                <el-input v-model="formLogin.pwd" show-password placeholder="请输入密码" @keyup.enter.native="submit"></el-input>
            </el-form-item>
            <el-form-item
                label="登录时长"
                prop="time_limit"
            >
                <el-select v-model="formLogin.time_limit" placeholder="请选择" style="width: 100%;">
                    <el-option
                        v-for="item in time_limit_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round size="small" @click="submit" :loading="submitButLoading">提交</el-button>
            </el-form-item>
        </el-form>
        <template #button-left>
            <el-link type="primary" :underline="false" @click="toRegister">注册</el-link>
        </template>
        <template #button-right>
            <el-link type="primary" :underline="false" @click="toForgetPwd">忘记密码</el-link>
        </template>
    </account>
</template>

<script>
import account from '@/components/user/login/account.vue';
import { FormValidate } from '@/utils/validate';
import { PwdRules, PhoneRules } from '@/components/user/validate';

import { login, } from '@/api/user';
export default {
    name: 'loginCom',
    components: {
        account,
    },
    data() {
        return {
            // 登录
            submitButLoading: false,
            formLogin: {
                phone: '',
                pwd: '',
                time_limit: 120
            },
            time_limit_options: [{
                value: 60,
                label: "一小时"
            }, {
                value: 120,
                label: "两小时"
            }, {
                value: 240,
                label: "四小时"
            }, {
                value: 480,
                label: "八小时"
            }, {
                value: 960,
                label: "十六小时"
            }],

            // 表单验证
            PhoneRules,
            PwdRules,
        }
    },
    created() { },
    methods: {
        init(phone = "") {
            this.formLogin.phone = phone
            this.formLogin.pwd = ''
            this.formLogin.time_limit = 30
        },
        async submit() {
            this.submitButLoading = true
            let flag = await FormValidate(this.$refs.LoginForm);
            if (flag) {
                await login({
                    phone: this.formLogin.phone,
                    pwd: this.formLogin.pwd,
                    time_limit: this.formLogin.time_limit,
                }).then(async res => {
                    this.$message.success('登录成功')
                    this.$store.commit('user/setToken', res.data)
                    await this.$store.dispatch('user/getUserInfo')
                    this.$router.push('/note')
                }).catch(err => {
                    this.$store.commit('user/setToken', null)
                    this.$message.error(err.data.detail)
                })
                
            }
            this.submitButLoading = false
        },
        toRegister() {
            this.$emit("changeTab", "register")
            this.init()
        },
        toForgetPwd() {
            this.$emit("changeTab", "forgetPwd")
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