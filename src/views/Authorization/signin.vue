<template>
  <div>
    <h1>サインインページ</h1>

    <input type="email" v-model="email" placeholder="example@mail.com" />
    <input type="password" v-model="password" placeholder="パスワード" />
    <button v-on:click="login">ログイン</button>

    <div class="signin/up">
      アカウントをお持ちでない方→<router-link to="/signup"
        >サインアップ</router-link
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.email == null || this.email == "") {
        alert("メアドが未入力です");
        return;
      }
      if (this.password == null || this.password == "") {
        alert("パスワードが未入力です");
        return;
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
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
