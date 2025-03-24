<script setup lang="ts">
import { ref } from "vue";

const letters = ref("Loading...".split(""));
</script>

<template>
  <div
    class="text-center text-3xl font-bold text-violet-300 transition-all md:text-4xl"
  >
    <span
      v-for="(letter, i) in letters"
      :key="letter"
      :style="{
        '--i': i,
        '--length': letters.length,
      }"
    >
      {{ letter }}
    </span>
  </div>
</template>

<style scoped>
span {
  --color: oklch(0.491 0.27 292.581); /* violet-700 */
  --delay: calc(var(--i) * 0.15s);
  --duration: calc(var(--length) * 0.15s);

  display: inline-block;
  animation: animateLetter infinite;
  animation-delay: var(--delay);
  animation-duration: var(--duration);
}

@keyframes animateLetter {
  0% {
    transform: translateY(0rem);
  }
  25% {
    transform: translateY(-0.5rem);
    color: var(--color);
  }
  50% {
    transform: translateY(0rem);
  }
  100% {
    transform: translateY(0rem);
  }
}
</style>
