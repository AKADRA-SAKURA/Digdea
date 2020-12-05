<template>
  <div class="home">
    目標 :<input type="text" v-model="goaltext" /> 期限 :<input
      type="date"
      v-model="timelimit"
    />
    <button v-on:click="addgoal">
      送信
    </button>

    <div class="goal-area">
      <div class="page-title">GOALS</div>
      <div v-for="(obj, index) in goalList" :key="index">
        {{ obj.status }},
        <div class="card-base">
          <div class="card-status-icon">
            <input type="checkbox" v-model="obj.status" />
            <font-awesome-icon icon="cloud" class="cloud" />
          </div>
          <div class="card-contents">
            <span v-on:click="ToProcess(index)">
              <div class="card-contents-title">
                {{ obj.text }}
              </div>
              <div class="card-contents-timelimit">
                {{ obj.timelimit }}
              </div>
            </span>
            <button v-on:click="deletegoal(obj.id)">削除</button>
            <button v-on:click="openModal(obj.id)">編集</button>
          </div>
        </div>
      </div>
    </div>
    <button v-on:click="logout">ログアウト</button>

    <div id="overlay" v-show="showContent">
      <div id="content">
        <p>これがモーダルウィンドウです。</p>
        目標 :<input type="text" v-model="goaltext" /> 期限 :<input
          type="date"
          v-model="timelimit"
        />
        <button v-on:click="editgoal(editingId)">
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
  name: "GOAL",
  components: {},
  data() {
    return {
      goalList: [],
      goaltext: "",
      status: false,
      timelimit: "",
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
        .collection("goal")
        .doc(index)
        .get()
        .then(doc => {
          this.goaltext = doc.data().text;
          this.timelimit = doc.data().timelimit;
        });
      this.showContent = true;
    },
    closeModal: function() {
      this.showContent = false;
      this.goalList = [];
      this.clearbox();
      this.reload();
    },
    reload() {
      this.goalList = [];
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
        });
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
    deletegoal(index) {
      var res = confirm("削除してもいいですか？");
      if (res == true) {
        firebase
          .firestore()
          .collection("goal")
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
    editgoal(index) {
      firebase
        .firestore()
        .collection("goal")
        .doc(index)
        .update({
          text: this.goaltext,
          timelimit: this.timelimit,
        })
        .then(() => {
          this.reload();
        });
      this.closeModal();
      this.clearbox();
    },
    clearbox() {
      this.goaltext = "";
      this.status = "";
      this.timelimit = "";
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
        .get()
        .update()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      this.goaltext = "";
      this.timelimit = "";
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
<style>

.base{
  max-width: 1440px;
  min-width: 375px;
}
.base-content{
  display: flex;
  flex-wrap: wrap;
}
.home{
  margin: auto;
}
.goal-area{
  max-width: 650px;
  min-width: 375px;
  margin: auto;
}
.page-title{
  width: 100%;
  height: 50px;
  font-family: "Noto Sans JP";
  font-weight: bold;
  font-size: 24px;
  color: #3d9e8d;
  line-height: 50px;
  letter-spacing: 0.05em;
  text-align: center;
}

.card-base{

  width: 335px;
  height: 50px;
  background-color: white;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  margin: 10px auto;
}
/* アイコンに関して */
.card-status-icon {
  width: 50px;
  margin: auto;
  text-align: center;
}
.svg-inline--fa.fa-w-20 {
  width: 30px;
  height: 20px;
  margin: 10px;
  color: #3d9e8d;
}

/* カードの内容に関して */
.card-contents {
  width: 285px;
}
.card-contents-title {
  height: 26px;
  font-weight: bold;
  font-size: 15.5px;
  line-height: 25px;
}

.card-contents-timelimit {
  height: 20px;
  font-family: "Noto Sans JP";
  font-weight: normal;
  font-size: 10px;
  line-height: 20px;
  color: #757575;
}
</style>
