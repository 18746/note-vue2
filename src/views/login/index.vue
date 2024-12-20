<template>
    <div class="login" :style="style">
        <transition name="bounce" mode="out-in">
            <loginCom
                v-if="loginOrRegister === 'login'"
                ref="loginCom"
                key="login"
                @changeTab="changeTab"
            />
            <registerCom
                v-else-if="loginOrRegister === 'register'"
                key="register"
                @changeTab="changeTab"
                @phoneToLogin="phoneToLogin"
            />
            <forgetPwdCom
                v-else-if="loginOrRegister === 'forgetPwd'"
                key="forgetpwd"
                @changeTab="changeTab"
                @phoneToLogin="phoneToLogin"
            />
        </transition>
    </div>
</template>

<script>
import loginCom from '@/components/user/login/login';
import registerCom from '@/components/user/login/register';
import forgetPwdCom from '@/components/user/login/forgetPwd';
import { sleep, getURL } from '@/utils/index.js';
export default {
    name: 'login',
    components: {
        loginCom,
        registerCom,
        forgetPwdCom,
    },
    data() {
        return {
            // 切换
            loginOrRegister: "login",
            style: {
                "background-image": `url(${ getURL('/course/picture/background') })`
            }
        }
    },
    watch: {
        $route: {
            handler(to, from) {
                let toPath = to.query.to || 'login'
                if (toPath) {
                    if (toPath == 'login') {
                        this.loginOrRegister = 'login'
                    } else if (toPath == 'register') {
                        this.loginOrRegister = 'register'
                    } else if (toPath == 'forgetPwd') {
                        this.loginOrRegister = 'forgetPwd'
                    }
                }
            },
            immediate: true,
        },
    },
    created() {
        
    },
    methods: {
        changeTab(tab) {
            this.$router.replace({
                path: '/login',
                query: { to: tab }
            })
        },
        async phoneToLogin(phone) {
            this.$router.replace({
                path: '/login',
                query: { to: 'login' }
            })
            await sleep(520)
            // 等待动画结束再赋值
            this.$refs.loginCom.init(phone)
        },
    }
}
</script>

<style lang="less" scoped>
.login {
    // background-image: url('~@/assets/img/school-supplie.jpg');
    // background-image: url('http://127.0.0.1:8070/course/picture/background');
    height: 100%;
    background-size: cover;        // 原始大小
    background-position: center;   // 水平垂直居中
    background-repeat: no-repeat;  // 不重复
}

.bounce-enter-active {
    animation: bounce-in .5s;
}
.bounce-leave-active {
    animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
    0% {
        scale: 0;
        opacity: 0;
    }
    50% {
        scale: 1.1;
        opacity: 1;
    }
    100% {
        scale: 1;
        opacity: 1;
    }
}

</style>