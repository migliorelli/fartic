<script setup lang="ts">
import type { AxiosError } from "axios";
import JsonEditorVue from "json-editor-vue";
import { Mode } from "vanilla-jsoneditor";
import { inject, ref } from "vue";
import Button from "../components/ui/Button.vue";
import Input from "../components/ui/Input.vue";
import Select from "../components/ui/Select.vue";
import usePersistentRef from "../composables/usePersistentRef";
import { AxiosKey } from "../lib/http";

type Method = "get" | "post" | "put" | "delete";

const axios = inject(AxiosKey);
const route = usePersistentRef("admin_api_tester_route", "/ping");
const method = ref<Method>("get");
const jsonData = usePersistentRef("admin_api_tester_json_data", "{}");
const response = ref("{}");

const methods = [
  { value: "get", label: "GET" },
  { value: "post", label: "POST" },
  { value: "put", label: "PUT" },
  { value: "delete", label: "DELETE" },
];

const handleRequest = async () => {
  if (!axios) return;

  try {
    const res = await axios[method.value](
      route.value,
      ["post", "put"].includes(method.value)
        ? JSON.parse(jsonData.value)
        : undefined,
    );

    response.value = res.data;
  } catch (err) {
    const error = err as AxiosError;
    const data = error.response?.data as { message: string };
    response.value = `${method.value.toUpperCase()} ${route.value} ${data.message}`;
  }
};
</script>

<template>
  <main class="container mx-auto flex h-full w-full flex-col p-4">
    <h1 class="mb-4 text-3xl font-bold">Admin Dashboard</h1>

    <div class="flex flex-col">
      <h2 class="mb-4 text-xl font-bold">API Tester</h2>

      <div class="mb-4 flex">
        <div class="w-24">
          <Select
            v-model="method"
            :data="methods"
            class="rounded-none rounded-l-lg focus:ring-transparent"
          />
        </div>
        <div class="grow">
          <Input
            v-model="route"
            placeholder="API Route"
            class="rounded-none ring-0 focus:ring-transparent"
          />
        </div>
        <Button
          @click="handleRequest"
          class="w-24 scale-100 rounded-none rounded-r-lg active:scale-100"
        >
          Send
        </Button>
      </div>

      <div class="grid h-130 max-h-130 grid-cols-2 grid-rows-1 gap-4">
        <div class="flex flex-col">
          <h3 class="mb-2 font-semibold">Request Body</h3>
          <JsonEditorVue
            foram
            v-model="jsonData"
            class="h-130 max-h-130 shrink grow"
            :mode="Mode.text"
          />
        </div>

        <div class="flex flex-col">
          <h3 class="mb-2 font-semibold">Response</h3>
          <pre
            class="h-130 max-h-130 shrink grow overflow-auto rounded-lg bg-gray-100 p-4 break-words whitespace-pre-wrap"
            >{{ response }}
            </pre
          >
        </div>
      </div>
    </div>
  </main>
</template>
