import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard.vue';

const router = new VueRouter({
  /* mode: 'history', */
  routes: [
    { path: '/', component: Dashboard },
    { path: '/*', component: Dashboard }
  ]
});

export default router;
