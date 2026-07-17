<template>
  <div class="companion-panel">
    <div v-if="companions.length === 0" class="empty-state">
      <span class="empty-icon">🤝</span>
      <p>暂无同伴</p>
    </div>
    <div v-else class="companion-list">
      <div
        v-for="(comp, idx) in companions"
        :key="idx"
        class="companion-card"
        :class="{ expanded: expandedIdx === idx }"
        @click="toggle(idx)"
      >
        <div class="card-header">
          <span class="comp-name">{{ comp.name }}</span>
          <span class="comp-identity">{{ comp.identity }}</span>
          <span class="comp-power">⚡{{ comp.power }}</span>
        </div>
        <div class="card-summary">
          <span>❤️ {{ comp.hp.current }}/{{ comp.hp.max }}</span>
          <span>🧠 {{ comp.sanity.current }}/{{ comp.sanity.max }}</span>
          <span>💛 {{ comp.affection }}%</span>
        </div>

        <Transition name="expand">
          <div v-if="expandedIdx === idx" class="card-detail" @click.stop>
            <div class="detail-row">
              <span class="dl">当前形态</span>
              <span class="dv form-val">{{ comp.current_form }}</span>
            </div>
            <div class="detail-row">
              <span class="dl">生理状态</span>
              <span class="dv">{{ comp.physical_state }}</span>
            </div>

            <div class="detail-section">
              <span class="ds-title">装备</span>
              <div class="eq-row" v-for="eq in equipOf(comp)" :key="eq.key">
                <span class="eq-l">{{ eq.label }}</span>
                <span class="eq-v">{{ eq.value }}</span>
              </div>
            </div>

            <div class="detail-section">
              <span class="ds-title">身体</span>
              <div class="bp-row" v-for="bp in bodyOf(comp)" :key="bp.key">
                <span class="bp-name">{{ bp.label }}</span>
                <span class="bp-mod" :class="modCls(bp.modification)">
                  {{ bp.modification }}
                </span>
                <span class="bp-st" :class="stCls(bp.status)">
                  {{ bp.status }}
                </span>
                <span class="bp-armor">🛡️{{ bp.armor }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store';
import type { CompanionData } from '../types';

const store = useStatusStore();
const { companions } = storeToRefs(store);
const expandedIdx = ref<number | null>(null);

function toggle(idx: number) {
  expandedIdx.value = expandedIdx.value === idx ? null : idx;
}

function equipOf(comp: CompanionData) {
  return [
    { key: 'weapon', label: '武器', value: comp.equipment.weapon },
    { key: 'accessory', label: '饰品', value: comp.equipment.accessory },
    { key: 'top', label: '上装', value: comp.equipment.top },
    { key: 'bottom', label: '下装', value: comp.equipment.bottom },
    { key: 'shoes', label: '鞋子', value: comp.equipment.shoes },
  ];
}

function bodyOf(comp: CompanionData) {
  const b = comp.body;
  return [
    { key: 'head', label: '头', ...b.head },
    { key: 'chest', label: '胸', ...b.chest },
    { key: 'left_arm', label: '左臂', ...b.left_arm },
    { key: 'right_arm', label: '右臂', ...b.right_arm },
    { key: 'left_leg', label: '左腿', ...b.left_leg },
    { key: 'right_leg', label: '右腿', ...b.right_leg },
  ];
}

function stCls(s: string) {
  if (s === '正常') return 'st-ok';
  if (s === '轻伤') return 'st-light';
  if (s === '重伤') return 'st-heavy';
  return 'st-crit';
}

function modCls(m: string) {
  if (m === '原生') return 'mod-organic';
  if (m === '义体') return 'mod-cyber';
  return 'mod-bio';
}
</script>

<style lang="scss" scoped>
.companion-panel { padding: 4px; }
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 100px; color: #6b5440;
  .empty-icon { font-size: 28px; margin-bottom: 6px; }
  p { margin: 0; font-size: 12px; }
}
.companion-list { display: flex; flex-direction: column; gap: 8px; }
.companion-card {
  padding: 8px 10px; background: rgba(74, 55, 40, 0.05);
  border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 6px;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { border-color: #c9a84c; }
  &.expanded { border-color: #c9a84c; background: rgba(201, 168, 76, 0.06); }
}
.card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comp-name { font-size: 13px; font-weight: bold; color: #4a3728; }
.comp-identity { font-size: 10px; color: #6b5440; }
.comp-power { font-size: 10px; color: #c9a84c; font-weight: bold; }
.card-summary { display: flex; gap: 10px; font-size: 10px; color: #6b5440; }

.card-detail {
  margin-top: 8px; padding-top: 8px;
  border-top: 1px dashed rgba(201, 168, 76, 0.3);
}
.detail-row { display: flex; gap: 6px; margin-bottom: 4px; font-size: 11px; }
.dl { color: #6b5440; width: 56px; }
.dv { color: #4a3728; font-weight: bold; }
.form-val { color: #8b5a2b; font-style: italic; }

.detail-section { margin-top: 6px; }
.ds-title { font-size: 11px; color: #4a3728; font-weight: bold; display: block; margin-bottom: 4px; }
.eq-row { display: flex; gap: 6px; font-size: 10px; margin-bottom: 2px; }
.eq-l { color: #6b5440; width: 32px; }
.eq-v { color: #4a3728; }

.bp-row { display: flex; align-items: center; gap: 6px; font-size: 10px; margin-bottom: 2px; }
.bp-name { color: #6b5440; width: 28px; }
.bp-mod {
  font-size: 9px; padding: 0 4px; border-radius: 6px;
  &.mod-organic { background: #d4e8c8; color: #3a6b2a; }
  &.mod-cyber { background: #c8d8e8; color: #2a4a6b; }
  &.mod-bio { background: #e8c8d8; color: #6b2a4a; }
}
.bp-st {
  font-weight: bold;
  &.st-ok { color: #4a8b4a; }
  &.st-light { color: #b89b3f; }
  &.st-heavy { color: #c94040; }
  &.st-crit { color: #6b1a1a; }
}
.bp-armor { font-size: 9px; color: #6b5440; }

.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }
</style>