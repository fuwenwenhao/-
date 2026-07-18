import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

async function boot() {
  // 等待 MVU 全局初始化（最多等 2 秒，超时照常启动）
  if (typeof waitGlobalInitialized === 'function') {
    try {
      await Promise.race([
        waitGlobalInitialized('Mvu'),
        new Promise(r => setTimeout(r, 2000)),
      ]);
    } catch {}
  }

  const app = createApp(App).use(createPinia());
  app.mount('#app');
  if (typeof $ !== 'undefined') {
    $(window).on('pagehide', () => app.unmount());
  }
}

if (typeof $ !== 'undefined') {
  $(() => boot());
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot());
  } else {
    boot();
  }
}
