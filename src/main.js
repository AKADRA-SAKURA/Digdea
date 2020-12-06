import Vue from "vue";
import App from "./App.vue";
import "./firebase.js"; // これを追加
import router from "./router";
import Vuex from "vuex";
import store from "./store";
//fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import jQuery from "jquery";
global.jquery = jQuery;
global.$ = jQuery;
window.$ = window.jQuery = require("jquery");

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
