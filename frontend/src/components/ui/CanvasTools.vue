<script setup lang="ts">
import {
  Brush,
  Circle,
  Eraser,
  PaintBucket,
  Redo,
  Ruler,
  Square,
  Triangle,
  TriangleRight,
  Undo,
  type LucideProps,
} from "lucide-vue-next";
import { twMerge } from "tailwind-merge";
import type { FunctionalComponent, StyleValue } from "vue";
import StrokeType from "../../enums/canvas";

interface DrawOption {
  key: StrokeType;
  icon: FunctionalComponent<LucideProps, {}, any, {}>;
}

interface Props {
  selectedColor: string;
  lineWidth: number;
  strokeType: StrokeType;
}

interface Emits {
  (event: "update:color", color: string): void;
  (event: "update:stroke-type", type: StrokeType): void;
  (event: "update:line-width", width: number): void;
  (event: "undo"): void;
  (event: "redo"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const drawOptions: DrawOption[] = [
  { key: StrokeType.Dash, icon: Brush },
  { key: StrokeType.Eraser, icon: Eraser },
  { key: StrokeType.Square, icon: Square },
  { key: StrokeType.Circle, icon: Circle },
  { key: StrokeType.Triangle, icon: Triangle },
  { key: StrokeType.HalfTriangle, icon: TriangleRight },
  { key: StrokeType.Line, icon: Ruler },
  { key: StrokeType.PaintBucket, icon: PaintBucket },
];

// prettier-ignore
const colors = [
  "#000000","#3f3f46","#372aac","#0d542b","#82181a","#9f2d00",
  "#ffffff","#d4d4d8","#7c86ff", "#00c951","#fb2c36","#ff6900",
  "#a65f00","#ffdf20","#861043", "#f6339a","#721378","#e12afb",
];

const getColorStyles = (color: string): StyleValue => {
  return {
    borderColor: color === "#ffffff" ? "#d4d4d8" : "transparent",
    borderWidth: "2px",
    outlineWidth: "2px",
    outlineOffset: "2px",
    borderStyle: "solid",
    outlineStyle: "solid",
    backgroundColor: color,
    outlineColor:
      color === props.selectedColor
        ? color === "#ffffff"
          ? "#d4d4d8"
          : props.selectedColor
        : "transparent",
  };
};
</script>

<template>
  <div class="flex h-full w-full grow items-center gap-4">
    <div
      class="grid h-full grid-flow-col grid-cols-4 grid-rows-2 place-items-center rounded-xl border-1 border-gray-200 p-4 shadow-sm"
    >
      <button
        v-for="option in drawOptions"
        :class="twMerge('tool-btn', strokeType === option.key && 'selected')"
        @click="emit('update:stroke-type', option.key)"
      >
        <component :is="option.icon" :size="28" />
      </button>
      <button class="tool-btn" @click="emit('undo')">
        <Undo />
      </button>
      <button class="tool-btn" @click="emit('redo')">
        <Redo />
      </button>
    </div>

    <div
      class="grid h-full grid-cols-6 grid-rows-3 place-items-center rounded-xl border-1 border-gray-200 p-4 shadow-sm"
    >
      <button
        v-for="color in colors"
        :key="color"
        :style="getColorStyles(color)"
        :class="twMerge('m-2 size-8 cursor-pointer rounded-lg transition-all')"
        @click="emit('update:color', color)"
      ></button>
    </div>

    <div
      class="h-full grow rounded-xl border-1 border-gray-200 p-4 shadow-sm"
    ></div>
  </div>
</template>
