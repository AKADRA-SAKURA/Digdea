import Vue from "vue";
import App from "./App.vue";
import "./firebase.js"; // これを追加
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
