<script setup lang="ts">
import socket, { bindDefaultEvents } from "./lib/socket";
import useGameStore from "./store/game";

const game = useGameStore();
socket.off();
bindDefaultEvents();
game.bindEvents();
</script>

<template>
  <RouterView />
</template>
