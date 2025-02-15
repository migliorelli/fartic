<script setup lang="ts">
import { twMerge } from "tailwind-merge";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="
      twMerge(
        'size-10 animate-spin rounded-full border-4 border-solid border-violet-600',
        props.class,
        'border-t-transparent',
      )
    "
  ></div>
</template>
