<script setup lang="ts">
import { Github } from "lucide-vue-next";
import socket from "./lib/socket";
import useGameStore from "./store/game";

const game = useGameStore();
socket.off();
game.bindEvents();
</script>

<template>
  <RouterView />
  <a
    href="https://github.com/migliorelli/fartic"
    target="_blank"
    class="flex items-center justify-center gap-1 pb-2 md:pb-0 transition-colors hover:text-violet-600 md:fixed md:bottom-2 md:left-[50%] md:-translate-x-[50%]"
  >
    <Github :size="16" /> Checkout on GitHub
  </a>
</template>
