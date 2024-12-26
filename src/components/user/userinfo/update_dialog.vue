<template>
    <el-dialog
        title="更新用户信息"
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
                label="头像"
            >
                <uploadFile
                    v-if="dialogFormVisible"
                    :file_list="file_list"
                    :file_size="6"
                    :init_url="form.picture"
                />
            </el-form-item>
            <el-form-item
                label="用户名"
                prop="username"
                :rules="UserNameRules"
            >
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item
                label="邮箱"
                prop="email"
                :rules="EmailRules"
            >
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item
                label="同时登录设备数"
                prop="device_num"
                :rules="DeviceNumRules"
                class="device_num"
            >
                <el-input v-model.number="form.device_num" placeholder="不建议多设备登录，可能存在多端修改数据出现问题的情况">
                    <template slot="append">台设备</template>
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="update">更 新</el-button>
        </div>
    </el-dialog>
</template>

<script>
import uploadFile from '@/components/note/upload_img.vue';
import { EmailRules, DeviceNumRules, UserNameRules } from '@/components/user/validate';
import { FormValidate, FormResetValidate } from '@/utils/validate';

import { updateUserInfo, } from '@/api/user';
export default {
    name: 'userinfo-update',
    components: {
        uploadFile, // 上传图片组件
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            required: true
        },
        userinfo: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            form: {
                username: '',
            },
            buttonLoading: false,
            file_list: [],

            EmailRules,
            DeviceNumRules,
            UserNameRules,
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
            this.form = this.userinfo
            this.file_list = []
        },
        async update() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await updateUserInfo(this.phone, {
                    ...this.form,
                    picture: this.file_list[0] ? this.file_list[0] : this.form.picture
                }).then(async res => {
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
