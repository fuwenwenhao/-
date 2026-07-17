# 实现计划

## 1. 正文回看（前/后翻页箭头）

在正文区域加左右箭头按钮，可浏览任意楼层的正文内容：

- 在 store 中维护 `viewingMessageId`（当前查看的楼层 ID），默认为最新楼层
- 正文区域上方显示 `← 第X楼 →` 导航栏
- 点左箭头 `viewingMessageId--`，点右箭头 `viewingMessageId++`
- 当处于最新楼层时右箭头禁用
- 当处于第 0 楼时左箭头禁用
- 正文内容根据 `viewingMessageId` 读取对应楼层消息并过滤显示
- 状态栏始终显示最新楼层的变量数据（不跟随翻页）

文件改动：
- `store.ts`: 加 `viewingMessageId` ref，加 `loadMessageText(id)` 方法
- `MainGame.vue`: 加翻页导航 UI

## 2. 修复第二 API

当前 `requestHandler.ts` 中的 `handleUnifiedRequest` 未被任何地方调用。需要把它接入实际生成流程。

问题分析：
- `handleUnifiedRequest` 调用了 `generate()` 和 `generateRaw()`，这些是酒馆助手**脚本**环境的函数
- 但前端界面是**楼层 iframe**，能用 `generateRaw` 但不能主动触发酒馆的正常生成流程
- 正确做法：监听 `GENERATION_ENDED` 事件，在 AI 回复后**用第二 API 补充变量更新**

重写方案：
- 监听 `iframe_events.GENERATION_ENDED`，拿到 AI 回复文本
- 如果是多 API 模式且回复中没有 `<UpdateVariable>`，调用第二 API（通过 `generateRaw` + `custom_api`）生成变量更新
- 把结果追加到消息中（通过 `setChatMessage` 或直接触发 MVU 处理）

设置页面修复：
- 获取模型列表改用酒馆原生 `getModelList()` API（而不是 fetch）
- 测试连接用 `generateRaw` + `custom_api` 发一条简单消息

文件改动：
- `requestHandler.ts`: 重写为事件驱动模式
- `SettingsView.vue`: fetchModels 改用 `getModelList()`
- `MainGame.vue`: onMounted 中初始化第二 API 监听
- `globals.d.ts`: 加 `getModelList`、`setChatMessage` 声明

## 3. 读档（回退到指定楼层）

- 在设置页面或单独 tab 中加「读档」功能
- 显示所有楼层列表（楼层号 + 正文摘要前20字）
- 点击某楼层后：
  - 状态栏加载该楼层的变量数据
  - 正文区跳转到该楼层
  - 提示"已回退到第X楼的状态"

文件改动：
- `store.ts`: 加 `loadFromFloor(id)` 方法
- 新建 `components/HistoryPanel.vue`：楼层列表 + 读档按钮
- `MainGame.vue`: TabNav 中加「记录」tab
