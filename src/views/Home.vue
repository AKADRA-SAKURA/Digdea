<template>
  <div class="home">
    目標 :<input type="text" v-model="goaltext" v-on:keyup.enter="addgoal" />
    状態 :<input type="checkbox" v-model="status" v-on:keyup.enter="addgoal" />
    期限 :<input type="date" v-model="timelimit" v-on:keyup.enter="addgoal" />
    <button v-on:click="addgoal" v-on:keyup.enter="addgoal">
      送信
    </button>
    <div class="goal-area">
      <div class="page-title">GOALS</div>
      <div v-for="(obj, index) in goalList" :key="index">
        {{ obj.status }}, 
        <div class="card-base">
          <div class="card-status-icon">
            <font-awesome-icon icon="cloud" class="cloud" />
          </div>
          <div class="card-contents">
            <div class="card-contents-title">
              {{ obj.text }}
            </div>
            <div class="card-contents-timelimit">
              {{ obj.timelimit }}
            </div>
          </div>
        </div>
      </div>
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
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
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
      });
  },
};
</script>
<style>
.home{
  margin: auto;
}
.page-title{
  width: 100%;
  height: 50px;
  font-family: "Noto Sans JP";
  font-weight: bold;
  font-size: 24px;
  color: #3D9E8D;
  line-height: 50px;
  letter-spacing: 0.05em;
  text-align: center;
}
.goal-area{
  align-items: center;
}
.card-base{
  width: 335px;
  height: 50px;
  background-color: white;
  display: flex;
  padding: 10px;
  border-radius: 10px;
}
/* アイコンに関して */
.card-status-icon{
  width: 50px; 
  margin: auto;
  text-align: center;
}
.svg-inline--fa.fa-w-20{
  width: 30px;
  height: 20px;
  margin: 10px;
  color: #3D9E8D;
}

/* カードの内容に関して */
.card-contents{
  width: 285px;
}
.card-contents-title{
  height: 26px;
  font-weight: bold;
  font-size: 15.5px;
  line-height: 25px;
}

.card-contents-timelimit{
  height: 20px;
  font-family: "Noto Sans JP";
  font-weight: normal;
  font-size: 10px;
  line-height: 20px;
  color: #757575;
}
</style>
