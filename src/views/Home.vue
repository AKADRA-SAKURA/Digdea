<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <h1>ホームです</h1>
    目標 :<input type="text" v-model="goaltext" v-on:keyup.enter="addgoal" />
    状態 :<input type="checkbox" v-model="status" v-on:keyup.enter="addgoal" />
    期限 :<input
      type="datetime"
      v-model="timelimit"
      v-on:keyup.enter="addgoal"
    />
    <button v-on:click="addgoal" v-on:keyup.enter="addgoal">
      送信
    </button>
    <div v-for="obj in goalList" v-bind:key="obj">
      {{ obj.text }}, {{ obj.status }}, {{ obj.timelimit }}
    </div>
    <button v-on:click="logout">ログアウト</button>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";

export default {
  name: "GOAL",
  components: {},
  data() {
    return {
      goalList: [],
      goaltext: "",
      status: false,
      timelimit: "",
      nowtime: "00:00:00",
    };
  },
  methods: {
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
    addgoal() {
      var date = new Date();
      this.nowtime =
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
      firebase
        .firestore()
        .collection("goal")
        .add({
          text: this.goaltext,
          status: this.status,
          timelimit: this.timelimit,
          created_at: this.nowtime,
        });
      this.goaltext == "", this.status == false, this.timelimit == "";
    },
  },
  mounted() {
    firebase
      .firestore()
      .collection("goal")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.goalList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
  },
};
</script>
