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
            <font-awesome-icon
              icon="trash-alt"
              class="icon"
              v-on:click="openDialog(obj.id)"
            />
            <font-awesome-icon
              icon="edit"
              class="icon"
              v-on:click="openModal(obj.id)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="new_goal">
      <div class="icon">
        <font-awesome-icon icon="plus" v-on:click="openNewModal()" />
      </div>
    </div>
    <!-- 編集 -->
    <div class="overlay-home" v-show="showContent">
      <div class="content">
        <div class="home-modal-base">
          <!-- 閉じる -->
          <div class="card-status-icon window red">
            <font-awesome-icon
              icon="times-circle"
              class="process-icon"
              v-on:click="closeModal"
            />
          </div>
          <div class="process-cotent modal-title">
            目標 :<input
              type="text"
              v-model="goaltext"
              class="process-title title-only-input"
            />
          </div>
          <div class="process-cotent modal-title">
            期限 :<input
              type="date"
              v-model="timelimit"
              class="process-title title-only-input"
            />
          </div>
          <button v-on:click="editgoal(editingId)" class="process-submit">
            ➡︎
          </button>
        </div>
      </div>
    </div>
    <!-- 新規作成 -->
    <div class="overlay-home" v-show="showContent2">
      <div class="content">
        <div class="home-modal-base">
          <!-- 閉じる -->
          <div class="card-status-icon window red">
            <font-awesome-icon
              icon="times-circle"
              class="process-icon"
              v-on:click="closeNewModal"
            />
            <div class="question">いつまでに何を達成したいですか？</div>
          </div>
          <div class="process-cotent modal-title">
            目標 :<input
              type="text"
              v-model="goaltext"
              class="process-title title-only-input"
              placeholder="大きな目標"
            />
          </div>
          <div class="process-cotent modal-title">
            期限 :<input
              type="date"
              v-model="timelimit"
              class="process-title title-only-input"
            />
          </div>
          <button v-on:click="addgoal" class="process-submit">
            ➡︎
          </button>
        </div>
      </div>
    </div>
    <dialog id="dg1" class="dg1">
      <p>削除してもいいですか？</p>
      <button
        v-on:click="deletegoal(editingId)"
        v-on:keydown.Enter="closeDialog()"
        class="answer"
      >
        YES
      </button>
      <button
        v-on:click="closeDialog()"
        v-on:keydown.Enter="closeDialog()"
        class="answer choice"
      >
        NO
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
      })
      .then(() => {
        for (var i = 0; i < this.goalList.length; i++) {
          const cloudstatus = document.getElementById(
            "cloud" + this.goalList[i].id
          );
          const sunstatus = document.getElementById(
            "sun" + this.goalList[i].id
          );
          console.log(cloudstatus);
          console.log(sunstatus);
          firebase
            .firestore()
            .collection("goal")
            .doc(this.goalList[i].id)
            .get()
            .then(doc => {
              this.status = doc.data().status;
            })
            .then(() => {
              console.log(this.status);
              if (this.status == false) {
                cloudstatus.style.display = "block";
                sunstatus.style.display = "none";
              } else {
                cloudstatus.style.display = "none";
                sunstatus.style.display = "block";
              }
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });
          console.log(this.goalList[i].id, this.status);
        }
      });
  },
};
</script>
<style lang="scss">
.home {
  margin: auto;

  .goal-area {
  max-width: 650px;
  min-width: 300px;
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
      width: 80%;
      height: 50px;
      background-color: white;
      display: flex;
      padding: 10px;
      border-radius: 10px;
      margin: 10px auto;
      min-width: 300px;

      /* アイコンに関して */
      .card-status-icon {
        width: 50px;
        font-size: 25px;
        color: pink;
        margin: auto;
        text-align: center;
        .cloud {
          color: grey;
        }
        .sun {
          color: orange;
        }
      }
      .edit_icons {
        font-size: 17px;
        margin: auto;
        text-align: center;

        .icon {
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
.new_goal {
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  .icon {
    text-align: center;
    margin: auto;
    font-size: 25px;
    line-height: 70px;
    color: #3d9e8d;
  }
}
.overlay-home {
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

  .content {
    z-index: 2;
    width: 85%;
    height: 190px;
    background: #fff;
    max-width: 400px;
    min-width: 300px;
    border-radius: 10px;
    overflow: auto;
    text-align: center;

    .home-modal-base {
      padding: 20px;

      .process-title {
        width: 70%;
        height: 25px;
        font-weight: bold;
        font-size: 15.5px;
        line-height: 22px;
        border: 0.5px solid #f2e9e3;
        border-radius: 5px;

        align-items: center;
        text-align: center;
      }
      .modal-title {
        display: flex;
        padding-right: 30px;
        .title-only-input {
          margin: auto;
        }
      }
      .window {
        font-size: 20px;
        margin-bottom: 10px;
        text-align: left;
        display: flex;
        .process-icon {
          margin-right: 10px;
        }
        .question {
          color: black;
          font-size: 15px;
          padding-right: 20px;
        }
      }
      .process-submit {
        width: 44px;
        height: 44px;
        border-radius: 50%; /*角丸*/
        background-color: #3d9e8d;
        border: none;
        font-weight: 900;
        font-size: 24px;
        line-height: 44px;
        color: white;
        margin: 10px;
      }
    }
  }
}
</style>
