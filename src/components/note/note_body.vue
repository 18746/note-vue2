<template>
    <div class="course-body">
        <div class="course-item" :class="Class" v-for="course in course_list" :key="course.course_no">
            <div class="course">
                <div class="course-img">
                    <img
                        :src="course.picture"
                        :alt="course.name"
                    />
                    <div class="icon">
                        <div class="body">
                            <i class="el-icon el-download el-icon-download" @click="download(course)"></i>
                            <i class="el-icon el-edit el-icon-edit" @click="edit(course)"></i>
                            <i class="el-icon el-delete el-icon-delete" @click="del(course.course_no)"></i>
                        </div>
                    </div>
                </div>
                <div class="course-info" @click="select(course)">
                    <div class="course-title">{{ course.name }}</div>
                    <div class="course-desc">简介：{{ course.description | descriptionFilter }}</div>
                    <!-- <div class="course-date">{{ course.create_time }}</div> -->
                    <div class="course-date">更新: {{ course.update_time }}</div>
                </div>
            </div>
        </div>
        <el-empty v-if="course_list.length == 0" :image-size="150"></el-empty>

        <div class="my-button-bottom" :key="course_list.length">
            <el-button type="success" icon="el-icon-upload2" circle @click="import_course" />
            <el-button type="success" icon="el-icon-document-add" circle @click="add" />
            <el-button
                :type="note_card_style ? 'primary' : ''"
                :icon="!note_card_style ? 'el-icon-s-grid' : 'el-icon-document'"
                circle
                @click="changCardOrLine"
            ></el-button>
        </div>

        <addDialog
            :visible.sync="addVisible"
            :type_no="type_no"
            :phone="phone"
            @success="addSuccess"
        />
        <updateDialog
            :visible.sync="updateVisible"
            :course="updateCourse"
            @success="updateSuccess"
        />
    </div>
</template>

<script>
import addDialog from '@/components/note/course/add_dialog.vue';
import updateDialog from '@/components/note/course/update_dialog.vue';

import { getCourseByTypeList, exportCourse, exportCourseChunks, importCourse, importCourseChunks, importCourseChunksDone, delCourse } from '@/api/note';
import { FileDownloader, FileUploader } from '@/utils/index.js';
export default {
    name: 'note',
    props: {
        type_no: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        }
    },
    components: {
        addDialog,
        updateDialog,
    },
    data() {
        return {
            course_list: [],

            addVisible: false,

            updateVisible: false,
            updateCourse: {},

            line_type: true,
        }
    },
    watch: {
        type_no: {
            handler(newVal, oldVal) {
                this.init()
            },
            immediate: true,
        },
    },
    filters: {
        descriptionFilter(val) {
            return val ? val : "暂无简介"
        },
    },
    computed: {
        Class() {
            if (this.note_card_style) {
                return 'course-card'
            } else if (this.line_type) {
                return 'course-line'
            }
            return 'course-line'
        },
        note_card_style: {
            get() {
                return this.$store.getters["habit/getHabit"].note_card_style
            },
            set(val) {
                this.$store.commit('habit/setHabit', {
                    note_card_style: val
                })
            }
        }
    },
    methods: {
        async init() {
            const type_no = this.type_no
            await getCourseByTypeList(this.phone, type_no).then(res => {
                this.course_list = res.data
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail
                });
            })
        },
        changCardOrLine() {
            this.note_card_style = !this.note_card_style
        },
        // 点击课程跳转
        select(course) {
            this.$emit('toCourse', course)
        },
        // 增加课程
        add() {
            this.addVisible = true;
        },
        addSuccess(add_course) {
            if (add_course.type_no === this.type_no) {
                this.course_list = [add_course, ...this.course_list]
            }
        },

        // 编辑
        edit(course) {
            this.updateVisible = true;
            this.updateCourse = {
                ...course,
            };
        },
        // 更新成功
        updateSuccess(update_course) {
            const course = this.course_list.find(item => item.course_no == update_course.course_no);
            if (update_course.type_no != course.type_no) {
                this.course_list = this.course_list.filter(item => item.course_no != course.course_no)
            } else {
                const index = this.course_list.findIndex(item => item.course_no == update_course.course_no);
                this.course_list.splice(index, 1, update_course);
            }
        },
        // 删除
        del(course_no) {
            this.$confirm('课程删除后无法找回，确定要删除吗？', '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                delCourse(this.phone, course_no).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.course_list = this.course_list.filter(item => item.course_no != course_no)
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.data.detail || '删除失败，请重试'
                    });
                })
            }).catch(action => {});
        },
        async download(course) {
            // exportCourse(this.phone, course.course_no)

            const downloader = new FileDownloader({
                request: exportCourseChunks,
                data: {
                    phone: this.phone,
                    course_no: course.course_no,
                    key: Date.now().toString(),
                },
                fileName: course.name + ".zip",
                chunkSize: 1024 * 100,
                cb: () => {
                    this.$message({
                        type: 'success',
                        message: '导出完成'
                    });
                }
            })
            downloader.startDownload();
            this.$message({
                type: 'info',
                message: '开始导出，请不要关闭页面...'
            })
        },
        import_course() {
            let input = document.createElement("input")
            input.type = "file"
            input.accept = ".zip"
            input.onchange = (e) => {
                let file = e.target.files[0]
                if (file.size > 1024 * 1024 * 100) {
                    this.$message({
                        type: 'error',
                        message: '文件大小不能超过100MB'
                    });
                    return
                }
                if (file.name.split('.').pop() != 'zip') {
                    this.$message({
                        type: 'error',
                        message: '文件格式不正确，必须为zip文件'
                    });
                    return
                }

                const uploader = new FileUploader({
                    request: importCourseChunks,
                    requestDone: importCourseChunksDone,
                    data: {
                        phone: this.phone,
                        type_no: this.type_no,
                    },
                    file: file,
                    chunkSize: 1024 * 100,
                    cb: (res) => {
                        this.$message({
                            type: 'success',
                            message: '导入成功'
                        });
                        this.course_list.unshift(res.data)

                        input.value = ''
                        input = null
                    }
                })
                uploader.startUpload()
                this.$message({
                    type: 'info',
                    message: '开始导入，请稍等...'
                });

                // importCourse(this.phone, this.type_no, e.target.files[0]).then(res => {
                //     this.$message({
                //         type: 'success',
                //         message: '导入成功'
                //     });
                //     this.course_list.unshift(res.data)
                // }).catch(err => {
                //     this.$message({
                //         type: 'error',
                //         message: err.data.detail || '导入失败，请重试'
                //     });
                // })

                // input.value = ''
                // input = null
            }
            input.click()
        },
    }
}
</script>

<style lang="less" scoped>
.course-body .course-item {
    display: inline-block;
    box-sizing: border-box;
    padding: 10px;
    transition: all 0.15s ease-in-out;
    
    .course {
        .course-img {
            position: relative;
            img {
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                position: absolute;
                z-index: 1;
            }
            
            .icon {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 0;
                opacity: 0;
                background-color: #00000088;
                .body {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    .el-icon {
                        cursor: pointer;
                        &.el-download {
                            color: #67C23A;
                        }
                        &.el-edit {
                            color: #409EFF;
                        }
                        &.el-delete {
                            color: #F56C6C;
                        }

                        &:last-child {
                            margin-right: 0px;
                        }
                    }
                }
            }
            &:hover .icon {
                z-index: 2;
                opacity: 1;
                transition: opacity 0.2s;
            }
        }
        .course-info {
            height: 100%;
            box-sizing: border-box;
            cursor: pointer;
            .course-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                white-space: nowrap;
            }
            .course-desc {
                height: 55px;
                font-size: 15px;
                color: #666;
                margin-bottom: 5px;

                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                line-clamp: 3;
                -webkit-line-clamp: 3;
            }
            .course-date {
                font-size: 13px;
                color: #767676;
            }
        }
        &:hover {
            .course-info {
                .course-title {
                    color: #00a1d6;
                }
            }
        }
    }
}
.course-body .course-item.course-line {
    
    .course {
        display: flex;
        height: 130px;
        width: 100%;
        border: 1px solid #cdcdcd;
        border-radius: 6px;

        .course-img {
            width: 130px;
            height: 100%;
            overflow: hidden;
            flex-shrink: 0;
            img {
                object-fit: cover;
            }
            
            .icon {
                .body {
                    .el-icon {
                        font-size: 24px;
                        margin-right: 5px;
                    }
                }
            }
            &:hover .icon {
                z-index: 2;
                opacity: 1;
                transition: opacity 0.2s;
            }
        }
        .course-info {
            padding: 5px 9px;
            flex-grow: 1;
        }

    }

    @media (max-width: 740px) {
        width: 100%;
    }
    @media (min-width: 740px) {
        width: 50%;
    }
    @media (min-width: 1350px) {
        width: 33.33%;
    }
    @media (min-width: 1750px) {
        width: 25%;
    }
}
.course-body .course-item.course-card {
    padding: 12px;
    
    .course {
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid #cdcdcd;
        border-radius: 6px;
        overflow: hidden;
        .course-img {
            width: 100%;
            height: 210px;

            img {
                object-fit: contain;
            }
            .icon {
                .body {
                    .el-icon {
                        font-size: 30px;
                        margin-right: 24px;
                        &:last-child {
                            margin-right: 0px;
                        }
                    }
                }
            }
            &:hover .icon {
                z-index: 2;
                opacity: 1;
                transition: opacity 0.2s;
            }
        }
        .course-info {
            width: 100%;
            padding: 10px 25px;
            box-sizing: border-box;
            cursor: pointer;
            .course-title {
                text-align: center;
            }
            .course-date {
                font-size: 14px;
            }
        }
    }

    @media (max-width: 640px) {
        width: 100%;
    }
    @media (min-width: 640px) {
        width: 50%;
    }
    @media (min-width: 1250px) {
        width: 33.33%;
    }
    @media (min-width: 1550px) {
        width: 25%;
    }
}
</style>
