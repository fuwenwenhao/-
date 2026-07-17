<template>
  <div class="map-panel">
    <!-- 当前位置 -->
    <div class="current-loc">
      <span class="loc-label">📍 当前位置：</span>
      <span class="loc-value">{{ map.current_location }}</span>
      <span class="loc-area">· {{ map.current_area }}</span>
    </div>

    <!-- 步骤指示 -->
    <div v-if="step !== 'select'" class="step-bar">
      <span class="step-text">{{ stepText }}</span>
      <button class="btn-back" @click="resetStep">✕ 取消</button>
    </div>

    <!-- 第一步：选区域 -->
    <div v-if="step === 'select'" class="district-grid">
      <div class="grid-section">
        <h4 class="grid-title">巢区</h4>
        <div class="grid-wrap">
          <button
            v-for="d in districts"
            :key="d.id"
            class="district-btn"
            :class="{ current: map.current_location === d.name }"
            @click="selectDistrict(d.name)"
          >
            {{ d.label }}
          </button>
        </div>
      </div>
      <div class="grid-section">
        <h4 class="grid-title">特殊地点</h4>
        <div class="grid-wrap">
          <button
            v-for="sp in specials"
            :key="sp"
            class="district-btn special"
            :class="{ current: map.current_location === sp }"
            @click="selectDistrict(sp)"
          >
            {{ sp }}
          </button>
        </div>
      </div>
    </div>

    <!-- 第二步：巢内/后巷 -->
    <div v-if="step === 'area'" class="choice-panel">
      <p class="choice-prompt">前往 <strong>{{ selectedDistrict }}</strong> 的：</p>
      <div class="choice-btns">
        <button class="choice-btn" @click="selectArea('巢内')">🏠 巢内</button>
        <button class="choice-btn" @click="selectArea('后巷')">🌑 后巷</button>
      </div>
    </div>

    <!-- 第三步：交通方式 -->
    <div v-if="step === 'transport'" class="choice-panel">
      <p class="choice-prompt">
        前往 <strong>{{ selectedDistrict }}</strong><template v-if="selectedArea"> · {{ selectedArea }}</template>
      </p>
      <div class="choice-btns">
        <button class="choice-btn" @click="confirmTravel('W列车')">🚇 W列车</button>
      </div>
      <div class="custom-transport">
        <span class="custom-label">或自行前往：</span>
        <input
          v-model="customTransport"
          class="custom-input"
          placeholder="输入方式..."
          @keyup.enter="confirmCustomTravel"
        />
        <button class="btn-confirm" @click="confirmCustomTravel">确定</button>
      </div>
    </div>

    <!-- 确认结果 -->
    <div v-if="step === 'done'" class="result-panel">
      <p class="result-text">
        ✅ 前往 <strong>{{ selectedDistrict }}</strong><template v-if="selectedArea"> · {{ selectedArea }}</template>
        <br>方式：{{ selectedTransport }}
      </p>
      <button class="btn-back" @click="resetStep">返回</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store';

const store = useStatusStore();
const { map } = storeToRefs(store);

type Step = 'select' | 'area' | 'transport' | 'done';
const step = ref<Step>('select');
const selectedDistrict = ref('');
const selectedArea = ref('');
const selectedTransport = ref('');
const customTransport = ref('');

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY';
const districts = letters.split('').map((l, i) => ({
  id: l,
  label: `${l}巢`,
  name: `${l}巢`,
  num: i + 1,
}));
const specials = ['大湖', '郊区'];

const stepText = computed(() => {
  if (step.value === 'area') return `选择区域类型 → ${selectedDistrict.value}`;
  if (step.value === 'transport') {
    const dest = selectedArea.value
      ? `${selectedDistrict.value}·${selectedArea.value}`
      : selectedDistrict.value;
    return `选择交通方式 → ${dest}`;
  }
  return '';
});

function selectDistrict(name: string) {
  selectedDistrict.value = name;
  // 大湖和郊区没有巢内/后巷选项，直接进交通选择
  if (specials.includes(name)) {
    selectedArea.value = '';
    step.value = 'transport';
  } else {
    step.value = 'area';
  }
}

function selectArea(area: string) {
  selectedArea.value = area;
  step.value = 'transport';
}

function confirmTravel(transport: string) {
  selectedTransport.value = transport;
  step.value = 'done';
}

function confirmCustomTravel() {
  if (customTransport.value.trim()) {
    selectedTransport.value = customTransport.value.trim();
    step.value = 'done';
  }
}

function resetStep() {
  step.value = 'select';
  selectedDistrict.value = '';
  selectedArea.value = '';
  selectedTransport.value = '';
  customTransport.value = '';
}
</script>

<style lang="scss" scoped>
.map-panel { padding: 4px; }

.current-loc {
  margin-bottom: 10px; padding: 6px 10px;
  background: rgba(201, 168, 76, 0.08); border-radius: 4px;
  border: 1px solid rgba(201, 168, 76, 0.3);
}
.loc-label { font-size: 11px; color: #6b5440; }
.loc-value { font-size: 13px; color: #4a3728; font-weight: bold; }
.loc-area { font-size: 11px; color: #8b5a2b; font-style: italic; }

.step-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px; padding: 4px 8px;
  background: rgba(74, 55, 40, 0.06); border-radius: 4px;
}
.step-text { font-size: 11px; color: #6b5440; }
.btn-back {
  font-size: 10px; padding: 2px 8px; border: 1px solid rgba(201,168,76,0.4);
  border-radius: 4px; background: transparent; color: #6b5440; cursor: pointer;
  &:hover { background: rgba(201, 168, 76, 0.1); }
}

.district-grid { display: flex; flex-direction: column; gap: 10px; }
.grid-section {}
.grid-title {
  font-size: 11px; color: #4a3728; margin: 0 0 6px 0;
  border-bottom: 1px dashed rgba(201, 168, 76, 0.3); padding-bottom: 3px;
}
.grid-wrap {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.district-btn {
  padding: 4px 8px; font-size: 10px; border-radius: 4px;
  border: 1px solid rgba(201, 168, 76, 0.35); background: rgba(245, 230, 200, 0.6);
  color: #4a3728; cursor: pointer; transition: all 0.15s ease;
  font-family: 'Georgia', serif;
  &:hover { background: rgba(201, 168, 76, 0.2); border-color: #c9a84c; }
  &.current { background: #c9a84c; color: #2c1810; font-weight: bold; }
  &.special { border-style: dashed; }
}

.choice-panel { text-align: center; padding: 12px 0; }
.choice-prompt { font-size: 12px; color: #4a3728; margin: 0 0 10px 0; }
.choice-btns { display: flex; gap: 12px; justify-content: center; }
.choice-btn {
  padding: 8px 16px; font-size: 12px; border-radius: 6px;
  border: 1px solid rgba(201, 168, 76, 0.5);
  background: linear-gradient(180deg, #f5e6c8, #e8d5a3);
  color: #4a3728; cursor: pointer; font-weight: bold; transition: all 0.2s ease;
  &:hover { background: linear-gradient(180deg, #c9a84c, #b8963f); color: #2c1810; }
}

.result-panel { text-align: center; padding: 12px 0; }
.result-text { font-size: 12px; color: #4a3728; line-height: 1.6; margin: 0 0 8px 0; }

.custom-transport {
  display: flex; align-items: center; gap: 6px;
  margin-top: 10px; justify-content: center;
}
.custom-label { font-size: 11px; color: #6b5440; }
.custom-input {
  padding: 4px 8px; font-size: 11px; border-radius: 4px;
  border: 1px solid rgba(201, 168, 76, 0.5); background: rgba(245, 230, 200, 0.8);
  color: #4a3728; outline: none; width: 100px;
  font-family: 'Georgia', serif;
  &:focus { border-color: #c9a84c; }
}
.btn-confirm {
  padding: 4px 10px; font-size: 10px; border-radius: 4px;
  border: 1px solid rgba(201, 168, 76, 0.5);
  background: linear-gradient(180deg, #e8d5a3, #dfc992);
  color: #4a3728; cursor: pointer; font-weight: bold;
  &:hover { background: linear-gradient(180deg, #c9a84c, #b8963f); color: #2c1810; }
}
</style>