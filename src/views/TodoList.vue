<template>
  <div>
    todo :
    <input type="text" v-model="text" /> 期限 :
    <input type="date" v-model="timelimit" />
    <button v-on:click="addlist">
      送信
    </button>
    <div v-for="(obj, index) in List" :key="index">
      <input type="checkbox" v-model="obj.status" v-on:click="check(obj.id)" />
      : {{ obj.todo }} / {{ obj.limit }} :
      <button v-on:click="deletetodo(obj.id)">削除</button>
      <button v-on:click="openModal(obj.id)">編集</button>
    </div>
    <button v-on:click="logout">ログアウト</button>

    <div id="overlay" v-show="showContent">
      <div id="content">
        <p>これがモーダルウィンドウです。</p>
        todo :
        <input type="text" v-model="text" />
        期限 : <input type="date" v-model="timelimit" />
        <button v-on:click="edittodo(editingId)">
          送信
        </button>
        <button v-on:click="closeModal">Close</button>
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
      status: false,
      showContent: false,
      editingId: "",
    };
  },
  methods: {
    openModal(index) {
      this.editingId = index;
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .get()
        .then(doc => {
          this.text = doc.data().todo;
          this.timelimit = doc.data().limit;
        });
      this.showContent = true;
    },
    closeModal: function() {
      this.showContent = false;
      this.List = [];
      this.clearbox();
      this.reload();
    },
    reload() {
      this.List = [];
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
      /*       this.List.push(this.text); */
      firebase
        .firestore()
        .collection("todo")
        .add({
          todo: this.text,
          created_at: this.now,
          limit: this.timelimit,
          status: this.status,
          user_id: store.state.now_user_id,
          process_id: store.getters.getProcessId,
        });
      this.List = [];
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
      this.clearbox();
    },
    deletetodo(index) {
      /*       console.log(index); */
      var res = confirm("削除してもいいですか？");
      if (res == true) {
        firebase
          .firestore()
          .collection("todo")
          .doc(index)
          .delete()
          .then(function() {
            alert("削除しました");
          })
          .catch(function(error) {
            alert.error("Error removing document: ", error);
          });
        this.reload();
      }
    },
    edittodo(index) {
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .update({
          todo: this.text,
          limit: this.timelimit,
        })
        .then(() => {
          this.reload();
        });
      this.closeModal();
      this.clearbox();
    },
    clearbox() {
      this.text = "";
      this.timelimit = "";
    },
    check(index) {
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .get()
        .add({
          status: this.List.status,
        });
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

<style>
#overlay {
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}
#content {
  z-index: 2;
  width: 50%;
  padding: 1em;
  background: #fff;
}
</style>
