import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { markRaw } from "vue";
import router from "../router";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

export default pinia;
