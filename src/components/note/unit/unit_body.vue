<template>
    <layout>
        <!-- 左侧搜索框 -->
        <template #left-search>
            <el-input v-model="search" size="small" placeholder="Search...">
                <el-button slot="append" icon="el-icon-search" style="width: 24px;padding: 12px;" />
            </el-input>
        </template>
        <!-- 左侧菜单 -->
        <template #left-menu>
            <el-tree
                ref="tree"
                :data="unit_list"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="info">
                        <i v-if="data.is_menu" :class="node.expanded ? 'el-icon el-icon-folder-opened' : 'el-icon el-icon-folder'"></i>
                        <i v-else class="el-icon el-icon-tickets"></i>
                        <span
                            :class="'unit-name ' + (unit_no == data.unit_no ? 'active' : '')"
                            @click.stop="handleNodeClick(data)"
                        >{{ data.name }}</span>
                    </span>
                    <span class="action"></span>
                </span>
            </el-tree>
        </template>
        <!-- 标题 -->
        <template #title>
            <div class="title">
                <div class="title-left">
                    <span class="course-name">
                        {{ course.name }} - {{ unit.name }}
                    </span>
                    <span class="course-type">
                        {{ type_name }}
                    </span>
                </div>
                <div class="title-right"></div>
            </div>
        </template>
        <!-- 内容 -->
        <div class="body">
            <!-- <v-md-preview v-if="!isEdit" :text="unit_content.content"></v-md-preview> -->
            <v-md-editor
                ref="mdEditor"
                :mode="mode"
                v-model="content"
                placeholder="在此输入内容"
                left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code"
                right-toolbar=""
                height="calc(100vh - 110px)"
                @save="save"
            ></v-md-editor>
            <div class="time">
                <div>更新时间：{{ unit.update_time }}</div>
                <div>创建时间：{{ unit.create_time }}</div>
            </div>
            <!-- <div class="children">
                <el-button
                    type="text"
                    v-for="item in unit_content.child"
                    :key="item.unit_no"
                    @click="handleNodeClick(item)"
                >{{ item.name }}</el-button>
            </div> -->
            <div class="button-bottom">
                <el-button
                    v-if="isEdit"
                    key="editSee"
                    type="primary"
                    icon="el-icon-view"
                    circle
                    :plain="!editSee"
                    @click="editSee = !editSee"
                ></el-button>
                <el-button
                    v-if="isEdit"
                    key="tocVisible"
                    type="primary"
                    icon="el-icon-notebook-1"
                    circle
                    :plain="!tocVisible"
                    @click="tocVisible = !tocVisible"
                ></el-button>
                <el-button
                    key="fullscreen"
                    type="primary"
                    :icon="!fullscreen ? 'el-icon-full-screen' : 'el-icon-crop'"
                    circle
                    :plain="!fullscreen"
                    @click="fullscreen = !fullscreen"
                ></el-button>
                <div class="quarantine"></div>
                <el-button
                    v-if="isEdit"
                    key="check"
                    type="success"
                    icon="el-icon-check"
                    circle
                    @click="toSave()"
                ></el-button>
                <el-button
                    v-if="!isEdit"
                    key="edit"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="toEdit()"
                ></el-button>
                <el-button
                    v-if="isEdit"
                    key="close"
                    type="danger"
                    icon="el-icon-close"
                    circle
                    @click="exitEdit()"
                ></el-button>
            </div>
        </div>
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import { getType, getCourse, getUnitList, getUnit, getUnitContent, updateUnitContent } from '@/api/note';
export default {
    name: 'unit-detail',
    components: {
        layout,
    },
    data() {
        return {
            course_no: '',
            unit_no: '',
            course: {
                course_no: "",
                name: "",
                type_no: "",
                phone: "",
                description: "",
                create_time: "",
                update_time: ""
            },
            unit_list: [],
            unit: {
                "course_no": "",
                "unit_no": "",
                "name": "",
                "is_menu": false,
                "parent_no": "",
                "next_no": "",
                "create_time": "",
                "update_time": ""
            },
            type_list: [],
            unit_content: {
                child: [],
                content: "",
            },

            search: '',
            defaultProps: {
                children: 'child',
                label: 'name',
                "node-key": "unit_no",
                "expand-on-click-node": false
            },

            
            content: '',        // 展示的内容
            fullscreen: false,  // 是否全屏
            tocVisible: false,  // 是否显示目录
            isEdit: false,      // 是否为编辑模式
            editSee: true,      // 编辑模式是否展示预览
        };
    },
    computed: {
        // img_url() {
        //     return getCourseImg(this.course);
        // },
        type_name() {
            if (this.course.type_no) {
                const type_no = this.course.type_no;
                if (this.type_list.length > 0) {
                    return this.type_list.find(item => item.type_no === type_no).name;
                }
            }
            return "默认";
        },
        mode() {
            if (!this.isEdit) {
                return "preview"
            } else if (this.editSee) {
                return "editable"
            } else {
                return "edit"
            }
        }
    },
    watch: {
        search(val) {
            this.$refs.tree.filter(val);
        },
        $route(val) {
            console.log(val.params);
            const course_no = val.params.course_no
            const unit_no = val.params.unit_no
            if (course_no && unit_no) {
                if (unit_no != this.unit_no) {
                    this.unit_no = val.params.unit_no
                    this.initUnit()
                }
            }
        },
        fullscreen(val) {
            if (this.$refs.mdEditor) {
                this.$refs.mdEditor.fullscreen = val;
            }
        },
        tocVisible(val) {
            if (this.$refs.mdEditor) {
                this.$refs.mdEditor.tocVisible = val;
            }
        },
    },
    filters: {
        // description(des) {
        //     return des ? des : '不知道写点啥了';
        // }
    },
    created() {
        this.course_no = this.$route.params.course_no;
        this.unit_no = this.$route.params.unit_no;
        this.init()
    },
    methods: {
        async init() {
            await getCourse({ course_no: this.course_no }).then(res => {
                this.course = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取课程信息失败'
                });
            })
            if (this.course.course_no) {
                this.initUnitList()
                this.initUnit()
                this.initType()
            }
        },
        async initUnitList() {
            await getUnitList({course_no: this.course_no}).then(res => {
                this.unit_list = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取目录信息失败'
                });
            })
        },
        async initUnit() {
            await getUnit({
                course_no: this.course_no,
                unit_no: this.unit_no,
            }).then(res => {
                this.unit = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取章节信息失败'
                });
            })
            this.getUnitContent()
        },
        async initType() {
            await getType().then(res => {
                this.type_list = res.data
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail
                });
            })
        },
        async getUnitContent() {
            await getUnitContent({
                course_no: this.course_no,
                unit_no: this.unit_no,
            }).then(res => {
                this.unit_content = res.data;
                this.content = res.data.content;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取章节内容失败'
                });
            })
        },

        // 筛选章节
        filterNode(search, data, node) {
            if (!search) return true;
            return data.name.indexOf(search) !== -1;
        },
        // 点击跳转
        handleNodeClick(data) {
            this.$router.push({
                path: '/note/' + data.course_no + '/' + data.unit_no,
            })
        },

        toEdit() {
            this.isEdit = true;
        },
        exitEdit() {
            this.$confirm("确定放弃修改？", '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                this.isEdit = false;
                this.content = this.unit_content.content;
            }).catch(action => {});
        },
        toSave() {
            this.$refs.mdEditor.save();
        },
        async save(text, html) {
            await updateUnitContent({
                course_no: this.course_no,
                unit_no: this.unit_no,
                content: this.content,
            }).then(res => {
                this.unit_content.content = res.data
                this.$message.success('内容已更新')
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: err.data.detail || '接口报错，请您先本地保存好数据，稍后重试'
                });
            })
            console.log(text)
            window.mdEditor = this.$refs.mdEditor
            console.log(this.$refs.mdEditor)
        },
    }
};
</script>

<style lang="less" scoped>
.custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-left: 8px;

    .info {
        font-size: 15px;
        line-height: 24px;
        .unit-name {
            &.active {
                color: #409EFF;
            }
            &:hover {
                color: #409EFF;
                text-decoration: underline;
            }
        }
        .el-icon {
            font-size: 18px;
        }
    }
    .action {}
}
/deep/ .el-tree-node__content {
    height: 35px;
}
/deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
}
/deep/ .el-tree-node__expand-icon.expanded {
    display: none;
}
/deep/ .el-tree-node__content>.el-tree-node__expand-icon {
    display: none;
}

.title {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-left {
        .course-name {
            font-size: 20px;
            font-weight: bold;
        }
        .course-type {
            display: inline-block;
            font-size: 12px;
            vertical-align: super;
            border-radius: 40px;
            padding: 0px 8px;
            background-color: #9db3ff;
            color: #fff;
            line-height: 20px;
            font-weight: normal;
            margin-left: 6px;
        }
    }
    .title-right {
        height: 100%;
    }

}
.body {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    .time {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #363636;
        margin-top: 15px;
    }

    .button-bottom {
        position: fixed;
        z-index: 2000;
        right: 50px;
        bottom: 50px;
        display: flex;
        flex-direction: column;
        .el-button {
            margin-bottom: 12px;
        }
        .el-button:last-child {
            margin-bottom: 0px;
        }
        .quarantine {
            margin-top: 20px;
        }
        .el-button+.el-button {
            margin-left: unset;
        }
    }
    .button-center {
        position: fixed;
        z-index: 2000;
        top: 50%;
        transform: translateY(-50%);
        right: 50px;
        display: flex;
        flex-direction: column;
        .el-button {
            margin-bottom: 12px;
        }
        .el-button:last-child {
            margin-bottom: 0px;
        }
        .el-button+.el-button {
            margin-left: unset;
        }
    }
}
.children {
    display: flex;
    flex-wrap: wrap;
    .el-button {
        padding: 8px 0px;
        font-size: 15px;
    }
}
</style>