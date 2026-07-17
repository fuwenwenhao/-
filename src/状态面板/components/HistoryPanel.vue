<template>
  <div class="history-panel">
    <h3 class="section-title">◈ 楼层记录</h3>
    <p class="hint">点击楼层可回退状态到该时刻</p>
    <div class="floor-list">
      <div
        v-for="floor in floors"
        :key="floor.id"
        class="floor-item"
        :class="{ active: floor.id === viewingFloor }"
        @click="handleLoad(floor.id)"
      >
        <span class="floor-id">#{{ floor.id }}</span>
        <span class="floor-preview">{{ floor.preview }}</span>
        <span class="floor-role">{{ floor.role }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store';

const store = useStatusStore();
const { viewingFloor } = storeToRefs(store);
const floors = ref<{ id: number; preview: string; role: string }[]>([]);

onMounted(() => { loadFloors(); });

function loadFloors() {
  const list: typeof floors.value = [];
  try {
    const lastId = typeof getLastMessageId === 'function' ? getLastMessageId() : 0;
    for (let i = lastId; i >= 0; i--) {
      try {
        const msgs = getChatMessages(i);
        if (!msgs.length) continue;
        const msg = msgs[0];
        const text = (msg.message || '').replace(/<[^>]+>/g, '').slice(0, 30);
        const role = msg.is_user ? '👤' : '🤖';
        list.push({ id: i, preview: text || '(空)', role });
      } catch { continue; }
    }
  } catch {}
  floors.value = list;
}

function handleLoad(id: number) {
  store.loadFromFloor(id);
}
</script>

<style lang="scss" scoped>
.history-panel { padding: 4px; }
.section-title {
  font-size: 13px; color: #4a3728; margin: 0 0 6px 0;
  padding-bottom: 4px; border-bottom: 1px dashed rgba(201,168,76,0.4);
}
.hint { font-size: 9px; color: #8b7355; margin: 0 0 8px; font-style: italic; }
.floor-list { max-height: 250px; overflow-y: auto; }
.floor-item {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; margin-bottom: 3px; border-radius: 4px;
  cursor: pointer; font-size: 11px; transition: background 0.15s;
  border: 1px solid transparent;
  &:hover { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.3); }
  &.active { background: rgba(201,168,76,0.2); border-color: #c9a84c; }
}
.floor-id { font-weight: bold; color: #c9a84c; min-width: 28px; }
.floor-preview {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: #6b5440;
}
.floor-role { font-size: 12px; }
</style>