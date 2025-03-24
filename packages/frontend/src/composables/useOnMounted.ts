import { onMounted, onUnmounted } from "vue";

export function useOnMounted(
  onMountedCallback: Function,
  onUnmountedCallback: Function,
) {
  onMounted(onMountedCallback);
  onUnmounted(onUnmountedCallback);
}
