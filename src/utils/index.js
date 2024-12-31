import CryptoJS from 'crypto-js'

export const sleep = (time) => new Promise((resolve) => {
    const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve()
    }, time)
})

export const syncDelayFuns = (time, callbacks) => {
    const promiList = []
    const isFunList = Array.isArray(callbacks)
    if (isFunList) {
        callbacks.forEach((item) => promiList.push(item()))
    } else {
        promiList.push(callbacks())
    }

    promiList.push(sleep(time))
    return new Promise((resolve, reject) => {
        Promise.all(promiList).then((resList) => {
            if (isFunList) {
                resolve(resList.slice(0, -1))
            } else {
                resolve(resList[0])
            }
        }).catch((err) => reject(err))
    })
}

export const doURL = (url) => {
    return process.env.BASE_API + url
}

export const unURL = (url) => {
    return url.replace(process.env.BASE_API, "");
}

// 防抖，一定时间内只允许执行一次（只执行第一次）
export const debounce = (fn, delay) => {
    var timer = undefined;
    return function() {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}

// 节流，一定时间内只允许执行一次（只执行最后一次）
export const throttle = (fn, delay) => {
    var last = 0;
    return function() {
        var now = Date.now();
        if (now - last > delay) {
            last = now;
            fn.apply(this, arguments);
        }
    };
}

export class FileDownloader {
    constructor({request, data, fileName, chunkSize = 5 * 1024 * 1024, progress, cb}) {
        this.request = request;    // 请求方法
        this.data = data;          // 请求参数
        this.fileName = fileName;      // 文件名
        this.chunkSize = chunkSize;    // 每块大小
        this.fileSize = 0;             // 文件大小
        this.totalChunks = 0;          // 总块数
        this.currentChunk = 0;         // 当前下载的块
        this.downloadedSize = 0;       // 已经下载的文件大小
        this.chunks = [];              // 下载的块
        this.abortController = new AbortController();  
        this.paused = false;           // 是否暂停
        this.progress = progress       // 进度回调
        this.cb = cb                   // 成功回调
    }
    // 获取文件大小，初始化下载
    async getFileSize() {
        let response = await this.request(this.data, {
            signal: this.abortController.signal,
            headers: { Range: "bytes=0-1" },
        });
        response = await this.request(this.data, {
            signal: this.abortController.signal,
            headers: { Range: "bytes=0-1" },
        });
        const contentLength = response.headers.get("content-range").split("/")[1];
        this.fileSize = parseInt(contentLength);
        this.totalChunks = Math.ceil(this.fileSize / this.chunkSize);

        this.progress && this.progress({
            downloadedSize: this.downloadedSize, // 已经下载的大小
            fileSize: this.fileSize,             // 文件大小
            currentChunk: this.currentChunk,     // 当前下载的块
            totalChunks: this.totalChunks + 1,       // 总共的块数
        })
    }
    // 下载文件块
    async downloadChunk(chunkIndex) {
        const start = chunkIndex * this.chunkSize;
        const end = Math.min(this.fileSize, (chunkIndex + 1) * this.chunkSize - 1);

        // await sleep(1000);

        const response = await this.request(this.data, {
            signal: this.abortController.signal,
            headers: { Range: `bytes=${start}-${end}` },
        });

        const blob = response.data;
        this.chunks[chunkIndex] = blob;
        this.downloadedSize += blob.size;
        this.currentChunk++;
        
        this.progress && this.progress({
            downloadedSize: this.downloadedSize, // 已经下载的大小
            fileSize: this.fileSize,             // 文件大小
            currentChunk: this.currentChunk + 1, // 当前下载的块
            totalChunks: this.totalChunks,       // 总共的块数
        });
    
        if (!this.paused && this.currentChunk < this.totalChunks) {
            this.downloadChunk(this.currentChunk);
        } else if (this.currentChunk === this.totalChunks) {
            this.mergeChunks();
        }
    }
    // 开始下载
    async startDownload() {
        if (this.chunks.length === 0) {
            await this.getFileSize();
        }
        this.downloadChunk(this.currentChunk);
    }
    // 暂停下载
    pauseDownload() {
        this.paused = true;
    }
    // 恢复下载
    resumeDownload() {
        this.paused = false;
        this.downloadChunk(this.currentChunk);
    }
    // 取消下载
    cancelDownload() {
        this.abortController.abort();
        this.reset();
    }
    // 合并文件
    async mergeChunks() {
        const blob = new Blob(this.chunks, { type: "application/octet-stream" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            this.cb && this.cb({
                downState: 1
            })
            this.reset();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    // 重置下载
    reset() {
        this.chunks = [];
        this.paused = false;
        this.fileName = '';
        this.fileSize = 0;
        this.totalChunks = 0;
        this.currentChunk = 0;
        this.downloadedSize = 0;
    }
}


export class FileUploader {
    constructor({request, requestDone, data, file, chunkSize = 5 * 1024 * 1024, progress, errorCB, cb}) {
        this.request = request;    // 请求方法
        this.requestDone = requestDone // 请求完成方法
        this.data = data;          // 请求参数
        this.file = file;          // 文件
        this.hash = '';            // 文件hash
        this.chunkSize = chunkSize;    // 每块大小
        this.uploadSize = 0;           // 已经上传的文件大小
        this.fileSize = 0;             // 文件大小
        this.totalChunks = 0;          // 总块数
        this.currentChunk = 0;         // 当前上传的块
        this.abortController = new AbortController();  
        this.paused = false;           // 是否暂停
        this.progress = progress       // 进度回调
        this.errorCB = errorCB         // 失败回调
        this.cb = cb                   // 成功回调
    }
    // 获取文件大小，初始化上传
    async getFileSize() {
        this.fileSize = this.file.size;
        this.totalChunks = Math.ceil(this.fileSize / this.chunkSize);

        this.progress && this.progress({
            uploadSize: this.uploadSize,
            fileSize: this.fileSize,
            currentChunk: this.currentChunk,
            totalChunks: this.totalChunks,
        })

        return new Promise((resolve) => {
            let read = new FileReader();
            read.readAsArrayBuffer(this.file)
            read.onload = async () => {
                let sha256 = CryptoJS.SHA256(read.result).toString()
                this.hash = sha256;
                resolve()
            }
        })
        
    }
    // 上传文件块
    async uploadChunk(chunkIndex) {
        const start = chunkIndex * this.chunkSize;
        const end = Math.min(this.fileSize, (chunkIndex + 1) * this.chunkSize);

        // await sleep(1000)

        await this.request({
            ...this.data,
            filename: this.file.name,
            file: this.file.slice(start, end),
            hash: this.hash,
            chunk_index: chunkIndex,
        }, {
            signal: this.abortController.signal,
        }).catch(err => {
            this.errorCB && this.errorCB(err)
            throw err;
        });

        this.uploadSize += end - start;
        this.currentChunk++;

        this.progress && this.progress({
            uploadSize: this.uploadSize,
            fileSize: this.fileSize,
            currentChunk: this.currentChunk,
            totalChunks: this.totalChunks,
        })

        if (!this.paused && this.currentChunk < this.totalChunks) {
            this.uploadChunk(this.currentChunk);
        } else if (this.currentChunk === this.totalChunks) {
            this.mergeChunks();
        }
    }
    // 开始上传
    async startUpload() {
        if (this.totalChunks === 0) {
            await this.getFileSize();
        }
        this.uploadChunk(this.currentChunk);
    }
    // 暂停上传
    pauseUpload() {
        this.paused = true;
    }
    // 恢复上传
    resumeUpload() {
        this.paused = false;
        this.uploadChunk(this.currentChunk);
    }
    // 取消上传
    cancelUpload() {
        this.abortController.abort();
        this.reset();
    }
    // 上传文件完成
    async mergeChunks() {
        await this.requestDone({
            ...this.data,
            filename: this.file.name,
            hash: this.hash,
        }, {
            signal: this.abortController.signal,
        }).then(res => {
            this.cb && this.cb(res)
            this.reset();
        }).catch(err => {
            this.errorCB && this.errorCB(err)
        });
    }
    // 重置上传
    reset() {
        this.file = "";
        this.hash = '';
        this.chunkSize = 0;
        this.fileSize = 0;
        this.uploadSize = 0;
        this.totalChunks = 0;
        this.currentChunk = 0;
        this.paused = false;           // 是否暂停
    }
}
