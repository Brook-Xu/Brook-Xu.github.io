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

// 添加全局CSS修复AOS透明度问题
const style = document.createElement('style');
style.textContent = `
  /* 确保AOS元素在没有动画时也可见 */
  [data-aos] {
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  /* 当AOS动画完成时，确保元素保持可见 */
  [data-aos].aos-animate {
    opacity: 1 !important;
    visibility: visible !important;
  }
`;
document.head.appendChild(style);

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App),
  mounted() {
    // 初始化AOS，确保动画正常工作
    AOS.init({ 
      duration: 800, 
      once: true,
      offset: 100,
      delay: 0,
      easing: 'ease-in-out'
    });
    
    // 设置HTML lang属性
    document.documentElement.lang = i18n.locale;
    
    // 确保AOS正确刷新
    this.$nextTick(() => {
      AOS.refresh();
    });
  }
}).$mount('#app');
