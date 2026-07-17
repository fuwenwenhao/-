export function parseString(content: string): any {
  const trimmed = content.trim();
  // 尝试直接 JSON
  try {
    return JSON.parse(trimmed);
  } catch {}
  // 尝试宽松修复：去掉尾部逗号
  try {
    const fixed = trimmed.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(fixed);
  } catch {}
  throw new Error('[parseString] 无法解析为有效 JSON');
}
