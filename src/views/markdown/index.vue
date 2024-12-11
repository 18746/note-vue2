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
            <Menu
                v-model="changeMenu"
                :List="list"
                @openOrClose="openOrClose" @change="select"
            ></Menu>
        </template>
        <!-- 标题 -->
        <template #title>
            <SpaceBetween>
                <template #Title-Left>
                    东败是VS的收到v
                </template>
                <template #Title-Right>
                    东败是VS的收到v
                </template>
            </SpaceBetween>
        </template>
        <!-- 内容 -->
        <template>
            <div style="background-color: beige;">
                <v-md-editor v-model="text" height="500px"></v-md-editor>
                <v-md-preview :text="text"></v-md-preview>
                <div>{{ changeMenu.id }}</div>
                <div>{{ changeMenu.name }}</div>
            </div>
        </template>
    </layout>
</template>

<script>
import layout from '@/components/layout/layout.vue';
import Menu from '@/components/menu';
import SpaceBetween from '@/components/title/space_between.vue';

export default {
    name: 'markdown',
    components: {
        layout,
        Menu,
        SpaceBetween,
    },
    data() {
        return {
            search: '', // 搜索框内容
            list: [], // 菜单列表
            changeMenu: {}, // 当前选中的菜单
            text: `
<h1 align="center">Markdown Editor built on Vue</h1>

<p align="center">
<a href="https://npmcharts.com/compare/@kangc/v-md-editor?minimal=true"><img src="https://img.shields.io/npm/dm/@kangc/v-md-editor.svg?sanitize=true" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@kangc/v-md-editor"><img src="https://img.shields.io/npm/v/@kangc/v-md-editor.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@kangc/v-md-editor"><img src="https://img.shields.io/npm/l/@kangc/v-md-editor.svg?sanitize=true" alt="License"></a>
</p>

## Links

- [Demo](https://code-farmer-i.github.io/vue-markdown-editor/examples/base-editor.html)
- [Documentation](https://code-farmer-i.github.io/vue-markdown-editor/)
- [Changelog](https://code-farmer-i.github.io/vue-markdown-editor/changelog.html)

## Install

\`\`\`bash
# use npm
npm i @kangc/v-md-editor -S

# use yarn
yarn add @kangc/v-md-editor
\`\`\`

## Quick Start

\`\`\`js
import Vue from 'vue';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

VueMarkdownEditor.use(vuepressTheme);

Vue.use(VueMarkdownEditor);
\`\`\`

## Usage

\`\`\`html
<template>
    <v-md-editor v-model="text" height="400px"></v-md-editor>
</template>

<script>
    export default {
        data() {
            return {
                text: '',
            };
        },
    };
<\/script>
\`\`\`

## Refrence

- [ElementUi Scrollbar Component](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar)
- [vuepress-plugin-container](https://vuepress.github.io/zh/plugins/container/)`,
        }
    },
    created() {
        let list0 = [];
        for(let i = 0; i < 40; i++) {
            let list1 = []
            for(let j = 0; j < 3; j++) {
                let list2 = []
                for(let k = 0; k < 3; k++) {
                    list2.push({
                        id: this.getId(),
                        name: '选项' + (k + 1),
                        children: []
                    })
                }
                list1.push({
                    id: this.getId(),
                    name: '选项' + (j + 1),
                    children: list2
                })
            }
            
            list0.push({
                id: this.getId(),
                name: '导航' + (i + 1),
                children: list1
            })
        }
        this.list = list0;

        this.changeMenu = this.list[0]
    },
    methods: {
        select(item) {
            console.log(item);
        },
        openOrClose(item) {
            console.log(item, item.open)
        },
        getId() {
            const uniqueId = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
            return uniqueId;
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped></style>
