import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Charts from './components/Charts.vue';
import CryptoStrategies from './components/CryptoStrategies.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/charts', name: 'Charts', component: Charts },
    { path: '/crypto-strategies', name: 'CryptoStrategies', component: CryptoStrategies }
  ]
});
