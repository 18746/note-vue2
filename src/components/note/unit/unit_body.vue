<template>
    <div class="body">
        <v-md-editor
            ref="mdEditor"
            :mode="mode"
            v-model="content"
            placeholder="在此输入内容"
            left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code"
            right-toolbar=""
            :include-level="[1, 2, 3, 4]"
            height="calc(100vh - 97px)"
            @save="save"
            :disabled-menus="[]"
            @image-click="imageClick"
            @upload-image="uploadImage"
        ></v-md-editor>
        <el-empty v-if="!isEdit && !content" class="empty" description="点击编辑，开始记录你的笔记" :image-size="150"></el-empty>
        <div class="time">
            <div>更新时间：{{ unit.update_time }}</div>
            <div>创建时间：{{ unit.create_time }}</div>
        </div>
        <!-- <div class="children">
            <el-button
                type="text"
                v-for="item in unit_content.child"
                :key="item.unit_no"
                @click="handleNodeClick(item)"
            >{{ item.name }}</el-button>
        </div> -->
        <div class="my-button-bottom">
            <el-button
                v-if="isEdit"
                key="editSee"
                type="primary"
                icon="el-icon-view"
                circle
                :plain="!editSee"
                @click="editSee = !editSee"
            ></el-button>
            <el-button
                v-if="isEdit"
                key="tocVisible"
                type="primary"
                icon="el-icon-notebook-1"
                circle
                :plain="!tocVisible"
                @click="tocVisible = !tocVisible"
            ></el-button>
            <el-button
                key="fullscreen"
                type="primary"
                :icon="!fullscreen ? 'el-icon-full-screen' : 'el-icon-crop'"
                circle
                :plain="!fullscreen"
                @click="fullscreen = !fullscreen"
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
            tocVisible: false,  // 是否显示目录
            isEdit: false,      // 是否为编辑模式
            editSee: true,      // 编辑模式是否展示预览

            imgVisible: false,  // 是否显示图片预览
            imgList: [],        // 图片列表
            img_index: 0,       // 当前显示的图片索引
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
    },
    watch: {
        fullscreen(val) {
            if (this.$refs.mdEditor) {
                this.$refs.mdEditor.fullscreen = val;
            }
        },
        tocVisible(val) {
            if (this.$refs.mdEditor) {
                this.$refs.mdEditor.tocVisible = val;
            }
        },
        unit() {
            if (this.unit && this.unit.unit_no) {
                this.init()
            }
            this.isEdit = false;
        }
    },
    methods: {
        async init() {
            await getUnitContent(this.phone, this.course, this.unit).then(res => {
                this.unit_content = res.data;
                this.content = res.data.content;
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
            }).catch(action => {});
        },
        toSave() {
            this.$refs.mdEditor.save();
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
            console.log(event)
            console.log(insertImage)
            console.log(files)
            await uploadUnitPicture(this.phone, this.course, this.unit, files[0]).then(res => {
                console.log(res.data.path)
                insertImage({
                    url: res.data.path,
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
        },
        imageClick(images, currentIndex) {
            console.log(images)
            console.log(currentIndex)
            this.imgVisible = true
            this.imgList = images
            this.img_index = currentIndex
        },
    }
};
</script>

<style lang="less" scoped>
.body {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    /deep/ .v-md-editor img {
        max-width: 800px;
        display: block;
        margin: auto;
        width: 80%;
        cursor: pointer;
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
    flex-wrap: wrap;
    .el-button {
        padding: 8px 0px;
        font-size: 15px;
    }
}
</style>