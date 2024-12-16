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
            <typeMenu ref="menu" :type_no.sync="type_no" :phone="phone" @toType="toType" />
        </template>
        <!-- 标题 -->
        <template #title>
            <!-- <div class="title">
                <div class="title-left">
                    <span class="course-name">
                        {{ course.name }} - {{ unit.name }}
                    </span>
                    <span class="course-type">
                        {{ type_name }}
                    </span>
                </div>
                <div class="title-right"></div>
            </div> -->
        </template>
        <!-- 内容 -->
        <noteBody :type_no="type_no" :phone="phone" @toCourse="toCourse" />
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import typeMenu from '@/components/note/type/type_menu.vue';
import noteBody from '@/components/note/note_body.vue';

export default {
    name: 'note',
    components: {
        layout,
        typeMenu,
        noteBody,
    },
    data() {
        return {
            type_no: "0",
            search: "",
        }
    },
    watch: {
        "$route": {
            handler: function (to, from) {
                this.type_no = to.query.type_no || "0"
            },
            immediate: true
        },
        search(val) {
            this.$refs.menu.filter(val);
        },
    },
    computed: {
        phone() {
            const info = this.$store.state.user.info
            return info ? info.phone : ''
        }
    },
    methods: {
        toType(type_no) {
            this.$router.push({
                path: '/note',
                query: {
                    type_no: type_no
                }
            })
        },
        toCourse(course) {
            const routeData = this.$router.resolve({
                path: '/note/' + course.course_no,
            });
            window.open(routeData.href, course.course_no);
        },
    }
}
</script>

<style lang="less" scoped>

</style>
