import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Calendar from "../views/Calendar.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/process",
    name: "Process",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Process.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/todolist",
    name: "TodoList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TodoList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "signin",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/Authorization/signin.vue"
      ),
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/Authorization/signup.vue"
      ),
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (store.getters.getUserId != null) {
      next();
    } else {
      next({
        path: "/signin",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;
