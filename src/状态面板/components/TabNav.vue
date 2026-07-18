<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-bookmark', { active: modelValue === tab.id }]"
      @click="$emit('update:modelValue', tab.id)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const tabs = [
  { id: 'player', icon: '⚔️', label: '玩家状态' },
  { id: 'companion', icon: '🤝', label: '同伴' },
  { id: 'npc', icon: '💬', label: '交互角色' },
  { id: 'inventory', icon: '🎒', label: '背包' },
  { id: 'map', icon: '🗺️', label: '地图' },
  { id: 'history', icon: '📜', label: '记录' },
];
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex; gap: 3px; margin-bottom: 12px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.tab-bookmark {
  flex: 0 0 auto;
  min-width: 48px;
  padding: 6px 6px;
  border: 1px solid rgba(201, 168, 76, 0.5);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #e8d5a3 0%, #dfc992 100%);
  color: #6b5440;
  font-size: 11px;
  font-family: 'Georgia', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  &:hover {
    background: linear-gradient(180deg, #f0e0b5 0%, #e8d5a3 100%);
    color: #4a3728;
  }

  &.active {
    background: linear-gradient(180deg, #c9a84c 0%, #b8963f 100%);
    color: #2c1810;
    font-weight: bold;
    box-shadow: 0 -2px 8px rgba(201, 168, 76, 0.4);
    border-color: #c9a84c;
  }
}

.tab-icon { font-size: 14px; }
.tab-label { font-size: 10px; white-space: nowrap; }

// 小屏适配：只显示 icon
@media (max-width: 400px) {
  .tab-nav { gap: 2px; margin-bottom: 8px; }
  .tab-bookmark { min-width: 36px; padding: 5px 4px; }
  .tab-icon { font-size: 13px; }
  .tab-label { display: none; }
}
</style>
