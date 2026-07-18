<template>
  <div class="panel-root">
    <!-- 正文 + 翻页 -->
    <div class="maintext-box" v-if="maintext">
      <div class="floor-nav">
        <button class="nav-btn" :disabled="viewingFloor <= 0" @click="store.navigateFloor(-1)">◀</button>
        <span class="floor-label">第 {{ viewingFloor }} 楼</span>
        <button class="nav-btn" :disabled="viewingFloor >= latestFloor" @click="store.navigateFloor(1)">▶</button>
      </div>
      <div class="maintext-body" v-html="formattedMaintext"></div>
    </div>

    <!-- 分隔线 -->
    <div class="divider" v-if="maintext">◆ ◇ ◆</div>

    <!-- 状态栏 -->
    <div class="status-compact">
      <TabNav v-model="activeTab" />
      <div class="tab-body">
        <Transition name="fade" mode="out-in">
          <PlayerPanel v-if="activeTab === 'player'" />
          <CompanionPanel v-else-if="activeTab === 'companion'" />
          <NpcPanel v-else-if="activeTab === 'npc'" />
          <InventoryPanel v-else-if="activeTab === 'inventory'" />
          <MapPanel v-else-if="activeTab === 'map'" />
          <HistoryPanel v-else-if="activeTab === 'history'" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import TabNav from './TabNav.vue';
import PlayerPanel from './PlayerPanel.vue';
import CompanionPanel from './CompanionPanel.vue';
import NpcPanel from './NpcPanel.vue';
import InventoryPanel from './InventoryPanel.vue';
import MapPanel from './MapPanel.vue';
import HistoryPanel from './HistoryPanel.vue';
import { useStatusStore } from '../store';

const store = useStatusStore();
const { maintext, viewingFloor, latestFloor } = storeToRefs(store);
const activeTab = computed({
  get: () => store.activeTab,
  set: (v: string) => { store.activeTab = v; },
});

const formattedMaintext = computed(() => {
  return maintext.value.replace(/\n/g, '<br>');
});

onMounted(() => {
  store.loadData();

  if (typeof eventOn === 'function') {
    // MVU 变量更新完成
    if (typeof Mvu !== 'undefined' && Mvu?.events?.VARIABLE_UPDATE_ENDED) {
      eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => { store.loadData(); });
    }
    // 酒馆消息事件
    if (typeof tavern_events !== 'undefined') {
      eventOn(tavern_events.MESSAGE_RECEIVED, () => { store.loadData(); });
      eventOn(tavern_events.MESSAGE_UPDATED, () => { store.loadData(); });
      eventOn(tavern_events.MESSAGE_SWIPED, () => { store.loadData(); });
    }
    // 流式文本 → 实时更新正文显示
    if (typeof iframe_events !== 'undefined') {
      eventOn(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, (text: string) => {
        store.maintext = store.filterMaintext(text);
      });
      eventOn(iframe_events.GENERATION_ENDED, () => { store.loadData(); });
    }
  }
});

</script>

<style lang="scss" scoped>
.panel-root {
  font-family: 'Georgia', 'Noto Serif SC', serif;
  padding: 4px;
  color: #f0e6d2;
}

.maintext-box {
  padding: 12px 14px;
  background: rgba(255, 248, 235, 0.08);
  border-left: 3px solid #c9a84c;
  border-radius: 0 4px 4px 0;
  margin-bottom: 8px;
}
.floor-nav {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; margin-bottom: 8px; padding-bottom: 6px;
  border-bottom: 1px dashed rgba(201, 168, 76, 0.3);
}
.nav-btn {
  background: rgba(201, 168, 76, 0.15); border: 1px solid rgba(201, 168, 76, 0.4);
  color: #c9a84c; border-radius: 4px; padding: 2px 10px; cursor: pointer;
  font-size: 12px; transition: all 0.15s;
  &:hover:not(:disabled) { background: rgba(201, 168, 76, 0.3); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}
.floor-label { font-size: 11px; color: rgba(240, 230, 210, 0.7); }
.maintext-body {
  font-size: 14px; line-height: 1.9; color: #f0e6d2;
  letter-spacing: 0.3px;

  :deep(.thinking-block) {
    margin: 8px 0;
    padding: 8px 12px;
    background: rgba(100, 140, 180, 0.08);
    border: 1px solid rgba(100, 140, 180, 0.25);
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.6;
    color: rgba(200, 210, 225, 0.85);

    summary {
      cursor: pointer;
      font-size: 11px;
      font-weight: bold;
      color: rgba(160, 190, 220, 0.9);
      padding: 2px 0;
      user-select: none;
      &:hover { color: rgba(180, 210, 240, 1); }
    }
  }
}

.divider {
  text-align: center; font-size: 10px; color: #c9a84c;
  margin: 4px 0 8px; letter-spacing: 4px; opacity: 0.7;
}

.status-compact {
  background: linear-gradient(170deg, #f5e6c8, #e8d5a3);
  border: 1.5px solid rgba(201, 168, 76, 0.5);
  border-radius: 6px; padding: 8px;
}
.tab-body { min-height: 80px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// 小屏适配
@media (max-width: 400px) {
  .panel-root { padding: 2px; }
  .maintext-box { padding: 8px 10px; margin-bottom: 6px; }
  .maintext-body { font-size: 13px; line-height: 1.7; }
  .floor-nav { gap: 8px; margin-bottom: 6px; padding-bottom: 4px; }
  .nav-btn { padding: 2px 8px; font-size: 11px; }
  .divider { margin: 2px 0 6px; font-size: 9px; }
  .status-compact { padding: 6px; }
  .tab-body { min-height: 60px; }
}
</style>