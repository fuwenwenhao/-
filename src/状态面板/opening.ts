// 缺省开场白模板（数据化格式）
export const OPENING_TEMPLATE = `<maintext>
{{时代}}年的{{地区}}。

【角色档案】
名字：{{user}}
年龄：{{年龄}}
种族：{{种族}}
性别：{{性别}}
身高：{{身高}}
职业：{{职业}}
身份：{{身份}}
实力：{{实力}}
阵营：{{阵营}}
地区：{{地区}}

【六维】
力量：{{力量}}  敏捷：{{敏捷}}  智力：{{智力}}
体质：{{体质}}  魅力：{{魅力}}  感知：{{感知}}

外貌：{{外貌描述}}
性格：{{性格描述}}

【背景】
{{背景故事}}
</maintext>`;

// 性别文字映射
export function mapGender(g: string): string {
  if (g === '男') return '男人';
  if (g === '女') return '女人';
  return g || '人';
}

// 标签数组转描述
export function tagsToText(tags: string[]): string {
  if (!tags || tags.length === 0) return '无';
  return tags.join('、');
}

export interface CustomEntry {
  name: string;
  value: string;
  vfx: string;
  appearance: string;
  effect: string;
}

// 技能带一个额外的判定属性字段
export interface SkillEntry extends CustomEntry {
  attr: string;
}

export interface AttrPoints {
  strength: number;
  agility: number;
  intelligence: number;
  constitution: number;
  charisma: number;
  perception: number;
}

export interface CreationForm {
  name: string;
  era: string;
  region: string;
  gender: string;
  race: string;
  age: string;
  height: string;
  appearance_tags: string[];
  personality_tags: string[];
  background: string;
  profession: string;
  identity: string;
  power: string;
  faction: string;
  skills: SkillEntry[];
  equipments: CustomEntry[];
  attributes: AttrPoints;
  remaining_points?: number;  // 剩余点数（用于换算金钱）
}

// 组装开场白文本
export function buildOpeningText(form: CreationForm): string {
  const vars: Record<string, string> = {
    'user': form.name || '无名者',
    '时代': form.era,
    '地区': form.region,
    '性别': mapGender(form.gender),
    '种族': form.race,
    '年龄': form.age,
    '身高': form.height,
    '职业': form.profession || '无',
    '身份': form.identity || '无',
    '实力': form.power || '普通',
    '阵营': form.faction || '无',
    '外貌描述': tagsToText(form.appearance_tags),
    '性格描述': tagsToText(form.personality_tags),
    '背景故事': form.background || '（无）',
    '力量': String(form.attributes.strength),
    '敏捷': String(form.attributes.agility),
    '智力': String(form.attributes.intelligence),
    '体质': String(form.attributes.constitution),
    '魅力': String(form.attributes.charisma),
    '感知': String(form.attributes.perception),
  };

  // 替换所有变量，包括名字
  return OPENING_TEMPLATE.replace(
    /\{\{(user|时代|地区|性别|种族|年龄|身高|职业|身份|实力|阵营|外貌描述|性格描述|背景故事|力量|敏捷|智力|体质|魅力|感知)\}\}/g,
    (_, key) => vars[key] ?? ''
  );
}
