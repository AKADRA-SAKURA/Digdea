<template>
  <div>
    <h1>サインアップページ</h1>

    <input type="email" v-model="email" placeholder="example@mail.com" />
    <input type="password" v-model="password" placeholder="パスワード" />
    <input
      type="password"
      v-model="password2"
      placeholder="パスワード(確認用)"
    />
    <input type="email" v-model="lineID" placeholder="lineID" />
    <button v-on:click="signup">サインアップ</button>
    <router-link to="/signin">アカウントをお持ちの方はこちら</router-link> |
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      lineID: "",
    };
  },
  methods: {
    signup() {
      if (this.email == null || this.email == "") {
        alert("メアドが未入力です");
        return;
      }
      if (this.password == null || this.password == "") {
        alert("パスワードが未入力です");
        return;
      }
      if (this.password != this.password2) {
        alert("パスワードが一致しません");
        return;
      }
      if (this.lineID != this.lineID) {
        alert("LineIDが未入力です。");
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((res) => {
          console.log(res);
          const linearisa = {
            user_id: res.user.uid,
            line_id: this.lineID,
          }
          this.$router.push("/");
          firebase
            .firestore()
            .collection("line")
            .add(linearisa)
        })
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
          alert(
            "ログインに失敗しました エラーコード" +
              errorCode +
              "エラーメッセージ" +
              errorMessage
          );
        });
    },
  },
};
</script>

<style></style>
