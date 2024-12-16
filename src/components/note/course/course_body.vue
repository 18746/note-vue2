<template>
    <div class="detail-body">
        <div class="detail-header">
            <div class="header-left">
                <img v-if="course && course.name" class="course-img" :src="img_url" :alt="course.name">
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
                    @click="addUnit(null, unit_list)"
                >章节</el-button>
            </div>
            <el-tree
                :data="unit_list"
                :props="defaultProps"
                default-expand-all
                draggable
                :allow-drag="allowDrag"
                :allow-drop="allowDrop"
                @node-drop="handleDrop"
                @node-click="nodeClick"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="info">
                        <i v-if="data.is_menu" :class="node.expanded ? 'el-icon el-icon-folder-opened' : 'el-icon el-icon-folder'"></i>
                        <i v-else class="el-icon el-icon-tickets"></i>
                        <span class="name" @click.stop="handleNodeClick(data)">{{ data.name }}</span>
                    </span>
                    <span class="action">
                        <el-button
                            v-if="data.is_menu"
                            class="button button-add"
                            type="text"
                            size="mini"
                            icon="el-icon-folder-add"
                            @click.stop="() => append(node, data)">
                        </el-button>
                        <el-button
                            class="button button-edit"
                            type="text"
                            size="mini"
                            icon="el-icon-edit"
                            @click.stop="() => update(node, data)"
                        ></el-button>
                        <el-button
                            class="button button-delete"
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click.stop="() => remove(node, data)"
                        ></el-button>
                    </span>
                </span>
            </el-tree>
        </el-card>
        <addDialog
            :visible.sync="addVisible"
            :unit="unit"
            :course="course"
            @success="addSuccess"
        />
        <updateDialog
            :visible.sync="updateVisible"
            :unit="unit"
            :course="course"
            @success="updateSuccess"
        />
    </div>
</template>

<script>
import { getTypePhoneList, getCourse, getUnitList, updateUnit, delUnit } from '@/api/note';

import { getCourseImg } from '@/utils/index.js';

import addDialog from '../unit/add_dialog.vue';
import updateDialog from '../unit/update_dialog.vue';
export default {
    name: 'course',
    props: {
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
            course_no: "",
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


            unit_list: [],
            defaultProps: {
                children: 'child',
                label: 'name',
                "node-key": "unit_no",
                "expand-on-click-node": false
            },

            addVisible: false,
            unit: {},
    
            updateVisible: false,
            unit: {},
        };
    },
    computed: {
        img_url() {
            return getCourseImg(this.course);
        },
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
        this.course_no = this.$route.params.course_no || "";
        this.init();
    },
    methods: {
        async init() {
            await getCourse(this.phone, this.course_no).then(res => {
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
                this.initUnitList()
            }
        },
        async initUnitList() {
            await getUnitList(this.phone, this.course_no).then(res => {
                this.unit_list = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取目录信息失败'
                });
            })
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
        nodeClick(data, node, component) {
            console.log(data, node, component);
        },

        // 添加目录
        addUnit(parent_no, unit_list) {
            this.addVisible = true;
            this.unit = {
                parent_no: parent_no, // 父节点
                next_no: null, // 下一个节点
            };
        },
        append(node, data) {
            this.addUnit(data.unit_no, data.child);
        },
        addSuccess(data) {
            this.initUnitList()
        },

        // 修改目录
        update(node, data) {
            this.updateVisible = true;
            this.unit = {...data};
        },
        updateSuccess(data) {
            this.initUnitList()
        },

        // 删除目录
        async remove(node, data) {
            let info = "";
            if (data.is_menu) {
                info = "该目录删除的话，下面的内容也会被删除掉，确认删除？"
            } else {
                info = "确认删除该目录？"
            }
            await this.$confirm(info, '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(async () => {
                await delUnit(this.phone, this.course_no, data.unit_no).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.initUnitList()
                })
            }).catch(action => {});
        },

        // 判断当前节点能否拖拽
        allowDrag(node) {
            return true
        },
        // 判断当前位置能否放置
        allowDrop(draggingNode, dropNode, dropType) {
            // console.log(draggingNode, dropNode, dropType)
            if (dropType == 'prev') {
                // console.log('放置在目标节点前')
            } else if (dropType == 'inner') {
                // console.log('插入至目标节点')
                return dropNode.data.is_menu
            } else if (dropType == 'next') {
                // console.log('放置在目标节点后')
            }
            return true
        },
        // 拖拽成功后
        async handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log('tree drop: ', draggingNode, dropNode, dropType, ev);
            draggingNode.data.name = draggingNode.data.name.split('.').slice(1).join('.')
            if (dropType == 'before') {
                console.log('放置在目标节点前')
                draggingNode.data.parent_no = dropNode.data.parent_no
                draggingNode.data.next_no = dropNode.data.unit_no
                await this.updateUnit(draggingNode.data)
            } else if (dropType == 'inner') {
                console.log('插入至目标节点')
                draggingNode.data.parent_no = dropNode.data.unit_no
                draggingNode.data.next_no = null
                await this.updateUnit(draggingNode.data)
            } else if (dropType == 'after') {
                console.log('放置在目标节点后')
                draggingNode.data.parent_no = dropNode.data.parent_no
                draggingNode.data.next_no = dropNode.data.next_no
                await this.updateUnit(draggingNode.data)
            }
            this.initUnitList()
        },
        async updateUnit(unit) {
            await updateUnit(this.phone, unit.course_no, unit.unit_no, unit).then(res => {
                this.$message.success('更新成功')
            }).catch(err => {
                this.$message.error(err.data.detail)
            })
        },

        // 点击章节节点
        handleNodeClick(data) {
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
        .custom-tree-node {
            .info {
                font-size: 16px;
                .el-icon {
                    font-size: 20px;
                }
            }
        }
    }
}
</style>