<template>
    <div class="unit-menu">
        <div class="unit-menu-title">
            <i class="el-icon-menu"></i>本章目录
        </div>
        <div class="unit-menu-list my-scrollbar-y">
            <div
                class="unit-menu-item"
                v-for="anchor in title_list"
                :style="{ 'padding-left': `${anchor.indent * 20}px` }"
                @click="handleAnchorClick(anchor)"
            >
                <a>{{ anchor.title }}</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'unit-menu',
    props: {
        title_list: {
            type: Array,
            default: () => []
        },
        haschild: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { }
    },
    // computed: {
    //     unit_menu_list_height() {
    //         return this.haschild ? 'height: calc(100vh - 185px);' : 'height: calc(100vh - 152px);'
    //     }
    // },
    created() { },
    methods: {
        handleAnchorClick(anchor) {
            this.$emit('anchor-click', anchor)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.unit-menu {
    height: initial;
    border-left: 1px solid #ccc;
    box-sizing: border-box;

    .unit-menu-title {
        font-size: 18px;
        color: #00000078;
        padding: 10px 10px 10px;
        border-bottom: 1px solid #ccc;

        i {
            margin-right: 5px;
        }
    }
    .unit-menu-list {
        width: 315px;
        padding: 5px 10px;
        height: calc(100% - 55px);

        .unit-menu-item {
            margin-bottom: 10px;
            font-size: 15px;
            color: #000000de;
            &:hover {
                color: #1890ff;
                text-decoration: underline;
            }
            &:last-child {
                margin-bottom: 0;
            }
            a {
                cursor: pointer;
            }
        }
    }
}
</style>
