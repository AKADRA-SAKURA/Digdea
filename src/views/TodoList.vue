<template>
  <div>
    <input type="text" v-model="todolist" v-on:keyup.enter="addlist" />
    <button v-on:click="addlist" v-on:keyup.enter="addlist">
      送信
    </button>
    <div v-for="obj in List" v-bind:key="obj">
      {{ obj.todo }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";

export default {
  name: "List",
  components: {},
  data() {
    return {
      List: [],
      todolist: "",
      now: "00:00:00",
    };
  },
  methods: {
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
      this.List.push(this.todolist);
      firebase
        .firestore()
        .collection("todo")
        .add({
          todo: this.todolist,
          created_at: this.now,
        });
      this.todolist == "";
    },
  },
  mounted() {
    firebase
      .firestore()
      .collection("todo")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          this.List.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
  },
};
</script>
