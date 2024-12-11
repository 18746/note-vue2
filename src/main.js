// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

import store from "./store/index.js";

import router from "./router";

// Vue.forceUpdate()
// 全局样式
import "./style/index.less";

// 引入 less
// npm install less@3.0.4 --save
// npm install less-loader@5.0.0 --save
import "less";


// 引入 element-ui
// npm i element-ui -S
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);


import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 引入主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// 引入highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

Vue.use(VMdPreview);


import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
// // 引入主题
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
// // highlightjs
// import hljs from 'highlight.js';

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

VMdEditor.Codemirror = Codemirror;

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
Vue.use(VMdEditor);


import { isTokenNotExpire } from '@/utils/user.js'
router.beforeEach((to, from, next) => {
    if (store.state.user.token) {
        if (isTokenNotExpire(store.state.user.token.update_time, store.state.user.token.time_limit)) {
            if (!store.state.user.info) {
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

Vue.config.productionTip = false;

const config = require('../config')

console.log('process.env', process.env)

console.log('config.dev', config.dev)


/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>",
});
