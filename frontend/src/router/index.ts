import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import useGameStore from "../store/game";
import AdminView from "../views/AdminView.vue";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RoomsView from "../views/RoomsView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
    name: "NotFound",
  },
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
    path: "/game/:tag",
    component: GameView,
    name: "Game",
  },
  {
    path: "/admin",
    component: AdminView,
    name: "Admin",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from) => {
  const game = useGameStore();

  const isLoginPage = to.name === "Login";
  const isAdminPage = to.name?.toString().startsWith("Admin") || false;
  const isGamePage = to.name === "Game";

  if (!isLoginPage && !isAdminPage && !game.logged) {
    return { name: "Login" };
  }

  if (isLoginPage && game.logged) {
    return { name: "Rooms" };
  }

  if (isGamePage) {
    const tag = to.params.tag;

    if (typeof tag !== "string") {
      return { name: "NotFound" };
    }

    try {
      await game.joinGame(tag);
      if (!game.game.initalized) {
        throw new Error("Game failed to initialize");
      }
    } catch (error) {
      console.error("Failed to join game:", error);
      return { name: "Rooms" };
    }
  }
});

export default router;
