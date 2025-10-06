import Vue from 'vue';
import App from './App.vue';
import router from './router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  mounted() {
    AOS.init({ duration: 800, once: true });
  }
}).$mount('#app');
