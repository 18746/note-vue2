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
            <courseMenu
                ref="menu"
                :phone="phone"
                :unit_no="unit_no"
                :course="course"
                draggable
                :showDelete="false"
                @toUnit="toUnit"
                @updateUnit="updateUnit"
            />
        </template>
        <!-- 标题 -->
        <template #title>
            <div class="my-layout-title">
                <div class="my-layout-title-left">
                    <span class="course-name">
                        {{ course.name }} - {{ unit.name }}
                    </span>
                    <span class="course-type">
                        {{ type_name }}
                    </span>
                </div>
                <div class="my-layout-title-right">
                    <userPicture />
                </div>
            </div>
        </template>
        <!-- 内容 -->
        <unitBody :phone="phone" :course="course" :unit="unit" @toUnit="toUnit" />
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import courseMenu from '@/components/note/course/course_menu.vue';
import unitBody from '@/components/note/unit/unit_body.vue';

import userPicture from '@/components/user/user_picture.vue';

import { getTypePhoneList, getCourse, getUnit } from '@/api/note';
export default {
    name: 'course-detail',
    components: {
        layout,
        unitBody,
        courseMenu,
        userPicture,
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
            unit_no: '',  // 单元编号
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
        };
    },
    watch: {
        search(val) {
            this.$refs.menu.filter(val);
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
        type_name() {
            if (this.course.type_no) {
                const type_no = this.course.type_no;
                if (this.type_list.length > 0) {
                    return this.type_list.find(item => item.type_no === type_no).name;
                }
            }
            return "默认";
        },
        phone() {
            const info = this.$store.getters["user/getUser"]
            return info ? info.phone : ''
        }
    },
    created() {
        this.course.course_no = this.$route.params.course_no;
        this.unit_no = this.$route.params.unit_no;
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
                await this.initType()
                await this.initUnit()
                // this.$refs.menu.init()
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
        async initUnit() {
            await getUnit(this.phone, this.course.course_no, this.unit_no).then(res => {
                this.unit = res.data;
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取章节信息失败'
                });
            })
        },
        toUnit(unit) {
            this.$router.push({
                path: '/note/' + unit.course_no + '/' + unit.unit_no,
            })
        },
        updateUnit(unit) {
            this.unit = unit;
        }
    }
};
</script>

<style lang="less" scoped>

</style>