import Vue from "vue";
import Router from "vue-router";

const markdown = () => import('@/views/markdown')

Vue.use(Router);

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err);
}

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            redirect: '/login'
        }, {
            path: "/login",
            name: "login",
            component: () => import('@/views/login'),
        }, {
            path: "/home",
            name: "home",
            component: () => import('@/views/home'),
        }, {
            path: "/markdown",
            name: "markdown",
            component: markdown,
        },
        {
            path: "/note",
            name: "note",
            component: () => import('@/components/null.vue'),
            redirect: '/note/home',
            children: [{
                path: "home",
                name: "home",
                component: () => import('@/views/note'),
            }, {
                path: ":course_no",
                name: "detail",
                component: () => import('@/views/note/course_detail.vue'),
            }, {
                path: ":course_no/:unit_no",
                name: "unit-detail",
                component: () => import('@/views/note/unit_detail.vue'),
            }]
        },
        // {
        //     path: "manage",
        //     name: "manage",
        //     // component: () => import('@/views/manage'),
        // },
    ],
});

