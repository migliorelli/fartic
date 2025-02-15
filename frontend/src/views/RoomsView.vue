<script setup lang="ts">
import { LogOut, Plus, RotateCcw } from "lucide-vue-next";
import { inject, onMounted, ref } from "vue";
import RoomCard from "../components/cards/RoomCard.vue";
import CreateRoomModal from "../components/modals/CreateRoomModal.vue";
import Button from "../components/ui/Button.vue";
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
    const response = await axios.get("/rooms");
    if (response.status !== 200) throw new Error(response.data.message);

    rooms.value = response.data.data;
  } catch (e) {
    const err = e as AxiosError;
    const data = err.response?.data as { message: string };
    error.value = data.message;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchRooms();
});
</script>

<template>
  <Suspense v-if="creating">
    <template #default>
      <CreateRoomModal @close="creating = false" />
    </template>
    <template #fallback>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
      >
        <div
          class="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"
        ></div>
      </div>
    </template>
  </Suspense>

  <main class="h-full w-full">
    <div class="container mx-auto h-full p-4 pb-0">
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

      <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RoomCard v-for="room in rooms" :key="room._id" :room="room" />
      </div>
    </div>
  </main>
</template>
