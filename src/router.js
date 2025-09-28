import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Upload from './components/Upload.vue';
import Charts from './components/Charts.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/upload', component: Upload },
    { path: '/charts', component: Charts }
  ]
});
