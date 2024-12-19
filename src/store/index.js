import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './user'
import habit from './habit'

export default new Vuex.Store({
    modules: {
        user: user,
        habit: habit,
    }
})