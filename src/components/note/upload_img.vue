<template>
    <div class="upload_img">
        <div class="body_img" v-for="(url, index) in ImgList">
            <img :src="url" alt="" class="img" />
            <div class="icon">
                <div class="body">
                    <i class="el-icon el-icon-zoom-in" @click="onPreview(url)"></i>
                    <i v-if="!is_init_url" class="el-icon el-icon-delete" @click="deleteImg(index)"></i>
                </div>
            </div>
        </div>
        <div
            v-if="!view"
            class="select-body"
            :style="file_list.length == 0 ? 'display: inline-block' : 'display: none'"
            @click="clickFile"
        >
            <i class="el-icon el-icon-upload"></i>
            <input ref="file" class="file" type="file" @change="selectFiles" />
        </div>
        <imgPreview
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            :preview-src-list="[dialogImageUrl]"
            :init_index="0"
        />
    </div>
</template>

<script>
import imgPreview from '@/components/img_preview.vue';
export default {
    name: 'upload-img',
    components: {
        imgPreview,
    },
    props: {
        type_list: {
            type: Array,
            default: () => ['image/jpeg', 'image/png', 'image/jpg'],
        },
        view: {
            type: Boolean,
            default: false,
        },
        file_size: {
            type: Number,
            default: 5,
        },
        file_list: {
            type: Array,
            default: () => [],
        },
        init_url: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            img_list: [],

            dialogVisible: false,
            dialogImageUrl: "",
        }
    },
    computed: {
        ImgList() {
            if (this.img_list.length > 0) {
                return this.img_list
            } else if (this.init_url) {
                return [this.init_url]
            }
            return []
        },
        is_init_url() {
            if (this.ImgList.length > 0 && this.file_list.length == 0) {
                return true
            }
            return false
        }
    },
    created() { },
    methods: {
        clickFile() {
            this.$refs.file.click()
        },
        async selectFiles(e) {
            const file_list = e.target.files

            if (this.selectFileFormat(file_list) === true) {
                for (let i = 0; i < file_list.length; i++) {
                    await this.selectFileInit(file_list[i]).then(res => {
                        this.img_list.push(res.base64Str)
                        this.file_list.push(res.file)
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
            this.$refs.file.value = ""
        },
        selectFileFormat(file_list) {
            for (let i = 0; i < file_list.length; i++) {
                const file = file_list[i]
                const isJpgOrPng = this.type_list.includes(file.type);
                if (!isJpgOrPng) {
                    this.$message.error(`文件格式不正确，只能为 ${this.type_list.join('、')} 格式`);
                    return false;
                }
            }
            if (this.file_size !== 0) {
                for (let i = 0; i < file_list.length; i++) {
                    const file = file_list[i]
                    const isLt5M = file.size / 1024 / 1024 < this.file_size;
                    if (!isLt5M) {
                        this.$message.error(`图片大小限制${this.file_size}M`)
                        return false;
                    }
                }
            }
            return true;
        },
        selectFileInit(file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    // 图片base64化
                    const base64Str = e.target.result
                    resolve({
                        file: file,
                        base64Str: base64Str,
                    })
                };
                reader.onerror = (e) => {
                    reject(e)
                };
            })
        },

        onPreview(file) {
            this.dialogImageUrl = file;
            this.dialogVisible = true;
        },
        deleteImg(index) {
            this.img_list.splice(index, 1);
            this.file_list.splice(index, 1);
        },

        getFileList() {
            return [...this.file_list];
        }
    }
}
</script>

<style lang="less" scoped>
.body_img {
    width: 150px;
    height: 150px;
    display: inline-block;
    border: 1px dashed #ccc;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    margin: 0 10px 10px 0;

    .img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .icon {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-color: #00000059;
        opacity: 0;
        .body {
            display: flex;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .el-icon {
                font-size: 25px;
                color: #fff;
                cursor: pointer;
                margin-right: 10px;
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
    }
    
    &:hover .icon {
        z-index: 2;
        opacity: 1;
        transition: opacity 0.2s;
    }
}
.select-body {
    width: 150px;
    height: 150px;
    display: inline-block;
    border: 1px dashed #ccc;
    border-radius: 6px;
    text-align: center;
    position: relative;

    vertical-align: top;

    cursor: pointer;
    &:hover {
        border-color: #409EFF;
    }

    .el-icon {
        font-size: 67px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #C0C4CC;
    }

    .file {
        display: none;
    }
}
</style>
