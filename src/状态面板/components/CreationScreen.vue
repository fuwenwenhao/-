<template>
  <div class="creation-wrapper">
    <div class="creation-frame">
      <div class="corner top-left">❦</div>
      <div class="corner top-right">❦</div>
      <div class="corner bottom-left">❦</div>
      <div class="corner bottom-right">❦</div>

      <div class="header">
        <span class="header-ornament">◈</span>
        <h2 class="header-title">角 色 创 建</h2>
        <span class="header-ornament">◈</span>
      </div>

      <!-- 进度指示 -->
      <div class="progress">
        <div v-for="i in totalSteps" :key="i" class="step-dot" :class="{ active: i === step, done: i < step }">
          {{ i }}
        </div>
      </div>

      <div class="content">
        <Transition name="slide" mode="out-in">
          <!-- 步骤1: 世界 -->
          <div v-if="step === 1" key="1" class="step">
            <h3 class="step-title">◈ 世界</h3>

            <div class="field">
              <label>时代</label>
              <div class="era-btns">
                <button
                  v-for="e in eras"
                  :key="e"
                  class="era-btn"
                  :class="{ active: form.era === e }"
                  @click="form.era = e"
                >
                  {{ e }}
                </button>
              </div>
            </div>

            <div class="field">
              <label>地区</label>
              <input v-model="form.region" class="input" placeholder="例如：月计都市 T 巢" />
            </div>
          </div>

          <!-- 步骤2: 基础信息 -->
          <div v-else-if="step === 2" key="2" class="step">
            <h3 class="step-title">◈ 基础信息</h3>

            <div class="field">
              <label>性别</label>
              <div class="gender-btns">
                <button
                  class="gender-btn"
                  :class="{ active: form.gender === '男' }"
                  @click="form.gender = '男'"
                >♂ 男</button>
                <button
                  class="gender-btn"
                  :class="{ active: form.gender === '女' }"
                  @click="form.gender = '女'"
                >♀ 女</button>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label>种族</label>
                <input v-model="form.race" class="input" placeholder="人类 / 改造人..." />
              </div>
              <div class="field">
                <label>年龄</label>
                <input v-model="form.age" class="input" placeholder="18" />
              </div>
            </div>

            <div class="field">
              <label>身高</label>
              <input v-model="form.height" class="input" placeholder="170cm" />
            </div>

            <div class="field">
              <label>身份</label>
              <input v-model="form.identity" class="input" placeholder="流民 / 巢民 / 外来者..." />
            </div>
          </div>

          <!-- 步骤3: 职业/实力/阵营 -->
          <div v-else-if="step === 3" key="3" class="step">
            <h3 class="step-title">◈ 职业与阵营</h3>

            <div class="field">
              <label>职业</label>
              <div class="option-list">
                <button
                  v-for="p in professions"
                  :key="p.id"
                  class="option-btn"
                  :class="{ active: form.profession === p.id }"
                  @click="form.profession = p.id; form.power = ''"
                >
                  <span class="opt-name">{{ p.name }}</span>
                  <span class="opt-desc">{{ p.desc }}</span>
                </button>
              </div>
            </div>

            <div class="field">
              <label>实力</label>
              <div v-if="!form.profession" class="hint-text">请先选择职业</div>
              <div v-else class="option-list compact">
                <button
                  v-for="pw in currentPowerOptions"
                  :key="pw"
                  class="option-btn small"
                  :class="{ active: form.power === pw }"
                  @click="form.power = pw"
                >{{ pw }}</button>
              </div>
            </div>

            <div class="field">
              <label>阵营</label>
              <div class="option-list compact">
                <button
                  v-for="f in factions"
                  :key="f"
                  class="option-btn small"
                  :class="{ active: form.faction === f }"
                  @click="form.faction = f"
                >{{ f }}</button>
              </div>
              <input
                v-model="customFaction"
                class="input mt-4"
                placeholder="自定义阵营（回车确认）"
                @keyup.enter="setCustomFaction"
              />
            </div>
          </div>

          <!-- 步骤4: 特质与背景 -->
          <div v-else-if="step === 4" key="4" class="step">
            <h3 class="step-title">◈ 特质与背景</h3>

            <div class="field">
              <label>外貌标签</label>
              <div class="tag-input-row">
                <input
                  v-model="appInput"
                  class="input"
                  placeholder="回车添加，如：银发"
                  @keyup.enter="addTag('appearance_tags', appInput); appInput = ''"
                />
              </div>
              <div class="tag-list">
                <span
                  v-for="(t, i) in form.appearance_tags"
                  :key="i"
                  class="tag"
                  @click="removeTag('appearance_tags', i)"
                >{{ t }} ✕</span>
              </div>
            </div>

            <div class="field">
              <label>性格标签</label>
              <div class="tag-input-row">
                <input
                  v-model="perInput"
                  class="input"
                  placeholder="回车添加，如：冷静"
                  @keyup.enter="addTag('personality_tags', perInput); perInput = ''"
                />
              </div>
              <div class="tag-list">
                <span
                  v-for="(t, i) in form.personality_tags"
                  :key="i"
                  class="tag"
                  @click="removeTag('personality_tags', i)"
                >{{ t }} ✕</span>
              </div>
            </div>

            <div class="field">
              <label>背景故事</label>
              <textarea
                v-model="form.background"
                class="textarea"
                rows="4"
                placeholder="描述你角色的过去..."
              ></textarea>
            </div>
          </div>

          <!-- 步骤5: 六维点数分配 -->
          <div v-else-if="step === 5" key="5" class="step">
            <h3 class="step-title">◈ 六维分配</h3>

            <div class="points-bar">
              <span class="pb-label">剩余点数</span>
              <span class="pb-value" :class="{ over: remainingPoints < 0, empty: remainingPoints === 0 }">
                {{ remainingPoints }} / {{ 27 }}
              </span>
              <button class="btn-reset" @click="resetAttrs">重置</button>
            </div>

            <div class="points-hint">
              购点法：8→13 每点耗 1；14 耗 2；15 耗 3。范围 8~15。
              <br>⚠ 剩余点数将按 1 点 = 100,000 眼 换算为初始金钱。
            </div>

            <div class="attr-list">
              <div v-for="a in attrList" :key="a.key" class="attr-row">
                <div class="attr-info">
                  <span class="attr-name">{{ a.label }}</span>
                  <span class="attr-desc">{{ a.desc }}</span>
                </div>
                <div class="attr-ctrl">
                  <button
                    class="btn-step"
                    :disabled="!canDecrease(a.key)"
                    @click="decAttr(a.key)"
                  >−</button>
                  <span class="attr-value">{{ form.attributes[a.key] }}</span>
                  <button
                    class="btn-step"
                    :disabled="!canIncrease(a.key)"
                    @click="incAttr(a.key)"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤6: 技能与装备 -->
          <div v-else-if="step === 6" key="6" class="step">
            <h3 class="step-title">◈ 技能与装备</h3>

            <!-- 技能列表 -->
            <div class="field">
              <label>技能</label>
              <div v-if="form.skills.length === 0" class="hint-text">尚未添加技能</div>
              <div class="custom-list">
                <div v-for="(sk, idx) in form.skills" :key="'sk' + idx" class="custom-card">
                  <div class="cc-head">
                    <span class="cc-name">{{ sk.name || '（未命名）' }}</span>
                    <button class="btn-remove" @click="form.skills.splice(idx, 1)">✕</button>
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">判定</span>
                    <select v-model="sk.attr" class="input tiny">
                      <option value="strength">力量</option>
                      <option value="agility">敏捷</option>
                      <option value="intelligence">智力</option>
                      <option value="constitution">体质</option>
                      <option value="charisma">魅力</option>
                      <option value="perception">感知</option>
                    </select>
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">名称</span>
                    <input v-model="sk.name" class="input tiny" placeholder="技能名" />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">数值</span>
                    <input v-model="sk.value" class="input tiny" placeholder="伤害/威力/范围..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">特效</span>
                    <input v-model="sk.vfx" class="input tiny" placeholder="燃烧/雷鸣..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">外观</span>
                    <input v-model="sk.appearance" class="input tiny" placeholder="银光刀影..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">效果</span>
                    <input v-model="sk.effect" class="input tiny" placeholder="斩击+流血..." />
                  </div>
                </div>
              </div>
              <button class="btn-add" @click="addSkill">＋ 添加技能</button>
            </div>

            <!-- 装备列表 -->
            <div class="field">
              <label>装备</label>
              <div v-if="form.equipments.length === 0" class="hint-text">尚未添加装备</div>
              <div class="custom-list">
                <div v-for="(eq, idx) in form.equipments" :key="'eq' + idx" class="custom-card">
                  <div class="cc-head">
                    <span class="cc-name">{{ eq.name || '（未命名）' }}</span>
                    <button class="btn-remove" @click="form.equipments.splice(idx, 1)">✕</button>
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">名称</span>
                    <input v-model="eq.name" class="input tiny" placeholder="装备名" />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">数值</span>
                    <input v-model="eq.value" class="input tiny" placeholder="攻击/防御/加成..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">特效</span>
                    <input v-model="eq.vfx" class="input tiny" placeholder="发光/寒气..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">外观</span>
                    <input v-model="eq.appearance" class="input tiny" placeholder="漆黑长剑..." />
                  </div>
                  <div class="cc-row">
                    <span class="cc-l">效果</span>
                    <input v-model="eq.effect" class="input tiny" placeholder="攻击+防御..." />
                  </div>
                </div>
              </div>
              <button class="btn-add" @click="addEquipment">＋ 添加装备</button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 操作按钮 -->
      <div class="footer-actions">
        <button v-if="step > 1" class="btn-secondary" @click="prevStep">← 上一步</button>
        <button v-else class="btn-secondary" @click="$emit('back')">← 返回</button>

        <button v-if="step < totalSteps" class="btn-primary" @click="nextStep">
          下一步 →
        </button>
        <button v-else class="btn-primary" @click="handleSubmit" :disabled="submitting">
          {{ submitting ? '创建中...' : '开始游戏 →' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useStatusStore } from '../store';
import type { CreationForm } from '../opening';

const emit = defineEmits<{
  back: [];
  done: [];
}>();

const props = defineProps<{
  playerName: string;
}>();

const store = useStatusStore();

const totalSteps = 6;
const step = ref(1);
const submitting = ref(false);
const errorMsg = ref('');

const eras = ['研究所时期', '脑叶公司时期', '废墟图书馆时期', '边狱巴士时期'];

// 职业定义
const professions = [
  { id: '收尾人', name: '收尾人', desc: '完成委托，收取报酬' },
  { id: '羽毛', name: '羽毛', desc: '世界之翼的员工' },
  { id: '帮派', name: '帮派', desc: '后巷的一方势力' },
  { id: '小员工', name: '小员工', desc: '只是在小公司工作而已' },
  { id: '普通人', name: '普通人', desc: '庞大都市之下的普通人' },
  { id: '老板', name: '老板', desc: '拥有了自己的一席之地（吧）' },
  { id: '灾害', name: '灾害', desc: '有资格成为大人物休闲时的谈资' },
];

// 实力等级（根据职业动态变化）
const SHOUWEI_POWERS = ['9阶收尾人', '8阶收尾人', '7阶收尾人', '6阶收尾人', '5阶收尾人', '4阶收尾人', '3阶收尾人', '2阶收尾人', '1阶收尾人', '色彩收尾人'];

const powerMap: Record<string, string[]> = {
  '收尾人': SHOUWEI_POWERS,
  '羽毛': ['文职', '1级员工', '2级员工', '3级员工', '4级员工', '5级员工', '部门领导', '精英队长'],
  '灾害': ['都市传闻', '都市怪谈', '都市传说', '都市恶疾', '都市梦魇', '都市之星', '杂质'],
  '帮派': SHOUWEI_POWERS,
  '小员工': SHOUWEI_POWERS,
  '普通人': SHOUWEI_POWERS,
  '老板': SHOUWEI_POWERS,
};

const currentPowerOptions = computed(() => {
  return powerMap[form.profession] || ['普通'];
});

// 阵营
const factions = [
  '食指', '拇指', '环指', '中指', '小指',
  'A公司', 'B公司', 'C公司', 'D公司', 'E公司',
  'F公司', 'G公司', 'H公司', 'I公司', 'J公司',
  'K公司', 'L公司', 'M公司', 'N公司', 'O公司',
  'P公司', 'Q公司', 'R公司', 'S公司', 'T公司',
  'U公司', 'V公司', 'W公司', 'X公司', 'Y公司', 'Z公司',
];

const customFaction = ref('');

function setCustomFaction() {
  const v = customFaction.value.trim();
  if (v) {
    form.faction = v;
    customFaction.value = '';
  }
}

const form = reactive<CreationForm>({
  name: '',
  era: '研究所时期',
  region: '',
  gender: '男',
  race: '',
  age: '',
  height: '',
  appearance_tags: [],
  personality_tags: [],
  background: '',
  profession: '',
  identity: '',
  power: '',
  faction: '',
  skills: [],
  equipments: [],
  attributes: {
    strength: 8,
    agility: 8,
    intelligence: 8,
    constitution: 8,
    charisma: 8,
    perception: 8,
  },
});

// === 六维点数分配 ===
const TOTAL_POINTS = 27;
const MIN_ATTR = 8;
const MAX_ATTR = 15;

// 购点法消耗：8-13每点耗1；14耗2；15耗3
function pointCost(value: number): number {
  if (value <= 13) return value - 8;
  if (value === 14) return 5 + 2;      // 5 (8→13) + 2 (14)
  if (value === 15) return 5 + 2 + 3;  // 5 + 2 + 3 (15)
  return 0;
}

const attrList = [
  { key: 'strength', label: '力量', desc: '影响物理攻击、格斗' },
  { key: 'agility', label: '敏捷', desc: '影响闪避、速度' },
  { key: 'intelligence', label: '智力', desc: '影响法术、科技' },
  { key: 'constitution', label: '体质', desc: '影响耐力、防御' },
  { key: 'charisma', label: '魅力', desc: '影响社交、诱导' },
  { key: 'perception', label: '感知', desc: '影响察觉、直觉' },
] as const;

const usedPoints = computed(() => {
  const a = form.attributes;
  return pointCost(a.strength) + pointCost(a.agility) + pointCost(a.intelligence)
    + pointCost(a.constitution) + pointCost(a.charisma) + pointCost(a.perception);
});

const remainingPoints = computed(() => TOTAL_POINTS - usedPoints.value);

function canIncrease(key: keyof typeof form.attributes): boolean {
  const cur = form.attributes[key];
  if (cur >= MAX_ATTR) return false;
  const cost = pointCost(cur + 1) - pointCost(cur);
  return remainingPoints.value >= cost;
}

function canDecrease(key: keyof typeof form.attributes): boolean {
  return form.attributes[key] > MIN_ATTR;
}

function incAttr(key: keyof typeof form.attributes) {
  if (canIncrease(key)) form.attributes[key]++;
}

function decAttr(key: keyof typeof form.attributes) {
  if (canDecrease(key)) form.attributes[key]--;
}

function resetAttrs() {
  form.attributes = {
    strength: 8, agility: 8, intelligence: 8,
    constitution: 8, charisma: 8, perception: 8,
  };
}

function addSkill() {
  form.skills.push({
    name: '', attr: 'strength', value: '', vfx: '', appearance: '', effect: '',
  });
}

function addEquipment() {
  form.equipments.push({
    name: '', value: '', vfx: '', appearance: '', effect: '',
  });
}

const appInput = ref('');
const perInput = ref('');

function addTag(key: 'appearance_tags' | 'personality_tags', value: string) {
  const v = value.trim();
  if (!v) return;
  if (!form[key].includes(v)) form[key].push(v);
}

function removeTag(key: 'appearance_tags' | 'personality_tags', idx: number) {
  form[key].splice(idx, 1);
}

function showError(msg: string) {
  errorMsg.value = msg;
  setTimeout(() => (errorMsg.value = ''), 2500);
}

function validateStep(s: number): boolean {
  if (s === 1) {
    if (!form.era) return showError('请选择时代'), false;
    if (!form.region.trim()) return showError('请填写地区'), false;
  } else if (s === 2) {
    if (!form.gender) return showError('请选择性别'), false;
    if (!form.race.trim()) return showError('请填写种族'), false;
    if (!form.age.trim()) return showError('请填写年龄'), false;
    if (!form.height.trim()) return showError('请填写身高'), false;
  } else if (s === 3) {
    if (!form.profession) return showError('请选择职业'), false;
    if (!form.power) return showError('请选择实力'), false;
  } else if (s === 5) {
    if (remainingPoints.value < 0) return showError('点数超支了'), false;
  }
  return true;
}

function nextStep() {
  if (!validateStep(step.value)) return;
  if (step.value < totalSteps) step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function handleSubmit() {
  if (submitting.value) return;
  if (!validateStep(1)) { step.value = 1; return; }
  if (!validateStep(2)) { step.value = 2; return; }
  if (!validateStep(3)) { step.value = 3; return; }
  if (!validateStep(5)) { step.value = 5; return; }

  submitting.value = true;
  // 把剩余点数写入 form，供 store 计算金钱
  form.remaining_points = remainingPoints.value;
  form.name = props.playerName;
  try {
    await store.submitCreation(form);
    toastr.success('已进入月计都市', '创建完成');
    emit('done');
  } catch (e) {
    console.error('[月计都市] 创建失败:', e);
    showError('创建失败：' + (e instanceof Error ? e.message : String(e)));
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.creation-wrapper {
  width: 100%;
  padding: 8px;
  font-family: 'Georgia', 'Noto Serif SC', serif;
}

.creation-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(201, 168, 76, 0.08), transparent 70%),
    linear-gradient(170deg, #f5e6c8 0%, #e8d5a3 40%, #dfc992 100%);
  border: 3px solid #c9a84c;
  border-radius: 10px;
  box-shadow:
    0 0 15px rgba(201, 168, 76, 0.3),
    inset 0 0 25px rgba(139, 90, 43, 0.15);
  padding: 18px;
  overflow: hidden;
  animation: frameFadeIn 0.6s ease-out;
  box-sizing: border-box;
}
@keyframes frameFadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.corner {
  position: absolute; font-size: 16px;
  color: #c9a84c; opacity: 0.7;
}
.top-left { top: 8px; left: 12px; }
.top-right { top: 8px; right: 12px; transform: scaleX(-1); }
.bottom-left { bottom: 8px; left: 12px; transform: scaleY(-1); }
.bottom-right { bottom: 8px; right: 12px; transform: scale(-1); }

.header {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding-bottom: 8px;
  border-bottom: 2px solid rgba(201, 168, 76, 0.5);
  margin-bottom: 12px;
}
.header-ornament { font-size: 12px; color: #c9a84c; }
.header-title {
  font-size: 16px; color: #4a3728;
  letter-spacing: 4px; margin: 0; font-weight: bold;
}

.progress {
  display: flex; justify-content: center;
  gap: 12px; margin-bottom: 14px;
}
.step-dot {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid rgba(201, 168, 76, 0.5);
  background: rgba(245, 230, 200, 0.7);
  color: #8b7355; font-size: 11px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
  &.active {
    background: #c9a84c; color: #2c1810;
    border-color: #c9a84c;
    box-shadow: 0 0 8px rgba(201, 168, 76, 0.6);
  }
  &.done {
    background: rgba(201, 168, 76, 0.3);
    color: #4a3728;
  }
}

.content {
  min-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
}
.step { padding: 4px 2px; }
.step-title {
  font-size: 13px; color: #4a3728; margin: 0 0 12px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(201, 168, 76, 0.4);
}

.field { margin-bottom: 10px; }
.field label {
  display: block; font-size: 11px; color: #6b5440;
  margin-bottom: 4px; letter-spacing: 1px;
}
.field-row {
  display: flex; gap: 8px;
  .field { flex: 1; margin-bottom: 10px; }
}

.input, .textarea {
  width: 100%; padding: 6px 8px; font-size: 12px;
  border: 1px solid rgba(201, 168, 76, 0.5);
  border-radius: 4px;
  background: rgba(245, 230, 200, 0.7);
  color: #4a3728; font-family: 'Georgia', serif;
  outline: none; box-sizing: border-box;
  transition: border 0.2s;
  &:focus { border-color: #c9a84c; box-shadow: 0 0 4px rgba(201,168,76,0.3); }
}
.textarea { resize: vertical; line-height: 1.5; }

.era-btns, .gender-btns {
  display: flex; gap: 6px; flex-wrap: wrap;
}
.era-btn, .gender-btn {
  flex: 1; padding: 5px 8px; font-size: 11px;
  border: 1px solid rgba(201, 168, 76, 0.5); border-radius: 4px;
  background: rgba(245, 230, 200, 0.6);
  color: #4a3728; cursor: pointer;
  font-family: 'Georgia', serif;
  transition: all 0.15s;
  &:hover { border-color: #c9a84c; background: rgba(201, 168, 76, 0.12); }
  &.active {
    background: linear-gradient(180deg, #c9a84c, #b8963f);
    color: #2c1810; font-weight: bold;
    border-color: #c9a84c;
  }
}

.tag-input-row { margin-bottom: 4px; }
.tag-list {
  display: flex; flex-wrap: wrap; gap: 4px;
  min-height: 6px;
}
.tag {
  padding: 2px 8px; font-size: 10px; border-radius: 10px;
  background: rgba(201, 168, 76, 0.2);
  border: 1px solid rgba(201, 168, 76, 0.4);
  color: #4a3728; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(201, 64, 64, 0.15); border-color: #c94040; color: #6b1a1a; }
}

.option-list {
  display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto;
  &.compact { flex-direction: row; flex-wrap: wrap; max-height: none; }
}
.option-btn {
  padding: 6px 10px; border-radius: 4px; text-align: left;
  border: 1px solid rgba(201, 168, 76, 0.4);
  background: rgba(245, 230, 200, 0.6); cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #c9a84c; background: rgba(201, 168, 76, 0.12); }
  &.active {
    background: linear-gradient(180deg, #c9a84c, #b8963f);
    color: #2c1810; font-weight: bold; border-color: #c9a84c;
  }
  &.small { padding: 4px 8px; font-size: 10px; }
}
.opt-name { display: block; font-size: 12px; color: #4a3728; font-weight: bold; }
.opt-desc { display: block; font-size: 9px; color: #8b7355; margin-top: 1px; }
.hint-text { font-size: 10px; color: #9b8a7a; font-style: italic; }
.mt-4 { margin-top: 6px; }

.custom-list {
  display: flex; flex-direction: column; gap: 6px;
  margin-bottom: 6px;
}
.custom-card {
  padding: 6px 8px; background: rgba(74, 55, 40, 0.05);
  border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 4px;
}
.cc-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 4px;
  padding-bottom: 3px; border-bottom: 1px dashed rgba(201, 168, 76, 0.3);
}
.cc-name { font-size: 12px; color: #4a3728; font-weight: bold; }
.btn-remove {
  padding: 0 6px; font-size: 11px; border-radius: 3px;
  border: 1px solid rgba(201, 64, 64, 0.4); background: transparent;
  color: #8b3a3a; cursor: pointer;
  &:hover { background: rgba(201, 64, 64, 0.15); }
}
.cc-row {
  display: flex; align-items: center; gap: 6px; margin-bottom: 3px;
}
.cc-l { font-size: 10px; color: #6b5440; width: 32px; flex-shrink: 0; }
.input.tiny { flex: 1; padding: 3px 6px; font-size: 10px; }
.btn-add {
  padding: 4px 10px; font-size: 11px; border-radius: 4px;
  border: 1px dashed rgba(201, 168, 76, 0.5);
  background: rgba(201, 168, 76, 0.08); color: #6b5440;
  cursor: pointer; font-family: 'Georgia', serif;
  transition: all 0.15s;
  &:hover { background: rgba(201, 168, 76, 0.2); color: #4a3728; border-style: solid; }
}

/* === 六维分配 === */
.points-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px; margin-bottom: 6px;
  background: linear-gradient(180deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05));
  border: 1px solid rgba(201, 168, 76, 0.4); border-radius: 4px;
}
.pb-label { font-size: 11px; color: #6b5440; }
.pb-value {
  font-size: 16px; color: #4a3728; font-weight: bold;
  letter-spacing: 1px;
  &.over { color: #c94040; }
  &.empty { color: #3a6b2a; }
}
.btn-reset {
  margin-left: auto; padding: 3px 10px; font-size: 10px; border-radius: 3px;
  border: 1px solid rgba(201, 168, 76, 0.4); background: transparent;
  color: #6b5440; cursor: pointer;
  &:hover { background: rgba(201, 168, 76, 0.15); color: #4a3728; }
}
.points-hint {
  font-size: 10px; color: #8b7355; font-style: italic;
  margin-bottom: 10px; padding: 4px 8px;
  background: rgba(74, 55, 40, 0.04); border-radius: 3px;
}

.attr-list { display: flex; flex-direction: column; gap: 6px; }
.attr-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 10px;
  background: rgba(74, 55, 40, 0.04); border-radius: 4px;
  border-left: 3px solid rgba(201, 168, 76, 0.5);
}
.attr-info { display: flex; flex-direction: column; gap: 1px; }
.attr-name { font-size: 12px; color: #4a3728; font-weight: bold; letter-spacing: 1px; }
.attr-desc { font-size: 9px; color: #8b7355; font-style: italic; }
.attr-ctrl { display: flex; align-items: center; gap: 8px; }
.btn-step {
  width: 22px; height: 22px; border-radius: 50%; font-size: 13px; font-weight: bold;
  border: 1px solid #c9a84c;
  background: linear-gradient(180deg, #e8d5a3, #dfc992);
  color: #4a3728; cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #c9a84c, #b8963f);
    color: #2c1810; box-shadow: 0 0 6px rgba(201, 168, 76, 0.4);
  }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}
.attr-value {
  min-width: 24px; text-align: center;
  font-size: 15px; color: #c9a84c; font-weight: bold;
  text-shadow: 0 0 4px rgba(201, 168, 76, 0.3);
}

.footer-actions {
  position: absolute;
  bottom: 12px; left: 18px; right: 18px;
  display: flex; justify-content: space-between; gap: 10px;
}

.btn-secondary, .btn-primary {
  flex: 1; padding: 7px 14px; border-radius: 4px;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  font-size: 12px; font-weight: bold;
  letter-spacing: 2px; cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(201, 168, 76, 0.5);
  color: #6b5440;
  &:hover { background: rgba(201, 168, 76, 0.15); border-color: #c9a84c; color: #4a3728; }
}
.btn-primary {
  background: linear-gradient(180deg, #c9a84c, #b8963f);
  border: 1px solid #c9a84c; color: #2c1810;
  &:hover { box-shadow: 0 0 12px rgba(201, 168, 76, 0.5); transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: wait; transform: none; box-shadow: none; }
}

.error-toast {
  position: absolute; top: 60px; left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px; font-size: 11px;
  background: rgba(201, 64, 64, 0.9); color: #f5e6c8;
  border-radius: 4px;
  animation: toastIn 0.2s ease-out;
  z-index: 10;
}
@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, -8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
