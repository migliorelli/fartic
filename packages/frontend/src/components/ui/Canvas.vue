<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import useCanvas from "../../composables/useCanvas";
import { useOnMounted } from "../../composables/useOnMounted";
import socket from "../../lib/socket";
import useGameStore from "../../store/game";
import CanvasTools from "./CanvasTools.vue";

const { game } = useGameStore();

const canvasContainer = useTemplateRef("canvasContainer");
const canvasSize = computed(() => {
  if (!canvasContainer.value) return { width: 0, height: 0 };

  const { width, height } = canvasContainer.value?.getBoundingClientRect();
  return { width, height };
});

const canvas = useTemplateRef("canvas");
const {
  color,
  lineWidth,
  strokeType,
  startDrawing,
  draw,
  stopDrawing,
  redo,
  undo,
  keyPress,
  updateImages,
} = useCanvas(canvas, {
  width: canvasSize.value.width,
  height: canvasSize.value.height,
  drawCallback: (images) => {
    if (!game.room) return;
    socket.emit("canvas:send", game.room.tag, images);
  },
});

useOnMounted(
  () => {
    socket.on("canvas:receive", (images) => {
      updateImages(images);
    });
  },
  () => {
    socket.off("canvas:receive");
  },
);
</script>

<template>
  <div
    ref="canvasContainer"
    class="aspect-video rounded-xl border-1 border-gray-200 shadow-sm"
  >
    <canvas
      ref="canvas"
      tabindex="1"
      :width="canvasSize.width"
      :height="canvasSize.height"
      @keypress="keyPress"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      @touchcancel="stopDrawing"
      @pointerdown="startDrawing"
      @pointermove="draw"
      @pointerup="stopDrawing"
      @pointerleave="stopDrawing"
      @pointercancel="stopDrawing"
    />
  </div>
  <CanvasTools
    :selected-color="color"
    :line-width="lineWidth"
    :stroke-type="strokeType"
    @update:color="(c) => (color = c)"
    @update:line-width="(lw) => (lineWidth = lw)"
    @update:stroke-type="(st) => (strokeType = st)"
    @undo="undo"
    @redo="redo"
  />
</template>
