<script setup lang="ts">
import { Users } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import type { Room } from "../../types/game";

interface Props {
  room: Room;
}

defineProps<Props>();
</script>

<template>
  <RouterLink
    class="bg-card text-card-foreground cursor-pointer rounded-xl border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-lg"
    :to="{ name: 'Game', params: { id: room._id } }"
  >
    <div class="flex w-full items-center justify-between">
      <h3 class="text-2xl font-semibold">
        {{ room.name }}
      </h3>
      <div class="flex items-center gap-2 text-sm font-bold text-gray-500">
        <Users :size="18" /> {{ room.players.length }}
      </div>
    </div>
    <div class="mt-4 flex w-full items-center justify-between">
      <span class="text-sm text-gray-400">Click to join</span>
      <span class="text-sm font-bold capitalize">{{ room.theme.name }}</span>
    </div>
  </RouterLink>
</template>
