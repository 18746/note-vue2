<template>
    <el-dialog
        title="新增类型"
        :visible.sync="dialogFormVisible"
        append-to-body
        @open="init"
    >
        <el-form ref="Form" :model="form" label-width="80px" @submit.native.prevent="add">
            <el-form-item
                label="类型名"
                prop="name"
                :rules="TypeNameRules"
            >
                <el-input v-model="form.name" maxlength="15" show-word-limit placeholder="请输入类型名"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="add">增 加</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addType } from '@/api/note';
import { FormValidate, FormResetValidate } from '@/utils/validate';
import { TypeNameRules } from '@/components/note/validate.js';
export default {
    name: 'type-add',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            required: true
        }
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
        },
    },
    methods: {
        async init() {
            this.form.name = ''
            await this.$nextTick()
            await FormResetValidate(this.$refs.Form)
        },
        async add() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await addType(this.phone, this.form).then(res => {
                    this.$message.success('添加成功')
                    this.$emit('success', res.data)
                    this.dialogFormVisible = false
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
