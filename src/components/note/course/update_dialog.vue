<template>
    <el-dialog
        title="更新课程"
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
                <el-input v-model="form.phone" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="头像"
            >
                <uploadFile
                    v-if="dialogFormVisible"
                    :file_list="file_list"
                    :file_size="6"
                    :init_url="img_url"
                />
            </el-form-item>
            <el-form-item
                label="课程名"
                prop="name"
                :rules="CourseNameRules"
            >
                <el-input v-model="form.name" maxlength="15" show-word-limit placeholder="请输入课程名"></el-input>
            </el-form-item>
            <el-form-item
                label="所属类型"
                prop="type_no"
                :rules="CannotEmpty"
            >
                <el-select v-model="form.type_no" filterable style="width: 100%;" placeholder="请选择">
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
                    rows="3"
                    show-word-limit
                />
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

import { CourseNameRules, DescriptionRules } from '../validate.js';

import { getTypePhoneList, updateCourse } from '@/api/note';
import { CannotEmpty, FormValidate, FormResetValidate } from '@/utils/validate';
export default {
    name: 'course-update',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        course: {
            type: Object,
            required: true
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
                type_no: '',
                description: '',
            },
            img_url: '',
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
        },
        phone() {
            return this.course.phone
        }
    },
    methods: {
        async init() {
            this.img_url = this.course.picture
            await this.$nextTick()
            await FormResetValidate(this.$refs.Form)
            await getTypePhoneList(this.phone).then(res => {
                this.type_list = res.data
            }).catch(err => {
                console.error(err)
                this.$message.error(err.data.detail || "未获取到类型列表")
            })
            this.form = this.course
            this.file_list = []
        },
        async update() {
            this.buttonLoading = true
            let flag = await FormValidate(this.$refs.Form);
            if (flag) {
                await updateCourse(this.phone, {
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
    }
}
</script>

<style lang="less" scoped></style>
