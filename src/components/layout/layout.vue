<template>
    <section class="container" :style="container_style">
        <aside
            v-if="showLeft"
            class="container-aside"
            :style="aside_style"
            @click.stop="showMenu = false"
        >
            <div class="aside-page-left" :style="aside_page_left_width" @click.stop>
                <div
                    class="page-left-search"
                    :style="title_height"
                >
                    <slot name="left-search"></slot>
                </div>
                <div
                    class="aside-page-menu"
                    :style="body_height"
                >
                    <slot name="left-menu"></slot>
                </div>
            </div>
        </aside>
        <main class="container-main" :style="container_main_style">
            <div class="main-page-right">
                <div
                    class="page-right-title"
                    :style="title_height"
                >
                    <el-button
                        v-if="showLeft"
                        class="btn"
                        type="text"
                        :icon="!showMenu ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                        @click="showMenu = !showMenu"
                    ></el-button>
                    <slot name="title"></slot>
                </div>
                <div
                    class="page-right-body my-scrollbar-y"
                    :style="body_height"
                >
                    <slot></slot>
                </div>
            </div>
        </main>
    </section>
</template>

<script>
export default {
    name: 'layout',
    props: {
        titleHeight: {
            type: Number,
            default: 54
        },
        menuWidth: {
            type: Number,
            default: 300
        },
        showLeft: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            showMenu: false,
        }
    },
    computed: {
        title_height() {
            return {
                height: `${this.titleHeight}px`
            }
        },
        body_height() {
            return {
                height: `calc(100vh - ${this.titleHeight}px)`
            }
        },

        screenSize() {
            return this.$store.getters["habit/getHabit"].ScreenSize
        },
        isSmallScreen() {
            return this.screenSize <= 1000
        },

        aside_style() {
            if (this.showMenu) {
                if (this.isSmallScreen) {
                    return {
                        width: '100vw !important',
                        paddingLeft: `${this.menuWidth}px`,
                        zIndex: 9999,
                    }
                } else {
                    return {
                        width: `${this.menuWidth}px`,
                        paddingLeft: `${this.menuWidth}px`,
                    }
                }
            }
            return {
                width: `${this.menuWidth}px`
            }
        },
        container_main_style() {
            if (this.showMenu) {
                if (!this.isSmallScreen) {
                    return {
                        paddingLeft: `${this.menuWidth}px`,
                    }
                }
            }
            return ""
        },
        aside_page_left_width() {
            return {
                width: `${this.menuWidth}px`
            }
        },
        container_style() {
            return {
                width: `calc(100vw + ${this.menuWidth}px)`,
                left: `${-this.menuWidth}px`,
                paddingLeft: `${this.menuWidth}px`,
            }
        },
    },
    watch: {
        screenSize: {
            handler(newVal, oldVal) {
                if (this.showLeft) {
                    if (newVal <= 1000) {
                        this.showMenu = false;
                    } else {
                        this.showMenu = true;
                    }
                }
            },
            immediate: true
        }
    },
    created() { },
    methods: { },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.container {
    display: flex;
    height: 100vh;
    position: relative;
    transition: all 0.15s ease-in-out;
    width: 100vw;
    left: 0px;
    overflow: hidden;
    box-sizing: border-box;
}
.container-aside {
    position: absolute;
    left: 0;
    background-color: #00000011;
    transition: all 0.15s ease-in-out;
    padding-left: 0px;
    .aside-page-left {
        height: 100%;
        overflow: hidden;
        border-right: 1px solid #dddddd;
        background-color: #fff;
        box-sizing: border-box;

        .page-left-search {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;
        }
        .aside-page-menu {
            width: 100%;
        }
    }
}
.container-main{
    flex: 1;
    padding: 0;
    transition: all 0.15s ease-in-out;
    .main-page-right {
        height: 100%;
        overflow: hidden;
        .el-button.btn {
            font-size: 25px;
            padding: 0 10px 0 0;
        }
        .page-right-title {
            padding: 5px 20px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;

            display: flex;
            align-items: center;
        }
        .page-right-body {
            width: 100%;
            overflow: hidden auto;
            box-sizing: border-box;
        }
    }
}
</style>
