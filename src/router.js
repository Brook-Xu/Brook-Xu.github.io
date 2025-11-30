import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Charts from './components/Charts.vue';
import CryptoStrategies from './components/CryptoStrategies.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import ForgotPassword from './components/ForgotPassword.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/charts', name: 'Charts', component: Charts },
    { path: '/crypto-strategies', name: 'CryptoStrategies', component: CryptoStrategies },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword }
  ]
});
