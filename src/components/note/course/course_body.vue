<template>
    <div class="detail-body">
        <div class="detail-header">
            <div class="header-left">
                <img v-if="course && course.name" class="course-img" :src="course.picture" :alt="course.name">
            </div>
            <div class="header-right">
                <div class="course-info">
                    <div class="course-name">
                        {{ course.name }}
                        <span class="type">{{ type_name }}</span>
                    </div>
                    <div class="course-desc">简介：{{ course.description | description }}</div>
                </div>
                <div class="course-bottom">
                    <div class="course-heat">
                        <div>
                            更新：
                            <span class="update-count">{{ course.update_num }} 次</span>
                        </div>
                        <div>
                            点击率：
                            <span class="click-count">{{ course.click_count }} 次</span>
                        </div>
                    </div>
                    <div class="course-date">
                        <div>更新时间：{{ course.update_time }}</div>
                        <div>创建时间：{{ course.create_time }}</div>
                    </div>
                </div>
            </div>
        </div>
        <el-card class="detail-content box-card">
            <div slot="header" class="clearfix">
                <span>目录</span>
                <el-button
                    type="text"
                    class="add-unit-button"
                    icon="el-icon el-icon-folder-add"
                    style="float: right;"
                    @click="addUnit()"
                >章节</el-button>
            </div>
            <unitMenu
                ref="menu"
                :phone="phone"
                :course="course"
                draggable
                @toUnit="toUnit"
            />
        </el-card>
    </div>
</template>

<script>
import unitMenu from '../unit/unit_menu.vue';

import { getTypePhoneList, getCourse } from '@/api/note';
export default {
    name: 'course',
    components: {
        unitMenu,
    },
    props: {
        phone: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            course: {
                course_no: "",
                name: "",
                type_no: "",
                phone: "",
                description: "",
                create_time: "",
                update_time: ""
            },
            type_list: [],
        };
    },
    computed: {
        type_name() {
            if (this.course.type_no) {
                const type_no = this.course.type_no;
                if (this.type_list.length > 0) {
                    return this.type_list.find(item => item.type_no === type_no).name;
                }
            }
            return "默认";
        },
    },
    filters: {
        description(des) {
            return des ? des : '不知道写点啥了';
        }
    },
    created() {
        this.course.course_no = this.$route.params.course_no || "";
        this.init();
    },
    methods: {
        async init() {
            await getCourse(this.phone, this.course.course_no).then(res => {
                this.course = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取课程信息失败'
                });
            })
            if (this.course.course_no) {
                this.initType()
            }
        },
        async initType() {
            await getTypePhoneList(this.phone).then(res => {
                this.type_list = res.data
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail
                });
            })
        },

        // 添加目录
        addUnit() {
            this.$refs.menu.addUnit();
        },

        // 点击章节节点
        toUnit(data) {
            this.$router.push({
                path: '/note/' + data.course_no + '/' + data.unit_no,
            })
        },
    }
};
</script>

<style lang="less" scoped>
.detail-body {
    .detail-header {
        display: flex;
        margin-bottom: 35px;

        .header-left {
            width: 320px;
            height: 300px;
            flex-shrink: 0;

            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            .course-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        .header-right {
            height: auto;
            box-sizing: border-box;
            padding-left: 25px;
            flex-grow: 1;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;
            .course-info {
                display: flex;
                flex-direction: column;
                .course-name {
                    font-size: 30px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    .type {
                        display: inline-block;
                        font-size: 12px;
                        vertical-align: super;
                        border-radius: 40px;
                        padding: 0px 8px;
                        background-color: #9db3ff;
                        color: #fff;
                        line-height: 20px;
                        font-weight: normal;
                    }
                }
                .course-desc {
                    font-size: 18px;
                    color: #3d3d3d;
                    margin-bottom: 10px;
                }
            }
            .course-bottom {
                max-width: 600px;
                .course-heat {
                    font-size: 15px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    .update-count {
                        color: #22d500;
                        border: 1px solid #d9ecff;
                        border-radius: 4px;
                        padding: 0 8px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        background-color: #eafff9;
                    }
                    .click-count {
                        color: #409eff;
                        border: 1px solid #d9ecff;
                        border-radius: 4px;
                        padding: 0 8px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        background-color: #ecf5ff;
                    }
                    & > * {
                        width: 215px;
                    }
                }
                .course-date {
                    font-size: 15px;
                    color: #666;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    & > * {
                        width: 215px;
                    }
                }
            }
        }
        @media (max-width: 1000px) {
            display: block;
            .header-left {
                width: 100%;
                text-align: center;
            }
            .header-right {
                padding-left: 0px;
                .course-info {
                    .course-name {
                        text-align: center;
                        margin-bottom: 30px;
                        margin-top: 25px;
                    }
                    .course-desc {
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }

    .detail-content {
        .add-unit-button {
            padding: 3px 0;
            font-size: 16px;
            /deep/ .el-icon {
                font-size: 20px;
            }
        }
        /deep/ .my-custom-tree-node {
            .info {
                font-size: 16px;
                .el-icon {
                    font-size: 22px;
                }
            }
        }
    }
}
</style>