<template>
    <div class="type_body">
        <el-tabs v-model="checked" type="card" editable @edit="tabsEdit" :before-leave="beforeLeave">
            <el-tab-pane
                :key="'0'"
                :label="'默认'"
                :name="'0'"
            >
                <span
                    slot="label"
                    style="display: inline-block;height: 100%;"
                    @contextmenu.prevent.stop="updateTypeFun({type_no: '0', name: '默认'})"
                > 默认 </span>
            </el-tab-pane>
            <el-tab-pane
                v-for="item in type_list" :key="item.type_no"
                :label="item.name"
                :name="item.type_no"
            >
                <span
                    slot="label" 
                    style="display: inline-block;height: 100%;"
                    @contextmenu.prevent.stop="updateTypeFun(item)"
                > {{ item.name }} </span>
            </el-tab-pane>
        </el-tabs>
        
        <typeAddDialog
            :visible.sync="addVisible"
            @success="addTypeSuccess"
        />
        <typeUpdateDialog
            :visible.sync="updateVisible"
            :type="updateType"
            @success="updateTypeSuccess"
        />

    </div>
</template>

<script>
import typeAddDialog from './add_dialog.vue';
import typeUpdateDialog from './update_dialog.vue';

import { getType, delType } from '@/api/note';
export default {
    name: 'type',
    components: {
        typeAddDialog,
        typeUpdateDialog,
    },
    props: {
        type_no: {
            type: String,
            default: "0"
        }
    },
    data() {
        return {
            type_list: [],

            addVisible: false,
    
            updateVisible: false,
            updateType: {},
        }
    },
    computed: {
        checked: {
            get() {
                return this.type_no;
            },
            set(val) {
                this.$emit("update:type_no", val);
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
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
        // 点击tab触发路由跳转
        beforeLeave(new_name, old_name) {
            this.$router.push({
                path: '/note/home',
                query: {
                    type_no: new_name
                }
            })
            // return false
        },

        tabsEdit(targetName, action) {
            if (action === 'add') {
                this.addVisible = true;
            }
            if (action === 'remove') {
                if (targetName === "0") {
                    this.$message({
                        type: 'info',
                        message: '默认标签不能删除'
                    });
                    return false;
                }
                this.deleteType(targetName);
            }
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
        deleteType(targetName) {
            this.$confirm('类型删除后，该类型下的课程会被放到默认类型下，是否继续？', '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                delType({ type_no: targetName }).then(res => {
                    let tabs = this.type_list;
                    let activeName = this.checked;
                    if (activeName === targetName) {
                        activeName = '0';
                        tabs.forEach((tab, index) => {
                            if (tab.type_no === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.type_no;
                                }
                            }
                        });
                    }
                    this.checked = activeName;
                    this.type_list = tabs.filter(tab => tab.type_no !== targetName);

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
            }).catch(action => {
                // this.$message({
                //     type: 'info',
                //     message: action === 'cancel'
                //         ? '放弃保存并离开页面'
                //         : '停留在当前页面'
                // })
            });
        },
    }
}
</script>

<style lang="less" scoped>
.home {
    min-width: 520px;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;
}
</style>
