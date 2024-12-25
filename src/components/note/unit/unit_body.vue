<template>
    <div class="body">
        <div class="edit_and_menu">
            <v-md-editor
                ref="mdEditor"
                :mode="mode"
                v-model="content"
                placeholder="在此输入内容"
                left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code"
                right-toolbar=""
                :include-level="[1, 2, 3, 4]"
                :height="editorHeight"
                @change="changeEditor"
                @save="save"
                :disabled-menus="[]"
                @image-click="imageClick"
                @upload-image="uploadImage"
            ></v-md-editor>
            <el-empty v-if="!isEdit && !content" class="empty" description="点击编辑，开始记录你的笔记" :image-size="150"></el-empty>
            <div v-if="tocVisible" class="menu_list">
                <div
                    class="menu_item"
                    v-for="anchor in title_list"
                    :style="{ 'padding-left': `${anchor.indent * 20}px` }"
                    @click="handleAnchorClick(anchor)"
                >
                    <a style="cursor: pointer">{{ anchor.title }}</a>
                </div>
            </div>
        </div>
        <div v-if="!isEdit" class="children my-scrollbar-x">
            <el-button
                type="text"
                v-for="item in unit_content.child"
                :key="item.unit_no"
                @click="toUnit(item)"
            >{{ item.name }}</el-button>
        </div>
        <div class="time">
            <div>更新时间：{{ unit.update_time }}</div>
            <div>创建时间：{{ unit.create_time }}</div>
        </div>
        <div class="my-button-bottom">
            <el-button
                key="fullscreen"
                type="primary"
                :icon="!fullscreen ? 'el-icon-full-screen' : 'el-icon-crop'"
                circle
                :plain="!fullscreen"
                @click="fullscreen = !fullscreen"
            ></el-button>
            <el-button
                key="tocVisible"
                type="primary"
                icon="v-md-icon-toc"
                circle
                :plain="!tocVisible"
                @click="tocVisible = !tocVisible"
            ></el-button>
            <el-button
                v-if="isEdit"
                key="editSee"
                type="primary"
                icon="el-icon-view"
                circle
                :plain="!editSee"
                @click="editSee = !editSee"
            ></el-button>
            <div class="quarantine"></div>
            <el-button
                v-if="isEdit"
                key="check"
                type="success"
                icon="el-icon-check"
                circle
                @click="toSave()"
            ></el-button>
            <el-button
                v-if="!isEdit"
                key="edit"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="toEdit()"
            ></el-button>
            <el-button
                v-if="isEdit"
                key="close"
                type="danger"
                icon="el-icon-close"
                circle
                @click="exitEdit()"
            ></el-button>
        </div>
        <imgPreview
            v-if="imgVisible"
            :visible.sync="imgVisible"
            :preview-src-list="imgList"
            :init_index="img_index"
        />
    </div>
</template>

<script>
import imgPreview from '@/components/img_preview.vue';
import { getUnitContent, updateUnitContent, uploadUnitPicture } from '@/api/note';

import { autoScrollFun } from '@/utils/scroll.js';
import { throttle } from '@/utils/index.js';
export default {
    name: 'unit',
    components: {
        imgPreview,
    },
    props: {
        phone: {
            type: String,
            required: true
        },
        unit: Object,
        course: Object,
    },
    data() {
        return {
            unit_content: {
                child: [],
                content: "",
            },

            content: '',        // 展示的内容

            fullscreen: false,  // 是否全屏
            isEdit: false,      // 是否为编辑模式
            editSee: true,      // 编辑模式是否展示预览

            imgVisible: false,  // 是否显示图片预览
            imgList: [],        // 图片列表
            img_index: 0,       // 当前显示的图片索引

            title_list: [],      // 目录列表
        };
    },
    computed: {
        mode() {
            if (!this.isEdit) {
                return "preview"
            } else if (this.editSee) {
                return "editable"
            } else {
                return "edit"
            }
        },
        editorHeight() {
            if (this.fullscreen) {
                return "100%"
            } else if (!this.isEdit && this.unit_content.child && this.unit_content.child.length) {
                return "calc(100vh - 133px)"
            }
            return "calc(100vh - 97px)"
        },
        tocVisible: {
            get() {
                return this.$store.getters["habit/getHabit"].unit_body_menu_visible
            },
            set(val) {
                this.$store.commit('habit/setHabit', {
                    unit_body_menu_visible: val
                })
            }
        }
    },
    watch: {
        fullscreen(val) {
            // if (this.$refs.mdEditor) {
            //     this.$refs.mdEditor.fullscreen = val;
            // }
            if (val) {
                document.querySelector(".edit_and_menu").style.position = "fixed"
            } else {
                document.querySelector(".edit_and_menu").style.position = "static"
            }
        },
        unit() {
            if (this.unit && this.unit.unit_no) {
                this.init()
            }
            // this.isEdit = false;
        }
    },
    methods: {
        async init() {
            await getUnitContent(this.phone, this.course, this.unit).then(res => {
                this.unit_content = res.data;
                this.content = res.data.content;
                this.GenerateMenuList();
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail || '获取章节内容失败'
                });
            })
        },

        toEdit() {
            this.isEdit = true;
        },
        exitEdit() {
            this.$confirm("确定放弃修改？", '确认信息', {
                type: 'warning',
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                this.isEdit = false;
                this.content = this.unit_content.content;
                this.GenerateMenuList();
            }).catch(action => {});
        },
        toSave() {
            this.$refs.mdEditor.save();
        },
        changeEditor(text, html) {
            this.GenerateMenuList();
        },
        async save(text, html) {
            await updateUnitContent(this.phone, this.course, this.unit, text).then(res => {
                this.unit_content.content = res.data
                this.$message.success('内容已更新')
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: err.data.detail || '接口报错，请您先本地保存好数据，稍后重试'
                });
            })
        },
        async uploadImage(event, insertImage, files) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let filesize = file.size / 1024 / 1024;
                if (filesize > 10) {
                    this.$message.error('图片大小不能超过10MB');
                    return;
                }
            }

            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                await uploadUnitPicture(this.phone, this.course, this.unit, file).then(res => {
                    insertImage({
                        url: res.data.picture_url,
                        desc: '图片描述',
                        // width: '80%',
                        // height: '80%',
                    });
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: err.data.detail || '接口报错，请稍后重试'
                    });
                })
            }
        },
        imageClick(images, currentIndex) {
            this.imgVisible = true
            this.imgList = images
            this.img_index = currentIndex
        },

        toUnit(unit) {
            this.$emit('toUnit', unit)
        },

        getMenuList() {
            const anchors = this.$refs.mdEditor.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
            const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());

            if (!titles.length) {
                this.title_list = [];
                return;
            }

            const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();

            this.title_list = titles.map((el) => ({
                title: el.innerText,
                lineIndex: el.getAttribute('data-v-md-line'),
                indent: hTags.indexOf(el.tagName),
            }));
        },
        handleAnchorClick(anchor) {
            const { mdEditor } = this.$refs;
            const { lineIndex } = anchor;

            const heading = mdEditor.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
            if (heading) {
                // 注意：如果你使用的是编辑组件的预览模式,则这里的方法名改为 previewScrollToTarget
                // mdEditor.scrollToTarget({
                //     target: heading,
                //     scrollContainer: window,
                //     top: 60,
                // });
                // mdEditor.previewScrollToTarget({
                //     target: heading,
                //     // scrollContainer: window,
                //     scrollContainer: document.getElementsByClassName('scrollbar__wrap')[1],
                //     top: 10,
                // });
                autoScrollFun(document.getElementsByClassName('scrollbar__wrap')[1], heading)
            }
        },
        GenerateMenuList(){}, // 生成目录
        
        keyupEvent(event) {
            if (event.ctrlKey && event.keyCode == 83) {
                if (this.isEdit) {
                    this.toSave()
                }
            } else if (event.keyCode == 27) {
                if (this.isEdit) {
                    this.isEdit = false;
                    this.GenerateMenuList();
                }
            }
            event.preventDefault(); //阻止默认事件
            event.stopPropagation(); //阻止冒泡
        },
        keydownEvent(event) {
            if (event.ctrlKey && event.keyCode == 83) {
                event.preventDefault(); //阻止默认事件
                event.stopPropagation(); //阻止冒泡
            } else if (event.keyCode == 27) {
                event.preventDefault(); //阻止默认事件
                event.stopPropagation(); //阻止冒泡
            }
        },
    },
    mounted() {
        this.GenerateMenuList = throttle(() => this.$nextTick(() => {
            this.getMenuList();
        }), 20)
        document.addEventListener('keyup', this.keyupEvent, false)
        document.addEventListener('keydown', this.keydownEvent, false)
    },
    beforeDestroy() {
        document.removeEventListener('keyup', this.keyupEvent, false)
        document.removeEventListener('keydown', this.keydownEvent, false)
    }
};
</script>

<style lang="less" scoped>
.body {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    .edit_and_menu {
        display: flex;
        border-bottom: 1px solid #ccc;
        background-color: #fff;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        /deep/ .v-md-editor img {
            max-width: 500px;
            // display: block;
            // margin: auto;
            width: auto;
            cursor: pointer;
        }
        .menu_list {
            width: 400px;
            padding: 10px 5px;
            box-sizing: border-box;
            border-left: 1px solid #ccc;
            .menu_item {
                margin-bottom: 10px;
                font-size: 14px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    .time {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #363636;
        margin-top: 15px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.children {
    display: flex;
    // flex-wrap: wrap;
    margin: 0 115px 0 20px;
    .el-button {
        padding: 8px 0px;
        font-size: 15px;
    }
}
</style>