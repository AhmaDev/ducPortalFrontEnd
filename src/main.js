import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VuePageTransition from "vue-page-transition";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import VueSimpleAlert from "vue-simple-alert";
import Popover from "vue-js-popover";
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import { TiptapVuetifyPlugin } from "tiptap-vuetify";
import VueGlide from "vue-glide-js";
import "vue-glide-js/dist/vue-glide.css";
import VueMeta from "vue-meta";
import i18n from "./i18n";
import VueProgressBar from "vue-progressbar";

import "tiptap-vuetify/dist/main.css";

var token = localStorage.getItem("token");
var locale = localStorage.getItem("locale") || "ar";

Vue.config.productionTip = false;
Vue.prototype.$locale = locale;
Vue.prototype.$baseUrl = "https://api.portal.duc.edu.iq/v1/";
Vue.prototype.$appVersion = "1.5.0";
const axiosConfig = {
  headers: { Authorization: `Bearer ${token}` },
  baseURL: Vue.prototype.$baseUrl,
  timeout: 30000,
};
Vue.http = Vue.prototype.$http = axios.create(axiosConfig);
Vue.mainServerHttp = Vue.prototype.$mainServerHttp = axios.create();
Vue.prototype.$background = "#2C86FC";
Vue.use(VuePageTransition);
Vue.use(Loading, {
  color: Vue.prototype.$background,
});
Vue.use(VueToast, {
  position: "bottom-left",
});
Vue.use(VueSimpleAlert);
Vue.use(Popover);
Vue.use(VueBottomSheet);
Vue.use(VueGlide);
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: "mdi",
});
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

Vue.use(VueProgressBar, {
  color: "#028313",
  failedColor: "#AA0505",
  thickness: "5px",
  transition: {
    speed: "0.2s",
    opacity: "0.6s",
    termination: 300,
  },
  autoRevert: true,
  location: "top",
  inverse: false,
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
