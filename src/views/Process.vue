<template>
  <div class="Process">
    <h1>プロセスページ</h1>
    現状:<input type="text" v-model="now" /> 考えられる要因:<input
      type="text"
      v-model="factor"
    />
    理想状態に向けて:<input type="text" v-model="need" /> 緊急度:<input
      type="number"
      v-model="emerge"
    />
    重要度:<input type="number" v-model="essential" /> メモ:<input
      type="text"
      v-model="memo"
    />
    <button v-on:click="addprocess">
      送信
    </button>
    <div
      v-for="(obj, index) in processlisttype"
      :key="index"
      v-on:click="ToToDo(index)"
    >
      {{ obj.now }}, {{ obj.need }}, {{ obj.factor }}, {{ obj.emerge }},
      {{ obj.essential }}, {{ obj.memo }}
    </div>
    <button v-on:click="logout">ログアウト</button>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import store from "../store";

export default {
  name: "Process",
  components: {},
  data() {
    return {
      processlisttype: [],
      now: "",
      need: "",
      factor: "",
      essential: "",
      emerge: "",
      memo: "",
      nowtime: "00:00:00",
    };
  },
  methods: {
    addprocess() {
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
        .collection("process")
        .add({
          now: this.now,
          need: this.need,
          factor: this.factor,
          essential: this.essential,
          emerge: this.emerge,
          memo: this.memo,
          created_at: this.nowtime,
          user_id: store.state.now_user_id,
        });
      firebase
        .firestore()
        .collection("process")
        .where("user_id", "==", store.getters.getUserId)
        .where("goal_id", "==", store.getters.getGoalId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      this.now == "",
        this.need == "",
        this.facto == "",
        this.essential == "",
        this.emerge == "",
        this.memo == "";
    },
    ToToDo(index) {
      store.dispatch("setProcessIdAction", {
        id: this.processlisttype[index].id,
      });
      this.$router.push("/TodoList");
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
      .collection("process")
      .where("user_id", "==", store.getters.getUserId)
      .where("goal_id", "==", store.getters.getGoalId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.processlisttype.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
  },
};
</script>
