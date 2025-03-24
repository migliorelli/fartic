<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { capitalize } from "vue";
import Button from "../components/ui/Button.vue";
import Canvas from "../components/ui/Canvas.vue";
import Chat from "../components/ui/Chat.vue";
import usePersistentRef from "../composables/usePersistentRef";

type Channel = "awsers" | "chat";
const channels: Channel[] = ["awsers", "chat"];
const selectedChannel = usePersistentRef<Channel>(
  "game_selected_channel",
  "awsers",
);
</script>

<template>
  <main class="h-full w-full">
    <div class="container mx-auto grid h-full place-items-center">
      <div class="grid h-[80%] w-full grid-cols-4 gap-4">
        <div class="col-span-3 flex flex-col gap-4">
          <Canvas />
        </div>
        <div
          class="col-span-1 flex max-h-[80dvh] flex-col rounded-xl border-1 border-gray-200 bg-gray-200 shadow-sm"
        >
          <div class="relative flex">
            <Button
              v-for="channel in channels"
              :class="
                twMerge(
                  'rounded-xl rounded-b-none bg-transparent text-black transition-colors hover:bg-transparent active:scale-100',
                  'after:pointer-events-none after:absolute after:top-0 after:h-full after:w-[50%] after:bg-transparent',
                  selectedChannel === channel && 'bg-white hover:bg-white',
                )
              "
              @click="selectedChannel = channel"
            >
              {{ capitalize(channel) }}
            </Button>
          </div>
          <Chat :channel="selectedChannel" />
        </div>
      </div>
    </div>
  </main>
</template>
