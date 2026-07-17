import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

async function boot() {
  // 等待 MVU 全局初始化
  if (typeof waitGlobalInitialized === 'function') {
    try { await waitGlobalInitialized('Mvu'); } catch {}
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
