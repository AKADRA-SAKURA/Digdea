<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>ホームです</h1>
    目標 :<input type="text" v-model="goaltext" /> 期限 :<input
      type="date"
      v-model="timelimit"
    />
    <button v-on:click="addgoal">
      送信
    </button>
    <div v-for="(obj, index) in goalList" :key="index">
      <input type="checkbox" v-model="obj.status" /> :
      <span v-on:click="ToProcess(index)">
        {{ obj.text }}, {{ obj.status }}, {{ obj.timelimit }}</span
      >
    </div>
    <button v-on:click="logout">ログアウト</button>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import store from "../store";

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
    ToProcess(index) {
      store.dispatch("setGoalIdAction", { id: this.goalList[index].id });
      this.$router.push("/process");
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
          user_id: store.state.now_user_id,
        });
      firebase
        .firestore()
        .collection("goal")
        .where("user_id", "==", store.getters.getUserId)
        .update()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          /*           console.log(this.List); */
        });
      this.goaltext === "", this.status === false, this.timelimit === "";
    },
  },
  mounted() {
    firebase
      .firestore()
      .collection("goal")
      .where("user_id", "==", store.getters.getUserId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.goalList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        /*         console.log(this.goalList); */
      });
  },
};
</script>
