<template>
    <el-dialog
        title="修改章节"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        append-to-body
        @open="init"
    >
        <el-form ref="Form" :model="form" label-width="80px">
            <el-form-item
                label="课程名"
            >
                <el-input :value="course.name" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="章节名"
                prop="name"
                :rules="UnitNameRules"
            >
                <el-input v-model="form.name" placeholder="请输入类型名"></el-input>
            </el-form-item>
            <el-form-item
                label="目录"
                prop="is_menu"
            >
                <el-switch
                    v-model="form.is_menu"
                    active-color="#13ce66"
                    @change="changeIsMenu"
                >
                </el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="update">更 新</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { UnitNameRules } from '../validate.js';

import { updateUnit } from '@/api/note';
import { FormValidate, FormResetValidate } from '@/utils/validate';
export default {
    name: 'unit-update',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        course: {
            type: Object,
            required: true
        },
        unit: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            form: {
                course_no: '',
                name: '',
                is_menu: false,
                parent_no: null,
                next_no: null,
            },
            buttonLoading: false,

            UnitNameRules,
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
        phone() {
            return this.course.phone
        }
    },
    methods: {
        async init() {
            this.form.name = ''
            await this.$nextTick()
            await FormResetValidate(this.$refs.Form)
            this.form = {
                ...this.unit,
                name: this.unit.name.split('.').slice(1).join('.'),
            }
        },
        async update() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await updateUnit(this.phone, this.form.course_no, this.form.unit_no, this.form).then(res => {
                    this.$message.success('更新成功')
                    this.$emit('success', res.data)
                    this.dialogFormVisible = false
                }).catch(err => {
                    this.$message.error(err.data.detail)
                })
            }
            this.buttonLoading = false
        },
        changeIsMenu(checked) {
            if (this.unit.is_menu && !checked) {
                this.$confirm("该操作更新后，会删除目录下的所有子目录和笔记，是否继续？", '确认信息', {
                    type: 'warning',
                    distinguishCancelAndClose: true,
                    confirmButtonText: '继续',
                    cancelButtonText: '取消'
                }).then(() => {

                }).catch(action => {
                    this.form.is_menu = this.unit.is_menu
                });
            }

            
        },
    }
}
</script>

<style lang="less" scoped></style>
