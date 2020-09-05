import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasAnimation: true,
        lineNum:1,
        size:'xl'
    },
    mutations: {
        CHANGE_STATE: (state, data) => {
            state[data.key] = data.val;
        }
    },
    actions: {
        changeState({ commit }, data) {
            commit('CHANGE_STATE', data)
        }
    }
})

export default store;
