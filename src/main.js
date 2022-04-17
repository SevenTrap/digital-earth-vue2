import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ws from "./utils/ws";
import "./components/index";

Vue.prototype.$ws = ws;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
