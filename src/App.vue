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
      |
      <button v-on:click="logout">ログアウト</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import firebase from "firebase";
import store from "./store";

export default {
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          store.dispatch("setUserIdAction", { id: null });
          this.$router.push("/signin");
          // Sign-out successful.
        })
        .catch(function(error) {
          alert("ログアウトできませんでした" + error);
          // An error happened.
        });
    },
  },
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
