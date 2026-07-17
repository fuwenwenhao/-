import { z } from 'zod';

// === 通用 ===
export const EquipmentSchema = z.object({
  weapon: z.string().default('无'),
  accessory: z.string().default('无'),
  top: z.string().default('无'),
  bottom: z.string().default('无'),
  shoes: z.string().default('无'),
});

export const BodyPartSchema = z.object({
  status: z.string().default('正常'),
  armor: z.string().default('无'),
  modification: z.enum(['原生', '义体', '生物改造']).default('原生'),
  mod_name: z.string().default(''),
  mod_effect: z.string().default(''),
});

export const BodySchema = z.object({
  head: BodyPartSchema.default({}),
  chest: BodyPartSchema.default({}),
  left_leg: BodyPartSchema.default({}),
  right_leg: BodyPartSchema.default({}),
  left_arm: BodyPartSchema.default({}),
  right_arm: BodyPartSchema.default({}),
});

// === 玩家状态 ===
export const PlayerStatusSchema = z.object({
  name: z.string().default('未知'),
  race: z.string().default(''),
  profession: z.string().default(''),
  hp: z.object({ current: z.number().default(10), max: z.number().default(10) }).default({}),
  sanity: z.object({ current: z.number().default(10), max: z.number().default(10) }).default({}),
  physical_state: z.string().default('正常'),
  emotion_level: z.string().default('平静'),
  identity: z.string().default('无'),
  power: z.string().default('普通'),
  current_form: z.string().default('常态'),
  money: z.number().default(0),
  current_date: z.string().default(''),
  current_region: z.string().default(''),
});

export const AttributesSchema = z.object({
  strength: z.number().default(8),
  agility: z.number().default(8),
  intelligence: z.number().default(8),
  constitution: z.number().default(8),
  charisma: z.number().default(8),
  perception: z.number().default(8),
});

// === 同伴 ===
export const CompanionSchema = z.object({
  name: z.string().default('未知'),
  hp: z.object({ current: z.number().default(100), max: z.number().default(100) }).default({}),
  sanity: z.object({ current: z.number().default(100), max: z.number().default(100) }).default({}),
  physical_state: z.string().default('正常'),
  affection: z.number().min(0).max(100).default(0),
  current_form: z.string().default('常态'),
  identity: z.string().default('无'),
  power: z.string().default('普通'),
  equipment: EquipmentSchema.default({}),
  body: BodySchema.default({}),
});

// === 交互角色（NPC） ===
export const NpcSchema = z.object({
  name: z.string().default('未知'),
  identity: z.string().default('无'),
  power: z.string().default('普通'),
  hp: z.object({ current: z.number().default(100), max: z.number().default(100) }).default({}),
  sanity: z.object({ current: z.number().default(100), max: z.number().default(100) }).default({}),
  physical_state: z.string().default('正常'),
  emotion_level: z.string().default('平静'),
  equipment: EquipmentSchema.default({}),
  body: BodySchema.default({}),
});

// === 背包 ===
export const InventoryItemSchema = z.object({
  name: z.string(),
  count: z.number().default(1),
  description: z.string().default(''),
});

export const InventorySchema = z.object({
  weapons: z.array(InventoryItemSchema).default([]),
  items: z.array(InventoryItemSchema).default([]),
});

// === 地图 ===
export const MapSchema = z.object({
  current_location: z.string().default('A巢'),
  current_area: z.enum(['巢内', '后巷']).default('巢内'),
});

// === 技能 ===
export const SkillSchema = z.object({
  name: z.string(),
  attr: z.enum(['strength', 'agility', 'intelligence', 'constitution', 'charisma', 'perception']),
  description: z.string().default(''),
  value: z.string().default(''),       // 数值
  vfx: z.string().default(''),         // 特效
  appearance: z.string().default(''),  // 外观
  effect: z.string().default(''),      // 效果
});

// === 自定义装备（玩家创建时定义） ===
export const CustomEquipmentSchema = z.object({
  name: z.string(),
  value: z.string().default(''),
  vfx: z.string().default(''),
  appearance: z.string().default(''),
  effect: z.string().default(''),
});

// === 战斗 ===
export const BattleResultSchema = z.enum(['命中', '被闪避', '被防御']);

// === 顶层数据结构 ===
export const StatusDataSchema = z.object({
  player: PlayerStatusSchema.default({}),
  equipment: EquipmentSchema.default({}),
  body: BodySchema.default({}),
  attributes: AttributesSchema.default({}),
  companions: z.array(CompanionSchema).default([]),
  npcs: z.array(NpcSchema).default([]),
  inventory: InventorySchema.default({}),
  map: MapSchema.default({}),
  skills: z.array(SkillSchema).default([]),
}).default({});

export type StatusData = z.infer<typeof StatusDataSchema>;
export type CompanionData = z.infer<typeof CompanionSchema>;
export type NpcData = z.infer<typeof NpcSchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type CustomEquipment = z.infer<typeof CustomEquipmentSchema>;
