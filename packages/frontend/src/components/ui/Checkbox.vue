<script setup lang="ts">
import { Check } from "lucide-vue-next";

interface Props {
  disabled?: boolean;
  modelValue: boolean;
}

interface Emits {
  (event: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleChange = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2">
    <input
      type="checkbox"
      class="peer hidden"
      :disabled="disabled"
      :checked="modelValue"
      @change="handleChange"
    />

    <div
      class="grid size-5 place-items-center transition-all rounded-md border-1 border-gray-300 bg-transparent peer-checked:border-transparent peer-checked:bg-violet-600"
    >
      <span class="text-white">
        <Check :size="18" />
      </span>
    </div>
    <span class="select-none"><slot></slot></span>
  </label>
</template>
