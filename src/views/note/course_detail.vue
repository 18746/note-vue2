<template>
    <layout :showLeft="false">
        <template #title>
            <div class="my-layout-title">
                <div class="my-layout-title-left"></div>
                <div class="my-layout-title-right">
                    <userPicture />
                </div>
            </div>
        </template>
        <div class="home">
            <courseBody
                :phone="phone"
                :course="course"
            />
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
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import courseBody from '@/components/note/course/course_body.vue';
import unitMenu from '@/components/note/unit/unit_menu.vue';
import userPicture from '@/components/user/user_picture.vue';

import { getCourse } from '@/api/note';
export default {
    name: 'course-detail',
    components: {
        layout,
        courseBody,
        userPicture,
        unitMenu,
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
        };
    },
    computed: {
        phone() {
            const info = this.$store.getters["user/getUser"]
            return info ? info.phone : ''
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
.home {
    width: 80%;
    margin: 0 auto;
    padding-top: 20px;
}
</style>