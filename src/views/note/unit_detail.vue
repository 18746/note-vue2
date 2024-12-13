<template>
    <layout AlwaysDisplayFold>
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
        <unitBody
            :phone="phone"
            :course="course"
            :unit="unit"
        />
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import unitBody from '@/components/note/unit/unit_body.vue';

import { getType, getCourse, getUnitList, getUnit } from '@/api/note';
export default {
    name: 'course-detail',
    components: {
        layout,
        unitBody,
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

            search: '', // 搜索
            defaultProps: {  // 树形控件默认属性
                children: 'child',
                label: 'name',
                "node-key": "unit_no",
                "expand-on-click-node": false
            },
            unit_no: '',  // 单元编号
            unit_list: [],  // 单元列表
        };
    },
    watch: {
        search(val) {
            this.$refs.tree.filter(val);
        },
        $route(val) {
            const course_no = val.params.course_no
            const unit_no = val.params.unit_no
            if (course_no && unit_no) {
                if (unit_no != this.unit_no) {
                    this.unit_no = unit_no
                    this.initUnit()
                }
            }
        },
    },
    computed: {
        // img_url() {
        //     return getCourseImg(this.course);
        // },
        type_name() {
            if (this.course.type_no) {
                const type_no = this.course.type_no;
                if (this.type_list.length > 0) {
                    const type = this.type_list.find(item => item.type_no === type_no);
                    if (type) {
                        return type.name;
                    }
                }
            }
            return "默认";
        },
        phone() {
            const info = this.$store.state.user.info
            return info ? info.phone : ''
        }
    },
    filters: {
        // description(des) {
        //     return des ? des : '不知道写点啥了';
        // }
    },
    created() {
        this.course_no = this.$route.params.course_no;
        this.unit_no = this.$route.params.unit_no;
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
                await this.initUnitList()
                await this.initUnit()
            }
        },
        async initType() {
            await getType(this.phone).then(res => {
                this.type_list = res.data
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail
                });
            })
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
        async initUnit() {
            await getUnit(this.phone, this.course_no, this.unit_no).then(res => {
                this.unit = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取章节信息失败'
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
</style>