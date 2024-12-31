<template>
    <div class="import-or-export-body">
        <div class="import-or-export-title">{{ parame.data.name }}</div>
        <el-progress :percentage="percentage" color="rgb(19, 206, 102)"></el-progress>
        <div class="import-or-export-info">
            <div class="import-or-export-progress">下载：{{ downloadedSize | formatBytes }} / {{ fileSize | formatBytes }}</div>

            <div class="import-or-export-button">
                <el-button type="text" v-if="playing" icon="el-icon-video-pause" @click="pause"></el-button>
                <el-button type="text" v-else icon="el-play el-icon-video-play" @click="player"></el-button>
                <el-button type="text" icon="el-close el-icon-close" @click="cancal"></el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { exportCourseChunks } from '@/api/note';

import { FileDownloader, sleep } from '@/utils/index.js';
export default {
    name: 'export-course',
    props: {
        ikey: {
            type: String,
            default: '',
        },
        parame: {
            type: Object,
            default: () => ({
                data: {},
                fileName: ''
            })
        },
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
            downloader: null,
            playing: false,

            downloadedSize: 0,
            fileSize: 0,
            currentChunk: 0,
            totalChunks: 0,
        }
    },
    computed: {
        percentage() {
            if (this.fileSize === 0) {
                return 0;
            } else if (this.downloadedSize === this.fileSize) {
                return 100;
            }
            return parseInt((this.downloadedSize / this.fileSize) * 100);
        },
    },
    created() {
        this.export()
    },
    methods: {
        async export() {
            this.downloader = new FileDownloader({
                request: exportCourseChunks,
                data: this.parame.data,
                fileName: this.parame.fileName,
                // chunkSize: 1024 * 100,
                progress: this.progressFun,
                cb: this.down,
            })
            this.startPlayer()
        },
        progressFun(progress) {
            this.downloadedSize = progress.downloadedSize // 已经下载的大小
            this.fileSize = progress.fileSize             // 文件大小
            this.currentChunk = progress.currentChunk     // 当前下载的块
            this.totalChunks = progress.totalChunks       // 总共的块数
        },
        async startPlayer() {
            this.playing = true;
            await sleep(400)
            this.downloader.startDownload();
        },
        player() {
            this.playing = true;
            this.downloader.resumeDownload();
        },
        pause() {
            this.playing = false;
            this.downloader.pauseDownload();
        },
        cancal() {
            this.playing = false;
            this.downloader.cancelDownload();
            this.$emit("success", this.ikey);
        },
        async down() {
            this.$message({
                type: 'success',
                message: `${this.parame.data.name} 导出完成`
            });
            await sleep(800)
            this.cancal();
        }
    }
}
</script>

<style lang="less" scoped>

</style>
