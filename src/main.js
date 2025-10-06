import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'fullpage.js/dist/fullpage.min.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App),
  mounted() {
    AOS.init({ duration: 800, once: true });
    // 设置HTML lang属性
    document.documentElement.lang = i18n.locale;
  }
}).$mount('#app');
