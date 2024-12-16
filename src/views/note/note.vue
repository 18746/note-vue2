<template>
    <div class="home">
        <typeBody :type_no.sync="checked" :phone="phone" />
        <noteBody :type_no="checked" :phone="phone" />
    </div>
</template>

<script>
import typeBody from '@/components/note/type/type_body.vue';
import noteBody from '@/components/note/note_body.vue';
export default {
    name: 'note',
    components: {
        typeBody,
        noteBody,
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
        },
    },
    computed: {
        phone() {
            const info = this.$store.state.user.info
            return info ? info.phone : ''
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
