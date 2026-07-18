<template>
  <div class="title-wrapper">
    <div class="title-frame">
      <!-- 背景纹理层 -->
      <div class="bg-noise"></div>
      <div class="bg-vignette"></div>

      <!-- 装饰性金色粒子（减少数量） -->
      <div class="particles">
        <span
          v-for="i in 10"
          :key="i"
          class="particle"
          :class="'p-' + i"
          :style="particleStyle(i)"
        ></span>
      </div>

      <!-- 四角装饰 -->
      <div class="corner top-left">❦</div>
      <div class="corner top-right">❦</div>
      <div class="corner bottom-left">❦</div>
      <div class="corner bottom-right">❦</div>

      <!-- 上方装饰线 -->
      <div class="deco-line">
        <span class="line"></span>
        <span class="deco-mark">◈</span>
        <span class="line"></span>
      </div>

      <!-- 作者 -->
      <div class="author-block">
        <span class="author-label">著</span>
        <span class="author-name">问号</span>
      </div>

      <!-- 主标题 -->
      <div class="title-block">
        <h1 class="game-title">
          <span class="ch" v-for="(ch, i) in titleChars" :key="i" :style="charDelay(i)">
            {{ ch }}
          </span>
        </h1>
        <div class="title-subtitle">LUNAR CALCULUS CITY</div>
      </div>

      <!-- 下方装饰线 -->
      <div class="deco-line">
        <span class="line"></span>
        <span class="deco-mark">◈</span>
        <span class="line"></span>
      </div>

      <!-- 名字输入 -->
      <div class="name-block">
        <label class="name-label">你的名字</label>
        <input
          v-model="playerName"
          class="name-input"
          placeholder="请输入角色名..."
          maxlength="20"
        />
      </div>

      <!-- 开始按钮 -->
      <div class="start-block">
        <button class="start-btn" @click="handleStart" :disabled="starting || !playerName.trim()">
          <span class="btn-inner">
            <span class="btn-icon">▸</span>
            <span class="btn-text">{{ starting ? '正在启程...' : '开 始 游 戏' }}</span>
            <span class="btn-icon rev">◂</span>
          </span>
        </button>
      </div>

      <!-- 底部说明 -->
      <div class="footer-hint">
        <span class="hint-mark">✦</span>
        点击开始，踏入都市
        <span class="hint-mark">✦</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ start: [name: string] }>();
const starting = ref(false);
const playerName = ref('');
const titleChars = ['月', '计', '都', '市'];

function charDelay(i: number) {
  return { animationDelay: `${0.4 + i * 0.18}s` };
}

function particleStyle(i: number) {
  const left = (i * 37 + 13) % 100;
  const top = (i * 53 + 7) % 100;
  const duration = 4 + (i % 4);
  const delay = (i % 5) * 0.5;
  const size = 2 + (i % 3);
  return {
    left: `${left}%`, top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    width: `${size}px`, height: `${size}px`,
  };
}

function handleStart() {
  if (starting.value || !playerName.value.trim()) return;
  starting.value = true;
  setTimeout(() => { emit('start', playerName.value.trim()); }, 600);
}
</script>

<style lang="scss" scoped>
.title-wrapper {
  width: 100%; min-height: 100%;
  padding: 8px; box-sizing: border-box;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}
.title-frame {
  position: relative; width: 100%;
  min-height: calc(100vh - 16px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; padding: 24px 16px;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.12), transparent 60%),
    linear-gradient(160deg, #1a0e05 0%, #2c1810 50%, #0f0803 100%);
  border: 2px solid #c9a84c; border-radius: 10px;
  box-shadow: 0 0 20px rgba(201,168,76,0.3), inset 0 0 40px rgba(0,0,0,0.8);
  overflow: hidden; box-sizing: border-box;
  animation: frameFadeIn 0.8s ease-out;
}
@keyframes frameFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.bg-noise {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image:
    repeating-linear-gradient(45deg, transparent 0, transparent 2px, rgba(201,168,76,0.02) 2px, rgba(201,168,76,0.02) 4px);
}
.bg-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
}

.particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.particle {
  position: absolute; border-radius: 50%; opacity: 0.6;
  background: radial-gradient(circle, #c9a84c 0%, rgba(201,168,76,0.3) 60%, transparent 100%);
  animation: floatUp linear infinite;
  will-change: transform, opacity;
}
@keyframes floatUp {
  0% { transform: translateY(20px); opacity: 0; }
  20% { opacity: 0.6; }
  80% { opacity: 0.4; }
  100% { transform: translateY(-40px) translateX(8px); opacity: 0; }
}

.corner {
  position: absolute; font-size: 16px; color: #c9a84c; opacity: 0.7;
  text-shadow: 0 0 4px rgba(201,168,76,0.4);
}
.top-left { top: 8px; left: 10px; }
.top-right { top: 8px; right: 10px; transform: scaleX(-1); }
.bottom-left { bottom: 8px; left: 10px; transform: scaleY(-1); }
.bottom-right { bottom: 8px; right: 10px; transform: scale(-1); }

.deco-line {
  display: flex; align-items: center; gap: 8px; width: 60%;
}
.line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c 30%, #c9a84c 70%, transparent);
}
.deco-mark { color: #c9a84c; font-size: 12px; }

.author-block {
  display: flex; align-items: center; gap: 8px;
}
.author-label {
  font-size: 10px; color: #8b7355;
  border: 1px solid rgba(201,168,76,0.5);
  padding: 1px 6px; border-radius: 2px; letter-spacing: 2px;
}
.author-name {
  font-size: 14px; color: #d4af37; letter-spacing: 6px;
  text-shadow: 0 0 6px rgba(201,168,76,0.5);
}

.title-block { text-align: center; }
.game-title {
  margin: 0; font-size: clamp(28px, 9vw, 42px);
  color: #f5e6c8; letter-spacing: 8px; font-weight: bold;
  text-shadow: 0 0 12px rgba(201,168,76,0.9), 0 0 24px rgba(201,168,76,0.5), 0 2px 4px rgba(0,0,0,0.9);
}
.game-title .ch {
  display: inline-block; opacity: 0;
  animation: charDrop 0.7s cubic-bezier(0.25,1.5,0.5,1) forwards;
}
@keyframes charDrop {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.title-subtitle {
  margin-top: 6px; font-size: 10px; color: #8b7355;
  letter-spacing: 6px; opacity: 0;
  animation: subtitleFade 0.8s ease-out 1.2s forwards;
}
@keyframes subtitleFade {
  from { opacity: 0; }
  to { opacity: 0.9; }
}

.name-block { text-align: center; width: 100%; }
.name-label {
  display: block; font-size: 11px; color: #8b7355;
  letter-spacing: 4px; margin-bottom: 8px;
}
.name-input {
  width: min(180px, 70%); padding: 8px 14px;
  background: rgba(26,14,5,0.8); border: 1.5px solid #c9a84c;
  border-radius: 4px; color: #f5e6c8; font-size: 14px;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  text-align: center; letter-spacing: 2px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  &::placeholder { color: #6b5a3a; }
  &:focus { border-color: #f5e6c8; box-shadow: 0 0 10px rgba(201,168,76,0.4); }
}

.start-block { text-align: center; }
.start-btn {
  padding: 10px 28px;
  background: linear-gradient(180deg, #2c1810, #1a0e05);
  border: 2px solid #c9a84c; border-radius: 4px;
  color: #d4af37; cursor: pointer;
  box-shadow: 0 0 10px rgba(201,168,76,0.3), inset 0 0 10px rgba(0,0,0,0.5);
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s;
  &:hover:not(:disabled) {
    color: #f5e6c8; border-color: #f5e6c8;
    box-shadow: 0 0 20px rgba(245,230,200,0.5);
  }
  &:disabled { opacity: 0.6; cursor: wait; }
}
.btn-inner {
  display: inline-flex; align-items: center; gap: 8px;
  letter-spacing: 3px; font-size: 13px; font-weight: bold;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}
.btn-icon { color: #c9a84c; }

.footer-hint {
  font-size: 10px; color: #8b7355; letter-spacing: 3px;
  display: flex; align-items: center; gap: 6px;
  opacity: 0.8;
}
.hint-mark { color: #c9a84c; }

// 小屏适配
@media (max-width: 400px) {
  .title-frame { padding: 18px 12px; gap: 12px; min-height: auto; }
  .deco-line { width: 75%; }
  .author-name { font-size: 12px; letter-spacing: 4px; }
  .game-title { letter-spacing: 6px; }
  .name-input { width: 80%; padding: 7px 10px; font-size: 13px; }
  .start-btn { padding: 8px 22px; }
  .btn-inner { font-size: 12px; letter-spacing: 2px; gap: 6px; }
  .particle:nth-child(n+7) { display: none; }
  .corner { font-size: 14px; }
}
</style>
