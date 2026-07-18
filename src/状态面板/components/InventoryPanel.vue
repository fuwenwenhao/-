<template>
  <div class="inventory-panel">
    <!-- 装备栏 -->
    <section class="inv-section">
      <h3 class="inv-title">⚔️ 装备</h3>
      <div v-if="inventory.weapons.length === 0" class="inv-empty">空</div>
      <div v-else class="inv-list">
        <div
          v-for="(item, idx) in inventory.weapons"
          :key="'w' + idx"
          class="inv-item"
          @click="toggleWeapon(idx)"
        >
          <div class="item-header">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-count">×{{ item.count }}</span>
          </div>
          <Transition name="desc">
            <div v-if="expandedWeapon === idx" class="item-desc">
              {{ item.description }}
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- 道具栏 -->
    <section class="inv-section">
      <h3 class="inv-title">🧪 道具</h3>
      <div v-if="inventory.items.length === 0" class="inv-empty">空</div>
      <div v-else class="inv-list">
        <div
          v-for="(item, idx) in inventory.items"
          :key="'i' + idx"
          class="inv-item"
          @click="toggleItem(idx)"
        >
          <div class="item-header">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-count">×{{ item.count }}</span>
          </div>
          <Transition name="desc">
            <div v-if="expandedItem === idx" class="item-desc">
              {{ item.description }}
            </div>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store';

const store = useStatusStore();
const { inventory } = storeToRefs(store);

const expandedWeapon = ref<number | null>(null);
const expandedItem = ref<number | null>(null);

function toggleWeapon(idx: number) {
  expandedWeapon.value = expandedWeapon.value === idx ? null : idx;
}
function toggleItem(idx: number) {
  expandedItem.value = expandedItem.value === idx ? null : idx;
}
</script>

<style lang="scss" scoped>
.inventory-panel { padding: 4px; }

.inv-section { margin-bottom: 12px; &:last-child { margin-bottom: 0; } }
.inv-title {
  font-size: 13px; color: #4a3728; margin: 0 0 8px 0;
  padding-bottom: 4px; border-bottom: 1px dashed rgba(201, 168, 76, 0.4);
}
.inv-empty { font-size: 11px; color: #9b8a7a; font-style: italic; padding: 4px 0; }

.inv-list { display: flex; flex-direction: column; gap: 4px; }
.inv-item {
  padding: 6px 8px; background: rgba(74, 55, 40, 0.04);
  border: 1px solid rgba(201, 168, 76, 0.2); border-radius: 4px;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { border-color: rgba(201, 168, 76, 0.5); }
}
.item-header { display: flex; align-items: center; justify-content: space-between; }
.item-name { font-size: 12px; color: #4a3728; font-weight: bold; }
.item-count { font-size: 11px; color: #c9a84c; font-weight: bold; }
.item-desc {
  margin-top: 4px; padding-top: 4px;
  border-top: 1px dotted rgba(201, 168, 76, 0.25);
  font-size: 10px; color: #6b5440; font-style: italic; line-height: 1.4;
}

.desc-enter-active, .desc-leave-active { transition: all 0.15s ease; }
.desc-enter-from, .desc-leave-to { opacity: 0; }

// 小屏适配
@media (max-width: 400px) {
  .inventory-panel { padding: 2px; }
  .inv-section { margin-bottom: 8px; }
  .inv-title { font-size: 12px; margin-bottom: 6px; }
  .inv-item { padding: 5px 6px; }
  .item-name { font-size: 11px; }
  .item-desc { font-size: 9px; }
}
</style>