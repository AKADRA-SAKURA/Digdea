<template>
  <div id="app" class="app">
    <div id="nav">
      <router-link to="/"><font-awesome-icon icon="home"/></router-link> |
      <router-link to="/process"><font-awesome-icon icon="brain"/></router-link>
      |
      <router-link to="/Todolist"><font-awesome-icon icon="list"/></router-link>
      |
      <router-link to="/calendar"
        ><font-awesome-icon icon="calendar-check"
      /></router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import firebase from "firebase";
import store from "./store";

export default {
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        /*     console.log(user); */
        store.dispatch("setUserIdAction", { id: user.uid });
      } else {
        /*     console.log(user); */
      }
    });
  },
  /*  mounted() {
    firebase
      .firestore()
      .collection("todo")
      .get()
      .then(snapshot => {
        const list = [];
        snapshot.docs.forEach(doc => {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        const newTodos = list.map(todo => {
          const obj = {};
          obj.date = todo.limit;
          obj.title = todo.todo;
          return obj;
        });
        this.$store.dispatch("setTodoAction", { todos: newTodos });
      });
  }, */
};
</script>

<style>
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f2e9e3;
  font-family: "Noto Sans JP";
}

#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #3d9e8d;
}
.bg-white {
  color: white;
}
</style>
