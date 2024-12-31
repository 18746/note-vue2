<template>
    <div v-if="visibleDialog" ref="exportCourse" class="export-course">
        <div class="export-body">
            <el-progress type="circle" :percentage="percentage" :format="format" color="rgb(19, 206, 102)"></el-progress>
            <div class="export-info">{{ downloadedSize | formatBytes }} / {{ fileSize | formatBytes }}</div>
            <div class="export-button">
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
import { exportCourseChunks } from '@/api/note';

import { FileDownloader, sleep } from '@/utils/index.js';
export default {
    name: 'export-course',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        parame: {
            type: Object,
            default: () => ({
                data: {},
                fileName: ''
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
            downloader: null,

            playing: false,

            downloadedSize: 0,
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
            } else if (this.downloadedSize === this.fileSize) {
                return 100;
            }
            return parseInt((this.downloadedSize / this.fileSize) * 100);
        },
    },
    created() {
        this.export()
    },
    mounted() {
        document.body.appendChild(this.$refs.exportCourse)
    },
    methods: {
        format(percentage) {
            return percentage === 100 ? '完成' : `${percentage}%`;
        },

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
            this.$message({
                type: 'success',
                message: '开始导出'
            })
            await sleep(200)
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
            this.visibleDialog = false;
        },
        async down() {
            this.$message({
                type: 'success',
                message: '导出完成'
            });
            await sleep(600)
            this.cancal();
        }
    }
}
</script>

<style lang="less" scoped>
.export-course {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000022;
    z-index: 1;

    .export-body {
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
    }

    .export-info {
        font-size: 16px;
        margin-top: 16px;
        color: #333;
    }
    .export-button {
        margin-top: 10px;
        .el-button {
            // padding: 6px;
        }
    }
}
</style>
