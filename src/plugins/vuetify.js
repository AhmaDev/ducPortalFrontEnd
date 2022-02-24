import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
var locale = localStorage.getItem("locale") || "ar";

export default new Vuetify({
  rtl: locale == 'en' ? false : true,
  theme: {
    // dark:true,
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#14B975',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
});
