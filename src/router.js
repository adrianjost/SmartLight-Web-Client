import VueRouter from 'vue-router';

import Login from './pages/Login.vue';

import store from './store'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login, meta: { isPublic: true }},
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["user/isAuthenticated"];
  if (!isAuthenticated && to.matched.some(record => !record.meta.isPublic)) {
    return next({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
  return next();
})

export default router;
