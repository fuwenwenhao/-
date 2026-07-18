import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve(__dirname, 'dist/yuanji');

// 打包完成后：去掉 type="module"，并生成独立 JS 文件
function postProcess() {
  return {
    name: 'post-process',
    closeBundle() {
      const file = path.join(outDir, 'index.html');
      if (!fs.existsSync(file)) return;
      let html = fs.readFileSync(file, 'utf-8');
      html = html.replace(/<script type="module" crossorigin>/g, '<script>');
      html = html.replace(/<script type="module">/g, '<script>');
      fs.writeFileSync(file, html, 'utf-8');

      // 提取 JS 到独立文件供 script src 加载
      const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (scriptMatch) {
        fs.writeFileSync(path.join(outDir, 'app.js'), scriptMatch[1], 'utf-8');
      }
      if (styleMatch) {
        fs.writeFileSync(path.join(outDir, 'app.css'), styleMatch[1], 'utf-8');
      }
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname, 'src/状态面板'),
  plugins: [vue(), viteSingleFile(), postProcess()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/状态面板'),
      '@util': path.resolve(__dirname, 'util'),
    },
  },
  build: {
    outDir,
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
});
