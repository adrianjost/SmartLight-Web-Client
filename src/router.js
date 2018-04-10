import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import Api from './components/Api.vue';

const router = new VueRouter({
  /* mode: 'history', */
  routes: [
    { path: '/', component: Dashboard },
    { path: '/api', component: Api },
    { path: '/*', component: Dashboard }
  ]
});

export default router;
