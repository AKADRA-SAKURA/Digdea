import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //データ
    now_user_id: null,
  },
  mutations: {
    //メソッド
    setUserId(state, payload) {
      state.now_user_id = payload.userId;
    },
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
  },
  actions: {
    //外部から書き込む
    setUserIdAction({ commit }, { id }) {
      commit("setUserId", { userId: id });
    },
  },
});

export default store;
