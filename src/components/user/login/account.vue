<template>
    <div class="login-body">
        <div v-if="title" class="title">{{ title }}</div>
        <slot></slot>
        <div class="bottom-button" :style="'margin-top: ' + bottomTop + 'px;'">
            <div class="bottom-button-left">
                <slot name="button-left"></slot>
            </div>
            <div class="bottom-button-right">
                <slot name="button-right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'account',
    props: {
        bottomTop: {
            type: Number,
            required: false,
            default: 40
        },
        title: {
            type: String,
            required: false,
            default: ""
        }
    },
    data() {
        return { }
    },
}
</script>

<style lang="less" scoped>
.login-body {
    width: 350px;
    background-color: #65fbe3c7;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    right: 40px;
    translate: 0 -50%;
    padding: 30px 45px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
        text-align: center;
        margin-bottom: 22px;
        font-size: 20px;
        color: #000000c4;
    }

    &:hover {
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }

    .bottom-button {
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 900px) {
        top: 50%;
        left: 50%;
        translate: -50% -50%;
    }
}

/deep/ .el-form .el-form-item:last-child {
    margin-bottom: 0;
}
</style>
