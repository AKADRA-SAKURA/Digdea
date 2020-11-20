<template>
  <div>
    todo :
    <input type="text" v-model="todolist" v-on:keyup.enter="addlist" /> 期限 :
    <input type="date" v-model="timelimit" v-on:keyup.enter="addlist" />
    <button v-on:click="addlist" v-on:keyup.enter="addlist">
      送信
    </button>
    <div v-for="obj in List" v-bind:key="obj">
      {{ obj.todo }}
    </div>
    <button v-on:click="logout">ログアウト</button>
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
      todolist: "",
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
      this.List.push(this.todolist);
      firebase
        .firestore()
        .collection("todo")
        .add({
          todo: this.todolist,
          created_at: this.now,
          limit: this.timelimit,
          user_id: store.state.now_user_id,
        });
      this.todolist == "";
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
      .where("user_id", "==", "now_user_id")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.List.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
  },
};
</script>
