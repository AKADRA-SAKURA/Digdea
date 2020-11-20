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
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
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
