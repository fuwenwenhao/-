import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StatusDataSchema, type StatusData } from './types';
import { parseString } from '../../util/common';
import { buildOpeningText, type CreationForm } from './opening';

// lodash 替代工具
function deepSet(obj: any, path: string, val: any) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = val;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target: any, ...sources: any[]): any {
  for (const source of sources) {
    if (!source) continue;
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

export const useStatusStore = defineStore('status', () => {
  const rawData = ref<StatusData>(StatusDataSchema.parse(undefined));

  const activeTab = ref<string>('player');
  const maintext = ref<string>('');  // 当前查看楼层正文
  const viewingFloor = ref<number>(-1);  // 当前查看的楼层号
  const latestFloor = ref<number>(-1);   // 最新楼层号

  // === 写入世界书「游戏信息」条目 ===
  async function writeGameInfoEntry(form: CreationForm): Promise<void> {
    const ENTRY_NAME = '游戏信息';

    // 组装设定数据内容
    const content = [
      `[游戏信息]`,
      `时代: ${form.era}`,
      `地区: ${form.region}`,
      ``,
      `[玩家角色]`,
      `性别: ${form.gender}`,
      `种族: ${form.race}`,
      `年龄: ${form.age}`,
      `身高: ${form.height}`,
      `职业: ${form.profession || '无'}`,
      `身份: ${form.identity || '无'}`,
      `实力: ${form.power || '普通'}`,
      `阵营: ${form.faction || '无'}`,
      `金钱: ${Math.max(0, form.remaining_points ?? 0) * 100000} 眼`,
      `外貌: ${form.appearance_tags.join('、') || '无'}`,
      `性格: ${form.personality_tags.join('、') || '无'}`,
      `背景故事: ${form.background || '无'}`,
      ``,
      `[六维]`,
      `力量: ${form.attributes.strength}  敏捷: ${form.attributes.agility}  智力: ${form.attributes.intelligence}`,
      `体质: ${form.attributes.constitution}  魅力: ${form.attributes.charisma}  感知: ${form.attributes.perception}`,
      ``,
      `[技能列表]`,
      form.skills.length === 0 ? '（无）' :
        form.skills.map(s => (
          `- ${s.name} [判定:${s.attr}]\n  数值: ${s.value || '无'}\n  特效: ${s.vfx || '无'}\n  外观: ${s.appearance || '无'}\n  效果: ${s.effect || '无'}`
        )).join('\n'),
      ``,
      `[装备清单]`,
      form.equipments.length === 0 ? '（无）' :
        form.equipments.map(e => (
          `- ${e.name}\n  数值: ${e.value || '无'}\n  特效: ${e.vfx || '无'}\n  外观: ${e.appearance || '无'}\n  效果: ${e.effect || '无'}`
        )).join('\n'),
    ].join('\n');

    // 获取本卡绑定的主世界书
    const charBooks = getCharWorldbookNames('current');
    let targetBook = charBooks.primary;
    if (!targetBook && charBooks.additional.length > 0) {
      targetBook = charBooks.additional[0];
    }
    if (!targetBook) {
      console.warn('[月计都市] 未绑定世界书，跳过写入游戏信息');
      return;
    }

    console.info('[月计都市] 目标世界书:', targetBook);

    // 用 updateWorldbookWith 查找并更新/创建条目
    await updateWorldbookWith(targetBook, (entries) => {
      const existing = entries.find(e => e.name === ENTRY_NAME);

      if (existing) {
        console.info('[月计都市] 世界书条目「游戏信息」已存在，更新内容');
        existing.content = content;
        return entries;
      } else {
        console.info('[月计都市] 创建世界书条目「游戏信息」');
        return [
          ...entries,
          {
            name: ENTRY_NAME,
            enabled: true,
            content: content,
            strategy: {
              type: 'constant',
              keys: [],
              keys_secondary: { logic: 'and_any', keys: [] },
              scan_depth: 'same_as_global',
            },
            position: {
              type: 'at_depth',
              role: 'system',
              depth: 4,
              order: 100,
            },
            probability: 100,
            recursion: {
              prevent_incoming: false,
              prevent_outgoing: false,
              delay_until: null,
            },
            effect: {
              sticky: null,
              cooldown: null,
              delay: null,
            },
          },
        ] as any;
      }
    });

    console.info('[月计都市] 世界书条目「游戏信息」写入完成');
  }

  // === 开局创建：提交表单 ===
  async function submitCreation(form: CreationForm): Promise<void> {
    console.info('[月计] submitCreation 开始');
    // 1. 从第 0 楼读取 MVU 初始化的 stat_data
    let statData: Record<string, any> = {};
    try {
      const initialData = Mvu.getMvuData({ type: 'message', message_id: 0 });
      statData = deepClone(initialData?.stat_data ?? {});
    } catch (e) {
      console.warn('[月计] 读取 MVU 初始变量失败，使用空对象:', e);
      statData = {};
    }
    console.info('[月计] statData keys:', Object.keys(statData));

    // 2. 用玩家选择覆盖对应字段
    deepSet(statData, '世界.时代', form.era);
    deepSet(statData, '世界.地区', form.region);
    deepSet(statData, '玩家.性别', form.gender);
    deepSet(statData, '玩家.种族', form.race);
    deepSet(statData, '玩家.年龄', form.age);
    deepSet(statData, '玩家.身高', form.height);
    deepSet(statData, '玩家.外貌', form.appearance_tags);
    deepSet(statData, '玩家.性格', form.personality_tags);
    deepSet(statData, '玩家.职业', form.profession);
    deepSet(statData, '玩家.身份', form.identity);
    deepSet(statData, '玩家.实力', form.power);
    deepSet(statData, '玩家.阵营', form.faction);
    deepSet(statData, '玩家.背景故事', form.background);
    deepSet(statData, '玩家.技能', form.skills);
    deepSet(statData, '玩家.装备清单', form.equipments);
    deepSet(statData, '玩家.六维', form.attributes);

    // 剩余六维点数换算金钱：1点 = 100000 眼
    const money = Math.max(0, form.remaining_points ?? 0) * 100000;
    deepSet(statData, '玩家.金钱', money);
    deepSet(statData, '玩家.当前年月', form.era);
    deepSet(statData, '玩家.所在地区', form.region);

    // 同步到 rawData（战斗系统 & 状态栏会用）
    rawData.value.attributes = { ...form.attributes };
    rawData.value.player.money = money;
    rawData.value.player.current_date = form.era;
    rawData.value.player.current_region = form.region;

    // 同步玩家技能到 rawData（战斗系统会用）
    rawData.value.skills = form.skills.map(s => ({
      name: s.name,
      attr: s.attr as any,
      description: s.effect,
      value: s.value,
      vfx: s.vfx,
      appearance: s.appearance,
      effect: s.effect,
    }));

    // 3. 组装开场白
    const messageText = buildOpeningText(form);

    // 4. 写入世界书「游戏信息」条目（非关键，失败不阻止创建）
    try {
      if (typeof getCharWorldbookNames === 'function' && typeof updateWorldbookWith === 'function') {
        await writeGameInfoEntry(form);
      }
    } catch (e) {
      console.warn('[月计] 写入世界书失败（不影响创建）:', e);
    }

    // 5. 替换 0 楼内容为开场白
    if (typeof setChatMessages === 'function') {
      await setChatMessages([{
        message_id: 0,
        message: messageText,
        data: { stat_data: statData },
      }]);
    }

    // 6. 自动发送一条消息让 AI 开始生成
    if (typeof generate === 'function') {
      generate({
        user_input: '（开始游戏）',
        should_stream: true,
      }).catch(e => console.warn('[月计] 自动生成失败:', e));
    }
  }

  function loadData() {
    // 在最新楼层 iframe 中读取变量
    let varData: Record<string, any> = {};
    try {
      // getAllVariables 在消息楼层 iframe 中返回合并到当前楼层的变量
      if (typeof getAllVariables === 'function') {
        varData = getAllVariables();
      }
    } catch (e) {
      console.warn('[月计] 读取变量失败:', e);
      return;
    }

    // 读正文
    const currentId = typeof getCurrentMessageId === 'function' ? getCurrentMessageId() : -1;
    if (currentId >= 0 && typeof getChatMessages === 'function') {
      try {
        const msgs = getChatMessages(currentId);
        if (msgs.length) {
          maintext.value = filterMaintext(msgs[0].message);
          latestFloor.value = currentId;
          if (viewingFloor.value < 0) viewingFloor.value = currentId;
        }
      } catch {}
    }

    // 映射变量到状态
    const mvuData = varData?.stat_data ?? varData ?? {};
    const mapped = mapMvuToStatus(mvuData);
    rawData.value = StatusDataSchema.parse(mapped);
  }

  /** 加载指定楼层的正文（不影响状态栏数据） */
  function loadFloorText(floorId: number) {
    try {
      const msgs = getChatMessages(floorId);
      if (!msgs.length) return;
      const text = msgs[0].message;
      maintext.value = filterMaintext(text);
      viewingFloor.value = floorId;
    } catch (e) {
      console.warn('[月计] 加载楼层正文失败:', floorId, e);
    }
  }

  /** 翻页：-1=上一页，+1=下一页 */
  function navigateFloor(delta: number) {
    const target = viewingFloor.value + delta;
    if (target < 0 || target > latestFloor.value) return;
    loadFloorText(target);
  }

  /** 读档：回退状态栏到指定楼层 */
  function loadFromFloor(floorId: number) {
    if (floorId < 0) return;
    let varData: Record<string, any> = {};
    try {
      varData = getVariables({ type: 'message', message_id: floorId });
    } catch (e) {
      console.warn('[月计] 读档变量失败:', e);
      return;
    }
    const mvuData = varData?.stat_data ?? varData ?? {};
    const mapped = mapMvuToStatus(mvuData);
    rawData.value = StatusDataSchema.parse(mapped);
    loadFloorText(floorId);
  }

  /** 过滤消息正文：去除变量/状态标记，美化思维链 */
  function filterMaintext(raw: string): string {
    let t = raw;
    const thinkReplace = (_m: string, content: string) => {
      const c = content.trim();
      if (!c) return '';
      return `\n<details class="thinking-block"><summary>💭 思考过程</summary>\n${c}\n</details>\n`;
    };
    const thinkOpen = (_m: string, content: string) => {
      return `\n<details class="thinking-block" open><summary>💭 思考中...</summary>\n${content.trim()}\n</details>\n`;
    };
    t = t.replace(/<think>([\s\S]*?)<\/think>/gi, thinkReplace);
    t = t.replace(/<thinking>([\s\S]*?)<\/thinking>/gi, thinkReplace);
    t = t.replace(/<reasoning>([\s\S]*?)<\/reasoning>/gi, thinkReplace);
    t = t.replace(/<内心>([\s\S]*?)<\/内心>/gi, thinkReplace);
    t = t.replace(/<\|thinking\|>([\s\S]*?)<\|\/thinking\|>/gi, thinkReplace);
    t = t.replace(/<think>([\s\S]*)$/gi, thinkOpen);
    t = t.replace(/<thinking>([\s\S]*)$/gi, thinkOpen);
    t = t.replace(/<reasoning>([\s\S]*)$/gi, thinkOpen);
    t = t.replace(/<\|thinking\|>([\s\S]*)$/gi, thinkOpen);
    t = t.replace(/<update(?:variable)?>[\s\S]*?<\/update(?:variable)?>/gi, '');
    t = t.replace(/<update(?:variable)?>[\s\S]*$/gi, '');
    t = t.replace(/```status\s*\n[\s\S]*?\n```/g, '');
    t = t.replace(/\[状态[：:][\s\S]*?\]/g, '');
    t = t.replace(/<StatusPanel\s*\/?>/gi, '');
    t = t.replace(/\n{3,}/g, '\n\n');
    return t.trim();
  }

  /** 把 MVU schema 的中文键结构转为前端 StatusDataSchema 的英文键 */
  function mapMvuToStatus(d: Record<string, any>) {
    const 玩家 = d.玩家 ?? {};
    const 基本 = 玩家.基本信息 ?? {};
    const 状态 = 玩家.状态 ?? {};
    const 六维 = 玩家.六维 ?? {};
    const 装备 = 玩家.装备 ?? {};
    const 身体 = 玩家.身体 ?? {};
    const 背包 = 玩家.背包 ?? {};
    const 世界 = d.世界 ?? {};
    const 地图 = 世界.地图 ?? {};

    return {
      player: {
        name: 基本.性别 ? `${基本.种族 ?? ''}·${基本.职业 ?? ''}` : '',
        hp: 状态.hp ?? { current: 10, max: 10 },
        sanity: 状态.sanity ?? { current: 10, max: 10 },
        physical_state: 状态.physical_state ?? 状态.物理状态 ?? '正常',
        emotion_level: 状态.emotion_level ?? 状态.情绪 ?? '平静',
        identity: 基本.身份 ?? '',
        power: 基本.实力 ?? '',
        current_form: 状态.current_form ?? 状态.当前形态 ?? '原生形态',
        money: 玩家.金钱 ?? 0,
        current_date: 世界.当前年月 ?? 世界.时代 ?? '',
        current_region: 地图.current_location ?? 地图.当前位置 ?? '',
      },
      equipment: 装备,
      body: 身体,
      attributes: {
        strength: 六维.strength ?? 8,
        agility: 六维.agility ?? 8,
        intelligence: 六维.intelligence ?? 8,
        constitution: 六维.constitution ?? 8,
        charisma: 六维.charisma ?? 8,
        perception: 六维.perception ?? 8,
      },
      companions: Object.entries(d.同伴 ?? {}).map(([name, c]: [string, any]) => ({
        name,
        identity: c.identity ?? '同伴',
        affection: c.affection ?? 0,
        current_form: c.current_form ?? '常态',
        hp: c.hp ?? { current: 10, max: 10 },
        sanity: c.sanity ?? { current: 10, max: 10 },
        physical_state: c.physical_state ?? '正常',
        emotion_level: c.emotion_level ?? '平静',
        equipment: c.equipment ?? {},
        body: c.body ?? {},
      })),
      npcs: Object.entries(d.交互角色 ?? {}).map(([name, n]: [string, any]) => ({
        name,
        identity: n.identity ?? '路人',
        power: n.power ?? '未知',
        hp: n.hp ?? { current: 10, max: 10 },
        sanity: n.sanity ?? { current: 10, max: 10 },
        physical_state: n.physical_state ?? '正常',
        emotion_level: n.emotion_level ?? '平静',
        equipment: n.equipment ?? {},
        body: n.body ?? {},
      })),
      inventory: {
        weapons: Object.entries(背包.weapons ?? {}).map(([name, w]: [string, any]) => ({
          name, count: w.count ?? 1, description: w.description ?? '',
        })),
        items: Object.entries(背包.items ?? {}).map(([name, it]: [string, any]) => ({
          name, count: it.count ?? 1, description: it.description ?? '',
        })),
      },
      map: {
        current_location: 地图.current_location ?? '',
        current_area: 地图.current_area ?? '后巷',
      },
      skills: Object.entries(玩家.技能列表 ?? {}).map(([name, s]: [string, any]) => ({
        name,
        attr: s.attr ?? 'strength',
        value: s.value ?? '',
        vfx: s.vfx ?? '',
        appearance: s.appearance ?? '',
        effect: s.effect ?? '',
      })),
    };
  }

  const player = computed(() => rawData.value.player);
  const equipment = computed(() => rawData.value.equipment);
  const body = computed(() => rawData.value.body);
  const attributes = computed(() => rawData.value.attributes);
  const companions = computed(() => rawData.value.companions);
  const npcs = computed(() => rawData.value.npcs);
  const inventory = computed(() => rawData.value.inventory);
  const map = computed(() => rawData.value.map);
  const skills = computed(() => rawData.value.skills);

  return {
    rawData, player, equipment, body, attributes, companions, npcs, inventory, map, skills,
    activeTab, maintext,
    viewingFloor, latestFloor,
    loadData, loadFloorText, navigateFloor, loadFromFloor, filterMaintext,
    submitCreation,
  };
});
