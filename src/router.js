import VueRouter from 'vue-router';
import Dashboard from './pages/Dashboard.vue';
import Api from './pages/Api.vue';

const router = new VueRouter({
  /* mode: 'history', */
  routes: [
    { path: '/api', component: Api },
    { path: '/*', component: Dashboard }
  ]
});

export default router;
