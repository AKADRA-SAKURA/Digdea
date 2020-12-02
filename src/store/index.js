import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //データ
    now_user_id: null,
    To_Pro_goal_id: null,
    To_Todo_Pro_id: null,
    //カレンダーの内容
    todos: [
      { title: "おぬまっち", date: "2020-11-20" },
      { title: "ホゲホゲ", date: "2020-11-21" },
    ],
  },
  mutations: {
    //メソッド
    setUserId(state, payload) {
      state.now_user_id = payload.userId;
      /*       console.log(state.now_user_id); */
    },
    //プロセスページにゴールidを渡す
    setGoalId(state, payload) {
      state.To_Pro_goal_id = payload.GoalId;
      /*       console.log(state.To_Pro_goal_id); */
    },
    //todoページにプロセスidを渡す
    setProcessId(state, payload) {
      state.To_Todo_Pro_id = payload.ProcessId;
      /*       console.log(state.To_Todo_Pro_id); */
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
    getGoalId(state) {
      return state.To_Pro_goal_id;
    },
    getProcessId(state) {
      return state.To_Todo_Pro_id;
    },

    allTodos: state => state.todos,
  },
  actions: {
    //外部から書き込む
    setUserIdAction({ commit }, { id }) {
      commit("setUserId", { userId: id });
    },
    //プロセスページにゴールidを渡す
    setGoalIdAction({ commit }, { id }) {
      commit("setGoalId", { GoalId: id });
    },
    //todoページにプロセスidを渡す
    setProcessIdAction({ commit }, { id }) {
      commit("setProcessId", { ProcessId: id });
    },

    setTodoAction({ commit }, { todos }) {
      commit("setTodo", { todos: todos });
      /*       console.log("hoge"); */
    },
  },
});

export default store;
