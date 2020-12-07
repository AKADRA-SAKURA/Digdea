<template>
  <div class="Sign_area">
    <div class="sign_title">SIGN UP</div>
    <div class="sign_input_area">
      <div class="sign_input">
        <input type="email" class="sign" v-model="email" placeholder="example@mail.com" />
      </div>
      <div class="sign_input">
        <input type="password" class="sign" v-model="password" placeholder="パスワード" />
      </div>
      <div class="sign_input">
        <input type="password" class="sign" v-model="password2" placeholder="パスワード(確認用)"/>
      </div>
      <div class="sign_input">
        <input type="email"  class="sign" v-model="lineID" placeholder="lineID" />
      </div>
      <div class="select">
        <button class="sign_button" v-on:click="signup"><span class="up">SIGN UP</span></button>
      </div>
      <div class="sign_button">
        <router-link to="/signin" class="up">LOG IN</router-link>
      </div>
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
         margin: 10px 0px 30px;
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
