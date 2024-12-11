<template>
    <section class="container">
        <transition name="fade">
            <aside class="aside" v-if="!isSmallScreen || isShow" @click.stop="isShow = false">
                <div class="Page_Left">
                    <div class="Search" :style="'height: ' + TitleHeight + ';'">
                        <slot name="left-search"></slot>
                    </div>
                    <div class="Menu" :style="'height: ' + BodyHeight + ';'">
                        <slot name="left-menu"></slot>
                    </div>
                </div>
            </aside>
        </transition>
        <main class="main">
            <div class="Page_Right">
                <div class="Title" :style="'height: ' + TitleHeight + ';'">
                    <el-button
                        v-if="isSmallScreen"
                        class="btn"
                        type="text"
                        icon="el-icon-s-fold"
                        @click="isShow = !isShow"
                    ></el-button>
                    <slot name="title"></slot>
                </div>
                <div class="Body scrollbar-y" :style="'height: ' + BodyHeight + ';'">
                    <slot></slot>
                </div>
            </div>
        </main>
    </section>
</template>

<script>
function throttle(fn, delay) {
    var last = 0;
    return function() {
        var now = Date.now();
        if (now - last > delay) {
            last = now;
            fn.apply(this, arguments);
        }
    };
}
export default {
    name: 'layout',
    props: {
        titleHeight: {
            type: Number,
            required: false,
            default: 54
        }
    },
    data() {
        return {
            isShow: false,
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

    },
    created() {
        const resize = throttle(this.resize, 10);
        window.addEventListener('resize', resize)
        this.resize()
    },
    methods: {
        resize() {
            const offsetWidth = window.document.body.offsetWidth;
            console.log(offsetWidth)
            if (offsetWidth < 1000) {
                this.isSmallScreen = true;
                this.isShow = false;
            } else {
                this.isSmallScreen = false;
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
.aside {
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 300px;
    .Page_Left {
        height: 100%;
        overflow: hidden;
        border-right: 1px solid #dddddd;
        .Search {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;
        }
        .Menu {
            width: 100%;
        }
    }
    @media (max-width: 1000px) {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
        
        .Page_Left {
            width: 80%;
            background: #fff;
            box-shadow: 4px 0px 10px #b0b0b0;
        }
    }
}
.main{
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
    .Page_Right {
        height: 100%;
        overflow: hidden;
        .el-button.btn {
            font-size: 25px;
            padding: 5px 11px 10px 0px;
        }
        .Title {
            padding: 10px 20px;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;

            display: flex;
        }
        .Body {
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
