<template>
  <div class="home">
    <div class="goal-area">
      <div class="page-title">GOALS</div>
      <div v-for="(obj, index) in goalList" :key="index">
        <div class="card-base">
          <div class="card-status-icon">
            <font-awesome-icon
              v-bind:id="'cloud' + obj.id"
              icon="cloud"
              class="cloud"
              v-on:click="check(obj.id)"
              style="display: block;"
            />
            <font-awesome-icon
              v-bind:id="'sun' + obj.id"
              icon="sun"
              class="sun"
              v-on:click="check(obj.id)"
              style="display: none;"
            />
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
          </div>
          <div class="edit_icons">
            <font-awesome-icon icon="trash-alt" class="icon" v-on:click="openDialog(obj.id)"/>
            <font-awesome-icon icon="edit" class="icon" v-on:click="openModal(obj.id)"/>
          </div>
        </div>
      </div>
    </div>
    <button v-on:click="openNewModal()">新規作成</button>
    <button v-on:click="logout">ログアウト</button>

    <div class="overlay" v-show="showContent">
      <div class="content">
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

    <div id="overlay" v-show="showContent2">
      <p>新規作成</p>
      <div id="content">
        目標 :<input type="text" v-model="goaltext" /> 期限 :<input
          type="date"
          v-model="timelimit"
        />
        <button v-on:click="addgoal">
          送信
        </button>
        <button v-on:click="closeNewModal">Close</button>
      </div>
    </div>
    <dialog id="dg1">
      <p>削除してもいいですか？</p>
      <button
        v-on:click="deletegoal(editingId)"
        v-on:keydown.Enter="closeDialog()"
      >
        はい
      </button>
      <button v-on:click="closeDialog()" v-on:keydown.Enter="closeDialog()">
        キャンセル
      </button>
    </dialog>
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
      showContent2: false,
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
    openNewModal() {
      this.showContent2 = true;
    },
    openDialog(index) {
      this.editingId = index;
      document.getElementById("dg1").show();
    },
    closeDialog() {
      document.getElementById("dg1").close();
    },
    closeModal: function() {
      this.showContent = false;
      this.goalList = [];
      this.clearbox();
      this.reload();
    },
    closeNewModal: function() {
      this.showContent2 = false;
      this.List = [];
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
      document.getElementById("dg1").close();
      this.reload();
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
      const cloudstatus = document.getElementById("cloud" + index);
      const sunstatus = document.getElementById("sun" + index);
      console.log(cloudstatus);
      console.log(sunstatus);
      firebase
        .firestore()
        .collection("goal")
        .doc(index)
        .get()
        .then(doc => {
          this.status = doc.data().status;
        })
        .then(() => {
          console.log(this.status);
          if (this.status == false) {
            this.status = true;
            cloudstatus.style.display = "none";
            sunstatus.style.display = "block";
          } else {
            this.status = false;
            cloudstatus.style.display = "block";
            sunstatus.style.display = "none";
          }
        })
        .then(() => {
          firebase
            .firestore()
            .collection("goal")
            .doc(index)
            .update({
              status: this.status,
            });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
      console.log(index, this.status);
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
      this.clearbox();
      this.closeNewModal();
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
<style lang="scss">
.home {
  margin: auto;

  .goal-area {
  max-width: 650px;
  min-width: 375px;
  margin: auto;
  
    .page-title {
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
    .card-base {
      width: 335px;
      height: 50px;
      background-color: white;
      display: flex;
      padding: 10px;
      border-radius: 10px;
      margin: 10px auto;

      /* アイコンに関して */
      .card-status-icon {
        width: 50px;
        font-size: 25px;
        color: pink;
        margin: auto;
        text-align: center;
      }
      .edit_icons {
        font-size: 20px;
        margin: auto;
        text-align: center;

        .icon{
          width: 30px;
        }
      }
      .card-contents {
        width: 285px;

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
      }
    }
  }
}
</style>
