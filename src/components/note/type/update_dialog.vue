<template>
    <el-dialog
        title="更新类型"
        :visible.sync="dialogFormVisible"
        append-to-body
        @open="init()"
    >
        <el-form ref="Form" :model="form" label-width="80px">
            <el-form-item
                label="类型名"
                prop="name"
                :rules="TypeNameRules"
            >
                <el-input v-model="form.name" placeholder="请输入类型名"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="update">更 新</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { TypeNameRules, } from '../validate.js';

import { updateType } from '@/api/note';
import { FormValidate, FormResetValidate } from '@/utils/validate';

export default {
    name: 'update-type',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            form: {
                name: '',
            },
            buttonLoading: false,

            TypeNameRules,
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
        }
    },
    methods: {
        async init() {
            await this.$nextTick()
            await FormResetValidate(this.$refs.Form)
            this.form = this.type
        },
        async update() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await updateType(this.form).then(res => {
                    this.$message.success('更新成功')
                    this.$emit('success', res.data)
                    this.$emit('update:visible', false)
                }).catch(err => {
                    this.$message.error(err.data.detail)
                })
            }
            this.buttonLoading = false
        },
    }
}
</script>

<style lang="less" scoped></style>
