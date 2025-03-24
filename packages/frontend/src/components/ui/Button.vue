<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import {
  useTemplateRef,
  type ButtonHTMLAttributes,
  type StyleValue,
} from "vue";

interface Props {
  type?: ButtonHTMLAttributes["type"];
  disabled?: boolean;
  style?: StyleValue;
  class?: string;
  icon?: boolean;
  hover?: "lighten" | "darken" | "default";
}

interface Emits {
  (event: "click", nativeEvent: MouseEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const button = useTemplateRef("button");

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};

defineExpose({ button });
</script>

<template>
  <button
    ref="button"
    :type="props.type"
    :disabled="props.disabled"
    :style="props.style"
    :class="
      twMerge(
        'flex h-10 w-full disabled:active:scale-100 cursor-pointer items-center justify-center gap-[1ch] rounded-lg border-none bg-violet-600 p-2 font-semibold text-white transition-all outline-none select-none hover:bg-violet-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
    @click="handleClick"
  >
    <slot />
  </button>
</template>
