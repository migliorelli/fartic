<script setup lang="ts">
import { Github } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Button from "../components/ui/Button.vue";
import Checkbox from "../components/ui/Checkbox.vue";
import Input from "../components/ui/Input.vue";
import usePersistentRef from "../composables/usePersistentRef";
import useGameStore from "../store/game";

const router = useRouter();
const game = useGameStore();
const username = usePersistentRef("username", "");
const remind = usePersistentRef("remindUsername", false);
const error = ref<string | null>(null);

const handleSubmit = () => {
  if (error.value !== null) {
    return;
  }

  if (!remind.value) {
    localStorage.setItem("username", "");
  }

  game.login(username.value);
  router.replace({ name: "Rooms" });
};

watch(username, () => {
  if (username.value.length < 4) {
    error.value = "Username must have at least 4 characters.";
  } else {
    error.value = null;
  }
});
</script>

<template>
  <main class="relative grid h-full w-full place-items-center">
    <div
      class="w-[85%] rounded-xl border-1 border-gray-100 p-6 shadow-sm md:w-100"
    >
      <h1 class="mb-8 text-center text-2xl font-bold">
        Welcome to <span class="text-violet-600">Fart</span>ic
      </h1>
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <Input
          placeholder="Username"
          v-model="username"
          label="Username"
          :error="error"
          :maxlength="16"
        />
        <Checkbox v-model="remind">Remind username</Checkbox>
        <Button type="submit">Enter</Button>
      </form>
    </div>
  </main>
  <a
    href="https://github.com/migliorelli/fartic"
    target="_blank"
    class="flex items-center justify-center gap-1 pb-2 transition-colors hover:text-violet-600 md:fixed md:bottom-2 md:left-[50%] md:-translate-x-[50%] md:pb-0"
  >
    <Github :size="16" /> Checkout on GitHub
  </a>
</template>

<style scoped></style>
