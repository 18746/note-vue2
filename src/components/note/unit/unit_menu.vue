<template>
    <div class="unit-menu">
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
    </div>
</template>

<script>
import { getUnitList } from '@/api/note';
export default {
    name: 'unit-menu',
    props: {
        phone: {
            type: String,
            required: true
        },
        unit_no: {
            type: String,
            required: true
        },
        course: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            unit_list: [],  // 单元列表
            defaultProps: {  // 树形控件默认属性
                children: 'child',
                label: 'name',
                "node-key": "unit_no",
                "expand-on-click-node": false
            },
        }
    },
    methods: {
        async init() {
            await getUnitList(this.phone, this.course.course_no).then(res => {
                this.unit_list = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取目录信息失败'
                });
            })
        },
        // 筛选章节
        filterNode(search, data, node) {
            if (!search) return true;
            return data.name.indexOf(search) !== -1;
        },
        // 点击跳转
        handleNodeClick(unit) {
            this.$emit('toUnit', unit);
        },
        filter(val) {
            this.$refs.tree.filter(val);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
