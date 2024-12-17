<template>
    <div class="type_menu">
        <el-tree
            ref="tree"
            :data="type_list"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
        >
            <template #default="{ node, data }">
                <span class="my-custom-tree-node">
                    <span class="info">
                        <!-- <i class="el-icon el-icon-menu"></i> -->
                        <span
                            :class="'name ' + (curr_type_no == data.type_no ? 'active' : '')"
                            @click.stop="toType(data.type_no)"
                        >{{ data.name }}</span>
                    </span>
                    <span class="action">
                        <el-button
                            v-if="data.type_no !== '0'"
                            class="button button-edit"
                            type="text"
                            size="mini"
                            icon="el-icon-edit"
                            @click.stop="() => updateTypeFun(data)"
                        ></el-button>
                        
                        <el-button
                            v-if="data.type_no !== '0'"
                            class="button button-delete"
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click.stop="() => deleteType(data.type_no)"
                        ></el-button>
                    </span>
                </span>
            </template>
        </el-tree>
        <div class="menu-button">
            <el-button
                class="button button-delete"
                type="success"
                size="mini"
                icon="el-icon-plus"
                @click="() => addVisible = true"
            ></el-button>
        </div>
        
        <typeAddDialog
            :visible.sync="addVisible"
            :phone="phone"
            @success="addTypeSuccess"
        />
        <typeUpdateDialog
            :visible.sync="updateVisible"
            :phone="phone"
            :type="updateType"
            @success="updateTypeSuccess"
        />

    </div>
</template>

<script>
import typeAddDialog from './add_dialog.vue';
import typeUpdateDialog from './update_dialog.vue';

import { getTypePhoneList, delType } from '@/api/note';
export default {
    name: 'type-menu',
    components: {
        typeAddDialog,
        typeUpdateDialog,
    },
    props: {
        type_no: {
            type: String,
            default: "0"
        },
        phone: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            type_list: [],

            type_list: [],  // 类型列表
            defaultProps: {  // 树形控件默认属性
                children: 'child',
                label: 'name',
                "node-key": "unit_no",
                "expand-on-click-node": false
            },

            addVisible: false,
    
            updateVisible: false,
            updateType: {},
        }
    },
    computed: {
        curr_type_no: {
            get() {
                return this.type_no;
            },
            set(val) {
                this.$emit("update:type_no", val);
            }
        },
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
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
        // 点击tab触发路由跳转
        toType(type_no) {
            this.$emit("toType", type_no);
        },
        // 筛选类型
        filterNode(search, data, node) {
            if (!search) return true;
            return data.name.indexOf(search) !== -1;
        },
        filter(val) {
            this.$refs.tree.filter(val);
        },

        // 增加类型，成功后更新列表
        addTypeSuccess(type) {
            this.type_list.push(type)
        },

        // 展示更新弹窗
        updateTypeFun(type) {
            if (type.type_no === "0") {
                this.$message({
                    type: 'info',
                    message: '默认标签不能修改'
                });
                return false
            }
            this.updateVisible = true;
            this.updateType = {...type};
        },
        // 更新类型，成功后更新列表
        updateTypeSuccess(type) {
            const index = this.type_list.findIndex(item => item.type_no === type.type_no);
            if (index !== -1) {
                this.type_list.splice(index, 1, type);
            }
        },

        // 删除类型
        async deleteType(type_no) {
            if (type_no === "0") {
                this.$message({
                    type: 'info',
                    message: '默认标签不能删除'
                });
                return false;
            }
            await this.$confirm('类型删除后，该类型下的课程会被放到默认类型下，是否继续？', '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(async () => {
                await delType(this.phone, type_no).then(res => {
                    let tabs = this.type_list;
                    let curr_type_no = this.curr_type_no;
                    if (curr_type_no === type_no) {
                        tabs.forEach((tab, index) => {
                            if (tab.type_no === type_no) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    curr_type_no = nextTab.type_no;
                                }
                            }
                        });
                    }
                    this.curr_type_no = curr_type_no;
                    this.type_list = tabs.filter(tab => tab.type_no !== type_no);

                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
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
.type_menu {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .menu-button {
        text-align: center;
        .button {
            width: 100%;
            margin-bottom: 10px;
        }
        .button:last-child {
            margin-bottom: 0px;
            font-size: 16px;
        }
        padding: 0 10px 10px;
    }
}
.my-custom-tree-node {
    padding-left: 20px;

    .info {

    }
    .action {
        .button {
            font-size: 20px;
        }
    }
}
</style>
