<template>
  <Transition name="screen" mode="out-in">
    <TitleScreen v-if="screen === 'title'" @start="handleStart" />
    <CreationScreen
      v-else-if="screen === 'creation'"
      :player-name="playerName"
      @back="screen = 'title'"
      @done="onCreationDone"
    />
    <MainGame v-else-if="screen === 'main'" />
    <div v-else-if="screen === 'readonly'" class="readonly-text" v-html="readonlyHtml"></div>
    <div v-else></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TitleScreen from './components/TitleScreen.vue';
import CreationScreen from './components/CreationScreen.vue';
import MainGame from './components/MainGame.vue';

type Screen = 'title' | 'creation' | 'main' | 'readonly' | 'hidden';
const screen = ref<Screen>('hidden');
const readonlyHtml = ref('');
const playerName = ref('');

onMounted(() => {
  const currentId = typeof getCurrentMessageId === 'function'
    ? getCurrentMessageId() : -1;
  const lastId = typeof getLastMessageId === 'function'
    ? getLastMessageId() : -1;

  if (currentId === 0) {
    // 判断是否已创建角色：有后续消息，或第0楼已有玩家创建数据
    const created = lastId > 0 || hasCreated();
    if (created) {
      showFloorText(0);
      return;
    }
    // 新对话，尚未创建 → 显示开局页面
    screen.value = 'title';
    if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined') {
      eventOn(tavern_events.MESSAGE_RECEIVED, () => { showFloorText(0); });
    }
  } else if (currentId > 0) {
    const isLatest = lastId < 0 || currentId >= lastId;
    screen.value = isLatest ? 'main' : 'readonly';
    if (!isLatest) showFloorText(currentId);
  }
});

function hasCreated(): boolean {
  try {
    if (typeof getChatMessages === 'function') {
      const msgs = getChatMessages(0);
      const sd = msgs[0]?.data?.stat_data;
      // 只有玩家完成创建后 stat_data.玩家.名字 才会被写入
      if (sd?.玩家?.名字) return true;
    }
  } catch {}
  return false;
}

function showFloorText(id: number) {
  try {
    if (typeof getChatMessages === 'function') {
      const msgs = getChatMessages(id);
      if (msgs.length) {
        let text = msgs[0].message || '';
        text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
        text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
        text = text.replace(/<UpdateVariable>[\s\S]*?<\/UpdateVariable>/gi, '');
        text = text.replace(/```status[\s\S]*?```/g, '');
        // 提取 <maintext> 内容，去掉 <option>
        const mainMatch = text.match(/<maintext>([\s\S]*?)<\/maintext>/i);
        if (mainMatch) text = mainMatch[1];
        text = text.replace(/<option>[\s\S]*?<\/option>/gi, '');
        text = text.replace(/<\/?maintext>/gi, '');
        text = text.replace(/\n/g, '<br>');
        readonlyHtml.value = text.trim();
      }
    }
  } catch {}
  screen.value = 'readonly';
}

function onCreationDone(openingText: string) {
  // 直接用创建时生成的开场白文本显示
  let text = openingText || '';
  text = text.replace(/<maintext>([\s\S]*?)<\/maintext>/gi, '$1');
  text = text.replace(/<option>[\s\S]*?<\/option>/gi, '');
  text = text.replace(/\n/g, '<br>');
  readonlyHtml.value = text.trim();
  screen.value = 'readonly';
}

function handleStart(name: string) {
  playerName.value = name;
  const lastId = typeof getLastMessageId === 'function'
    ? getLastMessageId() : -1;
  if (lastId > 0) {
    showFloorText(0);
  } else {
    screen.value = 'creation';
  }
}
</script>

<style lang="scss" scoped>
.screen-enter-active, .screen-leave-active { transition: opacity 0.3s ease; }
.screen-enter-from, .screen-leave-to { opacity: 0; }
.readonly-text {
  padding: 12px 14px;
  font-size: 14px; line-height: 1.9;
  color: #f0e6d2;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}

@media (max-width: 400px) {
  .readonly-text {
    padding: 8px 10px;
    font-size: 13px; line-height: 1.7;
  }
}
</style>
