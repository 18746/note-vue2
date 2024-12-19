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
            />
        </div>
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import courseBody from '@/components/note/course/course_body.vue';
import userPicture from '@/components/user/user_picture.vue';
export default {
    name: 'course-detail',
    data() {
        return { };
    },
    components: {
        layout,
        courseBody,
        userPicture,
    },
    computed: {
        phone() {
            const info = this.$store.getters["user/getUser"]
            return info ? info.phone : ''
        }
    },
    methods: { }
};
</script>

<style lang="less" scoped>
.home {
    min-width: 520px;
    width: 80%;
    margin: 0 auto;
    padding-top: 20px;
}
</style>