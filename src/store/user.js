import { getUserInfo, refresh } from '@/api/user'

export default {
    namespaced: true, // 命名空间
    state: {
        // info: null,
        info: localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : null,
        token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    },
    mutations: {
        setInfo(state, info) {
            if (info) {
                localStorage.setItem('info', JSON.stringify(info))
            } else {
                localStorage.removeItem('info')
            }
            state.info = info
        },
        setToken(state, token) {
            if (token) {
                localStorage.setItem('token', JSON.stringify(token))
            } else {
                localStorage.removeItem('token')
            }
            state.token = token
        }
    },
    getters: {
        getUser(state) {
            return state.info
        },
        getToken(state) {
            return state.token
        }
    },
    actions: {
        async getUserInfo({ commit, state}) {
            await getUserInfo(state).then(res => {
                commit('setInfo', res.data)
            }).catch(err => {
                commit('setInfo', null)
            })
        },
        async refreshToken({ commit, state}) {
            await refresh(state.token).then(res => {
                commit('setToken', res.data)
            }).catch(err => {
                commit('setToken', null)
            })
        }
    }
}
