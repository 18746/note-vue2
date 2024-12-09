<template>
    <div class="home">
        <courseDetail ></courseDetail>
    </div>
</template>

<script>
import { getType, getCourse, getUnit } from '@/api/note';

import { getCourseImg } from '@/utils/index.js';
import courseDetail from '@/components/note/course/detail_body.vue';
export default {
    name: 'note-detail',
    data() {
        return { };
    },
    components: {
        courseDetail
    },
    created() {
        // console.log();
     },
    mounted() { },
    methods: { }
};
</script>

<style lang="less" scoped>
.home {
    min-width: 520px;
    width: 80%;
    margin: 0 auto;
    padding-top: 70px;
}
.detail-body {
    .detail-header {
        display: flex;
        margin-bottom: 35px;

        .header-left {
            width: 320px;
            height: 300px;
            flex-shrink: 0;

            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            .course-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        .header-right {
            height: auto;
            box-sizing: border-box;
            padding-left: 25px;
            flex-grow: 1;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;
            .course-info {
                display: flex;
                flex-direction: column;
                .course-name {
                    font-size: 30px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    .type {
                        display: inline-block;
                        font-size: 12px;
                        vertical-align: super;
                        border-radius: 40px;
                        padding: 0px 8px;
                        background-color: #9db3ff;
                        color: #fff;
                        line-height: 20px;
                        font-weight: normal;
                    }
                }
                .course-desc {
                    font-size: 18px;
                    color: #3d3d3d;
                    margin-bottom: 10px;
                }
            }
            .course-bottom {
                max-width: 600px;
                .course-heat {
                    font-size: 15px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    .update-count {
                        color: #22d500;
                        border: 1px solid #d9ecff;
                        border-radius: 4px;
                        padding: 0 8px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        background-color: #eafff9;
                    }
                    .click-count {
                        color: #409eff;
                        border: 1px solid #d9ecff;
                        border-radius: 4px;
                        padding: 0 8px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        background-color: #ecf5ff;
                    }
                    & > * {
                        width: 215px;
                    }
                }
                .course-date {
                    font-size: 15px;
                    color: #666;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    & > * {
                        width: 215px;
                    }
                }
            }
        }
        @media (max-width: 1000px) {
            display: block;
            .header-left {
                width: 100%;
                text-align: center;
            }
            .header-right {
                padding-left: 0px;
                .course-info {
                    .course-name {
                        text-align: center;
                        margin-bottom: 30px;
                        margin-top: 25px;
                    }
                    .course-desc {
                        margin-bottom: 20px;
                    }
                }
            }
        }
    }
}
</style>