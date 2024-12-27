export default {
    namespaced: true, // 命名空间
    state: {
        habit: localStorage.getItem('habit') ? JSON.parse(localStorage.getItem('habit')) : {
            note_card_style: false,
            unit_body_menu_visible: true,
            ScreenSize: window.document.body.offsetWidth, // 屏幕宽度
        },
    },
    mutations: {
        setHabit(state, habit) {
            if (habit) {
                let _habit = {
                    ...state.habit,
                    ...habit,
                }
                localStorage.setItem('habit', JSON.stringify(_habit))
                state.habit = _habit
            } else {
                // 清空时，初始化本地
                localStorage.removeItem('habit')
                state.habit = {
                    note_card_style: false,
                    unit_body_menu_visible: true,
                    ScreenSize: window.document.body.offsetWidth, // 屏幕宽度
                }
            }
        },
    },
    getters: {
        getHabit(state) {
            return state.habit
        },
    },
    actions: { }
}
