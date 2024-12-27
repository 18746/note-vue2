<template>
    <div class="detail-body">
        <div class="detail-header">
            <div class="header-left">
                <img v-if="course && course.name" class="course-img" :src="course.picture" :alt="course.name">
            </div>
            <div class="header-right">
                <div class="course-info">
                    <div class="course-name">
                        {{ course.name }}
                        <span class="type">{{ type_name }}</span>
                    </div>
                    <div class="course-desc">简介：{{ course.description | description }}</div>
                </div>
                <div class="course-bottom">
                    <div class="course-heat">
                        <div>
                            更新：
                            <span class="update-count">{{ course.update_num }} 次</span>
                        </div>
                        <div>
                            点击率：
                            <span class="click-count">{{ course.click_count }} 次</span>
                        </div>
                    </div>
                    <div class="course-date">
                        <div>更新时间：{{ course.update_time }}</div>
                        <div>创建时间：{{ course.create_time }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getTypePhoneList, } from '@/api/note';
export default {
    name: 'course',
    props: {
        phone: {
            type: String,
            required: true
        },
        course: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            type_list: [],
        };
    },
    computed: {
        type_name() {
            if (this.course.type_no) {
                const type_no = this.course.type_no;
                if (this.type_list.length > 0) {
                    return this.type_list.find(item => item.type_no === type_no).name;
                }
            }
            return "默认";
        },
    },
    filters: {
        description(des) {
            return des ? des : '暂无简介';
        }
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            await getTypePhoneList(this.phone).then(res => {
                this.type_list = res.data
            }).catch(err => {
                console.error(err);
                this.$message({
                    type: 'error',
                    message: err.data.detail
                });
            })
        },
    }
};
</script>

<style lang="less" scoped>
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
                    flex-wrap: wrap;
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
                }
                .course-date {
                    font-size: 15px;
                    color: #666;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
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