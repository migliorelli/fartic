<script setup lang="ts">
import { X } from "lucide-vue-next";
import { twMerge } from "tailwind-merge";
import type { InputHTMLAttributes } from "vue";
import { computed } from "vue";

interface Props {
  modelValue: string;
  type?: InputHTMLAttributes["type"];
  disabled?: boolean;
  maxlength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  class?: string;
  label?: string;
  error?: string | null;
}

interface Emits {
  (event: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const clearInput = () => {
  emit("update:modelValue", "");
};

const inputAttrs = computed(() => {
  const { modelValue, class: className, ...attrs } = props;
  return attrs;
});
</script>

<template>
  <div
    class="min-5-10 relative flex shrink grow flex-col items-center justify-start"
  >
    <label
      v-if="label"
      :for="inputId"
      :class="
        twMerge(
          'flex w-full justify-start p-1 text-sm overflow-ellipsis text-gray-600',
          error && 'text-rose-500',
        )
      "
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      v-bind="inputAttrs"
      :class="
        twMerge(
          'h-10 w-full rounded-lg border-1 border-gray-200 py-4 pr-9 pl-3 text-black ring-2 ring-transparent ring-offset-2 transition-all outline-none select-none focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50',
          error &&
            'border-rose-300 bg-rose-100 text-rose-900 placeholder-rose-500 focus:ring-rose-500',
          props.class,
        )
      "
      :value="modelValue"
      @input="onInput"
    />
    <button
      :class="
        twMerge(
          'pointer-events-none absolute top-1.5 right-1.5 hidden aspect-square size-7 cursor-pointer place-items-center rounded-lg border-none bg-transparent text-gray-600 outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'text-rose-500',
          modelValue.length > 0 && 'pointer-events-auto grid',
          label && 'top-8.5',
        )
      "
      :disabled="disabled"
      @click="clearInput"
      type="button"
    >
      <X :size="20" />
    </button>
    <div v-if="error" class="mt-1 w-full text-sm text-rose-500">
      {{ error }}
    </div>
  </div>
</template>
