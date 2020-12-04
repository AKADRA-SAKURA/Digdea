import firebase from "firebase";
import "firebase/firestore";
import store from "@/store/index.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1gxX9ayhgCl_wasdWfVR2RtvJqnnGzp8",
  authDomain: "extodo-74f77.firebaseapp.com",
  databaseURL: "https://extodo-74f77.firebaseio.com",
  projectId: "extodo-74f77",
  storageBucket: "extodo-74f77.appspot.com",
  messagingSenderId: "764560772515",
  appId: "1:764560772515:web:50bff7fe668303dbb09e16",
  measurementId: "G-ZZR99KYX7Y",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    /*     console.log(user); */
    store.dispatch("setUserIdAction", { id: user.uid });
  } else {
    /*     console.log(user); */
  }
});
