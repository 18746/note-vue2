<template>
    <div v-if="visibleDialog && selectFlag" ref="importCourse" class="import-course">
        <div class="import-body">
            <el-progress type="circle" :percentage="percentage" :format="format" color="rgb(19, 206, 102)"></el-progress>
            <div class="import-info">导入进度：{{ uploadSize | formatBytes }} / {{ fileSize | formatBytes }}</div>
            <div class="import-button">
                <el-button-group>
                    <el-button v-if="playing" type="success" icon="el-icon-video-pause" @click="pause"></el-button>
                    <el-button v-else type="success" icon="el-icon-video-play" @click="player"></el-button>
                    <el-button type="danger" icon="el-icon-close" @click="cancal"></el-button>
                </el-button-group>
            </div>
        </div>
    </div>
</template>

<script>
import { importCourseChunks, importCourseChunksDone } from '@/api/note';

import { FileUploader, sleep } from '@/utils/index.js';
export default {
    name: 'import-course',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        parame: {
            type: Object,
            default: () => ({
                data: {},
            })
        }
    },
    filters: {
        formatBytes(value) {
            if (value === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(value) / Math.log(k));

            const num = value / Math.pow(k, i);
            if (num >= 1000) {
                return num.toPrecision(4) + ' ' + sizes[i];
            }
            return num.toPrecision(3) + ' ' + sizes[i];
        }
    },
    data() {
        return {
            uploader: null,
            selectFlag: false,

            playing: false,

            uploadSize: 0,
            fileSize: 0,
            currentChunk: 0,
            totalChunks: 0,
        }
    },
    computed: {
        visibleDialog: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('update:visible', val);
            }
        },
        percentage() {
            if (this.fileSize === 0) {
                return 0;
            } else if (this.uploadSize === this.fileSize) {
                return 100;
            }
            return parseInt((this.uploadSize / this.fileSize) * 100);
        },
    },
    created() {
        this.import()
    },
    mounted() {
    },
    methods: {
        format(percentage) {
            return percentage === 100 ? '完成' : `${percentage}%`;
        },

        async import() {
            let input = document.createElement("input")
            input.type = "file"
            input.accept = ".zip"
            input.onchange = (e) => {
                this.selectFlag = true
                this.$nextTick(() => {
                    document.body.appendChild(this.$refs.importCourse)
                })
                let file = e.target.files[0]
                if (file.size > 1024 * 1024 * 1024) {
                    this.$message({
                        type: 'error',
                        message: '文件大小不能超过1GB'
                    });
                    return
                }
                if (file.name.split('.').pop() != 'zip') {
                    this.$message({
                        type: 'error',
                        message: '文件格式不正确，必须为zip文件'
                    });
                    return
                }

                this.uploader = new FileUploader({
                    request: importCourseChunks,
                    requestDone: importCourseChunksDone,
                    data: this.parame.data,
                    file: file,
                    // chunkSize: 1024 * 200,
                    progress: this.progressFun,
                    errorCB: this.errorFun,
                    cb: this.down
                })
                this.startUpload()
                
                input.value = ''
                input = null
            }
            input.click()
        },
        progressFun(progress) {
            this.uploadSize = progress.uploadSize     // 已经上传的大小
            this.fileSize = progress.fileSize             // 文件大小
            this.currentChunk = progress.currentChunk     // 当前上传的块
            this.totalChunks = progress.totalChunks       // 总共的块数
        },
        async startUpload() {
            this.playing = true;
            this.$message({
                type: 'success',
                message: '开始导入'
            })
            await sleep(400)
            this.uploader.startUpload();
        },
        player() {
            this.playing = true;
            this.uploader.resumeUpload();
        },
        pause() {
            this.playing = false;
            this.uploader.pauseUpload();
        },
        cancal() {
            this.playing = false;
            this.uploader.cancelUpload();
            this.visibleDialog = false;
        },
        errorFun(err) {
            this.playing = false;
            this.$message({
                type: 'error',
                message: err.data.detail || '导入失败，请重试'
            })
        },
        async down(res) {
            this.$message({
                type: 'success',
                message: '导入成功'
            });
            this.$emit('success', res.data);
            await sleep(800)
            this.cancal();
        },
    }
}
</script>

<style lang="less" scoped>
.import-course {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000022;
    z-index: 9999;

    .import-body {
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
    }

    .import-info {
        font-size: 16px;
        margin-top: 16px;
        color: #333;
    }
    .import-button {
        margin-top: 10px;
    }
}
</style>
