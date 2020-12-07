<template>
  <div class="base">
    <div class="home">
      <div class="goal-area">
        <div class="page-title-todo">TODO LIST</div>
        <div class="from-process">
          <span class="process-title-main">{{ processtitle }}</span>を達成するために・・
        </div>

        <div v-for="(obj, index) in List" :key="index">
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
            <div class="card-contents" v-on:click="openModal(obj.id)">
              <div class="card-contents-title">
                {{ obj.todo }}
              </div>
              <div class="card-contents-timelimit">
                {{ obj.limit }}
              </div>
            </div>
            <div class="edit_icons">
              <font-awesome-icon icon="trash-alt" class="icon" v-on:click="openDialog(obj.id)"/>
              <font-awesome-icon icon="edit" class="icon" v-on:click="openModal(obj.id)"/>
            </div>
          </div>
        </div>
        <div class="new_goal">
          <div class="icon">
            <font-awesome-icon icon="plus" v-on:click="openNewModal()"/>
          </div>
        </div>
        <!-- モーダルについて -->
        <div class="overlay" v-show="showContent">
          <div class="content modal_base">
              <div class="page-title">
                <div class="card-status-icon window red">
                  <font-awesome-icon icon="times-circle" class="process-icon" v-on:click="closeModal"/>
                </div>
                <div class="window_title">EDIT TODO</div>
                
              </div>
              <div class="modal_content_area">
                <div class="modal_todo_title">
                  <div class="modal_icon">
                    <font-awesome-icon icon="edit" />
                  </div>
                  <input type="text" v-model="text" class="input_text" />
                </div>
                <div class="modal_time">
                  <div class="modal_icon">
                    <font-awesome-icon icon="clock" />
                  </div>
                  <input type="date" v-model="timelimit" class="input_data" />
                </div>
                <div class="modal_submit">
                  <button
                    v-on:click="edittodo(editingId)"
                    class="process-submit"
                  >
                    ➡︎
                  </button>
                </div>
              </div>
            </div>
        </div>

        <div class="overlay" v-show="showContent2">
          <div class="content modal_base">
              <div class="page-title">
                <div class="card-status-icon window red">
                  <font-awesome-icon icon="times-circle" class="process-icon" v-on:click="closeNewModal"/>
                </div>
                <div class="window_title">NEW TODO</div>
              </div>
              <div class="modal_content_area">
                <div class="modal_todo_title">
                  <div class="modal_icon">
                    <font-awesome-icon icon="edit" />
                  </div>
                  <input type="text" v-model="text" class="input_text" placeholder="Todo作成"/>
                </div>
                <div class="modal_time">
                  <div class="modal_icon">
                    <font-awesome-icon icon="clock" />
                  </div>
                  <input type="date" v-model="timelimit" class="input_data" />
                </div>
                <div class="modal_submit">
                  <button v-on:click="addlist" class="process-submit">
                    ➡︎
                  </button>
                </div>
              </div>
            </div>
        </div>

       
        <dialog id="dg1" class="dg1">
          <p>削除してもいいですか？</p>
          <button
            v-on:click="deletetodo(editingId)"
            v-on:keydown.Enter="closeDialog()"
            class="answer"
          >
            YEN
          </button>
          <button v-on:click="closeDialog()" v-on:keydown.Enter="closeDialog()" class="answer choice">
            NO
          </button>
        </dialog>
      </div>
    </div>
  </div>
</template>

<script >
// @ is an alias to /src
import firebase from "firebase";
import store from "../store";

export default {
  name: "List",
  components: {},
  data() {
    return {
      processtitle: "",
      List: [],
      text: "",
      timelimit: "",
      now: "00:00:00",
      status: null,
      showContent: false,
      showContent2: false,
      editingId: "",
    };
  },
  methods: {
    processrecall() {
      firebase
        .firestore()
        .collection("process")
        .doc(store.getters.getProcessId)
        .get()
        .then(doc => {
          this.processtitle = doc.data().title;
        });
    },
    openModal(index) {
      this.editingId = index;
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .get()
        .then(doc => {
          this.text = doc.data().todo;
          this.timelimit = doc.data().limit;
        });
      this.showContent = true;
    },
    openNewModal() {
      this.showContent2 = true;
    },
    closeModal: function() {
      this.showContent = false;
      this.List = [];
      this.clearbox();
      this.reload();
    },
    openDialog(index) {
      this.editingId = index;
      document.getElementById("dg1").show();
    },
    closeDialog() {
      document.getElementById("dg1").close();
    },
    closeNewModal: function() {
      this.showContent2 = false;
      this.List = [];
      this.clearbox();
      this.reload();
    },
    reload() {
      this.processrecall();
      this.List = [];
      firebase
        .firestore()
        .collection("todo")
        .where("user_id", "==", store.getters.getUserId)
        .where("process_id", "==", store.getters.getProcessId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          //ページ読み込んだと同時にvuexにもデータを同時に入れてる
          const newTodos = this.List.map(todo => {
            const obj = {};
            obj.date = todo.limit;
            obj.title = todo.todo;
            return obj;
          });
          this.$store.dispatch("setTodoAction", { todos: newTodos });
        });
    },
    addlist() {
      var date = new Date();
      this.now =
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
        .collection("todo")
        .add({
          todo: this.text,
          created_at: this.now,
          limit: this.timelimit,
          status: this.status,
          user_id: store.state.now_user_id,
          process_id: store.getters.getProcessId,
        });
      this.List = null;
      this.clearbox();
      this.closeNewModal();
      firebase
        .firestore()
        .collection("todo")
        .where("user_id", "==", store.getters.getUserId)
        .where("process_id", "==", store.getters.getProcessId)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => {
            this.List.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      // todoの中身の情報を整形する
      const newTodos = this.List.map(todo => {
        const obj = {};
        obj.date = todo.limit;
        obj.title = todo.todo;
        return obj;
      });
      this.$store.dispatch("setTodoAction", { todos: newTodos });
      this.clearbox();
    },
    deletetodo(index) {
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .delete()
        .then(function() {
          alert("削除しました");
        })
        .catch(function(error) {
          alert.error("Error removing document: ", error);
        });
      this.List = [];
      this.clearbox();
      document.getElementById("dg1").close();
      this.reload();
    },
    edittodo(index) {
      firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .update({
          todo: this.text,
          limit: this.timelimit,
        })
        .then(() => {
          this.reload();
        });
      this.closeModal();
      this.clearbox();
    },
    clearbox() {
      this.text = "";
      this.timelimit = "";
    },
    check(index) {
      const cloudstatus = document.getElementById("cloud" + index);
      const sunstatus = document.getElementById("sun" + index);
      console.log(cloudstatus);
      console.log(sunstatus);
      firebase
        .firestore()
        .collection("todo")
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
            .collection("todo")
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
  },
  mounted() {
    this.processrecall();
    firebase
      .firestore()
      .collection("todo")
      .where("user_id", "==", store.getters.getUserId)
      .where("process_id", "==", store.getters.getProcessId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.List.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        //ページ読み込んだと同時にvuexにもデータを同時に入れてる
        const newTodos = this.List.map(todo => {
          const obj = {};
          obj.date = todo.limit;
          obj.title = todo.todo;
          return obj;
        });
        this.$store.dispatch("setTodoAction", { todos: newTodos });
        if (this.List.status == false) {
          this.cloud = 1;
        } else {
          this.sun = 1;
        }
      });
  },
};
</script>

<style lang="scss" scoped>
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
    height: 220px;
    background: #fff;
    max-width: 400px;
    min-width: 300px;
    border-radius: 10px;
    overflow: auto;
    text-align: center;
    padding: 10px;
  }
}
.base {
  max-width: 1440px;
  min-width: 300px;

 .home {
  margin: auto;

  .goal-area {
    max-width: 650px;
    min-width: 300px;
    margin: auto;
    
      .page-title-todo{
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
          .cloud{
            color: grey;
          }
          .sun{
            color: orange;
          }
        }
        .edit_icons {
          font-size: 17gipx;
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
}
.modal_content_area {
  width: 300px;
  height: 150px;
  margin: auto;
  background-color: #f8f8f8;
}

.modal_todo_title {
  width: 100%;
  height: 35px;
  font-weight: 500;
  text-align: center;
  padding: 10px 0px;
  display: flex;
}

.input_text {
  font-weight: 500;
  font-size: 130%;
}

.modal_time {
  display: flex;
}
.modal_submit {
  text-align: center;
  height: 50px;
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
  margin-top: 10px;
}
.modal_icon {
  width: 40px;
  text-align: center;
  font-size: 1.33333em;
}

.window{
  font-size: 20px;
  margin-bottom: 10px;
  text-align: left;
  display: flex;
  .process-icon{
    margin-right: 10px;
  }
    .question{
      color: black;
      font-size: 15px;
      padding-right: 20px;
    }
}
.window_title{
  text-align: center;
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
  display: flex;
}
.from-process{
  text-align: center;
  .process-title-main{
      font-weight: bold;
      font-size: 15px;
      line-height: 45px;
      text-align: center;
  }
}

</style>
