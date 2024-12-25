export default {
    namespaced: true, // 命名空间
    state: {
        habit: localStorage.getItem('habit') ? JSON.parse(localStorage.getItem('habit')) : {
            note_card_style: false,
            unit_body_menu_visible: false,
        },
    },
    mutations: {
        setHabit(state, habit) {
            if (habit) {
                localStorage.setItem('habit', JSON.stringify({
                    ...state.habit,
                    ...habit,
                }))
                state.habit = habit
            } else {
                // 清空时，初始化本地
                localStorage.removeItem('habit')
                state.habit = {
                    note_card_style: false,
                    unit_body_menu_visible: false,
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
