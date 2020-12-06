<template>
  <div class="Process">
    <div class="page-title">PROCESS</div>
      <div class="goal-show">
        <div class="goal-show-title">{{ goaltitle }}
      </div>
      <div class="process-area">
        <div class="question">ゴールを達成するために必要なことを記入しよう！</div>
        <div class="process-box" v-for="(obj, index) in processlisttype" :key="index">
          <div class="process-content">
            <input type="checkbox" v-model="obj.status" /> :
            <div class="process-title">
              <span v-on:click="ToToDo(index)">{{ obj.title }}</span>
            </div>
            
            <button v-on:click="deleteprocess(obj.id)">削除</button>
            <button v-on:click="openModal(obj.id)">編集</button>
            </div>
        </div>
      </div>
    </div>
    <button v-on:click="openNewModal()">新規作成</button>

    <button v-on:click="logout">ログアウト</button>

    <div class="overlay" v-show="showContent2">
      <div class="content">
        <div class="process-base">
          <!-- タイトル -->
          <div class="process-cotent modal-title">
             <!-- 閉じる -->
            <div class="card-status-icon window red">
              <font-awesome-icon icon="window-close" class="process-icon" v-on:click="closeNewModal"/>
            </div>
            <input
                type="text"
                v-model="title"
                class="process-title title-only-input"
                placeholder="小さな目標を書いてみよう"
              />
          </div>
          <!-- 現状 -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="cloud" class="process-icon" />
              </div>
              <div class="process-cotent-title">現状</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="now"
                class="process-cotent-input"
                placeholder="今の状態を書いてみよう"
              />
            </div>
          </div>
          <!-- 考えられる原因 -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="dizzy" class="process-icon" />
              </div>
              <div class="process-cotent-title">考えられる要因</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="factor"
                class="process-cotent-input"
                placeholder="現状が起こっている原因はなんだろう？"
              />
            </div>
          </div>
          <!-- 理想状態に向けて -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="sun" class="process-icon" />
              </div>
              <div class="process-cotent-title">理想状態に向けて</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="need"
                class="process-cotent-input"
                placeholder="原因を踏まえて、理想に近づけるために必要なことを書いてみよう！"
              />
            </div>
          </div>
          <div class="number-area">
            緊急度:<input
              type="number"
              v-model="emerge"
              class="number-box"
              min="1"
              max="10"
            />
            重要度:<input
              type="number"
              v-model="essential"
              class="number-box"
              min="1"
              max="10"
            />
          </div>
          <!-- メモ -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="pen" class="cloud" />
              </div>
              <div class="process-cotent-title">メモ</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="memo"
                class="process-cotent-input"
                placeholder="メモ"
              />
            </div>
          </div>
          <button v-on:click="addprocess" class="process-submit">
            ➡︎
          </button>
      
        </div>
      </div>
    </div>
    <!-- 編集 -->
    <div class="overlay" v-show="showContent">
      <div class="content">
        <div class="process-base">
         
          <!-- タイトル -->
          <div class="process-cotent modal-title">
            <!-- 閉じる -->
            <div class="card-status-icon window red">
              <font-awesome-icon icon="window-close" class="process-icon" v-on:click="closeModal"/>
            </div>
            <input type="text" v-model="title" class="process-title title-only-input"/>
          </div>
          <!-- 現状 -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="cloud" class="process-icon" />
              </div>
              <div class="process-cotent-title">現状</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="now"
                class="process-cotent-input"
              />
            </div>
          </div>
          <!-- 考えられる原因 -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="dizzy" class="process-icon" />
              </div>
              <div class="process-cotent-title">考えられる要因</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="factor"
                class="process-cotent-input"
              />
            </div>
          </div>
          <!-- 理想状態に向けて -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="sun" class="process-icon" />
              </div>
              <div class="process-cotent-title">理想状態に向けて</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="need"
                class="process-cotent-input"
              />
            </div>
          </div>
          <div class="number-area">
            緊急度:<input type="number" v-model="emerge" class="number-box" min="1" max="10" />
            重要度:<input type="number" v-model="essential" class="number-box" min="1" max="10" />
          </div>
          <!-- メモ -->
          <div class="process-cotent">
            <div class="process-cotent-title-area">
              <div class="card-status-icon">
                <font-awesome-icon icon="pen" class="cloud" />
              </div>
              <div class="process-cotent-title">メモ</div>
            </div>
            <div class="process-cotent-input-area">
              <textarea
                v-model="memo"
                class="process-cotent-input"
              />
            </div>
          </div>
          <button v-on:click="editprocess(editingId)" class="process-submit">
            ➡︎
          </button>
        </div>
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
      goaltitle: "",
      processlisttype: [],
      title: "",
      now: "",
      need: "",
      factor: "",
      essential: "",
      emerge: "",
      memo: "",
      nowtime: "00:00:00",
      showContent: false,
      showContent2: false,
      editingId: "",
    };
  },
  methods: {
    goalrecall() {
      firebase
        .firestore()
        .collection("goal")
        .doc(store.getters.getGoalId)
        .get()
        .then(doc => {
          this.goaltitle = doc.data().text;
        });
    },
    openModal(index) {
      this.editingId = index;
      firebase
        .firestore()
        .collection("process")
        .doc(index)
        .get()
        .then(doc => {
          this.title = doc.data().title;
          this.now = doc.data().now;
          this.factor = doc.data().factor;
          this.emerge = doc.data().emerge;
          this.memo = doc.data().memo;
          this.need = doc.data().need;
          this.essential = doc.data().essential;
        });
      this.showContent = true;
    },
    openNewModal() {
      this.showContent2 = true;
    },
    closeModal: function() {
      this.showContent = false;
      this.processlisttype = [];
      this.clearbox();
      this.reload();
    },
    closeNewModal: function() {
      this.showContent2 = false;
      this.processlisttype = [];
      this.clearbox();
      this.reload();
    },
    reload() {
      this.goalrecall();
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
          title: this.title,
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
      this.clearbox();
      this.closeNewModal();
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
        this.clearbox();
        this.reload();
      }
    },
    editprocess(index) {
      firebase
        .firestore()
        .collection("process")
        .doc(index)
        .update({
          title: this.title,
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
      this.title = "";
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
    this.goalrecall();
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
<style lang="scss">
#overlay_process_new {
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

  #content_process_new {
    z-index: 2;
    width: 85%;
    padding: 1em;
    height: 650px;
    background: #fff;
  }
}

.overlay {
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
    padding: 1em;
    height: 650px;
    background: #fff;
    .modal-title{
      display: flex;
      padding-right: 30px;
      .title-only-input{
        margin: auto;
      }
    }
    .window{
      font-size: 20px;
      
      text-align: left;
    }
  }
}

.Process {
  max-width: 1000px;
  min-width: 375px;
  text-align: center;
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

  .goal-show{
    width: 95%;
    margin: auto;
    border-radius: 10px;
    background-color: white;

    .goal-show-title{
      width: 100%;
      height: 50px;
      font-weight: bold;
      font-size: 15.5px;
      line-height: 50px;
      border-bottom: 1px solid #F0F0F0;
    }
  }
  .question{
    width: 100%;
    height: 20px;
    font-size: 13px;
    padding: 10px;
  }
  .process-area{
    display: flex;
    flex-wrap: wrap;
    padding: 0px 20px;
    
    .process-box{
      width: 50%;
      margin: 20px 0px;
      .process-content{
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-color: #3d9e8d;
        margin: auto;

        .process-title{
          font-weight: bold;
          font-size: 14px;
          line-height: 20px;
          align-items: center;
        }
      }
    }
  }
}
.process-base {
  border-radius: 10px;
  background-color: white;
  margin: auto;

  .process-contents {
    padding: 0px 35px;
  }

  .process-cotent {
    margin-bottom: 20px;
    .process-cotent-input-area {
      width: 100%;
    }
  }


  .process-title{
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

  .process-cotent-input {
    height: 70px;
    width: 100%;
    border: 0.5px solid #f2e9e3;
    border-radius: 5px;
  }

  .process-cotent-title-area {
    height: 30px;
    display: flex;

    .card-status-icon{
      width: 40px;
      font-size: 20px;
      line-height: 30px;
      color:darkgray;
      text-align: center;
    }
    .process-cotent-title {
      height: 30px;
      font-weight: 500;
      font-size: 14px;
      line-height: 30px;
    }
  }
  .number-area {
    width: 60%;
    min-width: 230px;
    margin: 10px auto;

    .number-box {
      width: 30px;
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
  }
}







</style>
