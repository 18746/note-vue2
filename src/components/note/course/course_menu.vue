<template>
    <div class="course-menu my-scrollbar-y">
        <el-tree
            ref="tree"
            :data="unit_list"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            :draggable="draggable"
            :allow-drag="allowDrag"
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
            @node-click="nodeClick"
        >
            <template #default="{ node, data }">
                <span class="my-custom-tree-node">
                    <span class="info">
                        <i v-if="data.is_menu" :class="node.expanded ? 'el-icon el-icon-folder-opened' : 'el-icon el-icon-folder'"></i>
                        <i v-else class="el-icon el-icon-tickets"></i>
                        <span
                            :class="'name ' + (unit_no == data.unit_no ? 'active' : '')"
                            @click.stop="toUnit(data)"
                        >{{ data.name }}</span>
                    </span>
                    <span class="action">
                        <el-button
                            v-if="showAdd && data.is_menu"
                            class="button button-add"
                            type="text"
                            size="mini"
                            icon="el-icon-document-add"
                            @click.stop="() => append(node, data)">
                        </el-button>
                        <el-button
                            v-if="showEdit"
                            class="button button-edit"
                            type="text"
                            size="mini"
                            icon="el-icon-edit"
                            @click.stop="() => update(node, data)"
                        ></el-button>
                        <el-button
                            v-if="showDelete"
                            class="button button-delete"
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click.stop="() => remove(node, data)"
                        ></el-button>
                    </span>
                </span>
            </template>
        </el-tree>
        <addDialog
            :visible.sync="addVisible"
            :phone="phone"
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
import addDialog from './add_dialog.vue';
import updateDialog from './update_dialog.vue';

import { getUnitList, updateUnit, delUnit } from '@/api/note';
export default {
    name: 'course-menu',
    components: {
        addDialog,
        updateDialog,
    },
    props: {
        phone: {
            type: String,
            required: true
        },
        unit_no: {
            type: String,
            default: ""
        },
        course: {
            type: Object,
            required: true
        },
        draggable: {
            type: Boolean,
            default: false
        },
        showAdd: {
            type: Boolean,
            default: true
        },
        showEdit: {
            type: Boolean,
            default: true
        },
        showDelete: {
            type: Boolean,
            default: true
        }
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

            
            addVisible: false,
            unit: {},

            updateVisible: false,
            unit: {},
        }
    },
    created() {
        this.init();
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
        toUnit(unit) {
            this.$emit('toUnit', unit);
        },
        filter(val) {
            this.$refs.tree.filter(val);
        },

        append(node, data) {
            this.addUnit(data.unit_no);
        },
        // 添加目录
        addUnit(parent_no) {
            this.addVisible = true;
            this.unit = {
                parent_no: parent_no || null, // 父节点
                next_no: null, // 下一个节点
            };
        },
        addSuccess(data) {
            this.init()
        },

        // 修改目录
        update(node, data) {
            this.updateVisible = true;
            this.unit = {...data};
        },
        updateSuccess(data) {
            this.init()
            if (this.unit_no == data.unit_no) {
                this.$emit('updateUnit', data);
            }
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
                await delUnit(this.phone, this.course.course_no, data.unit_no).then(res => {
                    if (res.data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    }
                    this.init()
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
            // console.log('tree drop: ', draggingNode, dropNode, dropType, ev);
            draggingNode.data.name = draggingNode.data.name.split('.').slice(1).join('.')
            if (dropType == 'before') {
                // console.log('放置在目标节点前')
                draggingNode.data.parent_no = dropNode.data.parent_no
                draggingNode.data.next_no = dropNode.data.unit_no
                await this.updateUnit(draggingNode.data)
            } else if (dropType == 'inner') {
                // console.log('插入至目标节点')
                draggingNode.data.parent_no = dropNode.data.unit_no
                draggingNode.data.next_no = null
                await this.updateUnit(draggingNode.data)
            } else if (dropType == 'after') {
                // console.log('放置在目标节点后')
                draggingNode.data.parent_no = dropNode.data.parent_no
                draggingNode.data.next_no = dropNode.data.next_no
                await this.updateUnit(draggingNode.data)
            }
            await this.init()
        },
        async updateUnit(unit) {
            await updateUnit(this.phone, unit.course_no, unit.unit_no, unit).then(res => {
                this.$message.success('更新成功')
            }).catch(err => {
                this.$message.error(err.data.detail)
            })
        },
        nodeClick(data, node, component) {
            console.log(data, node, component);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped></style>
