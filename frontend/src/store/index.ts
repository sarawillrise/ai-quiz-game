import {createStore} from "vuex"

export default createStore({
  state: {
    score: 0,
  },
  mutations: {
    setScore(state, score) {
      state.score = score;
    }
  },
  actions: {
    setScore(context, score) {
      context.commit('setScore', score);
    }
  }
})