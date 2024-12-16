<template>
    <div ref="preview" class="preview-img">
        <img class="img" :style="imgStyle" :src="imgSrc" alt="">
        
        <el-button type="text" class="el-icon el-close" icon="el-icon-close" @click="closePreview"></el-button>
        <el-button type="text" class="el-icon el-left" icon="el-icon-arrow-left" @click="toLeftPage"></el-button>
        <el-button type="text" class="el-icon el-right" icon="el-icon-arrow-right" @click="toRightPage"></el-button>

        <div class="img-fun">
            <span class="img-info">{{ index + 1 }}/{{ ImgLen }}</span>
            <el-button type="text" class="el-but" icon="el-icon-zoom-in" @click="toLarge"></el-button>
            <el-button type="text" class="el-but" icon="el-icon-zoom-out" @click="toSmall"></el-button>
            <el-button type="text" class="el-but" icon="el-icon-refresh-left" @click="toLeftRotate"></el-button>
            <el-button type="text" class="el-but" icon="el-icon-refresh-right" @click="toRightRotate"></el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'img-preview',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        init_index: {
            type: Number,
            default: true,
        },
        'previewSrcList': {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        previewVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        },
        imgSrc() {
            return this.previewSrcList[this.index] || ''
        },
        ImgLen() {
            return this.previewSrcList.length
        },
        imgStyle() {
            return {
                width: `${this.size_list[this.size] * 20}%`,
                transform: `rotate(${90 * this.rotate}deg)`
            }
        }
    },
    data() {
        return {
            index: this.init_index,
            size_list: [1, 2, 3, 4, 5],
            size: 2,
            rotate: 0,
        }
    },
    mounted() {
        document.body.appendChild(this.$refs.preview)
    },
    methods: {
        closePreview() {
            this.previewVisible = false
        },
        toLeftPage() {
            this.index = this.index ? this.index - 1 : this.ImgLen - 1
            this.rotate = 0
        },
        toRightPage() {
            this.index = this.index < this.ImgLen - 1 ? this.index + 1 : 0
            this.rotate = 0
        },
        toLarge() {
            this.size = this.size < this.size_list.length - 1 ? this.size + 1 : this.size_list.length - 1
        },
        toSmall() {
            this.size = this.size ? this.size - 1 : 0
        },
        toLeftRotate() {
            this.rotate -= 1
        },
        toRightRotate() {
            this.rotate += 1
        },
    },
}
</script>

<style lang="less" scoped>
.preview-img {
    bottom: 0px;
    position: fixed;
    right: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 3000;
    background-color: #00000066;
    display: flex;
    justify-content: center;
    align-items: center;

    .img {
        width: 500px;
        max-width: unset;
    }
    .el-icon {
        width: 40px;
        height: 40px;
        font-size: 24px;
        padding: 0;
        color: #fff;
        border-radius: 50%;
        background-color: #606266;
        position: absolute;
        z-index: 2;
        &.el-close {
            top: 35px;
            right: 35px;
        }
        &.el-left {
            top: 50%;
            left: 35px;
            transform: translate(0, -50%);
        }
        &.el-right {
            top: 50%;
            right: 35px;
            transform: translate(0, -50%);
        }
    }
    .img-fun {
        border-radius: 40px;
        background-color: #606266;
        position: absolute;
        z-index: 2;
        bottom: 35px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 0px 20px;
        .img-info {
            display: inline-block;
            height: 40px;
            padding-right: 6px;
            color: #fffb;
            font-size: 18px;
            line-height: 40px;
            vertical-align: bottom;
        }
        .el-but {
            width: 30px;
            height: 40px;
            padding: 0;
            font-size: 24px;
            color: #fff;
        }
    }
}
</style>
