<template>
    <div class="home">
        <uploadImg
            :file_list="file_list"
            only_img
            init_url="http://localhost:8070/course/picture/15530717659/vue4/picture.png"
        />
    </div>
</template>

<script>
import uploadImg from '@/components/note/upload_img.vue';
export default {
    name: 'home',
    components: {
        uploadImg,
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
    min-width: 520px;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;
}
</style>
