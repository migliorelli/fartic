<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { nextTick, ref, useTemplateRef, watch } from "vue";
import MessageType from "../../enums/message";
import useGameStore from "../../store/game";
import Button from "../ui/Button.vue";
import Input from "../ui/Input.vue";

interface Props {
  channel: "awsers" | "chat";
}

const props = defineProps<Props>();
const chat = useTemplateRef("chat");
const game = useGameStore();
const messageValue = ref("");

const send = () => {
  if (messageValue.value.trim() === "") return;

  if (props.channel === "awsers") game.sendAwser(messageValue.value);
  else game.sendMessage(messageValue.value);

  messageValue.value = "";
};

watch(
  () => [props.channel, game.game[props.channel]],
  async ([newChannel], [oldChannel]) => {
    await nextTick();

    const switchedChannels = newChannel !== oldChannel;

    if (switchedChannels) messageValue.value = "";
    chat.value?.lastElementChild?.scrollIntoView({
      behavior: switchedChannels ? "instant" : "smooth",
    });
  },
);
</script>
<template>
  <div
    class="grid h-full max-h-[inherit] grid-rows-[1fr_48px] overflow-hidden rounded-b-xl bg-white"
  >
    <ul
      class="flex min-h-0 flex-col space-y-1 overflow-y-auto p-2 select-none"
      ref="chat"
    >
      <li
        v-for="(message, index) in game.game[props.channel]"
        :key="index"
        :class="
          twMerge(
            'break-words',
            message.type === MessageType.MESSAGE && 'text-violet-400',
            message.type === MessageType.CONFIRM && 'text-emerald-400',
            message.type === MessageType.SERVER && 'text-blue-400',
            message.type === MessageType.WARNING && 'text-amber-400',
          )
        "
      >
        <span
          :class="
            twMerge(
              'mr-[1ch] font-bold',
              message.type === MessageType.MESSAGE && 'text-violet-600',
              message.type === MessageType.CONFIRM && 'text-emerald-600',
              message.type === MessageType.SERVER && 'text-blue-600',
              message.type === MessageType.WARNING && 'text-amber-600',
            )
          "
          >{{ message.title }}</span
        >
        <span>{{ message.content }}</span>
      </li>
    </ul>
    <form class="flex gap-1.5 p-1" @submit.prevent="send" ref="form">
      <Input
        v-model="messageValue"
        :placeholder="props.channel === 'awsers' ? 'Dinossaur' : 'Hey guys!'"
        :maxlength="100"
      />
      <Button class="w-14 text-sm">Send</Button>
    </form>
  </div>
</template>

<style scoped>
@import "tailwindcss";

::-webkit-scrollbar {
  width: 7.5px;
}

::-webkit-scrollbar-track {
  background: theme("colors.violet.100");
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: theme("colors.violet.400");
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: theme("colors.violet.500");
}
</style>
