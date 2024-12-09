<template>
    <div class="home">
        <typeBody :type_no.sync="checked" />
        <courseBody :type_no="checked" />
    </div>
</template>

<script>
import typeBody from '@/components/note/type/type_body.vue';
import courseBody from '@/components/note/course/body.vue';
export default {
    name: 'note',
    components: {
        typeBody,
        courseBody,
    },
    data() {
        return {
            checked: "0",
        }
    },
    watch: {
        "$route": {
            handler: function (to, from) {
                this.checked = to.query.type_no || "0"
            },
            immediate: true
        }
    },
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
