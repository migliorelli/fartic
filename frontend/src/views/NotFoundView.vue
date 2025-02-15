<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "../components/ui/Button.vue";

const router = useRouter();

const handleReturn = () => {
  router.push({ name: "Login" });
};
</script>

<template>
  <main class="relative grid h-full w-full place-items-center">
    <div
      class="w-[85%] rounded-xl border-1 border-gray-100 p-6 shadow-sm md:w-100"
    >
      <h1 class="mb-8 text-center text-2xl font-bold">
        <span class="text-violet-600">404</span> - Page Not Found
      </h1>
      <div class="flex flex-col gap-5 text-center">
        <p class="text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button @click="handleReturn">Return to Login</Button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
