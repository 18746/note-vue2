<template>
    <div class="home">
        <!-- <uploadImg
            :file_list="file_list"
            only_img
            init_url="http://localhost:8070/course/picture/15530717659/vue4/picture.png"
        /> -->
        <div class="body body1"></div>
        <div class="body body3"></div>
        <div class="body body2"></div>
        <div class="body body4"></div>
        <div class="body body5"></div>
    </div>
</template>

<script>
// import uploadImg from '@/components/note/upload_img.vue';
export default {
    name: 'home',
    components: {
        // uploadImg,
    },
    data() {
        return {
            file_list: [],
        }
    },
    created() { },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.home {
    min-width: 300px;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;

    column-count: 3;//想要排成的列数
    column-gap: 4px;

    .body {
        width: 100%;
        height: 100px;
        border: 1px solid #00000030;
        page-break-inside: avoid;
        &.body1 {
            height: 20px;
            background-color:#12000030;
        }
        &.body2 {
            height: 10px;
            background-color:#50000030;
        }
        &.body3 {
            height: 50px;
            background-color:#50560030;
        }
        &.body4 {
            height: 10px;
            background-color:#50568930;
        }
        &.body5 {
            height: 30px;
            background-color:#ff568930;
        }
    }
}
</style>
