<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { capitalize, onMounted, ref, useTemplateRef } from "vue";
import Button from "../components/ui/Button.vue";
import Canvas from "../components/ui/Canvas.vue";
import CanvasTools from "../components/ui/CanvasTools.vue";
import Chat from "../components/ui/Chat.vue";
import usePersistentRef from "../composables/usePersistentRef";
import StrokeType from "../enums/canvas";

type Channel = "awsers" | "chat";
const channels: Channel[] = ["awsers", "chat"];
const selectedChannel = usePersistentRef<Channel>(
  "game_selected_channel",
  "awsers",
);

const canvasContainer = useTemplateRef("canvasContainer");
const canvasSize = ref({ width: 0, height: 0 });

const strokeType = ref(StrokeType.Dash);
const color = ref("#000000");
const lineWidth = ref(5);

onMounted(() => {
  if (!canvasContainer.value) return;

  const { height, width } = canvasContainer.value.getBoundingClientRect();
  canvasSize.value = { width, height };
});
</script>

<template>
  <main class="h-full w-full">
    <div class="container mx-auto grid h-full place-items-center">
      <div class="grid h-[80%] w-full grid-cols-4 gap-4">
        <div class="col-span-3 flex flex-col gap-4">
          <div
            ref="canvasContainer"
            class="aspect-video rounded-xl border-1 border-gray-200 shadow-sm"
          >
            <Canvas
              :width="canvasSize.width"
              :height="canvasSize.height"
              :stroke-type="strokeType"
              :line-width="lineWidth"
              :color="color"
            />
          </div>
          <CanvasTools
            :selected-color="color"
            :line-width="lineWidth"
            :stroke-type="strokeType"
            @update:color="(c) => (color = c)"
            @update:line-width="(lw) => (lineWidth = lw)"
            @update:stroke-type="(st) => (strokeType = st)"
          />
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
