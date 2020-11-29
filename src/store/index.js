import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //データ
    now_user_id: null,
    //カレンダーの内容
    todos:[
      { title: 'おぬまっち', date: '2020-11-20' },
      { title: 'ホゲホゲ', date: '2020-11-21' },
    ],
  },
  mutations: {
    //メソッド
    setUserId(state, payload) {
      state.now_user_id = payload.userId;
      console.log(state.now_user_id);
    },
    //todoの更新
    setTodo(state, payload) {
      state.todos = payload.todos;
    },
  },
  getters: {
    getUserId(state) {
      return state.now_user_id;
    },

    allTodos: state =>
        state.todos,
  },
  actions: {
    //外部から書き込む
    setUserIdAction({ commit }, { id }) {
      commit("setUserId", { userId: id });
    },

    setTodoAction({ commit }, { todos }){
      commit("setTodo", { todos: todos });
      console.log("hoge")
    }
  },
});

export default store;
