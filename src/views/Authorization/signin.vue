<template>
  <div>
    <h1>サインインページ</h1>

    <input type="email" v-model="email" placeholder="example@mail.com" />
    <input type="password" v-model="password" placeholder="パスワード" />
    <button v-on:click="login">ログイン</button>

    <button v-on:click="google">Googleアカウントでログイン</button>
    <router-link to="/signup">初めての方はこちら</router-link> |
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
    google() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(
          /* function(result) */ () => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            /*           var token = result.credential.accessToken; */
            // The signed-in user info.
            /*           var user = result.user; */
            // ...
            /*           alert("token : " + token + "User : " + user); */
            this.$router.push("/");
          }
        )
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          // ...
          alert(
            "ログインに失敗しました エラーコード" +
              errorCode +
              "エラーメッセージ" +
              errorMessage +
              "email : " +
              email +
              "credential : " +
              credential
          );
        });
    },
  },
};
</script>

<style></style>
