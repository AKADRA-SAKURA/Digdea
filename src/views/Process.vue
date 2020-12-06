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
            <div class="process-content-box">
              <div class="process-title">
                <span v-on:click="ToToDo(index)">{{ obj.title }}</span>
              </div>
              <button class="tassei-button" v-on:click="truedata(obj.id)">達成率</button>
              <div class="icons">
                <font-awesome-icon icon="trash-alt" class="icon" v-on:click="openDialog(obj.id)"/>
                <font-awesome-icon icon="edit" class="icon" v-on:click="openModal(obj.id)"/>
              </div>
            </div>
          </div>
        </div>
        <div class="process-box">
          <div class="process-content new">
            <div class="process-content-box new-box">
              <div class="process-title new-title">
                <font-awesome-icon icon="plus" class="new-icon" v-on:click="openNewModal()"/>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新規投稿 -->
    <div class="overlay" v-show="showContent2">
      <div class="content">
        <div class="process-base">
          <!-- タイトル -->
          <div class="process-cotent modal-title">
             <!-- 閉じる -->
            <div class="card-status-icon window red">
              <font-awesome-icon icon="times-circle" class="process-icon" v-on:click="closeNewModal"/>
            </div>
            <input type="text" v-model="title" class="process-title title-only-input" placeholder="小さな目標を書いてみよう"/>
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
            <div class="number-box">
              緊急度:<input
                type="number"
                v-model="emerge"
                class="number-box"
                min="1"
                max="10"
              />
            </div>
            <div class="number-box">
              重要度:<input
                type="number"
                v-model="essential"
                class="number-box"
                min="1"
                max="10"
              />
            </div>
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
          <!-- 送信 -->
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
              <font-awesome-icon icon="times-circle" class="process-icon" v-on:click="closeModal"/>
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
            <div class="number-box">
              緊急度:<input type="number" v-model="emerge" class="number-box" min="1" max="10" />
            </div>
            <div class="number-box">
              重要度:<input type="number" v-model="essential" class="number-box" min="1" max="10" />
            </div>
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
    <dialog id="dg1" class="dg1">
      <p>削除してもいいですか？</p>
      <button
        v-on:click="deleteprocess(editingId)"
        v-on:keydown.Enter="closeDialog()"
        class="answer"
      >
        YEN
      </button>
      <button v-on:click="closeDialog()" v-on:keydown.Enter="closeDialog()" class="answer">
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
      trueList: [],
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
    openDialog(index) {
      this.editingId = index;
      document.getElementById("dg1").show();
    },
    closeDialog() {
      document.getElementById("dg1").close();
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
      document.getElementById("dg1").close();
      this.reload();
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
    truedata(index) {
      this.List = [];
      firebase
        .firestore()
        .collection("todo")
        .where("user_id", "==", store.getters.getUserId)
        .where("process_id", "==", index)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          /*           console.log(this.List); */
        })
        .then(() => {
          firebase
            .firestore()
            .collection("todo")
            .where("user_id", "==", store.getters.getUserId)
            .where("process_id", "==", index)
            .where("status", "==", true)
            .get()
            .then(snapshot => {
              snapshot.docs.forEach(doc => {
                this.trueList.push({
                  id: doc.id,
                  ...doc.data(),
                });
              });
              /*               console.log(this.trueList); */
            });
        })
        .then(() => {
          this.countTrue(this.List);
        });
    },
    countTrue(List) {
      var finished = 0;
      var all = 0;
      var percent = 0;
      for (var i = 0; i < List.length; i++) {
        /*         console.log(List[i]); */
        if (List[i].status == true) {
          finished++;
          all++;
        } else {
          all++;
        }
        percent = (finished * 100) / all;
      }
      alert("達成率は" + percent + "%です。");
      /*       console.log(finished, all, percent); */
    },
    ToToDo(index) {
      store.dispatch("setProcessIdAction", {
        id: this.processlisttype[index].id,
      });
      this.$router.push("/TodoList");
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
    height: 650px;
    background: #fff;
    max-width: 750px;
    min-width: 350px;
    border-radius: 10px;
    overflow: auto;
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
  .process-area{
    display: flex;
    flex-wrap: wrap;
    padding: 0px 20px;
    justify-content:space-evenly;
    
    .process-box{
      width: 150px;
      margin: 20px 0px;
      color: white;

      .process-content{
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background-color: #3d9e8d;
        margin: auto;
        max-width: 200px;

        .process-title{
          font-weight: bold;
          font-size: 15px;
          line-height: 20px;
          align-items: center;
          
        }
        .tassei-button{
          border: 2px solid #3d9e8d;
          box-sizing: border-box;
          border-radius: 10px;
          background-color: white;
          color: #3d9e8d;
        }
        .icons {
            font-size: 20px;
            margin: auto;
            text-align: center;

            .icon{
              width: 30px;
            }
          }
      }
      .new{
        background-image: radial-gradient(#fff 68%, transparent 68% 70%, #fff 70%),
        repeating-conic-gradient(currentColor 0% 3%, transparent 3% 5%);
        .new-box{
          padding-top: 53px;

          .new-title{
            font-size: 30px;
            color: #3d9e8d;
          }
        }
      }
    }
  }

  .process-content-box{
    margin: auto;
    padding-top: 40px;

    
  }

  .goal-show{
    width: 95%;
    margin: auto;
    border-radius: 10px;
    background-color: white;
    max-width: 750px;
    min-width: 350px;

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
  
}
.goal-show-base {
  width: 80%;
  margin: auto;
  background-color: blue;
}
.process-base {
  border-radius: 10px;
  background-color: white;
  margin: 20px auto;
  width: 90%;

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
    display: flex;
    justify-content: space-evenly;
    
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
.dg1{
    left: 12px;
    top: 58px;
    position: fixed;
    border: none;
    background-color: #e81d1d;
    color: white;
    border-radius: 10px;
    font-weight: bold;
    .answer{
      width: 50px;
      height: 30px;
      margin: 20px;
    }
}
</style>
