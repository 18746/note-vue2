<template>
    <div ref="Menu_Main" id="Menu_Main" class="scrollbar-y">
        <!-- 遍历List数组，渲染MenuItem组件 -->
        <menu-item
            v-for="menuItem in List" :key="menuItem.id"
            :value="value"
            :menuItem="menuItem"
            :name="name" :children="children"
            :paddingLift="paddingLift" :layer="layer"
            @initOpen="scrollFun"
            @openOrClose="openOrClose" @select="select"
            @scrollFun="scrollFun"
        />
    </div>
</template>

<script>
import MenuItem from './menu-item';

import { autoScrollFun } from "@/utils/scroll.js";

export default {
    name: 'Menu',
    props: {
        // 左边距
        paddingLift: {
            type: Number,
            required: false,
            default: 16
        },
        // 菜单项列表
        List: {
            type: Array,
            required: false,
            default: () => []
        },
        // 当前选中的值
        value: {
            type: Object,
            required: true,
            default: () => {}
        },
        // 层级
        layer: {
            type: Number,
            required: false,
            default: 0
        },
        // 名称字段
        name: {
            type: String,
            required: false,
            default: "name"
        },
        // 子节点字段
        children: {
            type: String,
            required: false,
            default: "children"
        },
    },
    components: {
        MenuItem,
    },
    data() {
        return { }
    },
    created() { },
    methods: {
        // 选中菜单项时触发
        select(item) {
            this.$emit("input", item.menu)
            this.$emit("change", item);
        },
        // 打开或关闭菜单项时触发
        openOrClose(item) {
            this.$emit("openOrClose", item)
        },
        // 滚动到指定元素
        scrollFun(el) {
            let scrollDom = this.$refs["Menu_Main"];
            this.$nextTick(() => {
                autoScrollFun(scrollDom, el.target || el);
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
#Menu_Main {
    width: 100%;
    height: 100%;
    overflow: hidden auto;
}
</style>