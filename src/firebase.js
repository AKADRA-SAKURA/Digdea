import firebase from "firebase";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn_GqELETppbQo_UciVOPZqzHDJERRmLI",
  authDomain: "todo-c4d8f.firebaseapp.com",
  databaseURL: "https://todo-c4d8f.firebaseio.com",
  projectId: "todo-c4d8f",
  storageBucket: "todo-c4d8f.appspot.com",
  messagingSenderId: "56796410064",
  appId: "1:56796410064:web:8826952daeb780b0e2eed5",
  measurementId: "G-86L05VCBE9",
};

const app = firebase.initializeApp(firebaseConfig);

export default app.firestore();
