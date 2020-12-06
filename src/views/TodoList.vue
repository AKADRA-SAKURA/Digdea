<template>
  <div class="base">
    <div class="base-content">
      <div class="goal-area">
        <div class="page-title">TODO LIST</div>
        {{ processtitle }}

        <div v-for="(obj, index) in List" :key="index">
          <div class="card-base">
            <div class="card-status-icon">
              <input
                type="checkbox"
                v-model="obj.status"
                v-on:click="check(obj.id)"
              />
              <font-awesome-icon icon="cloud" class="cloud" />
            </div>
            <div class="card-contents">
              <div class="card-contents-title">
                {{ obj.todo }}
              </div>
              <div class="card-contents-timelimit">
                {{ obj.limit }}
              </div>
              <button v-on:click="deletetodo(obj.id)">削除</button>
              <button v-on:click="openModal(obj.id)">編集</button>
            </div>
          </div>
        </div>
        <button v-on:click="openNewModal()">新規作成</button>

        <!-- モーダルについて -->
        <div id="overlay" v-show="showContent">
          <div id="content">
            <div id="content" class="modal_base">
              <div class="page-title">
                <font-awesome-icon
                  icon="window-close"
                  v-on:click="closeModal"
                />
                EDIT TODO
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
        </div>

        <div id="overlay" v-show="showContent2">
          <div id="content">
            <div id="content" class="modal_base">
              <div class="page-title">
                <font-awesome-icon
                  icon="window-close"
                  v-on:click="closeNewModal"
                />
                新規作成
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
                  <button v-on:click="addlist" class="process-submit">
                    ➡︎
                  </button>
                </div>
              </div>
            </div>
          </div>
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
  name: "List",
  components: {},
  data() {
    return {
      processtitle: "",
      List: [],
      text: "",
      timelimit: "",
      now: "00:00:00",
      status: false,
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
      var res = confirm("削除してもいいですか？");
      if (res == true) {
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
        this.reload();
      }
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
      console.log(index, this.status);
      /*       firebase
        .firestore()
        .collection("todo")
        .doc(index)
        .get()
        .add({
          status: this.List.status,
        }); */
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
      });
  },
};
</script>

<style scoped>
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
  width: 300px;
  height: 200px;
  padding: 1em;
  background: #fff;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
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
</style>
