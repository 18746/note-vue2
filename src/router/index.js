import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err);
}
const routers = new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            redirect: '/login'
        }, {
            path: "/ceshi",
            name: "ceshi",
            component: () => import('@/views/ceshi'),
            meta: {
                title: "测试页",
            }
        }, {
            path: "/login",
            name: "login",
            component: () => import('@/views/login'),
            meta: {
                title: "注册登录",
            }
        }, {
            path: "/note",
            name: "note",
            component: () => import('@/components/null.vue'),
            redirect: '/note/',
            children: [{
                path: "/",
                name: "note",
                component: () => import('@/views/note/note.vue'),
                meta: {
                    title: "我的",
                }
            }, {
                path: ":course_no",
                name: "detail",
                component: () => import('@/views/note/course_detail.vue'),
                meta: {
                    title: "课程",
                }
            }, {
                path: ":course_no/:unit_no",
                name: "unit-detail",
                component: () => import('@/views/note/unit_detail.vue'),
                meta: {
                    title: "章节",
                }
            }]
        },
        // {
        //     path: "manage",
        //     name: "manage",
        //     // component: () => import('@/views/manage'),
        // },
    ],
});

import store from "@/store/index.js";
import { isTokenNotExpire } from '@/utils/user.js'
routers.beforeEach((to, from, next) => {
    if (store.getters["user/getToken"]) {
        if (isTokenNotExpire(store.getters["user/getToken"].update_time, store.getters["user/getToken"].time_limit)) {
            if (!store.getters["user/getUser"]) {
                store.dispatch('user/getUserInfo')
            }
            if (to.path === '/login' || to.path === '/') {
                next("/note")
            } else {
                next()
            }
            return
        }
    }
    store.commit('user/setInfo', null)
    store.commit('user/setToken', null)
    if (to.path === '/login') {
        next()
    } else {
        next('/login')
    }
})
routers.afterEach((to, from) => {
    const title = to.meta.title || '';
    document.title = title ? title + "-笔记" : '笔记'
});
export default routers

