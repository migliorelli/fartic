<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "../components/ui/Button.vue";

const num = ref(0);

onMounted(() => {
  console.log("mounted");
});
</script>

<template>
  <Button @click="num++" />
</template>
