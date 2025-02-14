<script setup lang="ts">
import { X } from "lucide-vue-next";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import { AxiosKey } from "../../lib/http";
import type { Theme } from "../../types/game";
import Button from "../ui/Button.vue";
import Checkbox from "../ui/Checkbox.vue";
import Input from "../ui/Input.vue";
import Select from "../ui/Select.vue";

interface Emits {
  (event: "close"): void;
}

const emit = defineEmits<Emits>();
const axios = inject(AxiosKey);

const limit = ref("8");
const limitError = ref<null | string>(null);

const targetPontuation = ref("120");
const targetPontuationError = ref<null | string>(null);

const privateRoom = ref(false);

const themeError = ref<null | string>(null);
const selectedTheme = ref("default");
const themes = ref<Theme[]>([
  { _id: "1", name: "Natureza", words: [] },
  { _id: "2", name: "Tecnologia", words: [] },
  { _id: "3", name: "Esportes", words: [] },
  { _id: "4", name: "Música", words: [] },
  { _id: "5", name: "Cinema", words: [] },
  { _id: "6", name: "História", words: [] },
  { _id: "7", name: "Ciência", words: [] },
  { _id: "8", name: "Culinária", words: [] },
  { _id: "9", name: "Geografia", words: [] },
  { _id: "10", name: "Literatura", words: [] },
]);
const options = computed(() =>
  themes.value.map((theme) => ({ value: theme._id, label: theme.name })),
);

const fetchThemes = async () => {
  if (!axios) return;

  try {
    const response = await axios.get<Theme[]>("/themes");
    themes.value = response.data;
  } catch (error) {
    // emit("close");
    console.error(error);
  }
};

const handleClose = () => {
  emit("close");
};

watch(selectedTheme, () => {
  if (selectedTheme.value === "default") {
    themeError.value = "Select a theme.";
  }
});

watch(limit, () => {
  if (Number(limit.value) < 8) {
    limitError.value = "Limit must be equal or greater than 8.";
  } else if (Number(limit.value) > 100) {
    limitError.value = "Limit must be equal or less than 100.";
  } else {
    limitError.value = null;
  }
});

watch(targetPontuation, () => {
  if (Number(targetPontuation.value) < 50) {
    targetPontuationError.value =
      "Target pontuation must be equal or greater than 50.";
  } else if (Number(targetPontuation.value) > 200) {
    targetPontuationError.value =
      "Target pontuation must be equal or less than 200.";
  } else {
    targetPontuationError.value = null;
  }
});

const handleSubmit = () => {
  if (limitError.value || targetPontuationError.value) return;

  console.log("Creating room...");
};

onMounted(async () => {
  document.body.style.setProperty("overflow", "hidden");
});

onUnmounted(() => {
  document.body.style.setProperty("overflow", "auto");
});

// await new Promise((r) => setTimeout(r, 2000));
await fetchThemes();
</script>

<template>
  <Transition>
    <Teleport to="body">
      <div
        class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center"
      >
        <div
          @click.stop="handleClose"
          class="h-full w-full bg-black opacity-50"
        />
        <div class="absolute w-full max-w-md p-4">
          <div
            class="rounded-xl border-1 border-gray-100 bg-white p-6 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold">Create Room</h2>
              <button
                @click="handleClose"
                class="cursor-pointer rounded-lg p-1 hover:bg-gray-100"
              >
                <X :size="24" />
              </button>
            </div>
            <form
              class="mt-4 flex flex-col gap-4"
              @submit.prevent="handleSubmit"
            >
              <Input
                v-model="limit"
                type="number"
                placeholder="Users limit"
                :min="8"
                label="Users limit"
                :max="100"
                :error="limitError"
              />

              <Input
                v-model="targetPontuation"
                type="number"
                label="Target pontuation"
                placeholder="Target pontuation"
                :max="200"
                :min="50"
                :error="targetPontuationError"
              />

              <Select
                v-model="selectedTheme"
                :data="options"
                placeholder="Select theme"
                :error="themeError"
                label="Select theme"
              />

              <Checkbox v-model="privateRoom">Private room</Checkbox>

              <Button>Create</Button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 200ms;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
