import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin to fix script loading for file:// protocol compatibility
function fixFileProtocol(): Plugin {
  return {
    name: 'fix-file-protocol',
    transformIndexHtml(html) {
      return html
        .replace(/ crossorigin/g, '')
        .replace(/ type="module"/g, ' defer');
    },
  };
}

export default defineConfig({
  plugins: [react(), fixFileProtocol()],
  base: '/ffxiv-glass-overlay/',
  build: {
    outDir: 'build',
    modulePreload: {
      polyfill: false,
    },
    target: 'esnext',
  },
  server: {
    port: 3000,
    open: true,
  },
});
