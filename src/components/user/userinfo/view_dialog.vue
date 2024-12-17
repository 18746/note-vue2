<template>
    <el-dialog
        title="用户信息"
        :visible.sync="dialogFormVisible"
        append-to-body
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
                    view
                    :init_url="form.picture"
                />
            </el-form-item>
            <el-form-item
                label="用户名"
                prop="username"
            >
                <el-input v-model="form.username" disabled placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item
                label="邮箱"
                prop="email"
            >
                <el-input v-model="form.email" disabled placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item
                label="同时登录设备数"
                prop="device_num"
                class="device_num"
            >
                <el-input v-model.number="form.device_num" disabled placeholder="允许同时登录的设备数">
                    <template slot="append">台设备</template>
                </el-input>
            </el-form-item>
            <el-form-item
                label="更新时间"
                prop="update_time"
            >
                <el-input v-model.number="form.update_time" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="过期时间"
                prop="expire_time"
            >
                <el-input v-model.number="form.expire_time" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="注册时间"
                prop="create_time"
            >
                <el-input v-model.number="form.create_time" disabled></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import uploadFile from '@/components/note/upload_img.vue';
export default {
    name: 'userinfo-view',
    components: {
        uploadFile, // 上传图片组件
    },
    props: {
        visible: {
            type: Boolean,
            default: false
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
            this.form = this.userinfo
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
