<template>
    <div class="course-body">
        <div style="text-align: right;margin: 0 10px 5px;" :key="course_list.length">
            <el-button-group>
                <el-button type="primary" icon="el-icon-document-add" @click="add"></el-button>
                <el-button :icon="!card_type ? 'el-icon-s-grid' : 'el-icon-document'" @click="changCardOrLine"></el-button>
            </el-button-group>
        </div>
        <div :class="Class" v-for="course in course_list" :key="course.course_no">
            <div class="course">
                <div class="course-img">
                    <img
                        :src="course | imgUrl"
                        :alt="course.name"
                    />
                    <div class="icon">
                        <div class="body">
                            <i class="el-icon el-icon-edit-outline" @click="edit(course)"></i>
                            <i class="el-icon el-icon-delete" @click="del(course.course_no)"></i>
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
import addDialog from './add_dialog.vue';
import updateDialog from './update_dialog.vue';

import { getTypeCourse, delCourse } from '@/api/note';
import { getCourseImg } from '@/utils/index.js';
export default {
    name: 'note-list',
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
            card_type: false,
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
        imgUrl(course) {
            return getCourseImg(course)
        },
    },
    computed: {
        Class() {
            if (this.card_type) {
                return 'course-card'
            } else if (this.line_type) {
                return 'course-line'
            }
            return 'course-line'
        },
    },
    methods: {
        async init() {
            const type_no = this.type_no
            await getTypeCourse(this.phone, {
                phone: this.phone,
                type_no: type_no
            }).then(res => {
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
            this.card_type = !this.card_type
        },
        // 点击课程跳转
        select(course) {
            this.$router.push({
                path: '/note/' + course.course_no,
            })

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
            console.log(course);
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
    }
}
</script>

<style lang="less" scoped>
.course-line {
    display: inline-block;
    padding: 10px;
    box-sizing: border-box;
    @media (max-width: 900px) {
        width: 100%;
    }
    @media (min-width: 900px) {
        width: 50%;
    }
    @media (min-width: 1350px) {
        width: 33.33%;
    }
    @media (min-width: 1750px) {
        width: 25%;
    }
    
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
            position: relative;
            flex-shrink: 0;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
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
                background-color: #00000059;
                .body {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    .el-icon {
                        font-size: 24px;
                        color: #fff;
                        cursor: pointer;
                        margin-right: 5px;
                        &:last-child {
                            margin-right: 0px;
                        }
                    }
                }
            }
            &:hover .icon {
                z-index: 2;
                opacity: 1;
                transition: opacity 0.3s;
            }
        }
        .course-info {
            height: 100%;
            padding: 5px 9px;
            box-sizing: border-box;
            flex-grow: 1;
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
            box-shadow: 0 0 10px #cdcdcd;
            .course-info {
                .course-title {
                    color: #00a1d6;
                }
            }
        }
    }
}
.course-card {
    display: inline-block;
    padding: 12px;
    box-sizing: border-box;
    
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
            position: relative;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
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
                background-color: #00000059;
                .body {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    .el-icon {
                        font-size: 30px;
                        color: #fff;
                        cursor: pointer;
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
                transition: opacity 0.3s;
            }
        }
        .course-info {
            width: 100%;
            height: 100%;
            padding: 10px 25px;
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
                text-align: center;
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
                font-size: 14px;
                color: #767676;
            }
        }

        &:hover {
            box-shadow: 0 0 10px #cdcdcd;
            .course-info {
                .course-title {
                    color: #00a1d6;
                }
            }
        }
    }

    @media (max-width: 750px) {
        width: 100%;
    }
    @media (min-width: 750px) {
        width: 50%;
    }
    @media (min-width: 1050px) {
        width: 33.33%;
    }
    @media (min-width: 1500px) {
        width: 25%;
    }
}
</style>
