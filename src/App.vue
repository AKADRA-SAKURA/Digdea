<template>
  <div id="app" class="app">
    <div id="nav" class="nav">
      <router-link to="/"><div class="icon"><font-awesome-icon icon="home"/></div></router-link> |
      <router-link to="/process"><div class="icon"><font-awesome-icon icon="brain"/></div></router-link> |
      <router-link to="/Todolist"><div class="icon"><font-awesome-icon icon="list"/></div></router-link> |
      <router-link to="/calendar"><div class="icon"><font-awesome-icon icon="calendar-check"/></div></router-link> |
      <div class="icon"><font-awesome-icon icon="sign-out-alt" v-on:click="logout"/></div>


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

<style lang="scss">
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f2e9e3;
  min-height: 800px;
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
.app{
  .nav{
    height: 40px;
    display: flex;
    justify-content: center;
    .icon{
      height: 30px;
      width: 30px;
      font-size: 20px;
    }
  }
}
.red{
  color: #e81d1d;
}
.theme{
  color: #3d9e8d;
}
.orange{
  color: orange;
}
</style>
