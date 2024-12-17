<template>
    <section class="container">
        <transition name="fade">
            <aside class="container-aside" v-show="showMenu" @click.stop="showMenu = false">
                <div class="aside-page-left" @click.stop>
                    <div class="page-left-search" :style="'height: ' + TitleHeight + ';'">
                        <slot name="left-search"></slot>
                    </div>
                    <div class="aside-page-menu" :style="'height: ' + BodyHeight + ';'">
                        <slot name="left-menu"></slot>
                    </div>
                </div>
            </aside>
        </transition>
        <main class="container-main">
            <div class="main-page-right">
                <div class="page-right-title" :style="'height: ' + TitleHeight + ';'">
                    <el-button
                        v-if="showFoldButton"
                        class="btn"
                        type="text"
                        :icon="!showMenu ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                        @click="showMenu = !showMenu"
                    ></el-button>
                    <slot name="title"></slot>
                </div>
                <div class="page-right-body" :style="'height: ' + BodyHeight + ';'">
                    <slot></slot>
                </div>
            </div>
        </main>
    </section>
</template>

<script>
import { throttle } from '@/utils';

export default {
    name: 'layout',
    props: {
        titleHeight: {
            type: Number,
            required: false,
            default: 54
        },
        AlwaysDisplayFold: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            showMenu: false,
            isSmallScreen: false,
        }
    },
    computed: {
        TitleHeight() {
            return this.titleHeight + 'px';
        },
        BodyHeight() {
            return 'calc(100% - ' + this.TitleHeight +')'
        },
        showFoldButton() {
            if (this.AlwaysDisplayFold) {
                return true;
            } else if (this.isSmallScreen) {
                return true;
            } else {
                return false;
            }
        },
    },
    created() {
        const resize = throttle(this.resize, 10);
        window.addEventListener('resize', resize)
        this.resize()
    },
    methods: {
        resize() {
            const offsetWidth = window.document.body.offsetWidth;
            if (offsetWidth <= 1000) {
                this.isSmallScreen = true;
                this.showMenu = false;
            } else {
                this.isSmallScreen = false;
                this.showMenu = true;
            }
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    min-width: 0;

    height: 100vh;
}
.container-aside {
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 300px;
    .aside-page-left {
        height: 100%;
        overflow: hidden;
        border-right: 1px solid #dddddd;
        .page-left-search {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;
        }
        .aside-page-menu {
            width: 100%;
        }
    }
    @media (max-width: 950px) {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 3000;
        background-color: #00000011;
        
        .aside-page-left {
            width: 80%;
            max-width: 350px;
            background: #fff;
            // box-shadow: 4px 0px 10px #b0b0b0;
        }
    }
}
.container-main{
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    padding: 0;
    .main-page-right {
        height: 100%;
        overflow: hidden;
        .el-button.btn {
            font-size: 25px;
            padding: 5px 11px 10px 0px;
        }
        .page-right-title {
            padding: 10px 20px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;

            display: flex;
        }
        .page-right-body {
            width: 100%;
            overflow: hidden auto;
            box-sizing: border-box;
            // padding: 10px 10px;
        }
    }
}

.fade-enter-active {
  transition: opacity .3s;
}
.fade-enter {
  opacity: 0;
}
</style>
