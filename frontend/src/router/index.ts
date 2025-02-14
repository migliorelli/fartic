import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import useGameStore from "../store/game";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import RoomsView from "../views/RoomsView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: LoginView,
    name: "Login",
  },
  {
    path: "/rooms",
    component: RoomsView,
    name: "Rooms",
  },
  {
    path: "/rooms/:id",
    component: GameView,
    name: "Game",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from) => {
  const game = useGameStore();

  if (to.path !== "/" && !game.logged) {
    return { name: "Login" };
  }

  if (to.path === "/" && game.logged) {
    return { name: "Rooms" };
  }
});

export default router;
