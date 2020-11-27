<template>
  <div>
    todo :
    <input type="text" v-model="text" v-on:keyup.enter="addlist" /> 期限 :
    <input type="date" v-model="timelimit" v-on:keyup.enter="addlist" />
    <button v-on:click="addlist" v-on:keyup.enter="addlist">
      送信
    </button>
    <!-- indexはv-forで一つ増えるためkeyにできる -->
    <div v-for="(obj,index) in List" v-bind:key="index">
      {{ obj.todo }}
      {{ obj.limit }}
    </div>
    <button v-on:click="logout">ログアウト</button>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
/* import store from "../store"; */

export default {
  name: "List",
  components: {},
  data() {
    return {
      List: [],
      text: "",
      timelimit: "",
      now: "00:00:00",
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
          /*           user_id: store.state.now_user_id, */
        });
      // todoの中身の情報を整形する
      const newTodos = this.List.map(todo => {
        const obj = {}
        obj.date = todo.limit
        obj.title = todo.todo
        return obj
        })
      this.$store.dispatch("setTodoAction",{"todos": newTodos})
      this.text == "";
      this.timelimit == "";
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
      /*       .where("user_id", "==", "now_user_id") */
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
        const obj = {}
        obj.date = todo.limit
        obj.title = todo.todo
        return obj
        })
      this.$store.dispatch("setTodoAction",{"todos": newTodos})

      });
  },
};
</script>
