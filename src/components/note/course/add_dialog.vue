<template>
    <el-dialog
        title="新增课程"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        append-to-body
        @open="init"
    >
        <el-form ref="Form" :model="form" label-width="80px">
            <el-form-item
                label="手机号"
                prop="phone"
            >
                <el-input :value="form.phone" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="头像"
            >
                <uploadFile
                    v-if="dialogFormVisible"
                    :file_list="file_list"
                    :file_size="6"
                />
            </el-form-item>
            <el-form-item
                label="课程名"
                prop="name"
                :rules="CourseNameRules"
            >
                <el-input v-model="form.name" placeholder="请输入课程名"></el-input>
            </el-form-item>
            <el-form-item
                label="所属类型"
                prop="type_no"
                :rules="CannotEmpty"
            >
                <el-select v-model="form.type_no" filterable style="width: 100%;" placeholder="请选择">
                    <el-option
                        :key="'0'"
                        :label="'默认'"
                        :value="'0'"
                    ></el-option>
                    <el-option
                        v-for="item in type_list" :key="item.value"
                        :label="item.name"
                        :value="item.type_no"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="简介"
                prop="description"
                :rules="DescriptionRules"
                
            >
                <el-input
                    v-model="form.description"
                    type="textarea"
                    placeholder="暂无"
                    maxlength="150"
                    rows="4"
                    show-word-limit
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="buttonLoading" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="buttonLoading" @click="add">增 加</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    getType,
    addCourse,
} from '@/api/note';
import { CannotEmpty, FormValidate, FormResetValidate } from '@/utils/validate';
import { CourseNameRules, DescriptionRules } from '@/components/note/validate.js';
import uploadFile from '@/components/note/upload_img.vue';
export default {
    name: 'add-course',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type_no: {
            type: String,
            default: '0'
        }
    },
    components: {
        uploadFile,
    },
    data() {
        return {
            form: {
                phone: '',
                name: '',
                type_no: '0',
                description: '',
            },
            buttonLoading: false,

            type_list: [],

            CannotEmpty,
            CourseNameRules,
            DescriptionRules,

            file_list: [],
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
            getType().then(res => {
                this.type_list = res.data
                this.form.type_no = this.type_no
            }).catch(err => {
                console.error(err)
                this.$message.error(err.data.detail | "未获取到类型列表")
            })
            this.form.phone = this.$store.state.user.info.phone
        },
        async add() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await addCourse({
                    ...this.form,
                    picture: this.file_list[0] ? this.file_list[0] : ""
                }).then(async res => {
                    this.$message.success('添加成功')
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
