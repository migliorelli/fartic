import axios, { type AxiosInstance } from "axios";
import type { InjectionKey } from "vue";

const API_URL = "/api";

const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export default http;

export const AxiosKey: InjectionKey<AxiosInstance> = Symbol("http");
