<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/process">Process</router-link> |
      <router-link to="/todolist">TodoList</router-link> |
      <router-link to="/calendar">Calendar</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  mounted() {
    firebase
      .firestore()
      .collection("todo")
      /*       .where("user_id", "==", "now_user_id") */
      .get()
      .then(snapshot => {
        const list = [];
        snapshot.docs.forEach(doc => {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        //vuexにもデータを同時に入れてる
        const newTodos = list.map(todo => {
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
