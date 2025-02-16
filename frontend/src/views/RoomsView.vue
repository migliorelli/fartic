<script setup lang="ts">
import type { AxiosError } from "axios";
import { LogOut, Plus, RotateCcw } from "lucide-vue-next";
import { inject, onMounted, ref } from "vue";
import RoomCard from "../components/cards/RoomCard.vue";
import CreateRoomModal from "../components/modals/CreateRoomModal.vue";
import Button from "../components/ui/Button.vue";
import LoadingText from "../components/ui/LoadingText.vue";
import { AxiosKey } from "../lib/http";
import useGameStore from "../store/game";
import type { Room } from "../types/game";

const axios = inject(AxiosKey);
const game = useGameStore();
const rooms = ref<Room[]>([]);

const loading = ref(true);
const error = ref<string | null>(null);
const creating = ref(false);

const fetchRooms = async () => {
  if (!axios) return;

  try {
    const response = await axios.get("/rooms/public");
    rooms.value = response.data.data;
  } catch (e) {
    const err = e as AxiosError;
    const data = err.response?.data as { message?: string };
    error.value = data?.message ?? err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchRooms();
});
</script>

<template>
  <CreateRoomModal v-if="creating" @close="creating = false" />

  <main class="h-full w-full">
    <div class="container mx-auto flex h-full flex-col p-4 pb-0">
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            class="size-10 rounded-xl bg-transparent text-black hover:bg-gray-100"
            :disabled="loading"
            @click="game.logout()"
          >
            <LogOut :size="20" />
          </Button>
          <h1 class="text-3xl font-bold">Game Rooms</h1>
        </div>
        <div class="flex items-center gap-2">
          <Button
            class="fixed right-5 bottom-5 size-13 rounded-xl text-sm shadow-2xl md:static md:h-10 md:w-auto md:p-4 md:shadow-transparent"
            :disabled="loading"
            @click="creating = true"
          >
            <span class="hidden md:block">Create Room</span>
            <Plus :size="26" class="block md:hidden" />
          </Button>
          <Button
            class="size-10 rounded-xl"
            :disabled="loading"
            @click="fetchRooms"
          >
            <RotateCcw :size="20" />
          </Button>
        </div>
      </div>

      <div
        v-if="loading || error || rooms.length === 0"
        class="flex shrink grow items-center justify-center gap-4 pb-10 text-lg md:text-xl"
      >
        <LoadingText v-if="loading" />
        <h2 class="text-rose-500" v-if="!loading && error">
          {{ error }}
        </h2>
        <h2
          v-if="!loading && !error && rooms.length === 0"
          class="text-center text-gray-600"
        >
          No public rooms available.
          <button
            class="cursor-pointer font-semibold text-violet-400 underline hover:text-violet-800"
            @click="creating = true"
          >
            Create one!
          </button>
        </h2>
      </div>

      <div
        v-if="!loading && !error && rooms.length > 0"
        class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <RoomCard v-for="room in rooms" :key="room._id" :room="room" />
      </div>
    </div>
  </main>
</template>
