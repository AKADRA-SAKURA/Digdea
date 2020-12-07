<template>
  <div class="Sign_area">
    <div class="sign_title">Welcome</div>
    <div class="sign_input_area">
      <div class="sign_input">
        <input type="email" class="sign" v-model="email" placeholder="example@mail.com" />
      </div>
      <div class="sign_input">
        <input type="password" class="sign" v-model="password" placeholder="パスワード" />
      </div>
      <div class="select">
        <button class="sign_button " v-on:click="login"><span class="up">LOG IN</span></button>
      </div>
      <div class="sign_button">
        <router-link to="/signup" class="up">SIGN UP</router-link>
      </div>
      <button class="google_button" v-on:click="google">Googleアカウントでログイン</button>

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

<style lang="scss">
  .Sign_area{
    margin: auto;
    width: 85%;
    max-width: 400px;
    min-width: 300px;
    border-radius: 10px;
    text-align: center;
    background-color: white;
    padding-bottom: 30px;

     
    
  
    .sign_title{
      width: 100%;
      height: 50px;
      font-size: 40px;
      font-size: 15.5px;
      line-height: 50px;
      font-weight: bold;
      border-bottom: 1px solid #F0F0F0;
      text-align: center;
    }
    .sign_input_area{
      width: 80%;
      font-size: 30px;
      margin: auto;
      color: #383838;
      
      .sign_input{
        display: flex;
        

        .sign{
          width: 70%;
          height: 25px;
          font-weight: bold;
          font-size: 15.5px;
          line-height: 22px;
          border: 0.5px solid #f2e9e3;
          border-radius: 5px;
          align-items: center;
          text-align: center;
          margin: 10px auto;
        }
        
      }
      .sign_button{
          border: 1px solid #3d9e8d;
          box-sizing: border-box;
          border-radius: 10px;
          background-color: white;
          width: 75px;
          height: 30px;
          margin: 5px auto;
          display: flex;
          font-weight: bold;

      }
      
     

      .google_button{
        border: 1px solid #3d9e8d;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: white;

        font-size: 13px;
        height: 35px;
      }
      .up{
        font-size: 13px;
        text-decoration: none;
        margin: auto;
        color: #383838;
      }
       .select{
         margin-bottom: 30px;
         .sign_button{
          background-color: #3d9e8d;
          
            .up{
              color: white;
            }
          }
       }
    
    }
    
  }
   
</style>
