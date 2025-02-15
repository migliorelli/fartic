<script setup lang="ts">
import socket from "./lib/socket";
import useGameStore from "./store/game";

const game = useGameStore();
socket.off();
game.bindEvents();
</script>

<template>
  <RouterView />
</template>
