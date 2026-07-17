<template>
  <div class="player-panel">
    <!-- 基础信息 -->
    <section class="section">
      <h3 class="section-title">◈ 基础信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">名字</span>
          <span class="value name-value">{{ player.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">种族</span>
          <span class="value">{{ player.race || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="label">职业</span>
          <span class="value">{{ player.profession || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="label">身份</span>
          <span class="value">{{ player.identity }}</span>
        </div>
        <div class="info-item">
          <span class="label">实力</span>
          <span class="value">{{ player.power }}</span>
        </div>
        <div class="info-item">
          <span class="label">形态</span>
          <span class="value form-value">{{ player.current_form }}</span>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label">❤️ 血量</span>
        <div class="bar-track">
          <div class="bar-fill hp" :style="{ width: hpPct + '%' }"></div>
        </div>
        <span class="bar-num">{{ player.hp.current }}/{{ player.hp.max }}</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">🧠 理智</span>
        <div class="bar-track">
          <div class="bar-fill sanity" :style="{ width: sanPct + '%' }"></div>
        </div>
        <span class="bar-num">{{ player.sanity.current }}/{{ player.sanity.max }}</span>
      </div>
      <div class="text-row">
        <span class="text-label">生理状态</span>
        <span class="text-value">{{ player.physical_state }}</span>
      </div>
      <div class="text-row">
        <span class="text-label">情感等级</span>
        <span class="text-value">{{ player.emotion_level }}</span>
      </div>
      <div class="text-row">
        <span class="text-label">📅 年月</span>
        <span class="text-value">{{ player.current_date || '—' }}</span>
      </div>
      <div class="text-row">
        <span class="text-label">📍 所在地区</span>
        <span class="text-value">{{ player.current_region || '—' }}</span>
      </div>
      <div class="text-row">
        <span class="text-label">💰 金钱</span>
        <span class="text-value money-value">{{ formatMoney(player.money) }} 眼</span>
      </div>
    </section>

    <!-- 装备 -->
    <section class="section">
      <h3 class="section-title">◈ 装备</h3>
      <div class="equip-grid">
        <div class="equip-item" v-for="eq in equipList" :key="eq.key">
          <span class="equip-label">{{ eq.label }}</span>
          <span class="equip-value">{{ eq.value }}</span>
        </div>
      </div>
    </section>

    <!-- 身体部位 -->
    <section class="section">
      <h3 class="section-title">◈ 身体状况</h3>
      <div class="body-list">
        <div class="body-item" v-for="bp in bodyList" :key="bp.key">
          <div class="body-header">
            <span class="body-name">{{ bp.label }}</span>
            <span class="body-mod" :class="modClass(bp.modification)">{{ bp.modification }}</span>
            <span class="body-status" :class="statusClass(bp.status)">{{ bp.status }}</span>
          </div>
          <div class="body-detail">
            <span class="body-armor">🛡️ {{ bp.armor }}</span>
            <span v-if="bp.mod_name" class="body-mod-name">⚙️ {{ bp.mod_name }}</span>
          </div>
          <div v-if="bp.mod_effect" class="body-effect">↳ {{ bp.mod_effect }}</div>
        </div>
      </div>
    </section>

    <!-- 六维属性 -->
    <section class="section">
      <h3 class="section-title">◈ 属性</h3>
      <div class="attr-grid">
        <div class="attr-item" v-for="attr in attrList" :key="attr.key">
          <span class="attr-label">{{ attr.label }}</span>
          <span class="attr-value">{{ attr.value }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store';

const store = useStatusStore();
const { player, equipment, body, attributes } = storeToRefs(store);

const hpPct = computed(() =>
  player.value.hp.max > 0 ? (player.value.hp.current / player.value.hp.max) * 100 : 0
);
const sanPct = computed(() =>
  player.value.sanity.max > 0 ? (player.value.sanity.current / player.value.sanity.max) * 100 : 0
);

function formatMoney(amount: number): string {
  if (amount >= 100000000) return (amount / 100000000).toFixed(1) + '亿';
  if (amount >= 10000) return (amount / 10000).toFixed(1) + '万';
  return amount.toLocaleString();
}

const equipList = computed(() => [
  { key: 'weapon', label: '武器', value: equipment.value.weapon },
  { key: 'accessory', label: '饰品', value: equipment.value.accessory },
  { key: 'top', label: '上装', value: equipment.value.top },
  { key: 'bottom', label: '下装', value: equipment.value.bottom },
  { key: 'shoes', label: '鞋子', value: equipment.value.shoes },
]);

const bodyList = computed(() => [
  { key: 'head', label: '头部', ...body.value.head },
  { key: 'chest', label: '胸部', ...body.value.chest },
  { key: 'left_arm', label: '左臂', ...body.value.left_arm },
  { key: 'right_arm', label: '右臂', ...body.value.right_arm },
  { key: 'left_leg', label: '左腿', ...body.value.left_leg },
  { key: 'right_leg', label: '右腿', ...body.value.right_leg },
]);

const attrList = computed(() => [
  { key: 'str', label: '力量', value: attributes.value.strength },
  { key: 'agi', label: '敏捷', value: attributes.value.agility },
  { key: 'int', label: '智力', value: attributes.value.intelligence },
  { key: 'con', label: '体质', value: attributes.value.constitution },
  { key: 'cha', label: '魅力', value: attributes.value.charisma },
  { key: 'per', label: '感知', value: attributes.value.perception },
]);

function statusClass(s: string) {
  if (s === '正常') return 'status-normal';
  if (s === '轻伤') return 'status-light';
  if (s === '重伤') return 'status-heavy';
  return 'status-critical';
}

function modClass(m: string) {
  if (m === '原生') return 'mod-organic';
  if (m === '义体') return 'mod-cyber';
  return 'mod-bio';
}
</script>

<style lang="scss" scoped>
.player-panel { padding: 4px; }
.section { margin-bottom: 14px; &:last-child { margin-bottom: 0; } }
.section-title {
  font-size: 13px; color: #4a3728; margin: 0 0 8px 0;
  padding-bottom: 4px; border-bottom: 1px dashed rgba(201, 168, 76, 0.4);
}

.info-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.info-item { display: flex; gap: 4px; align-items: center; }
.label { font-size: 11px; color: #6b5440; }
.value { font-size: 12px; color: #4a3728; font-weight: bold; }
.name-value { font-size: 14px; color: #c9a84c; }
.form-value { color: #8b5a2b; font-style: italic; }

.bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.bar-label { font-size: 11px; width: 62px; flex-shrink: 0; color: #4a3728; }
.bar-track {
  flex: 1; height: 14px; background: rgba(74, 55, 40, 0.12);
  border-radius: 7px; border: 1px solid rgba(201, 168, 76, 0.35); overflow: hidden;
}
.bar-fill {
  height: 100%; border-radius: 6px; transition: width 0.5s ease;
  &.hp { background: linear-gradient(90deg, #8b3a3a, #c94040); }
  &.sanity { background: linear-gradient(90deg, #6b4a8b, #9b6dc9); }
}
.bar-num { font-size: 10px; color: #6b5440; width: 50px; text-align: right; }

.text-row { display: flex; gap: 8px; margin-bottom: 4px; }
.text-label { font-size: 11px; color: #6b5440; width: 62px; }
.text-value { font-size: 12px; color: #4a3728; font-weight: bold; }
.money-value { color: #c9a84c; }

.equip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.equip-item { display: flex; gap: 6px; align-items: center; }
.equip-label { font-size: 11px; color: #6b5440; width: 36px; }
.equip-value { font-size: 12px; color: #4a3728; }

.body-list { display: flex; flex-direction: column; gap: 8px; }
.body-item {
  padding: 6px 8px; background: rgba(74, 55, 40, 0.05);
  border-radius: 4px; border-left: 3px solid rgba(201, 168, 76, 0.4);
}
.body-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.body-name { font-size: 12px; color: #4a3728; font-weight: bold; width: 32px; }
.body-mod {
  font-size: 10px; padding: 1px 6px; border-radius: 8px; font-weight: bold;
  &.mod-organic { background: #d4e8c8; color: #3a6b2a; }
  &.mod-cyber { background: #c8d8e8; color: #2a4a6b; }
  &.mod-bio { background: #e8c8d8; color: #6b2a4a; }
}
.body-status {
  font-size: 11px; font-weight: bold;
  &.status-normal { color: #4a8b4a; }
  &.status-light { color: #b89b3f; }
  &.status-heavy { color: #c94040; }
  &.status-critical { color: #6b1a1a; }
}
.body-detail { display: flex; gap: 10px; font-size: 10px; color: #6b5440; }
.body-effect { font-size: 10px; color: #5a7a4a; font-style: italic; margin-top: 2px; }

.attr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.attr-item { display: flex; gap: 4px; align-items: center; }
.attr-label { font-size: 11px; color: #6b5440; }
.attr-value { font-size: 13px; color: #c9a84c; font-weight: bold; }
</style>