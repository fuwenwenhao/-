<template>
  <div class="title-wrapper">
    <div class="title-frame" ref="frameRef">
      <!-- 背景纹理层 -->
      <div class="bg-noise"></div>
      <div class="bg-vignette"></div>

      <!-- 装饰性金色粒子 -->
      <div class="particles">
        <span
          v-for="i in 18"
          :key="i"
          class="particle"
          :style="particleStyle(i)"
        ></span>
      </div>

      <!-- 四角装饰 -->
      <div class="corner top-left">❦</div>
      <div class="corner top-right">❦</div>
      <div class="corner bottom-left">❦</div>
      <div class="corner bottom-right">❦</div>

      <!-- 上方装饰线 -->
      <div class="deco-line top">
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
        <div class="title-shadow">月计都市</div>
        <div class="title-subtitle">LUNAR CALCULUS CITY</div>
      </div>

      <!-- 下方装饰线 -->
      <div class="deco-line bottom">
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
          <span class="btn-glow"></span>
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

const emit = defineEmits<{
  start: [name: string];
}>();

const starting = ref(false);
const playerName = ref('');
const frameRef = ref<HTMLDivElement | null>(null);

const titleChars = ['月', '计', '都', '市'];

function charDelay(i: number) {
  return { animationDelay: `${0.4 + i * 0.18}s` };
}

function particleStyle(i: number) {
  const left = (i * 37 + 13) % 100;
  const top = (i * 53 + 7) % 100;
  const duration = 4 + (i % 5);
  const delay = (i % 6) * 0.4;
  const size = 2 + (i % 3);
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    width: `${size}px`,
    height: `${size}px`,
  };
}

function handleStart() {
  if (starting.value || !playerName.value.trim()) return;
  starting.value = true;
  setTimeout(() => {
    emit('start', playerName.value.trim());
  }, 600);
}
</script>

<style lang="scss" scoped>
.title-wrapper {
  width: 100%;
  padding: 8px;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}

.title-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(201, 168, 76, 0.12), transparent 60%),
    linear-gradient(160deg, #1a0e05 0%, #2c1810 50%, #0f0803 100%);
  border: 3px solid #c9a84c;
  border-radius: 10px;
  box-shadow:
    0 0 25px rgba(201, 168, 76, 0.35),
    inset 0 0 60px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  padding: 4px;
  animation: frameFadeIn 1.2s ease-out;
}

@keyframes frameFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.bg-noise {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(45deg, transparent 0, transparent 2px, rgba(201, 168, 76, 0.02) 2px, rgba(201, 168, 76, 0.02) 4px),
    repeating-linear-gradient(-45deg, transparent 0, transparent 3px, rgba(139, 90, 43, 0.02) 3px, rgba(139, 90, 43, 0.02) 6px);
  pointer-events: none;
  opacity: 0.7;
}

.bg-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

/* 金色粒子飘动 */
.particles {
  position: absolute; inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.particle {
  position: absolute;
  background: radial-gradient(circle, #c9a84c 0%, rgba(201, 168, 76, 0.3) 60%, transparent 100%);
  border-radius: 50%;
  opacity: 0.6;
  animation: floatUp linear infinite;
  box-shadow: 0 0 4px rgba(201, 168, 76, 0.6);
}
@keyframes floatUp {
  0% { transform: translateY(20px) translateX(0); opacity: 0; }
  20% { opacity: 0.7; }
  80% { opacity: 0.5; }
  100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
}

/* 四角装饰 */
.corner {
  position: absolute;
  font-size: 18px;
  color: #c9a84c;
  opacity: 0.85;
  text-shadow: 0 0 6px rgba(201, 168, 76, 0.6);
  animation: cornerPulse 3s ease-in-out infinite;
}
.top-left { top: 8px; left: 12px; }
.top-right { top: 8px; right: 12px; transform: scaleX(-1); }
.bottom-left { bottom: 8px; left: 12px; transform: scaleY(-1); }
.bottom-right { bottom: 8px; right: 12px; transform: scale(-1); }

@keyframes cornerPulse {
  0%, 100% { opacity: 0.6; text-shadow: 0 0 4px rgba(201, 168, 76, 0.4); }
  50% { opacity: 1; text-shadow: 0 0 10px rgba(201, 168, 76, 0.8); }
}

/* 装饰线 */
.deco-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  width: 60%;
}
.deco-line.top { top: 18%; }
.deco-line.bottom { top: 62%; }
.line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c 30%, #c9a84c 70%, transparent);
  animation: lineExpand 1.5s ease-out;
}
.deco-mark {
  color: #c9a84c;
  font-size: 14px;
  animation: markSpin 1s ease-out 0.5s backwards;
}
@keyframes lineExpand {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes markSpin {
  from { opacity: 0; transform: rotate(-180deg); }
  to { opacity: 1; transform: rotate(0deg); }
}

/* 作者 */
.author-block {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeSlideIn 0.9s ease-out 0.3s backwards;
}
.author-label {
  font-size: 10px;
  color: #8b7355;
  border: 1px solid rgba(201, 168, 76, 0.5);
  padding: 1px 6px;
  border-radius: 2px;
  letter-spacing: 2px;
}
.author-name {
  font-size: 14px;
  color: #d4af37;
  letter-spacing: 6px;
  text-shadow: 0 0 6px rgba(201, 168, 76, 0.5);
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 主标题 */
.title-block {
  position: absolute;
  top: 26%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
}

.game-title {
  margin: 0;
  font-size: 42px;
  color: #f5e6c8;
  letter-spacing: 12px;
  font-weight: bold;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  text-shadow:
    0 0 12px rgba(201, 168, 76, 0.9),
    0 0 24px rgba(201, 168, 76, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.9);
  position: relative;
  z-index: 2;
}

.game-title .ch {
  display: inline-block;
  opacity: 0;
  animation: charDrop 0.7s cubic-bezier(0.25, 1.5, 0.5, 1) forwards;
}
@keyframes charDrop {
  0% { opacity: 0; transform: translateY(-30px) rotateX(90deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
}

.title-shadow {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 42px;
  color: transparent;
  letter-spacing: 12px;
  font-weight: bold;
  text-shadow: 0 0 30px rgba(201, 168, 76, 0.3);
  pointer-events: none;
  z-index: 1;
}

.title-subtitle {
  margin-top: 8px;
  font-size: 10px;
  color: #8b7355;
  letter-spacing: 8px;
  font-family: 'Georgia', serif;
  opacity: 0;
  animation: subtitleFade 1s ease-out 1.4s forwards;
}
@keyframes subtitleFade {
  from { opacity: 0; letter-spacing: 4px; }
  to { opacity: 0.9; letter-spacing: 8px; }
}

/* 名字输入 */
.name-block {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: fadeSlideUp 1s ease-out 1.5s backwards;
}
.name-label {
  display: block;
  font-size: 11px;
  color: #8b7355;
  letter-spacing: 4px;
  margin-bottom: 8px;
}
.name-input {
  width: 180px;
  padding: 8px 14px;
  background: rgba(26, 14, 5, 0.8);
  border: 1.5px solid #c9a84c;
  border-radius: 4px;
  color: #f5e6c8;
  font-size: 14px;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  text-align: center;
  letter-spacing: 2px;
  outline: none;
  transition: all 0.3s ease;
  &::placeholder { color: #6b5a3a; }
  &:focus {
    border-color: #f5e6c8;
    box-shadow: 0 0 12px rgba(201, 168, 76, 0.4);
  }
}

/* 开始按钮 */
.start-block {
  position: absolute;
  top: 76%;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeSlideUp 1s ease-out 1.6s backwards;
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.start-btn {
  position: relative;
  padding: 10px 32px;
  background: linear-gradient(180deg, #2c1810 0%, #1a0e05 100%);
  border: 2px solid #c9a84c;
  border-radius: 4px;
  color: #d4af37;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 0 12px rgba(201, 168, 76, 0.3),
    inset 0 0 12px rgba(0, 0, 0, 0.5);

  &:hover:not(:disabled) {
    color: #f5e6c8;
    border-color: #f5e6c8;
    box-shadow:
      0 0 25px rgba(245, 230, 200, 0.6),
      inset 0 0 15px rgba(201, 168, 76, 0.2);
    transform: translateY(-1px);

    .btn-glow { animation: glowSweep 0.8s ease-out; }
    .btn-icon { transform: translateX(0); opacity: 1; }
    .btn-icon.rev { transform: translateX(0); }
  }

  &:active:not(:disabled) { transform: translateY(1px); }
  &:disabled { opacity: 0.7; cursor: wait; }
}

.btn-inner {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 4px;
  font-size: 14px;
  font-weight: bold;
}

.btn-icon {
  color: #c9a84c;
  transform: translateX(-4px);
  opacity: 0.6;
  transition: all 0.3s ease;
  &.rev { transform: translateX(4px); }
}

.btn-glow {
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(245, 230, 200, 0.4),
    transparent);
  z-index: 1;
}
@keyframes glowSweep {
  from { left: -100%; }
  to { left: 200%; }
}

/* 底部提示 */
.footer-hint {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #8b7355;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: hintPulse 3s ease-in-out infinite;
}
.hint-mark {
  color: #c9a84c;
  opacity: 0.7;
}
@keyframes hintPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>