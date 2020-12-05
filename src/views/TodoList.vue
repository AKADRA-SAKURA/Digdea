<template>
  <div class="base">
    <div class="base-content">
      <div class="goal-area">
        <div class="page-title">TODO LIST</div>
      
        todo :
        <input type="text" v-model="text" /> 期限 :
        <input type="date" v-model="timelimit" />
        <button v-on:click="addlist">
          送信
        </button>

        <div v-for="(obj, index) in List" :key="index">
          <div class="card-base">
            <div class="card-status-icon">
              <font-awesome-icon icon="cloud" class="cloud" />
            </div>
            <div class="card-contents">
              <div class="card-contents-title">
                {{ obj.todo }}
              </div>
              <div class="card-contents-timelimit">
                {{ obj.limit }}
              </div>
            </div>
          </div>
        </div>
      
        <button v-on:click="logout">ログアウト</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import store from "../store";

export default {
  name: "List",
  components: {},
  data() {
    return {
      List: [],
      text: "",
      timelimit: "",
      now: "00:00:00",
      show: true,
    };
  },
  methods: {
    addlist() {
      var date = new Date();
      this.now =
        date.getFullYear() +
        "年" +
        date.getMonth() +
        "月" +
        date.getDate() +
        "日 " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      this.List.push(this.text);
      firebase
        .firestore()
        .collection("todo")
        .add({
          todo: this.text,
          created_at: this.now,
          limit: this.timelimit,
          user_id: store.state.now_user_id,
          process_id: store.getters.getProcessId,
        });
      firebase
        .firestore()
        .collection("todo")
        .where("user_id", "==", store.getters.getUserId)
        .where("process_id", "==", store.getters.getProcessId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      // todoの中身の情報を整形する
      const newTodos = this.List.map(todo => {
        const obj = {};
        obj.date = todo.limit;
        obj.title = todo.todo;
        return obj;
      });
      this.$store.dispatch("setTodoAction", { todos: newTodos });
      this.text == "";
      this.timelimit == "";
    },
    switchDelateAlarm() {
      return false;
    },
    getIndex(index) {
      this.delateId = this.List[index].id;
    },
    deleteItem(deleteId) {
      firebase
        .collection("todo")
        .doc(deleteId)
        .delete();
      this.show == false;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin");
          // Sign-out successful.
        })
        .catch(function(error) {
          alert("ログアウトできませんでした" + error);
          // An error happened.
        });
    },
  },
  mounted() {
    firebase
      .firestore()
      .collection("todo")
      .where("user_id", "==", store.getters.getUserId)
      .where("process_id", "==", store.getters.getProcessId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.List.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        //ページ読み込んだと同時にvuexにもデータを同時に入れてる
        const newTodos = this.List.map(todo => {
          const obj = {};
          obj.date = todo.limit;
          obj.title = todo.todo;
          return obj;
        });
        this.$store.dispatch("setTodoAction", { todos: newTodos });
      });
  },
};
</script>
