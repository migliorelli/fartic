import { createApp } from "vue";
import App from "./App.vue";
import http, { AxiosKey } from "./lib/http";
import router from "./router";
import pinia from "./store/pinia";
import "./style.css";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.provide(AxiosKey, http);

app.mount("#app");
