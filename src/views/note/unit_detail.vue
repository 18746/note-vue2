<template>
    <div class="home">
        <unitDetail ></unitDetail>
    </div>
</template>

<script>
import unitDetail from '@/components/note/unit/unit_body.vue';
export default {
    name: 'course-detail',
    data() {
        return { };
    },
    components: {
        unitDetail
    },
    created() {
        // console.log();
     },
    mounted() { },
    methods: { }
};
</script>

<style lang="less" scoped>
.home {
    min-width: 520px;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;
}
</style>