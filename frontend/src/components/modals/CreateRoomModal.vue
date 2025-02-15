<script setup lang="ts">
import type { AxiosError } from "axios";
import { X } from "lucide-vue-next";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { AxiosKey } from "../../lib/http";
import type { Theme } from "../../types/game";
import Button from "../ui/Button.vue";
import Checkbox from "../ui/Checkbox.vue";
import Input from "../ui/Input.vue";
import LoadingSpin from "../ui/LoadingSpin.vue";
import Select from "../ui/Select.vue";

interface Emits {
  (event: "close"): void;
}

const emit = defineEmits<Emits>();
const router = useRouter();
const axios = inject(AxiosKey);
const loading = ref(true);
const loadingForm = ref(false);
const open = ref(false);
const error = ref<string | null>(null);

const limit = ref("8");
const limitError = ref<null | string>(null);

const targetPontuation = ref("120");
const targetPontuationError = ref<null | string>(null);

const privateRoom = ref(false);

const themeError = ref<null | string>(null);
const selectedTheme = ref("default");
const themes = ref<Theme[]>([]);
const options = computed(() =>
  themes.value.map((theme) => ({ value: theme._id, label: theme.name })),
);

const handleClose = () => {
  if (!loadingForm.value) {
    open.value = false;
  }
};

const fetchThemes = async () => {
  if (!axios) return;
  loading.value = true;

  try {
    const response = await axios.get("/themes");
    themes.value = response.data.data;
  } catch (error) {
    console.error(error);
    handleClose();
  } finally {
    loading.value = false;
  }
};

const validate = {
  theme() {
    if (selectedTheme.value === "default") {
      themeError.value = "Select a theme.";
    } else {
      themeError.value = null;
    }
  },
  limit() {
    if (Number(limit.value) < 8) {
      limitError.value = "Limit must be equal or greater than 8.";
    } else if (Number(limit.value) > 100) {
      limitError.value = "Limit must be equal or less than 100.";
    } else {
      limitError.value = null;
    }
  },
  target() {
    if (Number(targetPontuation.value) < 50) {
      targetPontuationError.value =
        "Target pontuation must be equal or greater than 50.";
    } else if (Number(targetPontuation.value) > 200) {
      targetPontuationError.value =
        "Target pontuation must be equal or less than 200.";
    } else {
      targetPontuationError.value = null;
    }
  },
};

watch(selectedTheme, validate.theme);
watch(limit, validate.limit);
watch(targetPontuation, validate.target);

const handleSubmit = async () => {
  if (!axios) return;

  // validate all fields
  Object.values(validate).forEach((value) => {
    value();
  });

  const hasError =
    limitError.value || targetPontuationError.value || themeError.value;
  if (hasError) return;

  loadingForm.value = true;
  error.value = null;

  try {
    const response = await axios.post("/rooms", {
      limit: Number(limit.value),
      targetPontuation: Number(targetPontuation.value),
      theme: selectedTheme.value,
      private: privateRoom.value,
    });

    const { data } = response.data;
    router.push({ name: "Game", params: { id: data._id } });
  } catch (e) {
    const err = e as AxiosError;
    const data = err.response?.data as { message: string };
    error.value = data.message;
  } finally {
    loadingForm.value = false;
  }
};

onMounted(async () => {
  open.value = true;

  await fetchThemes();

  // prevent scroll when modal is open
  document.body.style.setProperty("overflow", "hidden");
});

onUnmounted(() => {
  // enable scroll when modal is closed
  document.body.style.setProperty("overflow", "auto");
});

onBeforeUnmount(() => {
  open.value = false;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade" @after-leave="emit('close')">
      <div
        v-if="open"
        class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center"
      >
        <div
          @click.stop="handleClose"
          class="grid h-full w-full place-items-center bg-black/50"
        >
          <LoadingSpin v-if="loading" class="size-20 border-8 border-white" />
        </div>
        <div class="absolute w-full max-w-md p-4" v-if="!loading">
          <div
            class="rounded-xl border-1 border-gray-100 bg-white p-6 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold">Create Room</h2>
              <button
                @click="handleClose"
                class="cursor-pointer rounded-lg p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="loadingForm"
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

              <Button :disabled="loadingForm">
                <LoadingSpin
                  v-if="loadingForm"
                  class="size-4 border-2 border-white"
                />
                {{ loadingForm ? "Creating..." : "Create" }}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
