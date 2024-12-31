<template>
    <div class="import-or-export-body">
        <div class="import-or-export-title">{{ parame.file && parame.file.name }}</div>
        <el-progress :percentage="percentage" color="rgb(19, 206, 102)"></el-progress>
        <div class="import-or-export-info">
            <div class="import-or-export-progress">导入：{{ uploadSize | formatBytes }} / {{ fileSize | formatBytes }}</div>

            <div class="import-or-export-button">
                <el-button type="text" v-if="playing" icon="el-icon-video-pause" @click="pause"></el-button>
                <el-button type="text" v-else icon="el-play el-icon-video-play" @click="player"></el-button>
                <el-button type="text" icon="el-close el-icon-close" @click="cancal"></el-button>
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
        parame: {
            type: Object,
            default: () => ({
                data: {},
                file: null,
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
            playing: false,

            uploadSize: 0,
            fileSize: 0,
            currentChunk: 0,
            totalChunks: 0,
        }
    },
    computed: {
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
        this.import();
    },
    methods: {
        async import() {
            this.uploader = new FileUploader({
                request: importCourseChunks,
                requestDone: importCourseChunksDone,
                data: this.parame.data,
                file: this.parame.file,
                // chunkSize: 1024 * 200,
                progress: this.progressFun,
                errorCB: this.errorFun,
                cb: this.down
            })
            this.startUpload()
        },
        progressFun(progress) {
            this.uploadSize = progress.uploadSize     // 已经上传的大小
            this.fileSize = progress.fileSize             // 文件大小
            this.currentChunk = progress.currentChunk     // 当前上传的块
            this.totalChunks = progress.totalChunks       // 总共的块数
        },
        async startUpload() {
            this.uploadSize = 0;
            this.fileSize = 0;
            this.currentChunk = 0;
            this.totalChunks = 0;

            this.playing = true;
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
            this.$emit('error', this.parame.file.name);
        },
        errorFun(err) {
            this.playing = false;
            this.$message({
                type: 'error',
                message: err.data.detail || '导入失败，请重试'
            })
            this.cancal();
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

</style>
