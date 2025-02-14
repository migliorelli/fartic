<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

interface Option {
  value: any;
  label: string;
}

interface Props {
  disabled?: boolean;
  placeholder?: string;
  class?: string;
  label?: string;
  error?: string | null;
  modelValue: any;
  data: Option[];
}

interface Emits {
  (event: "update:modelValue", value: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

const selectAttrs = computed(() => {
  const { class: className, ...attrs } = props;
  return attrs;
});

const onSelect = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
};
</script>

<template>
  <div
    class="min-5-10 relative flex shrink grow flex-col items-center justify-start"
  >
    <label
      v-if="label"
      :for="selectId"
      :class="
        twMerge(
          'flex w-full justify-start p-1 text-sm overflow-ellipsis text-gray-600',
          error && 'text-rose-500',
        )
      "
    >
      {{ label }}
    </label>
    <select
      :id="selectId"
      v-bind="selectAttrs"
      :class="
        twMerge(
          'h-10 w-full appearance-none rounded-lg border-1 border-gray-200 px-3 py-0 text-black ring-2 ring-transparent ring-offset-2 transition-all outline-none focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50',
          error &&
            'border-rose-300 bg-rose-100 text-rose-900 placeholder-rose-500 focus:ring-rose-500',
          modelValue === 'default' && 'text-gray-400',
          props.class,
        )
      "
      :value="modelValue"
      @change="onSelect"
    >
      <option v-if="placeholder" value="default" disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="option in data"
        :key="option.value"
        :value="option.value"
        class="text-black"
      >
        {{ option.label }}
      </option>
    </select>

    <ChevronDown
      :size="16"
      :class="
        twMerge(
          'pointer-events-none absolute top-3 right-3 text-gray-600',
          error && 'text-rose-500',
          label && 'top-10',
        )
      "
    />

    <div v-if="error" class="mt-1 w-full text-sm text-rose-500">
      {{ error }}
    </div>
  </div>
</template>
