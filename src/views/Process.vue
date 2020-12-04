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
    <div v-for="(obj, index) in processlisttype" :key="index">
      <input type="checkbox" v-model="obj.status" /> :
      <span v-on:click="ToToDo(index)"
        >{{ obj.now }}, {{ obj.need }}, {{ obj.factor }}, {{ obj.emerge }},
        {{ obj.essential }}, {{ obj.memo }}</span
      >
      <button v-on:click="deleteprocess(obj.id)">削除</button>
      <button v-on:click="openModal(obj.id)">編集</button>
    </div>
    <button v-on:click="logout">ログアウト</button>

    <div id="overlay" v-show="showContent">
      <div id="content">
        <p>これがモーダルウィンドウです。</p>
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
        <button v-on:click="editprocess(editingId)">
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
      showContent: false,
      editingId: "",
    };
  },
  methods: {
    openModal(index) {
      this.editingId = index;
      firebase
        .firestore()
        .collection("process")
        .doc(index)
        .get()
        .then(doc => {
          this.now = doc.data().now;
          this.factor = doc.data().factor;
          this.emerge = doc.data().emerge;
          this.memo = doc.data().memo;
          this.need = doc.data().need;
          this.essential = doc.data().essential;
        });
      this.showContent = true;
    },
    closeModal: function() {
      this.showContent = false;
      this.processlisttype = [];
      this.clearbox();
      this.reload();
    },
    reload() {
      this.processlisttype = [];
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
          goal_id: store.getters.getGoalId,
        });
      firebase
        .firestore()
        .collection("process")
        .where("user_id", "==", store.getters.getUserId)
        .where("goal_id", "==", store.getters.getGoalId)
        .update()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.processlisttype.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      this.clearbox();
    },
    deleteprocess(index) {
      var res = confirm("削除してもいいですか？");
      if (res == true) {
        firebase
          .firestore()
          .collection("process")
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
    editprocess(index) {
      firebase
        .firestore()
        .collection("process")
        .doc(index)
        .update({
          now: this.now,
          need: this.need,
          factor: this.factor,
          essential: this.essential,
          emerge: this.emerge,
          memo: this.memo,
        })
        .then(() => {
          this.reload();
        });
      this.closeModal();
      this.clearbox();
    },
    clearbox() {
      this.now = "";
      this.need = "";
      this.factor = "";
      this.essential = "";
      this.emerge = "";
      this.memo = "";
    },
    check(index) {
      firebase
        .firestore()
        .collection("process")
        .doc(index)
        .get()
        .add({
          status: this.processlisttype.status,
        });
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
